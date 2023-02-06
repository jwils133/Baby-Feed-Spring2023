# Introduction 
This service deploys all the front-end components of the FFQ Project. All web pages in the website are defined, compiled and deployed through here.

# Getting Started
To start this service, open a console window.
1.	Navigate to the ffq-questionnaire-web directory in your project folder.
2.	Run the command "npm install" to install all packages and dependencies.
3.	Make sure no processes are running on port 4200.
4.	Run the command "npm start" to start the service.

# Directory Structure
This section will describe the structure of the "src/app/" directory.
1. /components/: includes angular components such as popup windows
2. /models/: all object models, such as clinicians and parents and their attributes
3. /pages/: all web pages for all portals
4. /pipes/ : all pipes, usually used for search functions
5. /services/: all services which return data from the database
6. app-routing.module.ts: all URLs are defined and mapped to an angular component here
7. app.module.ts: all components being used in the app are declared here

# Azure Deployment using ng-deploy

#### Pre reqs
 - Node v12 and npm v6 installed or docker images and container this app.
 - Make sure to run `ng build --configuration production` to create a `./dist` folder to use as the deployable artifact for a static website.

#### Deploy
 - Run `ng add @azure/ng-deploy` to add the azure deploy tools
 - Follow the command line steps to get azure connected
 - Run `ng run ffq-questionnaire-web:deploy` when ready to deploy static website to azure storage
 - Command line will have the url of the site
