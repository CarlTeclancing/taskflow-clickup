# TaskFlow
Multi-user task management MVP. React/Vite, Express MVC, Prisma/PostgreSQL.

## 1. Prerequisites
Install Node.js 20+ (npm included), PostgreSQL 15+ and Git (optional). Create a database named `taskflow` using pgAdmin or `createdb -U postgres taskflow`. Alternatively run `docker compose up -d` from this folder to start PostgreSQL with the example credentials.

## 2. Backend setup
Open a terminal in this folder:
```sh
cd backend
npm install
cp .env.example .env
```
On Windows PowerShell use `Copy-Item .env.example .env` instead of cp. Edit DATABASE_URL to match your database username/password/port. Set JWT_SECRET to a unique random secret (at least 32 characters). Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
```sh
npm run db:generate
npm run db:push
npm run dev
```
API: http://localhost:4000/api. Health check: http://localhost:4000/health. `db:push` is for local development; use Prisma migrations for production.

## 3. Frontend setup
Open another terminal at the project root:
```sh
cd frontend
npm install
cp .env.example .env
npm run dev
```
On Windows use `Copy-Item .env.example .env`. Open http://localhost:5173. If Vite chooses another port, update FRONTEND_URL in backend/.env and restart backend. `npm run build` creates the production frontend in dist.

## 4. Test the workflow
1. Register an account (password at least 8 characters). A workspace and project are created automatically.
2. Create tasks with the top plus button or a column plus button. Set due date, priority, category and progress.
3. Drag the three-dot handle between columns; click the title to edit, delete, comment or attach an HTTP(S) file link.
4. Register a second account in a different browser/private window. In the first account, open Team and add the second user's registered email. In the second account reload and select the shared workspace.
5. Assign tasks to members. Use Overview, Lists, Timeline, Files, Notifications and Settings. Export the current filtered project to CSV.
6. Verify isolation: an unrelated account cannot read or modify another workspace's tasks by guessing IDs (API returns 403).

## 5. Structure
- backend/prisma/schema.prisma: relational models
- backend/src/models: Prisma client and public user projection
- backend/src/controllers: request validation and CRUD
- backend/src/services: workspace/project/task authorization
- backend/src/routes: REST endpoints
- backend/src/middleware: JWT authentication and async error handling
- frontend/src/components: atoms, molecules, organisms, templates
- frontend/src/pages: independently routed screens
- frontend/src/state.jsx: shared application state
- frontend/src/api.js: Axios API client

## 6. API
All endpoints under /api; except register/login require Bearer JWT.
- POST /register, /login; PATCH /profile
- GET/POST /workspaces
- POST /workspaces/:id/members (owner only, existing registered email)
- POST /workspaces/:id/projects
- GET/POST /projects/:id/tasks
- PATCH/DELETE /tasks/:id
- POST /tasks/:id/comments, /tasks/:id/attachments

## 7. MVP limitations and production checklist
Attachments are external links, not uploaded binary files. Notifications are computed in-app from deadlines, not push/email. Timeline is a deadline list, not a full Gantt editor. Avatars use initials. Workspace members share task editing permissions; owners add members. No email verification, password reset, real-time synchronization, member removal or audit history. Refresh to see other users' changes. JWT is stored in sessionStorage for local MVP; for production use secure HttpOnly cookies with CSRF protections or a hardened token strategy, HTTPS, strong secrets, backups, migrations, monitoring and automated integration tests. Do not deploy the example database credentials publicly.
