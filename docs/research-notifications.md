# Research email notifications

New Research notifications run after a successful main push deployment. The deployed build packages its exact article index, notification scripts and config; the notification job reads that artifact and the actual GitHub Pages deployment URL. PR builds, failed deployments, gh-pages pushes and Market Pulse workflow events never send Research email.

## Publication rules

- Only content/research is read by the existing content builder. Draft language versions do not appear in its index.
- category/slug is the permanent publication identity. Keep published slugs stable; a rename is a new identity.
- Both en.md and ko.md must be public before one event is eligible. Two commits for the two languages still form one event.
- EN uses segment 1, KO segment 2. Both segments were created from PREFERRED_LANGUAGE and membership of AXIS11 Research Subscribers (#3). Brevo campaign subscription/blocklist suppression applies.
- Sender: AXIS11 Research <greg@axis11research.com>. Emails contain the version's title, full first body paragraph, public language link and unsubscribe link.
- The writing template and original article identities remain explicitly excluded in .github/research-notifications.json.

## Activation

Merging the production change enables the post-deployment job (productionEnabled: true). Its FIRST run initializes .notification-state/production.json with every currently public article and the explicit exclusions, and sends NOTHING. Only articles becoming eligible after that baseline can send. Publish no new article together with activation: all articles present in the activation build are intentionally treated as historical.

After merge, confirm the Send new Research notifications job succeeded with Baseline initialized: true and zero accepted campaigns. Future main deployments should show Baseline initialized: false.

The mode: dry-run field controls the independent preview planner; productionEnabled controls the production runner. Preview artifacts can repeat eligible new articles and do not prove delivery. Production uses its own permanent ledger to suppress repeat sending.

## Durable state and failures

Do not delete research-notification-state or .notification-state/production.json. Test state lives separately under .notification-state/test/. No subscriber contact data or API keys are written there; campaign payloads contain already public research metadata.

One event freezes EN and KO payloads together. Each language follows ready -> creating -> created -> sending -> accepted. The campaign ID is persisted before sendNow. Each intent is persisted BEFORE the external request. State writes use the prior GitHub blob SHA and fail on concurrent changes. The manual test workflow and production job share concurrency group research-notification-state.

Accepted means Brevo accepted scheduling the campaign, not confirmed inbox delivery. A complete event is never sent again, including edits, unpublishing/republication, reruns and test-workflow executions.

Network/API errors stop the job without retries. creating or sending records block automatic further attempts for that event, even after a rerun; this favors preventing duplicates over delivery guarantees. Other ready events may proceed on subsequent runs. There is no distributed exactly-once transaction with Brevo.

If a run fails:
1. Read its Actions log and the production record on research-notification-state.
2. Locate the campaign by saved campaignId, or the deterministic AXIS11 category/slug lang name if creation was uncertain.
3. Inspect the actual Brevo status before changing any ledger record.
4. If already accepted/scheduled/sent, mark that language accepted. If send was conclusively never requested, reconcile to a known created campaign and status created. If creation conclusively never succeeded, ready may be restored. Never reset accepted records or blindly create another campaign.
5. Rerun the failed production job only after reconciliation. Do not delete the ledger to recover.

If the entire production file is missing, the runner reinitializes a historical baseline and sends nothing on that run. This prevents an accidental historical blast but can suppress pending notifications; restore state from branch history instead of deleting it.

## Pause

In GitHub Settings -> Secrets and variables -> Actions -> Variables, set repository variable BREVO_RESEARCH_PAUSED to true to skip future production jobs. Remove it or set false to resume. Existing public articles added while paused can be picked up after resume if not already in the ledger. To discard them, explicitly reconcile them as baseline before resuming. A pause does not undo an in-progress Brevo request.

BREVO_API_KEY stays in GitHub Actions Secrets only. It is exposed only to the production notification step and the explicit manual test step, never to frontend code, PR jobs, logs or artifacts.

## Manual tests

Research notification test email is manual and main-only. It creates unscheduled drafts without subscriber recipients, and uses sendTest with a fixed nonempty emailTo list containing only greg.kkang@gmail.com. Default article: equities-bonds/news-explains-markets. Default test batch: initial-test.

Test records cannot mark production as sent. Reusing a batch/article/language blocks another attempt, including uncertain responses. Inspect Brevo before deliberately using another test batch. The user confirmed receipt of EN and KO emails and both language links before production implementation.

## Validation

Run:
node --test scripts/research-notifications.test.mjs scripts/brevo-research-test.test.mjs scripts/brevo-research-live.test.mjs

Coverage includes historical bootstrap, EN/KO grouping and segments, split language commits, edits/republication/reruns, Market Pulse exclusion, partial success, uncertain creation/send, failure to persist intent or acknowledgement, broken public links, invalid state, and GitHub blob SHA updates.

## Email opening paragraph

The content builder adds emailIntro separately from the site's summary. It selects the first top-level prose paragraph, skipping headings, italic-only subtitles, blockquotes, lists, images and code. Inline formatting is converted to readable text, link text is retained, and footnote markers are omitted. The complete paragraph is used without the 180-character truncation. EN and KO use their own paragraph. The email body is title -> opening paragraph -> Read Research button, with the required unsubscribe link below. Existing summary fields and site previews are unchanged. Legacy indexes without emailIntro retain the old summary fallback; newly built versions always include emailIntro and fail notification planning if no prose paragraph exists.

## Four-paragraph email excerpts

New builds include emailParagraphs with the first four top-level prose paragraphs, without truncation and with paragraph boundaries preserved. Articles with fewer than four paragraphs use all available prose. The mail renders a linked title, excerpt and prominent Read Research button. Unsubscribe appears in the header and footer so it remains accessible if a mail client folds repeated footer content. Manual test subjects include the batch identifier to distinguish revisions; mail-client folding remains client-controlled. No historical production notification is resent by this formatting change.
