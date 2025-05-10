FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/trading-backend-0.0.1-SNAPSHOT.jar trading-backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","trading-backend.jar"]