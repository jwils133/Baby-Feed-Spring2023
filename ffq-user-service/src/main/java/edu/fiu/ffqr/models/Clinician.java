package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection="clinicians")
public class Clinician extends User implements Serializable{

    @JsonProperty("abbreviation")
    private String abbreviation;
    @JsonProperty("assignedclinic")
    private String assignedclinic;
    @JsonProperty("previousclinics")
    private ArrayList<String> previousclinics = new ArrayList<String>();
    @JsonProperty("parentLimitForClinician")
    private int parentLimitForClinician;
    @JsonProperty("prefix")
    private String prefix;


	public Clinician() {}
	
    public Clinician(String userId, String username, String abbreviation, String firstname, String lastname, String userpassword, String usertype,
                    String assignedclinic, ArrayList<String> previousclinics, boolean isactive, int parentLimitForClinician, String prefix){
        this.userId = userId;
		this.username = username;
        this.userpassword = userpassword;
        this.usertype = usertype;
        this.firstname = firstname;
        this.lastname = lastname;
        this.assignedclinic = assignedclinic;
        this.abbreviation = abbreviation;
        this.previousclinics = previousclinics;
        this.isactive = isactive;
        this.parentLimitForClinician = parentLimitForClinician;
        this.prefix = prefix;

    }

    public String getAbbreviation(){
        return this.abbreviation;
    }
    public void setAbbreviation(String abbreviation){
        this.abbreviation = abbreviation;
    }
    public String getAssignedclinic() {
        return this.assignedclinic;
    }
    public void setAssignedclinic(String assignedclinic) {
        this.assignedclinic = assignedclinic;     
    }
    public ArrayList<String> getPreviousclinics() {
        return this.previousclinics;
    }
    public void setPreviousclinic(ArrayList<String> previousclinics) {
        this.previousclinics = previousclinics;   
    }
    public int getParentLimitForClinician(){
	    return this.parentLimitForClinician;
    }
    public void setParentLimitForClinician(int parentLimitForClinician) { this.parentLimitForClinician = parentLimitForClinician; }
    public String getPrefix() { return this.prefix; }
    public void setPrefix(String prefix) { this.prefix = prefix; }
}
