# Taskora Backend (Java + Spring Boot + Supabase)

Enterprise-ready REST API backend for the Taskora Project Management platform, built with **Spring Boot 3**, **Java 17**, and **Supabase (PostgreSQL & Auth)**.

---

## 🚀 Tech Stack

- **Java**: 17 LTS
- **Framework**: Spring Boot 3.3.4
- **ORM / Persistence**: Spring Data JPA / Hibernate
- **Database**: Supabase PostgreSQL (Supports direct connections & connection pooler)
- **Security & Authentication**: Spring Security + JJWT 0.12.6 (Supabase JWT verification)
- **Validation**: Jakarta Bean Validation (`spring-boot-starter-validation`)
- **API Documentation**: SpringDoc OpenAPI / Swagger UI (v2.6.0)
- **Build Tool**: Apache Maven

---

## 📁 Architecture & Folder Structure

```
backend/
├── pom.xml                               # Maven project dependencies & build config
├── src/
│   ├── main/
│   │   ├── java/com/taskora/
│   │   │   ├── TaskoraApplication.java   # Spring Boot Application entry point
│   │   │   ├── config/                   # CORS, Security, Swagger configurations
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── controller/               # REST API endpoints
│   │   │   │   ├── HealthController.java
│   │   │   │   ├── ProfileController.java
│   │   │   │   ├── ProjectController.java
│   │   │   │   ├── TaskController.java
│   │   │   │   └── WorkspaceController.java
│   │   │   ├── dto/                      # Data Transfer Objects & Requests
│   │   │   │   ├── ApiResponse.java
│   │   │   │   ├── CommentDto.java
│   │   │   │   ├── CreateCommentRequest.java
│   │   │   │   ├── CreateProjectRequest.java
│   │   │   │   ├── CreateTaskRequest.java
│   │   │   │   ├── CreateWorkspaceRequest.java
│   │   │   │   ├── ProfileDto.java
│   │   │   │   ├── ProjectDto.java
│   │   │   │   ├── TaskDto.java
│   │   │   │   └── UpdateTaskRequest.java
│   │   │   ├── exception/                # Exception handling & ControllerAdvice
│   │   │   │   ├── BadRequestException.java
│   │   │   │   ├── ErrorResponse.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   └── UnauthorizedException.java
│   │   │   ├── model/                    # JPA Entities & Enums
│   │   │   │   ├── Comment.java
│   │   │   │   ├── Label.java
│   │   │   │   ├── Notification.java
│   │   │   │   ├── Profile.java
│   │   │   │   ├── Project.java
│   │   │   │   ├── Task.java
│   │   │   │   ├── Workspace.java
│   │   │   │   ├── WorkspaceMember.java
│   │   │   │   └── enums/
│   │   │   │       ├── TaskPriority.java
│   │   │   │       ├── TaskStatus.java
│   │   │   │       └── WorkspaceRole.java
│   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   │   ├── CommentRepository.java
│   │   │   │   ├── LabelRepository.java
│   │   │   │   ├── NotificationRepository.java
│   │   │   │   ├── ProfileRepository.java
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   ├── TaskRepository.java
│   │   │   │   ├── WorkspaceMemberRepository.java
│   │   │   │   └── WorkspaceRepository.java
│   │   │   ├── security/                 # Supabase JWT token extraction & validation
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   ├── SupabaseJwtValidator.java
│   │   │   │   └── UserPrincipal.java
│   │   │   └── service/                  # Business logic services
│   │   │       ├── ProfileService.java
│   │   │       ├── ProjectService.java
│   │   │       ├── TaskService.java
│   │   │       └── WorkspaceService.java
│   │   └── resources/
│   │       ├── application.yml           # Database & application properties
│   │       └── schema.sql                # Supabase database schema reference
│   └── test/
│       └── java/com/taskora/             # Unit and integration tests
└── README.md
```

---

## ⚙️ Configuration & Environment Variables

Configure your database connection in `src/main/resources/application.yml` or through environment variables:

| Environment Variable | Description | Example |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | Supabase Postgres JDBC URL | `jdbc:postgresql://db.<PROJECT-REF>.supabase.co:5432/postgres` or `jdbc:postgresql://aws-0-<REGION>.pooler.supabase.com:6543/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | Supabase Postgres User | `postgres` (or `postgres.<PROJECT-REF>` for pooler) |
| `SPRING_DATASOURCE_PASSWORD` | Supabase Database Password | `your-db-password` |
| `SUPABASE_URL` | Supabase Project URL | `https://<PROJECT-REF>.supabase.co` |
| `SUPABASE_JWT_SECRET` | Supabase JWT Secret | *Found in Supabase Dashboard -> Settings -> API -> JWT Secret* |
| `PORT` | HTTP Server Port (Default `8080`) | `8080` |

---

## 🏃 Running the Backend

### Prerequisites
- Java 17+ installed (`java -version`)
- Maven 3.8+ installed (`mvn -version`)

### Build and Run
```bash
# Navigate to the backend directory
cd backend

# Compile and package
mvn clean package -DskipTests

# Run with Maven
mvn spring-boot:run

# Or run the packaged jar
java -jar target/taskora-backend-0.0.1-SNAPSHOT.jar
```

---

## 📖 Swagger / OpenAPI Documentation

Once the server is running, explore and test the interactive API documentation at:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 🔐 Supabase JWT Authentication Flow

1. The frontend authenticates users directly with Supabase (`supabase.auth.signInWithPassword()` / OAuth).
2. The frontend sends the Supabase access token in the request header:
   ```http
   Authorization: Bearer <supabase_access_token>
   ```
3. `JwtAuthFilter` extracts the token, verifies the cryptographic signature (using `SUPABASE_JWT_SECRET`), parses the user's `UUID` and email, and sets the authenticated `UserPrincipal` into Spring Security's `SecurityContext`.
