-- ============================================================
-- Skilect — Supabase Schema
-- Run this in the Supabase SQL editor (Project → SQL Editor)
-- ============================================================

-- ── Users ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id             TEXT UNIQUE NOT NULL,
  email                TEXT NOT NULL,
  first_name           TEXT NOT NULL DEFAULT '',
  last_name            TEXT NOT NULL DEFAULT '',
  avatar_url           TEXT,
  target_role          TEXT,
  skills               TEXT[] DEFAULT '{}',
  experience           TEXT,
  education            TEXT,
  assessment_completed BOOLEAN NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Resumes ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  target_role TEXT NOT NULL,
  analysis    JSONB,                  -- stores full ResumeAnalysis object
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Roadmaps ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmaps (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  target_role      TEXT NOT NULL,
  estimated_weeks  INT  NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Skill Nodes (roadmap steps) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_nodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id      UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  level           TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  estimated_days  INT  NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  resources       JSONB DEFAULT '[]',  -- array of { title, url, type }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Tasks ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  roadmap_id   UUID REFERENCES roadmaps(id) ON DELETE SET NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  priority     TEXT NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low', 'medium', 'high')),
  status       TEXT NOT NULL DEFAULT 'todo'
                 CHECK (status IN ('todo', 'in_progress', 'completed')),
  due_date     TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Interview Sessions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  type         TEXT DEFAULT 'technical'
                 CHECK (type IN ('technical', 'behavioral', 'hr')),
  status       TEXT NOT NULL DEFAULT 'in_progress'
                 CHECK (status IN ('scheduled', 'in_progress', 'completed')),
  score        INT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Interview Answers ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS interview_answers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  user_id      TEXT NOT NULL,
  question     TEXT NOT NULL,
  transcript   TEXT NOT NULL,
  score        INT,
  feedback     TEXT,
  model_answer TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Assessment Results ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  assessment_id   TEXT NOT NULL,
  score           INT NOT NULL,
  feedback        TEXT,
  answers         JSONB DEFAULT '[]',
  completed_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, assessment_id)
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tasks_user_id       ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status        ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id    ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_nodes_roadmap ON skill_nodes(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_interview_user      ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user        ON resumes(user_id);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Enable RLS on all tables (service-role key bypasses these; anon key respects them)
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps            ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results  ENABLE ROW LEVEL SECURITY;
