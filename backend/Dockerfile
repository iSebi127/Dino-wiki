FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY mvnw pom.xml ./
COPY .mvn .mvn
COPY src src
RUN ./mvnw -q -DskipTests package
EXPOSE 8080
CMD ["java","-jar","target/dinowiki-backend-0.0.1-SNAPSHOT.jar"]

