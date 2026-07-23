# Project: CS&E ERP System Audit
# Scope: Project Orchestrator

## Architecture
- `/backend`: NestJS application with Prisma (SQLite) handling API and DB layer.
- `/frontend`: Next.js application handling the client UI.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Backend Verification | /backend folder: `npm install`, `build`, static analysis (types, unused vars, unhandled promises), Prisma schema validation. | none | PLANNED |
| 2 | Frontend Verification | /frontend folder: `npm install`, `build`, static analysis (types). | none | PLANNED |
| 3 | API & Functional Test | Launch servers. Verify RBAC, JWT on `/api/auth/login`, CSV parsing to SQLite, Pass percentage match. | M1, M2 | PLANNED |
| 4 | Final E2E Audit | Integrity auditing to ensure no cheated implementations. | M3 | PLANNED |

## Interface Contracts
### /frontend ↔ /backend
- Frontend consumes `/api/*` endpoints from Backend via HTTP/JSON.
- Authentication handled via JWT on restricted routes.
