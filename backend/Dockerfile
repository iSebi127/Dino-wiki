# Build frontend assets with Node, then build backend with Maven and include the frontend dist in static resources

# --- frontend builder ---
FROM node:18-alpine AS frontend-builder
WORKDIR /tmp/frontend

# copy package files and install deps for faster cache
COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend

# copy frontend sources and build
COPY frontend ./frontend
RUN npm run build --prefix frontend

# --- maven build ---
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app

# copy pom and source from backend/ because build context is repository root
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src

# copy built frontend into Spring static resources so it's packaged in the jar
COPY --from=frontend-builder /tmp/frontend/frontend/dist ./src/main/resources/static
# copy repository images into static (so paths like /images/... are available)
COPY images ./src/main/resources/static/images

# build the application (skip tests to speed up builds)
RUN mvn -B -q -DskipTests package

# --- runtime image ---
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy built artifact (use wildcard to match artifact name)
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]

