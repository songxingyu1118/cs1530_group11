FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json .
RUN npm install --frozen-lockfile

COPY frontend .
RUN npm run build

FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /app

COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY --from=backend-builder /app/target/*.jar app.jar
COPY --from=frontend-builder /app/frontend/dist /app/public

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
