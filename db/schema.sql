DROP TABLE executions;
DROP TABLE code_sessions;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE code_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(20),
  source_code TEXT,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES code_sessions(id),
  status VARCHAR(20) DEFAULT 'QUEUED',
  stdout TEXT,
  stderr TEXT,
  execution_time_ms INT,
  queued_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  finished_at TIMESTAMP
);
