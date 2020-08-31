package edp.tinetcloud.dto;

import edp.davinci.core.common.Constants;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@NotNull(message = "user info cannot be null")
public class TinetUserRegist {

    @NotBlank(message = "username cannot be EMPTY")
    private String username;

    @NotBlank(message = "email cannot be EMPTY")
    @Pattern(regexp = Constants.REG_EMAIL_FORMAT, message = "invalid email format")
    private String email;

    @NotBlank(message = "password cannot be EMPTY")
    @Pattern(regexp = Constants.REG_USER_PASSWORD, message = "密码长度为6-20位")
    private String password;

    @NotBlank(message = "dbUrl cannot be EMPTY")
    private String dbUrl;

    @NotBlank(message = "dbUsername cannot be EMPTY")
    private String dbUsername;

    @NotBlank(message = "dbPassword cannot be EMPTY")
    private String dbPassword;

    @Override
    public String toString() {
        return "UserRegist{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", dbUrl='" + dbUrl + '\'' +
                ", dbUsername='" + dbUsername + '\'' +
                ", dbPassword='" + dbPassword + '\'' +
                '}';
    }
}
