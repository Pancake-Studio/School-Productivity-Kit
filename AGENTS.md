<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ferrum School Platform - Implementation Log

## 1. Core Architecture & Multi-tenancy
- [x] **Dynamic Prisma Integration**: Configured Prisma v7 with `@prisma/adapter-pg` to support dynamic switching between tenant-specific database schemas at runtime.
- [x] **Master/Tenant Database Split**: Established a Master DB (Neon) for global metadata and dynamic schema provisioning for individual schools.
- [x] **Tenant Resolver Utility**: Created `lib/db.ts` and `lib/tenant.ts` to securely resolve database connections based on session context.
- [x] **Proxy/Middleware Protection**: Implemented `proxy.ts` (Next.js custom convention) to enforce authentication, school assignment, and onboarding redirects.

## 2. Authentication & Identity
- [x] **Google OAuth (Auth.js v5)**: Fully integrated NextAuth with Google provider.
- [x] **Multi-account Linking**: Support for syncing multiple Gmail accounts to a single user identity (GlobalUser).
- [x] **Session Extension**: Injected `schoolId` and `globalUserId` into JWT/Session objects for downstream usage.

## 3. Onboarding & Provisioning
- [x] **Access Code Validation**: Secure flow to validate Ferrum Group-issued codes.
- [x] **Automated Schema Provisioning**: Server action that programmatically creates PostgreSQL schemas and executes Prisma migrations for new tenants.
- [x] **Initial Admin Seeding**: Automatic creation of the first ADMIN user in the tenant DB upon school creation.

## 4. RBAC (Role-Based Access Control)
- [x] **Permission System**: Defined `PERMISSIONS` constants and `ROLE_DEFAULT_PERMISSIONS` mapping.
- [x] **Hybrid Check**: Support for both role-inherited permissions and explicit database overrides in the `Permission` table.
- [x] **Security Hooks**: Implemented `requirePermission` and `checkPermission` utilities for Server Actions and UI components.

## 5. Functional Modules
- [x] **News & Activities**: 
    - Full CRUD with publishing toggles.
    - Glassmorphism UI with Framer Motion animations.
- [x] **Teacher Directory**: 
    - Searchable directory with role/department filtering.
    - Admin-only department management.
    - Premium card-based visualization.
- [x] **Student Records**: 
    - Schema for `Classroom` and `StudentProfile`.
    - Detailed record tracking: Student Code, Roll Number (เลขที่), Study Track (สายการเรียน).
    - Management UI for updating student and parent information.

## 6. Premium UI & UX
- [x] **Design System**: Implemented a theme-aware, vibrant aesthetic using HeroUI and custom Vanilla CSS meshes.
- [x] **Dashboard Menu**: Centralized hub with vivid quick-action cards and real-time stats overview.
- [x] **Font Modernization**: Integrated modern sans-serif typography across the entire project.

