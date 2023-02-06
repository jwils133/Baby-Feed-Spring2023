FROM java:8-jdk-alpine

COPY ./ffq-questionnaire-service-0.0.1-SNAPSHOT.jar /usr/app/

WORKDIR /usr/app

RUN sh -c 'touch ffq-questionnaire-service-0.0.1-SNAPSHOT.jar'

ENTRYPOINT ["java","-jar", "-Dmongo.questionnaires.load=true", "ffq-questionnaire-service-0.0.1-SNAPSHOT.jar"]  