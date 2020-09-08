package edp.tinetcloud.dto;

import lombok.Data;
import lombok.ToString;

/**
 * @author 王大宝
 */
@Data
@ToString
public class TinetShow {

    private Long id;
    private Long userId;
    private Long showId;
    /**
     * dashboard  /  display
     */
    private String type;
    private String name;
    private boolean status;
}
