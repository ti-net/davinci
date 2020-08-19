package edp.tinetcloud.controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 王大宝
 */
@RestController
@Slf4j
public class HealthController {

    @GetMapping("/health")
    public void health(){
    }
}
