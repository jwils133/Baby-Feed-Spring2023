Github Org: https://github.com/babyfeed

High level overview of the project structure:
•	ffq-questionnaire-web
	o	Angular front end of application used for the website
			/src/app/components – contains components for some pages
			/src/app/models – contains classes
			/src/app/pages – contains all pages 
			/src/app/services – used to communicated with external services
•	ffq-authentication-service
	o	Small node service for authenticating users
			/users/user.service.js –authenticates and assigns tokens
•	ffq-food-item-service
	o	Used for managing of food items, calculations, and also reads and writes from the database for information related to food items.
			/src/main/java/~/calculator – used for food item calculations such as nutrient values
			/src/main/java/~/dataloader – used for loading data from resources or database
			/src/main/java/~/models – contains classes
			/src/main/java/~/controller – contains endpoint to be called from the web and calls the service
			/src/main/java/~/service – is called by controller and then calls repositories
			/src/main/java/~/repositories – is called by service and communicates with database
			/src/main/resources – contains additional resources that may be loaded on to the database or read from directly
•	ffquestionnaire-service
	o	Used for managing all things related to the ffq and reads and writes to and from the database for ffq related information.
			/src/main/java/~/calculator – used for food item calculations such as nutrient values
			/src/main/java/~/dataloader – used for loading data from resources or database
			/src/main/java/~/models – contains classes
			/src/main/java/~/controller – contains endpoint to be called from the web and calls the service
			/src/main/java/~/service – is called by controller and then calls repositories
			/src/main/java/~/repositories – is called by service and communicates with database
			/src/main/resources – contains additional resources that may be loaded on to the database or read from directly
•	ffq-user-service
	o	Used for managing the users and their different roles and also reads and writes user information in the database
			/src/main/java/~/dataloader – used for loading data from resources or database
			/src/main/java/~/models – contains classes
			/src/main/java/~/controller – contains endpoint to be called from the web and calls the service
			/src/main/java/~/service – is called by controller and then calls repositories
			/src/main/java/~/repositories – is called by service and communicates with database
			/src/main/resources – contains additional resources that may be loaded on to the database or read from directly
