# Task Manager

A full-stack task management application built with Next.js 15, TypeScript, tRPC, and TanStack Query.

This project demonstrates CRUD operations, type-safe API communication, server-side rendering, data validation, and client-side state management.

## Features

- Create tasks with a required title and optional description.
- Retrieve and display all tasks.
- Update existing tasks.
- Delete tasks.
- Validate input data using Zod.
- Handle not-found errors with meaningful API responses.
- Display loading, success, and error feedback.
- Prefetch initial data on the server and hydrate it on the client.

## Tech Stack

- **Next.js 15** – React framework and App Router.
- **React 19** – User interface.
- **TypeScript** – Static typing.
- **tRPC 11** – End-to-end type-safe API.
- **TanStack Query** – Data fetching, caching, mutations, and hydration.
- **Zod** – Runtime input validation.
- **Tailwind CSS** – Styling.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd task-manager
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```text
src/
├── app/
│   ├── api/trpc/[trpc]/
│   │   └── route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── tasks-client.tsx
├── server/
│   ├── api/
│   │   ├── routers/
│   │   │   └── task.ts
│   │   ├── root.ts
│   │   └── trpc.ts
│   └── data/
│       └── tasks.ts
└── trpc/
    ├── client.tsx
    ├── query-client.ts
    └── server.tsx
```

## API Operations

| Procedure | Type | Description |
|---|---|---|
| `task.list` | Query | Retrieves all tasks |
| `task.create` | Mutation | Creates a new task |
| `task.update` | Mutation | Updates an existing task |
| `task.delete` | Mutation | Deletes a task |

## Technical Decisions

### Type-safe API

tRPC provides end-to-end type safety between the frontend and backend, reducing duplicated type definitions and improving development reliability.

### Server-side validation

Zod validates incoming data on the server, ensuring task titles are not empty and update requests contain valid fields.

### Server-side rendering

The initial task list is prefetched in a Next.js Server Component. TanStack Query hydrates the prefetched data on the client, reducing unnecessary initial requests.

### In-memory storage

Tasks are stored in an in-memory array for this technical challenge.

**Limitation:** Data is not persistent and may be lost when the server process restarts. A database would be required for persistent storage and production deployment across multiple instances.

## Future Improvements

- Persistent database integration.
- Automated unit and integration tests.
- Task completion status and filtering.
- Pagination or infinite scrolling.
- Task comments.

## License

Developed as a technical challenge.