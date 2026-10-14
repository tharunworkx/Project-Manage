# TaskFlow 🚀

TaskFlow is a high-performance, full-stack project and task management platform featuring a modern **React + Vite** frontend and an enterprise **Java + Spring Boot + Supabase PostgreSQL** backend.

---

## 📁 Repository Structure

```
Project-Management/
├── frontend/             # React (Vite) + Tailwind CSS + shadcn/ui client
│   ├── src/              # Components, pages, hooks, state, and services
│   ├── public/           # Static assets
│   ├── package.json      # Frontend npm dependencies
│   └── vite.config.js    # Vite configuration
│
├── backend/              # Java 17 + Spring Boot 3.3 REST API
│   ├── pom.xml           # Maven build & dependencies (Spring Boot, Supabase/JJWT, OpenAPI)
│   ├── src/main/java/    # Spring Boot controllers, services, repositories, models, security
│   └── src/main/resources# application.yml and database schema.sql
│
└── supabase/             # Supabase database migrations, seed data, and Edge functions
    └── migrations/       # SQL schemas (profiles, workspaces, projects, tasks, comments, labels)
```

---

## 🛠️ Quick Start

### 1. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend will run at `http://localhost:5173`.

### 2. Backend Setup (Java + Spring Boot + Supabase)

Ensure you have **Java 17+** and **Maven 3.8+** installed.

```bash
cd backend

# Compile and package
mvn clean package -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
```
The backend API and Swagger UI will be available at:
- **API Base URL**: `http://localhost:8080/api/v1`
- **Interactive Swagger Docs**: `http://localhost:8080/swagger-ui.html`

### 3. Database & Supabase Configuration

Set your Supabase credentials in `backend/src/main/resources/application.yml` or via environment variables:
- `SPRING_DATASOURCE_URL`: Supabase PostgreSQL JDBC connection string
- `SPRING_DATASOURCE_PASSWORD`: Your Supabase database password
- `SUPABASE_JWT_SECRET`: Supabase JWT secret from your project settings

---

## ✨ Full Stack Features

- 📋 **Dynamic Kanban Board**: Drag-and-drop task workflows powered by `@dnd-kit`.
- 📊 **Productivity Analytics**: Real-time metrics and charts via `recharts`.
- 🏢 **Multi-Workspace & Projects**: Complete workspace management and team collaboration.
- ⚡ **Supabase Authentication & Security**: Stateless JWT verification integrated with Spring Security filter chain.
- 📖 **OpenAPI 3 / Swagger Documentation**: Auto-generated interactive API exploration.
- 🎨 **Modern Aesthetics**: Dark mode, micro-interactions with Framer Motion, and shadcn/ui components.
