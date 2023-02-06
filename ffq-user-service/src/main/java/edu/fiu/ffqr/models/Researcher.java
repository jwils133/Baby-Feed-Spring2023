package edu.fiu.ffqr.models;

import java.io.Serializable;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;


@Document(collection="researchers")
public class Researcher implements Serializable {

	@Id
	private ObjectId _id;
	@JsonProperty("userId")
	private String userId; 
	@JsonProperty("username")
	private String username;
	@JsonProperty("userpassword")
	private String userpassword;
	@JsonProperty("usertype")
        private String usertype;
	@JsonProperty("firstname")
	private String firstname;
	@JsonProperty("lastname")      
	private String lastname;        
	@JsonProperty("assignedResearchInstitutionId")
	private String assignedResearchInstitutionId;
	@JsonProperty("limitNumberOfParticipants")
	private Number limitNumberOfParticipants; 
	@JsonProperty("isactive")
        private boolean isactive;
	@JsonProperty("prefix")
	private String prefix;


	public Researcher() {}
	
	public Researcher(String userId, String username, String userpassword, 
                String usertype, String firstname, String lastname, boolean isactive,
                String assignedResearchInstitutionId, Number limitNumberOfParticipants, String prefix){
                this.userId = userId;
		this.username = username;
		this.userpassword = userpassword;
		this.usertype = usertype;
		this.firstname = firstname;
		this.lastname = lastname;
		this.isactive = isactive;
                this.assignedResearchInstitutionId = assignedResearchInstitutionId;
                this.limitNumberOfParticipants = limitNumberOfParticipants;
                this.prefix = prefix;

    }
	

	public ObjectId getId() {
        return this._id;    }

	
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getPrefix() {
		return this.prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getUserpassword(){
		return this.userpassword;
	}

	public void setUserpassword(String userpassword){
		this.userpassword = userpassword;
	}

	public String getUsertype(){
        return this.usertype;
    }
    public void setUsertype(String usertype){
        this.usertype = usertype;
    }
	
	public String getFirstname() {
        return this.firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
	}
	
	public String getLastname() {
        return this.lastname;
	}
	
    public void setLastname(String lastname) {
        this.lastname = lastname;
	}
	
	public void setIsactive(boolean isactive){
        this.isactive = isactive;
    }

    public boolean getIsactive(){
        return this.isactive;
    }
    
    public void setAssignedResearchInstitutionId(String assignedResearchInstitutionId){
        this.assignedResearchInstitutionId = assignedResearchInstitutionId;
    }

    public String getAssignedResearchInstitutionId(){
        return this.assignedResearchInstitutionId;
    }
    
    public void setLimitNumberOfParticipants(Number limitNumberOfParticipants){
        this.limitNumberOfParticipants = limitNumberOfParticipants;
    }

    public Number getLimitNumberOfParticipants(){
        return this.limitNumberOfParticipants;
    }

    
}
