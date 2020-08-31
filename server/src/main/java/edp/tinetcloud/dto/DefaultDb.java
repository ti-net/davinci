package edp.tinetcloud.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DefaultDb {

    private Long id;
    private Long userId;
    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
}
