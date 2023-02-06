package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import edu.fiu.ffqr.models.Researcher;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "participants")
public class Participant extends User implements Serializable {

    @JsonProperty("assignedResearcherInst")
    private String assignedResearcherInst;
    @JsonProperty("assignedResearcherUsers")
    private List<String> assignedResearcherUsers;
    @JsonProperty("childrennames")
    private ArrayList<String> childrennames = new ArrayList<String>();
	@JsonProperty("prefix")
    private String prefix;

    @JsonProperty("children")
    private  Children[] children;


 

    public Children[] getChildren() {
        return children;
    }

    public void setChildren(Children[] children) {
        this.children = children;
    }

    public List<String> getAssignedResearcherUsers() {
        return assignedResearcherUsers;
    }

    public void setAssignedResearcherUsers(List<String> assignedResearcherUsers) {
        this.assignedResearcherUsers = assignedResearcherUsers;
    }

   

    public Participant() {
    }

    public Participant(String userId, String username, String userpassword, String usertype,
            String assignedResearcherInst, List<String> assignedResearcherUsers, ArrayList<String> childrennames,
            boolean isactive, String prefix,  Children [] children ) {
        this.userId = userId;
        this.username = username;
        this.userpassword = userpassword;
        this.usertype = usertype;
        this.firstname = "";
        this.lastname = "";
        this.assignedResearcherInst = assignedResearcherInst;
        this.assignedResearcherUsers = assignedResearcherUsers;
        this.childrennames = childrennames;
        this.isactive = isactive;
		this.prefix = prefix;
        this.children  = children ;

    }

    public String getAssignedResearcherInst() {
        return this.assignedResearcherInst;
    }

    public void setAssignedResearcherInst(String assignedResearcherOrg) {
        this.assignedResearcherInst = assignedResearcherOrg;

    }

    public List<String> getAssignedResearcherUser() {
        return this.assignedResearcherUsers;
    }

    public void setAssignedResearcherUser(List<String> assignedResearcherUser) {
        this.assignedResearcherUsers = assignedResearcherUser;

    }

    public ArrayList<String> getChildrennames() {
        return this.childrennames;
    }

    public void setChildrennames(ArrayList<String> childrennames) {
        this.childrennames = childrennames;
    }

	public String getPrefix() {
        return this.prefix;
    }
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }
}
