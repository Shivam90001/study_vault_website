# StudyVault

## Render analytics persistence

On Render, StudyVault stores analytics and shared owner content under `/var/data/studyvault/analytics.json`. In the Render service settings, attach a persistent disk with mount path `/var/data`, then redeploy. Render's filesystem outside an attached disk is temporary and is cleared on restarts and deploys. Keep the disk attached to preserve lifetime visit, unique-browser, resource-open, and MCQ totals. Clearing the activity log does not reset these lifetime totals.

