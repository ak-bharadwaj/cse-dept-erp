# CSE Department ERP System

A role-based Enterprise Resource Planning (ERP) application developed for the Computer Science & Engineering (CSE) Department. Built on a modular NestJS API backend and a Next.js (Turbopack + TailwindCSS) frontend dashboard client.

---

## 🚀 Key Features

*   **Student Dashboard:** Onboarding registration, personal profile completion form, self-reported achievements, placement offers list, and official syllabus repository downloads.
*   **Faculty Dashboard:** Allocation mappings, class attendance logger sheets, Continuous Internal Assessment (CIA) marks entry grids, and research publication logging.
*   **Operator Dashboard:** Student registration forms, onboarding verification queue approval, placement drives records management, and batch CSV textareas data imports.
*   **HOD / Admin Portal:** Recharts result analytics charts, student rosters, faculty workload audits, document repository uploader, and security audit log table.

---

## 🛠️ Technology Stack

*   **Frontend Client:** Next.js (App Router), Lucide Icons, Recharts, TailwindCSS.
*   **Backend API:** NestJS Framework, Passport JWT Authentication, Roles Guards.
*   **Database:** SQLite Engine via Prisma Client.

---

## 📦 Getting Started (Windows Users)

We have provided quick launch batch files for convenient local testing and customer deployment:

### 1. Initial Installation
Double-click and run:
```bash
setup-app.bat
```
*This installs both NestJS and Next.js npm packages, synchronizes the SQLite schema (`npx prisma db push`), and compiles the database client.*

### 2. Launch the Application
Double-click and run:
```bash
run-app.bat
```
*This launches the API server and frontend client concurrently in separate window logs.*
*   **Web Portal:** `http://localhost:3000`
*   **API Server:** `http://localhost:3001`

---

## 🔒 Security & Access Rules
All administrative endpoints are protected with standard JWT strategies. Operations such as CSV imports, mark entries, student verifications, and document releases verify user roles (`SUPER_ADMIN`, `HOD`, `DATA_ENTRY`, `FACULTY`, `STUDENT`) before authorizing transactions.
