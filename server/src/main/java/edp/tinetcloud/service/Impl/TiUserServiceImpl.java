package edp.tinetcloud.service.Impl;

/**
 * @author baixk
 * @title: TiUserServiceImpl
 * @projectName davinci-parent_3.01
 * @description: TODO
 * @date 2020-04-28 18:37
 */
import edp.core.consts.Consts;
import edp.core.enums.HttpCodeEnum;
import edp.core.enums.MailContentTypeEnum;
import edp.core.exception.ServerException;
import edp.core.model.MailContent;
import edp.core.utils.*;
import edp.davinci.core.common.Constants;
import edp.davinci.core.common.ResultMap;
import edp.davinci.core.enums.CheckEntityEnum;
import edp.davinci.core.enums.LockType;
import edp.davinci.core.enums.UserOrgRoleEnum;
import edp.davinci.dao.OrganizationMapper;
import edp.davinci.dao.RelUserOrganizationMapper;
import edp.davinci.dao.UserMapper;
import edp.davinci.dto.organizationDto.OrganizationInfo;
import edp.davinci.dto.userDto.*;
import edp.davinci.model.Organization;
import edp.davinci.model.RelUserOrganization;
import edp.davinci.model.User;
import edp.davinci.service.LdapService;
import edp.davinci.service.impl.BaseEntityService;
import edp.tinetcloud.service.TiUserService;
import lombok.extern.slf4j.Slf4j;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Slf4j
@Service("tiUserService")
public class TiUserServiceImpl extends BaseEntityService implements TiUserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private OrganizationMapper organizationMapper;

    @Autowired
    private RelUserOrganizationMapper relUserOrganizationMapper;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private MailUtils mailUtils;


    @Autowired
    private FileUtils fileUtils;

    @Autowired
    private ServerUtils serverUtils;

    @Autowired
    private LdapService ldapService;

    private static final CheckEntityEnum entity = CheckEntityEnum.USER;

    /**
     * 用户是否存在
     *
     * @param name
     * @param scopeId
     * @return
     */
    @Override
    public boolean isExist(String name, Long id, Long scopeId) {
        Long userId = userMapper.getIdByName(name);
        if (null != id && null != userId) {
            return !id.equals(userId);
        }
        return null != userId && userId.longValue() > 0L;
    }

    /**
     * 根据用户名获取用户
     *
     * @param username
     * @return
     */
    @Override
    public User getByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public User getById(Long id) {
        return userMapper.getById(id);
    }

    /**
     * 用户注册接口
     *
     * @param userRegist
     * @return
     */
    @Override
    @Transactional
    public User regist(UserRegist userRegist) throws ServerException {

        String username = userRegist.getUsername();
        //用户名是否已经注册
        if (isExist(username, null, null)) {
            log.info("the username {} has been registered", username);
            throw new ServerException("the username:" + username + " has been registered");
        }

        String email = userRegist.getEmail();
        //邮箱是否已经注册
        if (isExist(email, null, null)) {
            log.info("the email {} has been registered", email);
            throw new ServerException("the email:" + email + " has been registered");
        }

        BaseLock usernameLock = getLock(entity, username, null);
        if (usernameLock != null && !usernameLock.getLock()) {
            alertNameTaken(entity, username);
        }

        BaseLock emailLock = null;
        if (!username.toLowerCase().equals(email.toLowerCase())) {
            emailLock =getLock(entity, email, null);
        }

        if (emailLock != null && !emailLock.getLock()) {
            alertNameTaken(entity, email);
        }

        try {
            User user = new User();
            //密码加密
            userRegist.setPassword(BCrypt.hashpw(userRegist.getPassword(), BCrypt.gensalt()));
            BeanUtils.copyProperties(userRegist, user);
            //添加用户
            if (userMapper.insert(user) <= 0) {
                log.info("regist fail: {}", userRegist.toString());
                throw new ServerException("regist fail: unspecified error");
            }
            //添加成功，
            if (user.getId() > 0) {
                // 用户激活，关联操作
                activeUser(user);
            }
            return user;
        }finally {
            releaseLock(usernameLock);
            releaseLock(emailLock);
        }
    }

    public String activeUser(User user) {
        // 已经激活，不需要再次激活
        if (user.getActive()) {
            return "The user is actived";
        }

        BaseLock lock = LockFactory.getLock("ACTIVATE" + Consts.AT_SYMBOL + user.getUsername().toUpperCase(), 5,
                LockType.REDIS);
        if (lock != null && !lock.getLock()) {
            return "The current user is activating";
        }

        try {
            // 验证激活token
            user.setActive(true);
            user.setUpdateTime(new Date());
            userMapper.activeUser(user);

            String orgName = user.getUsername() + "'s Organization";
            // 激活成功，创建默认Orgnization
            Organization organization = new Organization(orgName, null, user.getId());
            organizationMapper.insert(organization);

            // 关联用户和组织，创建人是组织的owner
            RelUserOrganization relUserOrganization = new RelUserOrganization(organization.getId(), user.getId(),
                    UserOrgRoleEnum.OWNER.getRole());
            relUserOrganizationMapper.insert(relUserOrganization);
            return "active success";
        } finally {
            releaseLock(lock);
        }
    }


    /**
     * 发送邮件
     *
     * @param email
     * @param user
     * @return
     */
    @Override
    public boolean sendMail(String email, User user) throws ServerException {
        //校验邮箱
        if (!email.equals(user.getEmail())) {
            throw new ServerException("The current email address is not match user email address");
        }

        Map<String, Object> content = new HashMap<String, Object>();
        content.put("username", user.getUsername());
        content.put("host", serverUtils.getHost());
        content.put("token", AESUtils.encrypt(tokenUtils.generateContinuousToken(user), null));

        MailContent mailContent = MailContent.MailContentBuilder.builder()
                .withSubject(Constants.USER_ACTIVATE_EMAIL_SUBJECT)
                .withTo(user.getEmail())
                .withMainContent(MailContentTypeEnum.TEMPLATE)
                .withTemplate(Constants.USER_ACTIVATE_EMAIL_TEMPLATE)
                .withTemplateContent(content)
                .build();

        mailUtils.sendMail(mailContent, null);
        return true;
    }

    /**
     * 查询用户信息
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @Override
    public ResultMap getUserProfile(Long id, User user, HttpServletRequest request) {
        ResultMap resultMap = new ResultMap(tokenUtils);

        User tempUser = userMapper.getById(id);
        if (null == tempUser) {
            return resultMap.failAndRefreshToken(request).message("user not found");
        }

        UserProfile userProfile = new UserProfile();
        BeanUtils.copyProperties(tempUser, userProfile);
        if (user ==null  || id.equals(user.getId())) {
            List<OrganizationInfo> organizationInfos = organizationMapper.getOrganizationByUser(id);
            userProfile.setOrganizations(organizationInfos);
            return resultMap.successAndRefreshToken(request).payload(userProfile);
        }

        Long[] userIds = {user.getId(), id};
        List<OrganizationInfo> jointlyOrganization = organizationMapper.getJointlyOrganization(Arrays.asList(userIds), id);
        if (!CollectionUtils.isEmpty(jointlyOrganization)) {
            BeanUtils.copyProperties(tempUser, userProfile);
            userProfile.setOrganizations(jointlyOrganization);
            return resultMap.successAndRefreshToken(request).payload(userProfile);
        }

        return resultMap.failAndRefreshToken(request, HttpCodeEnum.UNAUTHORIZED).message("You have not permission to view the user's information because you don't have any organizations that join together");
    }
}
