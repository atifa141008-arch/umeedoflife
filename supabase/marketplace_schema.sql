-- Umeed Marketplace base schema proposal (Phase: Supabase integration next)
-- Review before running. This file intentionally does not create auth users or RLS policies yet.
-- Money is stored in integer paisa to avoid floating-point rounding.
create extension if not exists pgcrypto;

create table if not exists public.marketplace_vendors (
 id uuid primary key default gen_random_uuid(),
 auth_user_id uuid unique references auth.users(id) on delete cascade,
 business_name text not null,
 applicant_name text not null,
 email text not null,
 phone text not null,
 city text not null,
 business_type text not null,
 business_description text,
 website text,
 application_status text not null default 'pending' check (application_status in ('pending','under_review','approved','rejected','suspended')),
 is_active boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.marketplace_vendor_profiles (
 vendor_id uuid primary key references public.marketplace_vendors(id) on delete cascade,
 store_slug text unique,
 store_description text,
 logo_url text,
 support_email text,
 support_phone text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.marketplace_products (
 id uuid primary key default gen_random_uuid(), vendor_id uuid not null references public.marketplace_vendors(id),
 title text not null, slug text not null unique, sku text, description text not null, category_id uuid,
 price_paisa bigint not null check(price_paisa >= 0), compare_at_price_paisa bigint check(compare_at_price_paisa is null or compare_at_price_paisa >= 0),
 stock_quantity integer not null default 0 check(stock_quantity >= 0), status text not null default 'draft' check(status in ('draft','pending_review','active','rejected','archived')),
 image_urls text[] not null default '{}', attributes jsonb not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.marketplace_addresses (
 id uuid primary key default gen_random_uuid(), buyer_id uuid not null references auth.users(id) on delete cascade,
 recipient_name text not null, phone text not null, city text not null, postal_code text, address_line text not null, instructions text,
 is_default boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.marketplace_carts (
 id uuid primary key default gen_random_uuid(), buyer_id uuid not null unique references auth.users(id) on delete cascade, updated_at timestamptz not null default now()
);
create table if not exists public.marketplace_cart_items (
 id uuid primary key default gen_random_uuid(), cart_id uuid not null references public.marketplace_carts(id) on delete cascade,
 product_id uuid not null references public.marketplace_products(id), quantity integer not null check(quantity > 0), created_at timestamptz not null default now(), unique(cart_id,product_id)
);
create table if not exists public.marketplace_orders (
 id uuid primary key default gen_random_uuid(), order_number text not null unique, buyer_id uuid not null references auth.users(id),
 address_snapshot jsonb not null, status text not null default 'placed' check(status in ('placed','confirmed','packed','shipped','out_for_delivery','delivered','cancelled','return_requested','returned','refunded')),
 payment_method text not null default 'cod' check(payment_method in ('cod','online')), payment_status text not null default 'pending' check(payment_status in ('pending','paid','failed','refunded','reconciled')),
 subtotal_paisa bigint not null check(subtotal_paisa >= 0), shipping_paisa bigint not null default 0 check(shipping_paisa >= 0), discount_paisa bigint not null default 0 check(discount_paisa >= 0), total_paisa bigint not null check(total_paisa >= 0),
 cod_slip_number text unique, tracking_id text unique, courier_name text, placed_at timestamptz not null default now(), packed_at timestamptz, delivered_at timestamptz, cancelled_at timestamptz
);
create table if not exists public.marketplace_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.marketplace_orders(id) on delete cascade,
 product_id uuid references public.marketplace_products(id), vendor_id uuid not null references public.marketplace_vendors(id), product_title_snapshot text not null,
 sku_snapshot text, quantity integer not null check(quantity > 0), unit_price_paisa bigint not null check(unit_price_paisa >= 0), line_total_paisa bigint not null check(line_total_paisa >= 0),
 status text not null default 'placed' check(status in ('placed','confirmed','packed','shipped','delivered','cancelled','return_requested','returned','refunded'))
);
create table if not exists public.marketplace_order_events (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.marketplace_orders(id) on delete cascade,
 actor_user_id uuid references auth.users(id), event_type text not null, old_status text, new_status text, note text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create table if not exists public.marketplace_notifications (
 id uuid primary key default gen_random_uuid(), recipient_user_id uuid references auth.users(id) on delete cascade, recipient_role text not null check(recipient_role in ('buyer','vendor','management')),
 title text not null, body text not null, entity_type text, entity_id uuid, read_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.marketplace_management_messages (
 id uuid primary key default gen_random_uuid(), order_id uuid references public.marketplace_orders(id) on delete set null, vendor_id uuid references public.marketplace_vendors(id) on delete set null,
 subject text not null, body text not null, status text not null default 'open' check(status in ('open','in_progress','resolved','closed')), created_at timestamptz not null default now()
);
create table if not exists public.marketplace_cod_remittances (
 id uuid primary key default gen_random_uuid(), order_id uuid not null unique references public.marketplace_orders(id), courier_name text not null, courier_reference text,
 expected_paisa bigint not null check(expected_paisa >= 0), received_paisa bigint check(received_paisa is null or received_paisa >= 0), status text not null default 'pending' check(status in ('pending','matched','mismatch','approved')),
 reconciled_by uuid references auth.users(id), reconciled_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.marketplace_vendor_wallet_transactions (
 id uuid primary key default gen_random_uuid(), vendor_id uuid not null references public.marketplace_vendors(id), order_id uuid references public.marketplace_orders(id),
 transaction_type text not null check(transaction_type in ('sale_credit','management_fee','marketing_fee','refund_debit','withdrawal_debit','adjustment','release_credit')),
 amount_paisa bigint not null, reference text, metadata jsonb not null default '{}', created_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table if not exists public.marketplace_payout_requests (
 id uuid primary key default gen_random_uuid(), vendor_id uuid not null references public.marketplace_vendors(id), amount_paisa bigint not null check(amount_paisa > 0),
 destination_snapshot jsonb not null, status text not null default 'requested' check(status in ('requested','approved','paid','rejected','cancelled')),
 requested_at timestamptz not null default now(), reviewed_by uuid references auth.users(id), reviewed_at timestamptz, payment_reference text
);
create table if not exists public.marketplace_reviews (
 id uuid primary key default gen_random_uuid(), order_item_id uuid not null unique references public.marketplace_order_items(id), buyer_id uuid not null references auth.users(id),
 product_id uuid not null references public.marketplace_products(id), vendor_id uuid not null references public.marketplace_vendors(id), rating smallint not null check(rating between 1 and 5), review_text text,
 status text not null default 'published' check(status in ('pending','published','hidden','rejected')), created_at timestamptz not null default now()
);
create table if not exists public.marketplace_returns (
 id uuid primary key default gen_random_uuid(), order_item_id uuid not null references public.marketplace_order_items(id), buyer_id uuid not null references auth.users(id), vendor_id uuid not null references public.marketplace_vendors(id),
 reason text not null, details text, status text not null default 'requested' check(status in ('requested','under_review','approved','rejected','pickup_scheduled','received','refunded','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.marketplace_vouchers (
 id uuid primary key default gen_random_uuid(), code text not null unique, title text not null, discount_type text not null check(discount_type in ('percentage','fixed')),
 discount_value integer not null check(discount_value > 0), max_discount_paisa bigint, minimum_order_paisa bigint not null default 0, starts_at timestamptz, ends_at timestamptz,
 usage_limit integer, per_buyer_limit integer not null default 1, is_active boolean not null default false, created_at timestamptz not null default now(),
 check(discount_type <> 'percentage' or discount_value <= 50)
);
create table if not exists public.marketplace_voucher_redemptions (
 id uuid primary key default gen_random_uuid(), voucher_id uuid not null references public.marketplace_vouchers(id), buyer_id uuid not null references auth.users(id), order_id uuid not null unique references public.marketplace_orders(id), discount_paisa bigint not null check(discount_paisa >= 0), created_at timestamptz not null default now()
);
create table if not exists public.marketplace_referrals (
 id uuid primary key default gen_random_uuid(), referrer_user_id uuid not null references auth.users(id), referred_user_id uuid unique references auth.users(id), referral_code text not null unique,
 status text not null default 'invited' check(status in ('invited','qualified','rewarded','rejected')), reward_paisa bigint not null default 0 check(reward_paisa >= 0), qualified_order_id uuid references public.marketplace_orders(id), created_at timestamptz not null default now()
);
create table if not exists public.marketplace_feature_settings (
 key text primary key, enabled boolean not null default false, config jsonb not null default '{}', updated_at timestamptz not null default now()
);
insert into public.marketplace_feature_settings(key,enabled,config) values ('welfare_donations',false,'{"default_off":true}'::jsonb) on conflict(key) do nothing;

create index if not exists marketplace_products_vendor_status_idx on public.marketplace_products(vendor_id,status);
create index if not exists marketplace_orders_buyer_date_idx on public.marketplace_orders(buyer_id,placed_at desc);
create index if not exists marketplace_order_items_vendor_idx on public.marketplace_order_items(vendor_id,status);
create index if not exists marketplace_notifications_recipient_idx on public.marketplace_notifications(recipient_user_id,created_at desc);
create index if not exists marketplace_wallet_vendor_date_idx on public.marketplace_vendor_wallet_transactions(vendor_id,created_at desc);
create index if not exists marketplace_returns_buyer_idx on public.marketplace_returns(buyer_id,created_at desc);

-- IMPORTANT NEXT PHASE: add RLS policies, server-only management permissions, atomic COD release RPC,
-- idempotency constraints, auth callback wiring, and transaction tests before production use.
