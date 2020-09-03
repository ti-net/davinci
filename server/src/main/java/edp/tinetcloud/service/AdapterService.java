package edp.tinetcloud.service;

import com.alibaba.fastjson.JSONObject;
import edp.davinci.dao.DefaultDbMapper;
import edp.davinci.dao.SourceMapper;
import edp.davinci.dto.sourceDto.SourceConfig;
import edp.davinci.model.Source;
import edp.tinetcloud.dto.DefaultDb;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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
}
