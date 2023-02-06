package edu.fiu.ffqr.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class User {
    @Id
    protected ObjectId _id;
    @JsonProperty("userId")
    protected String userId;
    @JsonProperty("username")
    protected String username;
    @JsonProperty("userpassword")
    protected String userpassword;
    @JsonProperty("usertype")
    protected String usertype;
    @JsonProperty("firstname")
    protected String firstname;
    @JsonProperty("lastname")
    protected String lastname;
    @JsonProperty("isactive")
    protected boolean isactive;

    public User() {}

    public User(String userId, String username,  String userpassword, String usertype, String firstname, String lastname, boolean isactive) {
        this.username = username;
        this.usertype = usertype;
        this.firstname = firstname;
        this.lastname = lastname;
        this.isactive = isactive;
        this.userId = userId;
        this.userpassword = userpassword;
    }

    public String getUserId() {
        return this.userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setUserpassword(String userpassword){
        this.userpassword = userpassword;
    }

    public String getUserpassword() {
        return this.userpassword;
    }

    public ObjectId getId() {
        return this._id;
    }

    public String getUsername() {
        return this.username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}
