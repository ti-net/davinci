package edp.tinetcloud.controller;


import edp.core.annotation.AuthIgnore;
import edp.core.annotation.CurrentUser;
import edp.core.enums.HttpCodeEnum;
import edp.davinci.common.controller.BaseController;
import edp.davinci.core.common.Constants;
import edp.davinci.core.common.ResultMap;
import edp.davinci.model.User;
import edp.davinci.service.DashboardService;
import edp.davinci.service.DisplayService;
import edp.tinetcloud.dto.TinetShow;
import edp.tinetcloud.service.AdapterService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


/**
 * @author 王大宝
 */
@Api(tags = "tinetlogin", basePath = Constants.BASE_API_PATH, consumes = MediaType.APPLICATION_JSON_VALUE, produces =
        MediaType.APPLICATION_JSON_UTF8_VALUE)
@ApiResponses({
        @ApiResponse(code = 400, message = "pwd is wrong"),
        @ApiResponse(code = 404, message = "user not found")
})
@RestController
@Slf4j
@RequestMapping(value = Constants.BASE_API_PATH + "/tinet")
public class ShowController extends BaseController {


    @Autowired
    private AdapterService adapterService;
    @Autowired
    private DisplayService displayService;
    @Autowired
    private DashboardService dashboardService;

    /**
     * 获取分享地址加密字符
     *
     * @param
     * @return
     */
    @ApiOperation(value = "Get Share Token ")
    @GetMapping("/getShareToken/{id}/{type}")
    public ResponseEntity getShareToken(@PathVariable Long id, @PathVariable String type,
                                        @ApiIgnore @CurrentUser User user, HttpServletRequest request) {
        log.info("[获取] {} [分享加密串] ID：{}",type , id);

        String shareToken = null;
        if ("display".equals(type)){
            shareToken = displayService.shareDisplay(id, user, "");
        }
        if ("dashboard".equals(type)){
            shareToken = dashboardService.shareDashboard(id, "", user);
        }
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(shareToken));
    }

    /**
     * 获取需显示大屏列表
     *
     * @return
     */
    @ApiOperation(value = "get dashboard list")
    @GetMapping(value = "/getShowList/{userId}/{type}")
    @AuthIgnore
    public ResponseEntity getShowList(@PathVariable Long userId, @PathVariable String type,
                                           HttpServletRequest request) {
        log.info("[获取需要显示的大屏列表] {} [userID] {}",type , userId);
        List<TinetShow> showList = adapterService.getShowList(userId, type);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(showList));
    }


    /**
     * 大屏和画布显示或者关闭操作
     *
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "show a display", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PostMapping(value = "/show")
    public ResponseEntity show(@RequestBody TinetShow tinetShow,
                               @ApiIgnore @CurrentUser User user,
                               HttpServletRequest request) {

        log.info("[大屏和画布操作] {} [{}] 请求参数: {}",tinetShow.getType() , tinetShow.isStatus() ? "开启" : "关闭", tinetShow.toString());
        boolean b = adapterService.operateShow(tinetShow, user);
        if (b){
            return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload("操作成功"));
        }
        ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request,HttpCodeEnum.SERVER_ERROR).message("操作失败");
        return ResponseEntity.status(resultMap.getCode()).body(resultMap);
    }
    /**
     * 大屏和画布更新名称
     *
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "show a display", consumes = MediaType.APPLICATION_JSON_VALUE)
    @GetMapping(value = "/updateShow/{id}/{type}")
    public ResponseEntity show(@PathVariable Long id, @PathVariable String type, @RequestParam String name,
                               @ApiIgnore @CurrentUser User user,
                               HttpServletRequest request) {

        Integer integer = adapterService.updateShow(id, type, name, user);
        if (integer > 0){
            return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload("操作成功"));
        }
        ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request,HttpCodeEnum.SERVER_ERROR).message("操作失败");
        return ResponseEntity.status(resultMap.getCode()).body(resultMap);
    }
    /**
     * 大屏和画布是否显示
     *
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "show a display", consumes = MediaType.APPLICATION_JSON_VALUE)
    @GetMapping(value = "/show/{id}/{type}")
    public ResponseEntity show(@PathVariable Long id, @PathVariable String type,
                               @ApiIgnore @CurrentUser User user,
                               HttpServletRequest request) {
        boolean b = adapterService.showStatus(id, type,user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(b));
    }
}