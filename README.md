# StudyVault

## Free persistent storage with Supabase

Render Free web services have an ephemeral filesystem, so local uploads can be lost after a restart, spin-down, or deploy. Supabase Storage can hold uploaded files and the shared StudyVault content while the app stays on Render Free.

1. Create a free Supabase project.
2. In **Storage**, create a **private** bucket named `studyvault`. Set the maximum file size to 50 MB.
3. In **Project Settings > API Keys**, copy the Project URL and the server-side `service_role` secret key. Never put this secret in frontend code or commit it to GitHub.
4. In the Render service **Environment** settings, add `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. Optionally add `SUPABASE_STORAGE_BUCKET=studyvault` if using another bucket name.
5. Save and redeploy. The startup log should say it is using the Supabase Storage bucket. Uploads and shared content are then stored in that private bucket.

The Supabase Free plan currently includes 1 GB of file storage, a 50 MB per-file limit, and 5 GB of monthly egress. Free projects can pause after inactivity; they may need to be resumed before the site can read uploads again. Check the current [Supabase pricing](https://supabase.com/pricing) and usage page.

For an offline copy, log in to the owner dashboard and choose **Resources > Download full backup**. The ZIP includes shared study content and uploaded files, but not owner credentials. Keep copies outside Supabase (for example, on your computer and another storage account); this is a manual backup, not an automatic second copy.

Files already on Render's temporary filesystem are not automatically migrated. Download and re-upload them after configuring Supabase, and verify the course/material records before removing any old deployment data.

## Render persistent disk

Paid Render web services can instead use a persistent disk mounted at `/var/data`. The server stores shared website content, uploaded files, owner credentials, and analytics under `/var/data/studyvault` by default.

If the disk uses a different mount path, set `DATA_DIR` to a writable directory on that disk (for example, `/mnt/data/studyvault`). Do not set `DATA_DIR` to the disk mount's parent or to a directory that the service cannot write to.

When neither Supabase nor a writable persistent disk is configured, the server may use temporary storage and logs a warning. Content, uploads, and analytics there can be lost on restart or redeploy. Uploaded files are stored outside GitHub.
