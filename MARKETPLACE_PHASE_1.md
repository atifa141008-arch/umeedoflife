# Umeed Marketplace — Phase 1 frontend and backend contracts

## Included in this update
- Buyer sign-in and registration routes linked from the existing Marketplace header: `/marketplace/login`, `/marketplace/register`.
- Separate vendor login route already in the project is retained; vendor navigation is not rewritten here.
- Reworked unfinished buyer cart, checkout, orders, order tracking, and account overview pages while preserving the existing peach/white/coral Marketplace styling.
- Added buyer wallet, vouchers and referrals pages.
- Replaced unfinished vendor earnings, payouts/wallet, analytics, returns and reviews placeholders with complete page layouts and explicit no-fake-data states.
- Added management COD reconciliation page and a COD API contract.
- Filled 22 empty API route files with explicit 503 contract handlers rather than fabricated data or unsafe fake transactions.
- Added `supabase/marketplace_schema.sql` as the proposed base schema for the next integration phase.

## Important boundary
This ZIP is not a production backend yet. Login, Google OAuth, cart persistence, order creation, notifications, COD slip/tracking generation, payout release, wallet ledger, reviews, vouchers, referrals and welfare donations still require Supabase Auth, RLS, server-side authorization and transaction-safe database functions. The pages state this honestly and do not pretend that actions have succeeded.

## Order/payout rules to implement in Phase 2
1. Validate product status, price and stock on the server at checkout; reserve/decrement stock atomically.
2. Create order and item snapshots in one transaction; create COD slip/tracking record and buyer/vendor/management notifications from committed data.
3. Buyer cancellation is permitted only before the relevant item/order is Packed. Record every transition in `marketplace_order_events`.
4. On delivery, notify the buyer that a verified-purchase review is available.
5. COD release is management-only, idempotent, and allowed only after courier remittance reconciliation. From the eligible reconciled amount, record 7% management and 3% marketing ledger deductions; credit the remaining 90% to the vendor ledger exactly once.
6. Vendor withdrawals are separate payout requests; balance must be derived from ledger entries, never a client-submitted amount.
7. Voucher discounts are server-calculated and capped at 50%; referral rewards must be guarded against self-referral and duplicate qualification.
8. Welfare donations remain disabled by default in `marketplace_feature_settings`.

## Suggested local verification
- `npm install`
- `npm run build`
- Visit `/marketplace/login`, `/marketplace/register`, `/marketplace/cart`, `/marketplace/checkout`, `/marketplace/orders`, `/marketplace/vouchers`, `/marketplace/referrals`, `/marketplace/vendor/earnings`, `/marketplace/vendor/payouts`, `/marketplace/vendor/analytics`, `/marketplace/vendor/returns`, `/marketplace/vendor/reviews`, and `/management/marketplace/cod`.
