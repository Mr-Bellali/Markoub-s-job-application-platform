# Job Application Platform  
**Senior Full-stack Assignment Submission**

> This project is my submission for the **Senior Full-stack Assignment**.  
> Even though I don’t officially consider myself *senior yet*, I treated this task as a **product-level system** and focused on clean architecture, data integrity, and developer experience.

---

## Architectural Overview

I chose a **monolithic architecture** for this project.

The goal was to:
- Move fast
- Keep all entry points in a single repository
- Avoid unnecessary complexity for a take-home assignment

All services live in one repo but are **logically separated** by responsibility.

### Project is composed of:

```
/api                     → Backend API
/admin                   → Admin dashboard
/job-application-platform → Public job platform
```

---

## Backend — `/api`

The backend is built with **Node.js + TypeScript** using **Express.js**, mainly because it’s still the most straightforward and productive choice when working with Node.

### Key decisions & stack

- **Express.js**
- **PostgreSQL**
- **Drizzle ORM**
- **Zod** for data validation
- **LocalStack (S3)** for file storage

### Backend structure

```
src
├── common
├── config
├── db
├── middlewares
├── routes
├── services
└── types
```

---

## Admin Panel — `/admin panel`

The admin dashboard allows managing job positions and viewing applications.

### Stack
- React + Vite
- Zod
- Axios
- TanStack React Query

---

## Job Application Platform — `/job application platform`

Public-facing platform where users can view and apply for positions.

---

## Running the Project (Dockerized)

### Prerequisites
- Docker
- Docker Compose

### Start everything

```bash
docker-compose up --build
```

---

## Services & Ports

| Service | URL |
|------|------|
| API | http://localhost:8080 |
| Admin Panel | http://localhost:7000 |
| job application platform | http://localhost:6000 |
| PostgreSQL | localhost:5432 |
| LocalStack S3 | http://localhost:4566 |

---

## Useful Commands

```bash
docker compose up --build
```

this command will run everything from creating env files for the project to work to services running for other developers to make their life easier.

If you having a trouble to run the frontend like I do just comment ot in the docker compose and run them individually using `npm run dev` because I still have to learn working with fontend with docker

---

## 🎯 Final Notes

Thank you for reviewing this submission. I hope I meet your expectations.
