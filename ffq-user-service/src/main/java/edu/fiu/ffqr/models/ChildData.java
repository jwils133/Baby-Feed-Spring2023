package edu.fiu.ffqr.models;

import java.io.Serializable;
import java.lang.reflect.Constructor;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

public class ChildData implements Serializable {
    
    @JsonProperty("weight")
    private String weight;

    @JsonProperty("height")
    private String height;

    @JsonProperty("age")
    private String age;

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }


 
    public ChildData() {
    }

    public ChildData(String weight, String length, String month) {
        this.weight = weight;
        this.height = length;
        this.age = month;
    }
 

 

    
    

}
