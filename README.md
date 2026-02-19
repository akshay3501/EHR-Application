# EHR Clinic — Electronic Health Records Application

A full-stack clinical management system for managing patients, appointments, and laboratory orders, with role-based access control.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Default Admin Credentials](#default-admin-credentials)
- [API Documentation](#api-documentation)
- [Environment Configuration](#environment-configuration)

---

## Overview

EHR Clinic is a web-based Electronic Health Records system designed for clinical environments. It provides a secure, role-aware interface for doctors, nurses, lab technicians, receptionists, and administrators to manage day-to-day clinical workflows.

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Runtime |
| Spring Boot | 3.2.5 | Application framework |
| Spring Security | (via Boot) | Authentication & authorization |
| PostgreSQL | Latest | Primary database |
| Flyway | (via Boot) | Database migrations |
| JWT (jjwt) | 0.13.0 | Stateless auth tokens |
| MapStruct | 1.6.3 | DTO mapping |
| Lombok | Latest | Boilerplate reduction |
| SpringDoc OpenAPI | 2.3.0 | Swagger UI / API docs |
| Spring Actuator | (via Boot) | Health & metrics endpoints |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 5 | Build tool & dev server |
| Ant Design | 6 | UI component library |
| Redux Toolkit | 2 | Global state management |
| TanStack Query | 5 | Server state & caching |
| Axios | 1 | HTTP client |
| React Router DOM | 7 | Client-side routing |
| Day.js | 1 | Date handling |

---

## Project Structure

```
Lab explainer/
├── backend/                        # Spring Boot application
│   └── src/main/java/com/ehrclinic/
│       ├── auth/                   # JWT auth, security config, user management
│       ├── patient/                # Patient profiles, allergies, vitals, history
│       ├── appointment/            # Appointments & doctor availability
│       ├── lab/                    # Lab orders, items, catalog & results
│       ├── config/                 # Dashboard controller, audit config
│       ├── common/                 # BaseEntity, DTOs, constants
│       └── exception/              # Global exception handling
│   └── src/main/resources/
│       ├── application.yml         # Main config
│       ├── application-dev.yml     # Dev profile overrides
│       ├── application-prod.yml    # Prod profile overrides
│       └── db/migration/           # Flyway SQL migrations (V1–V4)
│
└── frontend/                       # React + Vite application
    └── src/
        ├── api/                    # Axios API calls per domain
        ├── components/             # UI components (auth, patients, appointments, lab, dashboard)
        ├── config/                 # Constants (roles, statuses, colors)
        ├── hooks/queries/          # TanStack Query hooks
        ├── pages/                  # Page-level components
        ├── router/                 # Route definitions & guards
        ├── store/                  # Redux store (auth, UI slices)
        └── types/                  # TypeScript type definitions
```

---

## Features

### Authentication
- JWT-based login with access tokens (15 min) and refresh tokens (7 days)
- Secure token storage and auto-refresh
- Role-based route protection

### Patient Management
- Register patients with a unique Medical Record Number (MRN)
- Full patient profiles: demographics, contact info, insurance
- Track allergies (type, allergen, severity, reaction)
- Record vital signs (BP, heart rate, temperature, SpO2, weight, height, BMI)
- Maintain medical history (conditions, diagnoses, status)

### Appointment Management
- Schedule and manage appointments
- Configure doctor availability by day of week and time slot
- Track appointment status: `SCHEDULED → CHECKED_IN → IN_PROGRESS → COMPLETED`
- Cancel or mark as `NO_SHOW`

### Laboratory Orders
- Create lab orders with multiple test items from a catalog
- Track status: `ORDERED → SAMPLE_COLLECTED → PROCESSING → COMPLETED`
- Enter and verify individual test results
- Flag abnormal results
- View lab reports per order

### Role-Specific Dashboards
- Each role sees a tailored dashboard with relevant statistics and actions

---

## User Roles & Permissions

| Role | Patients | Appointments | Lab Orders | Register Users |
|---|---|---|---|---|
| `ADMIN` | Full access | Full access | Full access | Yes |
| `DOCTOR` | Read/Write | Read/Write | Read/Write | No |
| `NURSE` | Read/Write | Read/Write | Read/Write | No |
| `LAB_TECHNICIAN` | Read | Read | Results entry | No |
| `RECEPTIONIST` | Read/Write | Read/Write | No access | No |

---

## Database Schema

Managed via Flyway migrations applied in order:

| Migration | Description |
|---|---|
| `V1__init_schema.sql` | Core tables: roles, users, patients, allergies, vital signs, medical histories, appointments, lab orders/items/results |
| `V2__seed_roles.sql` | Insert default roles (ADMIN, DOCTOR, NURSE, LAB_TECHNICIAN, RECEPTIONIST) |
| `V3__seed_lab_test_catalog.sql` | Seed standard lab test catalog entries |
| `V4__seed_admin_user.sql` | Insert default admin user |

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 14+ running locally
- Node.js 18+ and npm

---

### Backend Setup

1. **Create the database:**
   ```sql
   CREATE DATABASE ehr_clinic;
   ```

2. **Configure credentials** in `backend/src/main/resources/application.yml` (or use environment variables):
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/ehr_clinic
       username: postgres
       password: postgres
   ```

3. **Build and run:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

   The backend starts on **http://localhost:8080**. Flyway will automatically apply all migrations on startup.

---

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

   The frontend starts on **http://localhost:5173** (Vite default).

3. **Build for production:**
   ```bash
   npm run build
   ```

> The frontend proxies API calls to the backend. If you change the backend port, update `VITE_API_BASE_URL` in your `.env` file:
> ```
> VITE_API_BASE_URL=http://localhost:8080/api
> ```

---

## Default Admin Credentials

A default admin account is seeded by `V4__seed_admin_user.sql`:

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `Admin@123` |
| Email | `admin@ehrclinic.com` |

> Change this password immediately after first login in a production environment.

---

## API Documentation

When the backend is running, Swagger UI is available at:

```
http://localhost:8080/swagger-ui.html
```

The raw OpenAPI spec is at:

```
http://localhost:8080/api-docs
```

### Key Endpoints

| Domain | Base Path |
|---|---|
| Authentication | `/api/auth` |
| Patients | `/api/patients` |
| Appointments | `/api/appointments` |
| Lab Orders | `/api/lab` |
| Dashboard | `/api/dashboard` |

---

## Environment Configuration

### Backend Profiles

| Profile | File | Usage |
|---|---|---|
| Default | `application.yml` | Base configuration |
| Dev | `application-dev.yml` | Local development overrides |
| Prod | `application-prod.yml` | Production settings |

Activate a profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Actuator Endpoints

Health, info, and metrics endpoints are enabled at:
```
http://localhost:8080/actuator/health
http://localhost:8080/actuator/info
http://localhost:8080/actuator/metrics
```
