# Project Name

A MonoRepoInvoices with Prisma, Docker support, and pnpm workspaces.

---

## Project Overview

This repository contains a backend API built with **NestJS** in a monorepo structure using **pnpm workspaces**.  
It uses **Prisma ORM** to interact with a **PostgreSQL** database and supports **real-time events** via WebSockets.

The project is containerized using **Docker**, allowing seamless deployment.

---

## Architecture

root
│
├─ apps
│ └─ api # NestJS backend
│
├─ libs # Shared libraries
│
├─ prisma # Prisma schema and migrations
│
├─ package.json
├─ pnpm-workspace.yaml
└─ pnpm-lock.yaml

markdown


- **apps/api**: NestJS application  
- **libs**: Shared modules, utilities, or DTOs  
- **prisma**: Database schema and migrations  

---

## Tech Stack

- **Node.js** v20  
- **NestJS** v10+  
- **TypeScript**  
- **Prisma ORM**  
- **PostgreSQL**  
- **pnpm** for workspace management  
- **Docker** & **Docker Compose**  

---
