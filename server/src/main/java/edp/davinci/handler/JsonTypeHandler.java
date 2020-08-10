package edp.davinci.handler;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.apache.ibatis.type.TypeHandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedJdbcTypes(JdbcType.VARCHAR)
@MappedTypes({JSONObject.class})
@Slf4j
public class JsonTypeHandler implements TypeHandler<JSONObject> {

    @Override
    public void setParameter(PreparedStatement ps, int i, JSONObject parameter, JdbcType jdbcType) throws SQLException {
        try {
            if (parameter != null) {
                ps.setString(i, parameter.toJSONString());
            } else {
                ps.setString(i, null);
            }
        } catch (Exception e) {
            log.error("JsonTypeHandler error", e);
        }
    }

    @Override
    public JSONObject getResult(ResultSet rs, String columnName) throws SQLException {
        String jsonStr = rs.getString(columnName);
        if (StringUtils.isNotBlank(jsonStr)) {
            return JSON.parseObject(jsonStr);
        }
        return null;
    }

    @Override
    public JSONObject getResult(ResultSet rs, int columnIndex) throws SQLException {
        String jsonStr = rs.getString(columnIndex);
        if (StringUtils.isNotBlank(jsonStr)) {
            return JSON.parseObject(jsonStr);
        }
        return null;
    }

    @Override
    public JSONObject getResult(CallableStatement cs, int columnIndex) throws SQLException {
        String jsonStr = cs.getString(columnIndex);
        if (StringUtils.isNotBlank(jsonStr)) {
            return JSON.parseObject(jsonStr);
        }
        return null;
    }
}
