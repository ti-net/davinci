package edp.tinetcloud.service;

/**
 * @author baixk
 * @title: TiUserService
 * @projectName davinci-parent_3.01
 * @description: TODO
 * @date 2020-04-28 18:36
 */
import edp.core.exception.ServerException;
import edp.davinci.core.common.ResultMap;
import edp.davinci.core.service.CheckEntityService;
import edp.davinci.dto.userDto.UserRegist;
import edp.davinci.model.User;
import javax.servlet.http.HttpServletRequest;


public interface TiUserService extends CheckEntityService {
    User getById(Long id);
    User getByUsername(String username);
    User regist(UserRegist userRegist) throws ServerException;
    boolean sendMail(String email, User user) throws ServerException;
    ResultMap getUserProfile(Long id, User user, HttpServletRequest request);

}
