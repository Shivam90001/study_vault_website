# StudyVault

## Render storage

Attach a persistent disk to the Render web service and set its mount path to `/var/data`. The server stores shared website content, uploaded files, owner credentials, and analytics under `/var/data/studyvault` by default. Owner uploads are available to all visitors through the website and survive deploys as long as this disk remains attached.

If the disk uses a different mount path, set `DATA_DIR` to a writable directory on that disk (for example, `/mnt/data/studyvault`). Do not set `DATA_DIR` to the disk mount's parent or to a directory that the service cannot write to.

When Render storage is unavailable, the server starts with temporary storage and logs a warning. Content, uploads, and analytics in temporary storage can be lost on restart or redeploy; configure a persistent disk to retain them. Uploaded files are stored on the server disk, not committed to GitHub.



