# Live Code Execution Backend System

## Project Overview
This project implements a backend system that support APIs for users create/save code session, and execute code in real-time within a Job Simulation platform.

The system is designed to:
- Execute user-submitted code securely
- Handle asynchronous execution using a queue-based architecture
- Return execution results (stdout, stderr, status)
- Support concurrency without blocking API requests

## Teck Stack
- Backend API: Node.js (Express)
- Queue System: BullMQ + Redis
- Database: PostgreSQL
- Containerization: Docker

## Directory structure

```
live-coding-execution/
│
├── src/
│   ├── controllers/        # Xử lý request/response (API layer)
│   ├── routes/             # Định nghĩa API endpoints
│   ├── services/           # Business logic (execution)
│   ├── workers/            # Worker xử lý queue (BullMQ consumer)
│   ├── queues/             # Queue setup (BullMQ producer)
│   ├── models/             # Data models / schema (DB)
│   ├── utils/              # Helper (template code, time tracker, file)
│   ├── config/             # Config (env, db, redis)
│   └── server.js           # App entry (Express app)
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env
├── package.json
└── README.md
```

## Setup Instructions

### System requirement
- Node.js: version 18.x and above
- PostgreSQL: version 13.x and above
- Redis: version 6.x and above
- Git

### Setup Database (Local)
1. Install PostgreSQL
Make sure PostgreSQL is installed on your machine.
- Download: https://www.postgresql.org/download/
- Default port: 5432

2. Create Database
Open terminal or pgAdmin and run:  
```CREATE DATABASE live_coding_execution;```

3. Run script SQL
- In the pgAdmin 4, right click the database `live_coding_execution` select `QUERY TOOL` or `Alt + Shift + Q`
- Open the schema.sql file in the db/ directory and copy its contents into the SQL Editor
- Run file sql

### Set up file `.env`
Create a .env file in the root directory and configure the following variables:
```
# PostgreSQL connection string
DATABASE_URL=postgres://postgres:password@localhost:5432/live_coding_execution

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=live_coding_execution
DB_SSL=false
```
Make sure your PostgreSQL server is running on port `5432`

### Install and run project
Install: `npm install`

Run: `npm run dev`

## Architecture
The system is designed using a modular and scalable architecture to handle code execution requests efficiently.
### API Server
- Built with Node.js (Express)
- Handles incoming HTTP requests from clients
- Validates input
- Pushes execution jobs to the queue

### Queue System
- Powered by Redis (BullMQ)
- Manages job scheduling and execution flow

### Worker
- Consumes jobs from the queue
- Executes user-submitted code in an isolated environment
- Returns execution results (output, error)

### Database (PostgreSQL)
- Store data in table `code_sessions` and `executions`

### Execution Environment
- Execution is performed using `child_process.spawn` with a 2s timeout.
- Supports multiple programming languages

### Architecture Diagram
``` mermaid
graph TD
    A[Client] --> B[API Server]
    B --> C[Redis Queue]
    C --> D[Worker]
    D --> E[Execution Environment]
    D --> F[PostgreSQL]
```

### Flow Diagram (run execution)
``` mermaid
sequenceDiagram
    participant Client
    participant API as API Server
    participant Queue as Redis (BullMQ)
    participant Worker
    participant Exec as Execution Environment
    participant DB as PostgreSQL

    Client->>API: Create code session
    API->>DB: Insert session
    API-->>Client: Return session

    Client->>API: Save code
    API->>DB: Update session
    API-->>Client: Confirm save

    Client->>API: Send code execution request
    API->>API: Validate input
    API->>Queue: Add job to queue
    API-->>Client: Response status QUEUED

    Queue->>Worker: Dispatch job
    Worker->>Exec: Execute code

    Exec-->>Worker: Return result (output/error)
    Worker->>DB: Save result

    Client->>API: Get execution result
    DB-->>API: Query data execution
    API-->>Client: Response execution result
```

## API documentation
### Base URL: `http://localhost:3000`

1. Create code session
#### End point: `POST /code_sessions
#### Request Body
``` json
{
    "language": "javascript"
}
```
#### Response
``` json
{
    "session_id": "session_id",
    "status": "ACTIVE"
}
```
2. Save code session
#### End point: `PATCH  /code-sessions/{session_id}`
#### Request Body
``` json
{
    "language": "javascript",
    "source_code": "console.log(\"Hello world\")"
}
```
#### Response
``` json
{
    "session_id": "session_id",
    "status": "ACTIVE"
}
```
3. Execute code session
#### End point: `POST /code-sessions/{session_id}/run`
#### Request Body
``` json
```
#### Response
``` json
{
    "execution_id": "execution_id",
    "status": "QUEUED",
    "queued_at": "timestamp"
}
```
4. Get execution
#### End point: `GET /executions/{execution_id}`
#### Response
``` json
{
    "id": "execution_id",
    "session_id": "session_id",
    "status": "COMPLETED",
    "stdout": "Hello world\n",
    "stderr": "",
    "execution_time_ms": 0,
    "queued_at": "timestamp",
    "started_at": "timestamp",
    "finished_at": "timestamp"
}
```

## Design decisions and trade-offs
1. Api server
#### Decision:
- Use Express.js as the backend framework
#### Why:
- Lightweight and flexible for rapid development
- Supports asynchronous programming (non-blocking I/O)
- Easy to integrate with middleware and third-party libraries
#### Trade off:
- Can become harder to maintain as the project grows without proper architecture

2. Asynchronous Processing with Queue
#### Decision:
- Use Redis (BullMQ) to handle code execution jobs asynchronously
#### Why:
- Code execution can be time-consuming
- Avoid blocking the main API thread
- Improve system scalability
#### Trade off:
- Increased system complexity (need Redis + Worker)
- Harder to debug compared to synchronous flow

3. Database
#### Decision:
- Use Postgre database
#### Why:
- Strong consistency and relational structure
- Easy querying for history and analytics
#### Trade off:
- Slightly slower than in-memory storage
- Requires schema management and migrations


