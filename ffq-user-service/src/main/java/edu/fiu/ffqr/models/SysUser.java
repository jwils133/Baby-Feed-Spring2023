package edu.fiu.ffqr.models;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="sys_users")
public class SysUser implements Serializable {

	@JsonProperty("sysUserId")
	private String userId;  
	@JsonProperty("sysUsername")
	private String username;
	
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setSysUsername(String username) {
		this.username = username;
	}
	
	public String getSysUsername() {
		return this.username;
	}

}
