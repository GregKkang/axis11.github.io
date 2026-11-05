# Research notifications — phase 1: dry run

EN segment: 1. KO segment: 2. Sender: AXIS11 Research <greg@axis11research.com>.

This phase never calls Brevo and does not read BREVO_API_KEY. No live send or test-email endpoint is implemented. Keep the secret stored in GitHub for phase 2.

After a successful main push deployment, the workflow uses the exact article index, script and configuration packaged by that build. The deployment's page_url supplies the public URL, including any base path. This avoids the older hardcoded SITE_URL fallback in the metadata generator.

Download research-notification-preview from the deployment run. plan.json contains one event per category/slug and two campaign previews (EN/KO). HTML files show each email. Existing article identities at baseline 2077d119d2856058f31a2bd71d55aee567296b22 are excluded, including the writing template. There are 14 published articles and one draft template in that baseline.

Only built, non-draft language versions appear in the input. A new article waits until both en and ko are public. Market Pulse never enters the Research index and is explicitly rejected by the planner. Editing a baseline article cannot make it eligible. Changing a slug creates a new identity: retain stable slugs.

IMPORTANT: dry-run previews do not consume publication events or persist a sent ledger. An eligible new article appears in each preview until phase 2 installs the durable ledger. Repeated previews are expected and cannot send mail.

Before enabling production:
1. Verify EN and KO segments also require email campaign subscription eligibility, and list membership #3. They must be mutually exclusive.
2. Inspect both language links against the deployed site.
3. Add a designated test recipient and implement Brevo campaign draft creation plus its sendTest endpoint only; do not use sendNow for tests.
4. Implement a durable per-article/per-language state ledger outside ephemeral caches/artifacts. Persist intent and campaign ID before send; serialize send runs; never automatically retry an ambiguous send response. Reconcile uncertain outcomes with Brevo.
5. Initialize already published identities at activation to prevent a historical backlog, and test edits, split language commits, reruns and partial failures.
6. Enable production only after explicit user instruction.

The API key belongs only in GitHub Actions secret BREVO_API_KEY. Never place it in config, frontend code, logs or artifacts.

## Phase 2: manual test delivery

The Research notification test email workflow runs only through workflow_dispatch on main. Default article: equities-bonds/news-explains-markets. Default batch: initial-test. It builds the current published Research index and checks both public article links.

The only allowed test recipient is greg.kkang@gmail.com. Campaign drafts intentionally omit recipients and scheduling. The only Brevo POST routes permitted are draft creation and /sendTest with a nonempty, fixed emailTo list. There is no live campaign send endpoint. API acceptance is not proof of inbox delivery. Verify both messages in the inbox before production work.

GitHub Actions secret BREVO_API_KEY is exposed only to the manual test step. The GitHub token needs contents:write to persist test records on research-notification-state. Do not delete this branch or its .notification-state/test files: they prevent duplicate attempts. Workflow concurrency serializes all test state updates.

Records are written before campaign creation and before sendTest. Reusing a batch/article/language record skips it even if a previous API response was uncertain. A failed record must be reviewed in Brevo before deliberately choosing a new test_batch. Do not automatically retry a new batch on errors. An error can leave a draft or a test message already accepted by Brevo.

These are TEST records only. They do not replace the production per-article/per-language ledger or enable production notifications. Before implementing live sending, complete the production checklist above and obtain explicit activation instructions.
