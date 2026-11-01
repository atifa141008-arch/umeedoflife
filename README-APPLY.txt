UMEED OF LIFE — CENTRAL MANAGEMENT + INVESTOR FINANCE PATCH

WHAT THIS PATCH CHANGES
1. Adds a shared animated responsive sidebar through app/management/layout.tsx, so existing Central Management pages (departments, employees, roles, marketplace subpages, etc.) share one navigation frame. The management login/reset pages intentionally do not show the sidebar.
2. Adds a management-theme CSS normalization layer so older management screens inherit the supplied executive palette without replacing every existing page file: #18412F green, #D9A55B gold, #F8FAF7 background, #FFFFFF cards, #E3EAE6 borders, #6B7280 body text.
3. Adds Investor & Finance workspace at /management/workspace/investors.
4. Adds separate investor sign-in/dashboard at /investor/login and /investor/dashboard.
5. Adds payment proof submission and Management Head-only approval/rejection. The SQL RPC locks a pending payment and posts a unique wallet credit in one database transaction to prevent repeat approvals.
6. Adds receiving account management (CEO/Co-CEO only) and department income/expense/valuation entries (Management Head only).
7. Adds News & Updates draft/publish/archive workflow and a read-only Audit Logs screen.

APPLY
- Extract at the root of the Next.js project (same folder as app/, components/, lib/).
- Merge files into your project. Replace only the included Central Management layout, the CEO/Co-CEO/Management Head route files if present, and the three included departments/employees/roles pages (their central-role allow-lists include Management Head). The shared CSS theme layer updates older colors without replacing every Marketplace page. Do not replace .env, package.json or unrelated pages.
- Open Supabase SQL Editor and run supabase/migrations/20261029_central_investor_finance.sql.
- Ensure server-only SUPABASE_SECRET_KEY is configured in the deployment environment. It must never be prefixed NEXT_PUBLIC_ or exposed in browser code. Existing lib/supabase/admin.ts expects this name.
- Ensure the invitation email template and redirect URLs are configured in Supabase Auth. Investor is invited by email from management; investor completes the secure email invite flow and then signs in at /investor/login.
- Test first in a staging database, then run npm run build and exercise all role scenarios.

IMPORTANT SECURITY / DATA NOTES
- The APIs verify the logged-in user and assigned central role before using the server-only Supabase admin client. Management Head is the only role allowed to approve/reject payment proofs or record department finance entries. CEO and Co-CEO can publish official receiving accounts. Investor data includes CNIC; access is restricted to the trusted management APIs. Avoid logging CNIC or payment proofs.
- The investment-proofs bucket is private. The included UI does not yet provide a signed preview/download for proof files; review the original proof in your secure Supabase Storage console before approval. Do not approve a payment based only on the amount/reference text.
- Department income/outgoing/worth are recorded figures, not inferred from investment totals. They will show no data until Management Head enters documented values. A valuation is not guaranteed investor return.
- This patch does not implement withdrawals, profit distributions, tax calculations, or audited financial statements. Wallet credit represents an approved investor payment submission; withdrawal/debit flows need a separately approved accounting policy. Investor access toggles control wallet summary, department finances, payment history, and new investment submission. The investor dashboard includes company-wide total approved investment and per-department recorded figures when access is granted.
- This patch has not been built against your local working tree or live Supabase project. Apply on a copy/staging first. If your database role relationship/table names differ, adapt the helper queries before production use.
