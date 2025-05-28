-- Table: leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  message text,
  source text default 'email_followup',
  status text default 'new',
  thread_id text,
  last_contact_date timestamp with time zone,
  follow_up_count integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Table: email_logs
create table email_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  email_type text not null,
  subject text,
  content text,
  sent_at timestamp with time zone default now()
);

-- Table: settings
create table settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create s_curves table to store S-curve data
CREATE TABLE s_curves (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id),
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX idx_s_curves_project_id ON s_curves(project_id);