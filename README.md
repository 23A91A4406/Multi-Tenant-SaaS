### MULTI-TENANT SAAS PLATFORM

## 1. Project Title and Description

Multi-Tenant SaaS Platform

This project is a Multi-Tenant SaaS application designed to allow multiple organizations (tenants) to securely use a single platform with isolated data. It provides authentication, tenant-based access control, project and task management, and audit logging.

Target Audience:
Small to medium businesses, SaaS startups, and developers learning multi-tenant system architecture.
_____________________________________________________
## 2. Features List

- Multi-tenant architecture with tenant isolation
- User authentication using JWT
- Role-based access control
- Tenant-specific projects and tasks
- Secure RESTful API backend
- PostgreSQL database with migrations
- Audit logs for user actions
- Dockerized backend, frontend, and database
_____________________________________________________
## 3. Technology Stack

Frontend
- React.js 18+
- Vite 5+
- HTML5 / CSS3
- JavaScript (ES6)

Backend
- Node.js 18
- Express.js 4+
- JSON Web Tokens (JWT) for authentication
- dotenv 17+

Database
- PostgreSQL 15

Containerization
- Docker
- Docker Compose
________________________________________________
## 4. Architecture Overview
System Architecture Description

The application follows a three-tier architecture:

- Frontend: React-based UI running in a Docker container

- Backend: Node.js + Express REST API handling business logic

- Database: PostgreSQL for persistent storage

All services are orchestrated using Docker Compose, ensuring isolated and consistent environments.

Architecture Diagram:

+------------+        HTTP/REST        +------------+        SQL Queries        +------------+
|            |  ------------------>   |            |  -------------------->   |            |
|  Frontend  |                        |  Backend   |                           |  Database  |
|  (React)   |  <------------------   | (Node.js)  |  <--------------------   | (Postgres) |
|            |        JSON Response    |            |        Query Results      |            |
+------------+                        +------------+                           +------------+

_____________________________________________________
## 5. Installation & Setup

 ## 5.1 Prerequisites

- Docker
- Docker Compose
- Git

## 5.2 Step-by-Step Local Setup

1. Clone the repository

 git clone <repository-url>
 cd Multi-Tenant-Saas

2. Build Docker images

 docker compose build --no-cache

3. Start all services
 
 docker compose up -d

## 5.3 Running Migrations

Migration files location:

/app/migrations

## 5.4 Seeding the Database

To seed the database, run:

docker compose exec backend node scripts/init-db.js

## 5.5 Start Backend

The backend starts automatically via Docker.

Backend URL:

http://localhost:5000


Health check:

curl http://localhost:5000/api/health

## 5.6 Start Frontend

The frontend starts automatically via Docker.

Frontend URL:

http://localhost:3000

______________________________________________
## 6. Environment Variables

Backend Environment Variables

| Variable       | Description                |
| -------------- | -------------------------- |
| PORT           | Backend server port        |
| DB_HOST        | Database host name         |
| DB_PORT        | Database port              |
| DB_NAME        | PostgreSQL database name   |
| DB_USER        | Database username          |
| DB_PASSWORD    | Database password          |
| JWT_SECRET     | Secret key for JWT signing |
| JWT_EXPIRES_IN | JWT expiration duration    |
| FRONTEND_URL   | Allowed frontend URL       |
| NODE_ENV       | Application environment    |

Frontend Environment Variables

| Variable          | Description          |
| ----------------- | -------------------- |
| REACT_APP_API_URL | Backend API base URL |
_____________________________________________________
## 7. API Documentation

Health Check
GET /api/health

Authentication
POST /api/auth/register
POST /api/auth/login

Tenants
GET /api/tenants
POST /api/tenants

Projects
GET /api/projects
POST /api/projects

Tasks
GET /api/tasks
POST /api/tasks