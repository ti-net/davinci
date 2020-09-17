/*
 * <<
 *  Davinci
 *  ==
 *  Copyright (C) 2016 - 2019 EDP
 *  ==
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *  >>
 *
 */

package edp.davinci.dao;

import edp.tinetcloud.dto.TinetShow;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author 王大宝
 */
@Component
public interface TinetShowMapper {

    int insert(TinetShow tinetShow);

    @Select({"select * from `tinet_show` where `user_id` = #{id} and `type` = #{type}"})
    List<TinetShow> getByUserId(@Param("id") Long id, @Param("type") String type);

    @Select({"select * from `tinet_show` where `show_id` = #{id} and `type` = #{type}"})
    TinetShow getByshowId(@Param("id") Long id, @Param("type") String type);

    @Delete({"delete from tinet_show where `show_id` = #{id} and `type` = #{type}"})
    int delete(@Param("id") Long id, @Param("type") String type);

    @Update({"update tinet_show set `name` = #{name} where `show_id` = #{id} and `type` = #{type}"})
    int updateByShowId(String name,Long id, String type);
}