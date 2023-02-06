# ffq-user-service

This service will serve as a backing store for the users and clinics that will be used in program

>Running The Application
- Ensure that a local instance of mongoDb is running on port 27017
- Build and start the application by running FFQUserApplication.java
    To run from command line: ``mvn spring-boot:run``
- The base endpoint of the API is: **localhost:9070/ffq**

>Load database on startup
- Start the application with the following args: 
- -Dmongo.users.load="true"
- ie) ``mvn spring-boot:run -Dspring.boot.run.arguments="--mongo.users.load=true"``

>Database Information
- Database name: **ffq_database**
- Admin user Collection name: **admins**
- Clinician user Collection name: **clinicians**
- Parent user Collection name: **parents**
- Clinic Collection name: **clinics**

>User API

GET calls
- Get all items : **/{api}/all**  where api = admins, parents, clinicians, or clinics
- Get individual item by ID: **/{api}/{ID}**    

POST calls
- Create a an item based on api used: **/{api}/create**
    In the request body, pass one item object in a JSON payload. 
    Example payload:
    {"userId": "1","username": "clinician1", "userpassword": "Cristina_123@", "usertype": "clinician", "abbreviation": "Dr", "firstname": "Mary", "lastname": "Adams", "assignedclinic": 1, "previousclinics": [1], "isactive": true}

DELETE calls
- Delete item by ID: **/{api}/delete/{ID}**
    Pass the ID in a request parameter


