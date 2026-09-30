# StudyVault

## Render storage

Attach a persistent disk to the Render web service and set its mount path to `/var/data`. The server stores shared website content, owner credentials, and analytics under `/var/data/studyvault` by default.

If the disk uses a different mount path, set `DATA_DIR` to a writable directory on that disk (for example, `/mnt/data/studyvault`). Do not set `DATA_DIR` to the disk mount's parent or to a directory that the service cannot write to.

When Render storage is unavailable, the server starts with temporary storage and logs a warning. Content and analytics in temporary storage can be lost on restart or redeploy; configure a persistent disk to retain them.



