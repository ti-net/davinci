package edp.davinci.controller;

/**
 * @author baixk
 * @title: TiUserController
 * @projectName davinci-parent_3.01
 * @description: TODO
 * @date 2020-04-25 14:43
 */
import edp.core.annotation.AuthIgnore;
import edp.core.annotation.CurrentUser;
import edp.core.enums.HttpCodeEnum;
import edp.core.utils.TokenUtils;
import edp.davinci.common.controller.BaseController;
import edp.davinci.core.common.Constants;
import edp.davinci.core.common.ResultMap;
import edp.davinci.dto.userDto.UserLogin;
import edp.davinci.dto.userDto.UserLoginResult;
import edp.davinci.dto.userDto.UserPut;
import edp.davinci.dto.userDto.UserRegist;
import edp.davinci.model.User;
import edp.davinci.service.TiUserService;
import edp.davinci.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;

@Api(tags = "tinetlogin", basePath = Constants.BASE_API_PATH, consumes = MediaType.APPLICATION_JSON_VALUE, produces =
        MediaType.APPLICATION_JSON_UTF8_VALUE)
@ApiResponses({
        @ApiResponse(code = 400, message = "pwd is wrong"),
        @ApiResponse(code = 404, message = "user not found")
})
@RestController
@Slf4j
@RequestMapping(value = Constants.BASE_API_PATH + "/tinet")
// consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class TiUserController  extends BaseController {
    @Autowired
    private UserService userService;

    @Autowired
    private TiUserService tiUserService;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    private Environment environment;

    /**
     * 常规登录
     *
     * @param userLogin
     * @param bindingResult
     * @return
     */
    @ApiOperation(value = "Login into the server and return token")
    @RequestMapping(value = "/tinetLogin")
    @AuthIgnore
    public ResponseEntity tinetLogin(@Valid @RequestBody UserLogin userLogin, @ApiIgnore BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap().fail().message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        User user = userService.userLogin(userLogin);
        if (!user.getActive()) {
            log.info("this user is not active： {}", userLogin.getUsername());
            ResultMap resultMap = new ResultMap(tokenUtils).failWithToken(tokenUtils.generateToken(user)).message("this user is not active");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        UserLoginResult userLoginResult = new UserLoginResult(user);
        String statistic_open = environment.getProperty("statistic.enable");
        if("true".equalsIgnoreCase(statistic_open)){
            userLoginResult.setStatisticOpen(true);
        }
        return ResponseEntity.ok(new ResultMap().success(tokenUtils.generateToken(user)).payload(userLoginResult));
    }

    /**
     * 单参数用户名登录，不存在则自动注册。
     *
     * @param
     * @return
     */
    @ApiOperation(value = "add User")
    @PostMapping("/addUser")
    @AuthIgnore
    public ResponseEntity addUser(@Valid @RequestBody UserRegist userRegist, HttpServletRequest request){
        // if username
        String username = userRegist.getUsername();
        if ("".equals(username.trim())) {
            ResultMap resultMap = new ResultMap(tokenUtils).failWithToken(tokenUtils.generateToken(null)).message("no user");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        // check in db
        User user1 = tiUserService.getByUsername(username);
        if (user1 != null && user1.getId() > 0){
            Long id = user1.getId();
            ResultMap resultMap = tiUserService.getUserProfile(id, user1, request);
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        // regist
        User user = tiUserService.regist(userRegist);
        Long id = user.getId();
        ResultMap resultMap = tiUserService.getUserProfile(id, user, request);
        return ResponseEntity.status(resultMap.getCode()).body(resultMap);
    }

    /**
     * 修改用户信息
     *
     * @param id
     * @param userPut
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "update user info", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PutMapping(value = "/editUser/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @AuthIgnore
    public ResponseEntity putUser(@PathVariable Long id,
                                  @RequestBody UserPut userPut,
                                  @ApiIgnore @CurrentUser User user,
                                  HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid user id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        if (!user.getId().equals(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request, HttpCodeEnum.UNAUTHORIZED).message("Illegal user identity");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        BeanUtils.copyProperties(userPut, user);
        userService.updateUser(user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }

    /**
     * 查询用户
     *
     * @param id
     * @param request
     * @return
     */
    @ApiOperation(value = "get user info")
    @GetMapping("/getUserById/{id}")
    @AuthIgnore
    public ResponseEntity getUser(@PathVariable Long id,
                                  @ApiIgnore @CurrentUser User user,
                                  HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid user id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        try {
            User user1 = tiUserService.getById(id);
            UserLoginResult userLoginResult = new UserLoginResult(user1);
            String statistic_open = environment.getProperty("statistic.enable");
            if("true".equalsIgnoreCase(statistic_open)){
                userLoginResult.setStatisticOpen(true);
            }
            return ResponseEntity.ok(new ResultMap().success(tokenUtils.generateToken(user1)).payload(userLoginResult));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ResponseEntity.status(HttpCodeEnum.SERVER_ERROR.getCode()).body(HttpCodeEnum.SERVER_ERROR.getMessage());
        }
    }

    /**
     * 查询用户
     *
     * @param id
     * @param request
     * @return
     */
    @ApiOperation(value = "get user profile")
    @GetMapping("/getUserProfileById/{id}")
    @AuthIgnore
    public ResponseEntity getUserProfile(@PathVariable Long id,
                                  @ApiIgnore @CurrentUser User user,
                                  HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid user id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        try {
            ResultMap resultMap = tiUserService.getUserProfile(id, user, request);
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return ResponseEntity.status(HttpCodeEnum.SERVER_ERROR.getCode()).body(HttpCodeEnum.SERVER_ERROR.getMessage());
        }
    }


}