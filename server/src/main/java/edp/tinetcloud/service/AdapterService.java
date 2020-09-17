package edp.tinetcloud.service;

import com.alibaba.fastjson.JSONObject;
import edp.davinci.dao.DefaultDbMapper;
import edp.davinci.dao.SourceMapper;
import edp.davinci.dao.TinetShowMapper;
import edp.davinci.dto.sourceDto.SourceConfig;
import edp.davinci.model.Source;
import edp.davinci.model.User;
import edp.tinetcloud.dto.DefaultDb;
import edp.tinetcloud.dto.TinetShow;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @author 王大宝
 */
@Service
@Slf4j
public class AdapterService {

    @Autowired
    private DefaultDbMapper defaultDbMapper;
    @Autowired
    private SourceMapper sourceMapper;

    public void creatDefaultDb(Long userId,Long projectId){
        //创建默认数据库
        log.info("创建项目之时，指定默认数据库，开始");
        DefaultDb defaultDb = defaultDbMapper.getByUserId(userId);
        if (Objects.isNull(defaultDb)){
            log.info("账号没有通过慧智开户，没有默认数据库信息");
            return;
        }
        Source source = new Source();
        source.setName("默认数据库");
        source.setDescription("企业默认数据源");
        SourceConfig config = new SourceConfig();
        config.setExt(false);
        config.setUrl(defaultDb.getDbUrl());
        config.setUsername(defaultDb.getDbUsername());
        config.setPassword(defaultDb.getDbPassword());
        config.setProperties(new ArrayList<>());
        config.setVersion("");
        source.setConfig(JSONObject.toJSONString(config));
        source.setType("jdbc");
        source.setProjectId(projectId);
        source.setCreateBy(userId);
        int insert = sourceMapper.insert(source);
        log.info("创建项目指定默认数据库，结果：{}",insert);
    }


    @Autowired
    private TinetShowMapper tinetShowMapper;

    /**
     * 操作在质检端是否显示报表
     * @param tinetShow
     * @param user
     */
    public boolean operateShow(TinetShow tinetShow, User user) {
        //判断是开启还是关闭操作，关闭就把数据库记录删掉
        if (tinetShow.isStatus()){
            TinetShow byshowId = tinetShowMapper.getByshowId(tinetShow.getShowId(), tinetShow.getType());
            if (Objects.nonNull(byshowId)){
                return true;
            }
            int insert = tinetShowMapper.insert(tinetShow);
            return insert > 0;
        }else {
            int delete = tinetShowMapper.delete(tinetShow.getShowId(), tinetShow.getType());
            return delete > 0;
        }
    }

    /**
     * 删除
     * @param showId
     * @param type
     */
    public void deleteShow(Long showId, String type) {
        tinetShowMapper.delete(showId, type);
    }

    /**
     * 查看该报表是否显示
     * @param id
     * @param type
     * @param user
     * @return
     */
    public boolean showStatus(Long id, String type, User user) {
        TinetShow byshowId = tinetShowMapper.getByshowId(id, type);
        return Objects.nonNull(byshowId);
    }

    /**
     * 获取用户显示大屏列表
     * @param id
     * @param type
     */
    public List<TinetShow> getShowList(Long id, String type) {
        return tinetShowMapper.getByUserId(id, type);
    }

    public Integer updateShow(Long id, String type, String name, User user) {
        log.info("参数：{},{},{}",id, type, name);
        TinetShow byshowId = tinetShowMapper.getByshowId(id, type);
        if (Objects.isNull(byshowId)){
            return 1;
        }
        log.info("show:{}",byshowId.toString());
        return tinetShowMapper.updateByShowId(name,id, type);

    }
}
