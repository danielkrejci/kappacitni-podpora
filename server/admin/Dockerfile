FROM openjdk:17
EXPOSE 8080
ARG JAR_FILE=build/libs/admin-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
CMD ["--server.port=8080"]