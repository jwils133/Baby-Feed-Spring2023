package edu.fiu.ffqr.models;

public class QuestionnaireValidationResponse {
	
	private String id;
	private boolean exists;
	private boolean submitted;
	private String issuerId;
	
	public QuestionnaireValidationResponse(String id) {
		this.id = id;
	}
	
	public QuestionnaireValidationResponse(String id, boolean exists, boolean submitted, String issuerId) {
		this.id = id;
		this.exists = exists;
		this.submitted = submitted;
		this.issuerId = issuerId;
	}
	
	public String getIssuerId() {
		return issuerId;
	}

	public void setIssuerId(String issuerId) {
		this.issuerId = issuerId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public boolean isExists() {
		return exists;
	}

	public void setExists(boolean exists) {
		this.exists = exists;
	}

	public boolean isSubmitted() {
		return submitted;
	}

	public void setSubmitted(boolean submitted) {
		this.submitted = submitted;
	}
	
	
	
	
	
	
}
