# Single combined deploy: this image builds the React frontend AND the Spring
# Boot backend, and bundles the built frontend into the backend's static
# resources so one jar serves both the API and the SPA from one origin.
#
# Lives at the REPO ROOT on purpose — Render's default Docker settings
# (Root Directory blank, Dockerfile Path "Dockerfile", Build Context ".")
# find it with zero custom configuration. Don't move this back into backend/.

# ---- Frontend build stage ----
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./
# No package-lock.json committed yet — using `npm install` rather than `npm ci`.
# Once a lockfile exists, commit it and switch this to `npm ci` for reproducible builds.
RUN npm install
COPY frontend/ ./
# Same-origin deploy: leave the API base empty so frontend/src/api.js falls back
# to relative paths (e.g. /api/me) instead of pointing at localhost:8080.
ENV VITE_API_BASE_URL=""
RUN npm run build

# ---- Backend build stage ----
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn -q -B dependency:go-offline
COPY backend/src ./src
# Drop the built frontend into Spring Boot's static resources before packaging —
# anything under src/main/resources/static/ is served automatically at the app root.
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn -q -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Render sets PORT at runtime; application.yml already reads ${PORT:8080}.
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
