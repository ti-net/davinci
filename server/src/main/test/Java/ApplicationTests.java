import edp.DavinciServerApplication;
import edp.davinci.dao.DefaultDbMapper;
import edp.tinetcloud.dto.DefaultDb;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {DavinciServerApplication.class})
public class ApplicationTests {

	@Autowired
	private DefaultDbMapper defaultDbMapper;
	@Test
	public void s() {
		DefaultDb defaultDb = new DefaultDb();
		defaultDb.setDbUrl("33");
		defaultDb.setDbUsername("33");
		defaultDb.setDbPassword("33");
		defaultDb.setUserId(2L);
		int insert = defaultDbMapper.insert(defaultDb);
		System.out.println(insert);
	}

}
