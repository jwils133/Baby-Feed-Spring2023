#FFQuestionnaireService

This service will be used to create, delete, and validate questionnaireIDs. It will not allow a questionnaireID to be used more than once.

>Running The Application
- Ensure that a local instance of mongoDb is running on port 27017
- Build and start the application by running FFQuestionnaireApplication.java
    To run from command line: ``mvn spring-boot:run``
- The base endpoint of the API is: **localhost:9080/ffq**

>Load database on startup
- Start the application with the following args: 
- -mongo.questionnaires.load="true"
- ie) ``mvn spring-boot:run -Dspring-boot.run.arguments="--mongo.questionnaires.load=true"``

>Database Information
- Database name: **ffq_database**
- Questionnaires Collection name: **questionnaires**

>Questionnaire API

GET calls
- Get all questionnaires: **/questionnaires**
- Get individual questionnaire by questionnaireID: **/{quesetionnaireID}**    (Currently case sensitive)
- Validate questionnaireID: **/validate/{questionnaireID}** 
    If the exists and submitted fields are false, user can take questionnaire.
    If the exists field is true, and submitted is false, user already took questionnaire.

POST calls
- Create a single questionnaire: **/create**
    In the request body, pass one FFQuestionnaire object in a JSON payload. 
    Example:

    {"questionnaireID":"gonza23", "issuerID":"David Gonzalez"}
- Create multiple questionnaires: **/createMany**
    In the request body, pass an arraylist of FFQuestionnaire objects in a JSON payload. 
    Example:

    [{"questionnaireID":"palacios33", "issuerID":"Cristina Palacios"}, {"questionnaireID":"leia003", "issuerID":"Leia Diaz"}]

PUT calls
- To mark a questionnaire as submitted: **/update**
    In the request body, pass a FFQuestionnaire object with the updated info. The questionnaireID in this object must be valid.
    Example:
    {"questionnaireID":"palacios33", "submitted":true}

DELETE calls
- Delete questionnaire by questionnaireID: **/delete/{questionnaireID}**
    Pass the questionnaireID in a request parameter. Make sure the questionnaireID exists.



