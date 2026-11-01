-- Umeed Of Life central investor and department finance module.
-- Review and test in a staging project before applying to production.
create extension if not exists pgcrypto;

create table if not exists public.investor_profiles (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id) on delete set null,
 full_name text not null,
 email text not null unique,
 phone text not null,
 cnic_number text not null,
 address text not null,
 status text not null default 'active' check (status in ('active','inactive','suspended')),
 created_by uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);


create table if not exists public.investor_access_permissions (
 id uuid primary key default gen_random_uuid(),
 investor_id uuid not null references public.investor_profiles(id) on delete cascade,
 permission_key text not null check (permission_key in ('wallet_summary','department_finances','payment_history','submit_investment')),
 enabled boolean not null default true,
 updated_by uuid,
 updated_at timestamptz not null default now(),
 unique(investor_id,permission_key)
);

create table if not exists public.investment_accounts (
 id uuid primary key default gen_random_uuid(),
 label text not null,
 bank_name text not null,
 account_title text not null,
 account_number text not null,
 iban text,
 instructions text,
 is_active boolean not null default true,
 created_by uuid not null,
 created_at timestamptz not null default now()
);

create table if not exists public.investment_submissions (
 id uuid primary key default gen_random_uuid(),
 investor_id uuid not null references public.investor_profiles(id) on delete restrict,
 account_id uuid not null references public.investment_accounts(id) on delete restrict,
 amount numeric(14,2) not null check (amount > 0),
 currency text not null default 'PKR' check (currency='PKR'),
 reference_number text not null,
 payment_date date not null,
 note text,
 proof_path text not null,
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 review_note text,
 reviewed_by uuid,
 reviewed_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.investor_wallet_ledger (
 id uuid primary key default gen_random_uuid(),
 investor_id uuid not null references public.investor_profiles(id) on delete restrict,
 submission_id uuid references public.investment_submissions(id) on delete restrict,
 amount numeric(14,2) not null check (amount > 0),
 entry_type text not null check (entry_type in ('credit','debit')),
 note text not null,
 created_by uuid,
 created_at timestamptz not null default now(),
 unique(submission_id,entry_type)
);

create table if not exists public.department_financial_entries (
 id uuid primary key default gen_random_uuid(),
 department_id uuid not null references public.departments(id) on delete restrict,
 entry_type text not null check (entry_type in ('income','expense','valuation')),
 amount numeric(14,2) not null check (amount > 0),
 currency text not null default 'PKR' check (currency='PKR'),
 note text not null,
 entry_date date not null default current_date,
 created_by uuid not null,
 created_at timestamptz not null default now()
);


create table if not exists public.central_announcements (
 id uuid primary key default gen_random_uuid(),
 title text not null,
 body text not null,
 audience text not null default 'all' check (audience in ('all','employees','investors','management')),
 status text not null default 'draft' check (status in ('draft','published','archived')),
 published_at timestamptz,
 created_by uuid not null,
 updated_by uuid,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists central_announcements_status_created_idx on public.central_announcements(status,created_at desc);

create table if not exists public.central_audit_logs (
 id uuid primary key default gen_random_uuid(),
 actor_id uuid,
 action text not null,
 entity_type text not null,
 entity_id uuid,
 metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists investment_submissions_status_created_idx on public.investment_submissions(status,created_at desc);
create index if not exists investor_ledger_investor_created_idx on public.investor_wallet_ledger(investor_id,created_at desc);
create index if not exists department_finance_department_date_idx on public.department_financial_entries(department_id,entry_date desc);
create index if not exists central_audit_logs_created_idx on public.central_audit_logs(created_at desc);

-- Private proof bucket. Files are accessed only by trusted server routes with the server secret key.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('investment-proofs','investment-proofs',false,5242880,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public=false,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;

alter table public.investor_profiles enable row level security;
alter table public.investment_accounts enable row level security;
alter table public.investor_access_permissions enable row level security;
alter table public.investment_submissions enable row level security;
alter table public.investor_wallet_ledger enable row level security;
alter table public.department_financial_entries enable row level security;
alter table public.central_audit_logs enable row level security;
alter table public.central_announcements enable row level security;
-- Deliberately no broad authenticated policies: server routes verify role/profile before using the server-only secret key.

create or replace function public.review_investment_submission(
 p_submission_id uuid,
 p_decision text,
 p_review_note text,
 p_reviewer_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare s public.investment_submissions%rowtype;
begin
 if p_decision not in ('approve','reject') then raise exception 'Invalid review decision'; end if;
 select * into s from public.investment_submissions where id=p_submission_id for update;
 if not found then raise exception 'Payment submission not found'; end if;
 if s.status <> 'pending' then raise exception 'This submission has already been reviewed'; end if;
 if p_decision='approve' then
   update public.investment_submissions set status='approved',review_note=p_review_note,reviewed_by=p_reviewer_id,reviewed_at=now() where id=s.id;
   insert into public.investor_wallet_ledger(investor_id,submission_id,amount,entry_type,note,created_by)
   values(s.investor_id,s.id,s.amount,'credit','Approved investment payment · Ref '||s.reference_number,p_reviewer_id)
   on conflict (submission_id,entry_type) do nothing;
 else
   update public.investment_submissions set status='rejected',review_note=p_review_note,reviewed_by=p_reviewer_id,reviewed_at=now() where id=s.id;
 end if;
 return jsonb_build_object('id',s.id,'status',case when p_decision='approve' then 'approved' else 'rejected' end,'wallet_credited',p_decision='approve');
end;
$$;
revoke all on function public.review_investment_submission(uuid,text,text,uuid) from public,anon,authenticated;
grant execute on function public.review_investment_submission(uuid,text,text,uuid) to service_role;
