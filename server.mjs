import 'dotenv/config';
import { createServer } from 'node:http';
import { createHash, randomBytes, randomUUID, scryptSync, createHmac, timingSafeEqual } from 'node:crypto';
import { mkdir, open, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';

const root = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDirectory = process.env.RENDER === 'true'
  ? path.join('/var/data', 'studyvault')
  : path.join(root, '.studyvault-data');
let dataDirectory = process.env.DATA_DIR || defaultDataDirectory;
let dataFile = path.join(dataDirectory, 'analytics.json');
const isProduction = process.env.NODE_ENV === 'production';
const serveBuiltFiles = isProduction || process.argv.includes('--preview');
const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
const ownerUsername = process.env.OWNER_USERNAME || 'owner';
const ownerPasswordPrimary = process.env.OWNER_PASSWORD_PRIMARY || 'vault2026';
const ownerPasswordSecondary = process.env.OWNER_PASSWORD_SECONDARY || 'secure999';
const sessionCookie = 'studyvault_owner_session';
const sessionDurationSeconds = 8 * 60 * 60;
const allowedActions = new Set([
  'PAGE_VISIT',
  'COURSE_VISIT',
  'SEMESTER_VISIT',
  'SUBJECT_VISIT',
  'DOCUMENT_VIEW',
  'MCQ_PRACTICE'
]);

if (isProduction && (!process.env.SESSION_SECRET || !process.env.OWNER_USERNAME || !process.env.OWNER_PASSWORD_PRIMARY || !process.env.OWNER_PASSWORD_SECONDARY)) {
  throw new Error('Production requires SESSION_SECRET and all three OWNER_* credentials.');
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return {
    salt,
    hash: scryptSync(password, salt, 64).toString('hex')
  };
}

function hasPdfHeader(buffer) {
  return buffer.subarray(0, 1024).toString('latin1').includes('%PDF-');
}

function createDefaultStore() {
  return {
    activities: [],
    analyticsTotals: {
      totalVisits: 0,
      uniqueBrowsers: {},
      totalDocumentViews: 0,
      totalMCQAttempts: 0
    },
    ownerCredentials: {
      username: ownerUsername,
      passwordPrimary: hashPassword(ownerPasswordPrimary),
      passwordSecondary: hashPassword(ownerPasswordSecondary)
    }
  };
}

const defaultStore = createDefaultStore();
let mutationQueue = Promise.resolve();
const eventRateLimits = new Map();

function getAnalyticsTotals(store) {
  if (store.analyticsTotals) return store.analyticsTotals;

  const activities = Array.isArray(store.activities) ? store.activities : [];
  const uniqueBrowsers = {};
  for (const activity of activities) {
    if (typeof activity.visitorId === 'string') {
      uniqueBrowsers[createHash('sha256').update(activity.visitorId).digest('hex')] = true;
    }
  }

  store.analyticsTotals = {
    totalVisits: activities.filter(activity => activity.action === 'PAGE_VISIT').length,
    uniqueBrowsers,
    totalDocumentViews: activities.filter(activity => activity.action === 'DOCUMENT_VIEW').length,
    totalMCQAttempts: activities.filter(activity => activity.action === 'MCQ_PRACTICE').length
  };
  return store.analyticsTotals;
}

async function loadStore() {
  try {
    const store = JSON.parse(await readFile(dataFile, 'utf8'));
    getAnalyticsTotals(store);
    return store;
  } catch (error) {
    if (error.code === 'ENOENT') return structuredClone(defaultStore);
    throw error;
  }
}

async function saveStore(store) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${dataFile}.${randomUUID()}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(store), { mode: 0o600 });
  await rename(temporaryFile, dataFile);
}

async function verifyWritableDirectory(directory) {
  await mkdir(directory, { recursive: true });
  const probeFile = path.join(directory, `.write-check-${randomUUID()}`);
  await writeFile(probeFile, '', { flag: 'wx' });
  await rm(probeFile);
}

async function prepareDataDirectory() {
  try {
    await verifyWritableDirectory(dataDirectory);
  } catch (error) {
    if (process.env.RENDER !== 'true') {
      throw new Error(`StudyVault cannot write to DATA_DIR "${dataDirectory}". Configure a writable persistent disk path.`, { cause: error });
    }

    const unavailableDataDirectory = dataDirectory;
    dataDirectory = path.join(tmpdir(), 'studyvault');
    dataFile = path.join(dataDirectory, 'analytics.json');
    try {
      await verifyWritableDirectory(dataDirectory);
    } catch (fallbackError) {
      throw new Error(`StudyVault cannot write to its temporary data directory "${dataDirectory}".`, { cause: fallbackError });
    }

    console.warn(`Persistent storage at "${unavailableDataDirectory}" is unavailable. Using temporary storage at "${dataDirectory}"; data may be lost when the service restarts. Configure DATA_DIR to the mounted disk path.`);
  }
}

function mutateStore(mutator) {
  const task = mutationQueue.then(async () => {
    const store = await loadStore();
    const result = await mutator(store);
    await saveStore(store);
    return result;
  });
  mutationQueue = task.catch(() => {});
  return task;
}

function verifyPassword(password, credential) {
  const suppliedHash = scryptSync(password, credential.salt, 64);
  const storedHash = Buffer.from(credential.hash, 'hex');
  return suppliedHash.length === storedHash.length && timingSafeEqual(suppliedHash, storedHash);
}

function getCookie(request, name) {
  const cookieHeader = request.headers.cookie || '';
  const pair = cookieHeader.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return pair ? pair.slice(name.length + 1) : '';
}

function validOwnerSession(request) {
  const [expiresAtText, signature] = getCookie(request, sessionCookie).split('.');
  const expiresAt = Number(expiresAtText);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now() || !signature) return false;

  const expected = createHmac('sha256', sessionSecret).update(expiresAtText).digest();
  let supplied;
  try {
    supplied = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function requireOwner(request, response, next) {
  if (!validOwnerSession(request)) {
    response.status(401).json({ error: 'Owner login required.' });
    return;
  }
  next();
}

function setOwnerCookie(response) {
  const expiresAt = String(Date.now() + sessionDurationSeconds * 1000);
  const signature = createHmac('sha256', sessionSecret).update(expiresAt).digest('base64url');
  const secure = isProduction ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${sessionCookie}=${expiresAt}.${signature}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${sessionDurationSeconds}${secure}`);
}

function clearOwnerCookie(response) {
  const secure = isProduction ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure}`);
}

function toAnalytics(store) {
  const activities = [...store.activities].sort((left, right) => right.timestamp.localeCompare(left.timestamp));
  const totals = getAnalyticsTotals(store);
  return {
    totalVisits: totals.totalVisits,
    uniqueVisitors: Object.keys(totals.uniqueBrowsers).length,
    totalDocumentViews: totals.totalDocumentViews,
    totalMCQAttempts: totals.totalMCQAttempts,
    activities: activities.slice(0, 100)
  };
}

function allowEvent(request) {
  const now = Date.now();
  const key = request.ip || 'unknown';
  const window = eventRateLimits.get(key);
  if (!window || now - window.startedAt >= 60_000) {
    eventRateLimits.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (window.count >= 60) return false;
  window.count += 1;
  return true;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({
  limit: '25mb',
  type: request => request.path !== '/api/uploads' && request.is('application/json')
}));

app.get('/api/content', async (request, response, next) => {
  try {
    const store = await loadStore();
    response.set('Cache-Control', 'no-store');
    response.json({ content: store.content || null });
  } catch (error) {
    next(error);
  }
});

app.post('/api/uploads', requireOwner, express.raw({ type: '*/*', limit: '100mb' }), async (request, response, next) => {
  try {
    if (!Buffer.isBuffer(request.body) || request.body.length === 0) {
      response.status(400).json({ error: 'Choose a non-empty file to upload.' });
      return;
    }

    let originalName;
    try {
      originalName = decodeURIComponent(request.get('X-File-Name') || 'upload');
    } catch {
      response.status(400).json({ error: 'Invalid file name.' });
      return;
    }
    originalName = path.basename(originalName.replaceAll('\\', '/')).slice(0, 255) || 'upload';

    const contentType = request.get('Content-Type') || 'application/octet-stream';
    const reportedContentType = /^[\w.+-]+\/[\w.+-]+$/.test(contentType) ? contentType : 'application/octet-stream';
    const safeContentType = hasPdfHeader(request.body)
      ? 'application/pdf'
      : reportedContentType;
    const id = randomUUID();
    const uploadDirectory = path.join(dataDirectory, 'uploads');
    const storedFile = path.join(uploadDirectory, `${id}.blob`);

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(storedFile, request.body, { flag: 'wx', mode: 0o600 });
    await writeFile(path.join(uploadDirectory, `${id}.json`), JSON.stringify({ contentType: safeContentType, fileName: originalName }));

    response.status(201).json({ fileUrl: `/api/uploads/${id}`, contentType: safeContentType });
  } catch (error) {
    next(error);
  }
});

app.get('/api/uploads/:id', async (request, response, next) => {
  try {
    if (!/^[\da-f-]{36}$/i.test(request.params.id)) {
      response.status(404).end();
      return;
    }

    const uploadDirectory = path.join(dataDirectory, 'uploads');
    const storedFile = path.join(uploadDirectory, `${request.params.id}.blob`);
    const metadata = JSON.parse(await readFile(path.join(uploadDirectory, `${request.params.id}.json`), 'utf8'));
    const fileHandle = await open(storedFile, 'r');
    let fileHeader;
    try {
      fileHeader = Buffer.alloc(1024);
      const { bytesRead } = await fileHandle.read(fileHeader, 0, fileHeader.length, 0);
      fileHeader = fileHeader.subarray(0, bytesRead);
    } finally {
      await fileHandle.close();
    }
    const detectedPdf = hasPdfHeader(fileHeader);
    const contentType = detectedPdf
      ? 'application/pdf'
      : /^[\w.+-]+\/[\w.+-]+$/.test(metadata.contentType) ? metadata.contentType : 'application/octet-stream';
    const inlineTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/bmp']);
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', contentType);
    response.set('Content-Disposition', inlineTypes.has(contentType) ? 'inline' : 'attachment');
    response.sendFile(storedFile);
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.status(404).end();
      return;
    }
    next(error);
  }
});

app.delete('/api/uploads/:id', requireOwner, async (request, response, next) => {
  try {
    if (!/^[\da-f-]{36}$/i.test(request.params.id)) {
      response.status(404).end();
      return;
    }

    const uploadDirectory = path.join(dataDirectory, 'uploads');
    await Promise.all([
      rm(path.join(uploadDirectory, `${request.params.id}.blob`), { force: true }),
      rm(path.join(uploadDirectory, `${request.params.id}.json`), { force: true })
    ]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.put('/api/content', requireOwner, async (request, response, next) => {
  try {
    const { courses, semesters, subjects, documents, mcqs, siteConfig, notices } = request.body || {};
    if (![courses, semesters, subjects, documents, mcqs, notices].every(Array.isArray)
      || !siteConfig || typeof siteConfig !== 'object' || Array.isArray(siteConfig)) {
      response.status(400).json({ error: 'Invalid shared content.' });
      return;
    }

    const content = { courses, semesters, subjects, documents, mcqs, siteConfig, notices };
    await mutateStore(store => {
      store.content = content;
    });
    response.json({ saved: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/analytics/events', async (request, response, next) => {
  try {
    if (!allowEvent(request)) {
      response.status(429).json({ error: 'Too many analytics events.' });
      return;
    }

    const { visitorId, action, title, details, deviceType } = request.body || {};
    if (!/^[a-zA-Z0-9_-]{16,64}$/.test(visitorId || '') || !allowedActions.has(action) || !['Mobile', 'Desktop'].includes(deviceType)) {
      response.status(400).json({ error: 'Invalid analytics event.' });
      return;
    }

    const activity = {
      id: randomUUID(),
      visitorId,
      timestamp: new Date().toISOString(),
      action,
      title: typeof title === 'string' ? title.slice(0, 160) : '',
      details: typeof details === 'string' ? details.slice(0, 300) : '',
      deviceType
    };

    await mutateStore(store => {
      const totals = getAnalyticsTotals(store);
      if (action === 'PAGE_VISIT') totals.totalVisits += 1;
      if (action === 'DOCUMENT_VIEW') totals.totalDocumentViews += 1;
      if (action === 'MCQ_PRACTICE') totals.totalMCQAttempts += 1;
      totals.uniqueBrowsers[createHash('sha256').update(visitorId).digest('hex')] = true;
      store.activities = [activity, ...store.activities].slice(0, 10_000);
    });
    response.status(202).json({ accepted: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/owner/login', async (request, response, next) => {
  try {
    const { username, passwordPrimary, passwordSecondary } = request.body || {};
    const store = await loadStore();
    const credentials = store.ownerCredentials;
    const valid = typeof username === 'string'
      && username.trim() === credentials.username
      && typeof passwordPrimary === 'string'
      && typeof passwordSecondary === 'string'
      && verifyPassword(passwordPrimary, credentials.passwordPrimary)
      && verifyPassword(passwordSecondary, credentials.passwordSecondary);

    if (!valid) {
      response.status(401).json({ error: 'Invalid owner credentials.' });
      return;
    }
    setOwnerCookie(response);
    response.json({ authenticated: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/owner/logout', (request, response) => {
  clearOwnerCookie(response);
  response.status(204).end();
});

app.put('/api/owner/credentials', requireOwner, async (request, response, next) => {
  try {
    const { username, passwordPrimary, passwordSecondary } = request.body || {};
    if (![username, passwordPrimary, passwordSecondary].every(value => typeof value === 'string' && value.trim().length >= 3 && value.length <= 128)) {
      response.status(400).json({ error: 'All credentials must be between 3 and 128 characters.' });
      return;
    }
    await mutateStore(store => {
      store.ownerCredentials = {
        username: username.trim(),
        passwordPrimary: hashPassword(passwordPrimary),
        passwordSecondary: hashPassword(passwordSecondary)
      };
    });
    response.json({ updated: true });
  } catch (error) {
    next(error);
  }
});

app.get('/api/analytics', requireOwner, async (request, response, next) => {
  try {
    response.json(toAnalytics(await loadStore()));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/analytics', requireOwner, async (request, response, next) => {
  try {
    await mutateStore(store => {
      store.activities = [];
    });
    response.json(toAnalytics(await loadStore()));
  } catch (error) {
    next(error);
  }
});

const httpServer = createServer(app);
let vite;

if (serveBuiltFiles) {
  const distDirectory = path.join(root, 'dist');
  app.use(express.static(distDirectory));
  app.get('*', (request, response) => response.sendFile(path.join(distDirectory, 'index.html')));
} else {
  const { createServer: createViteServer } = await import('vite');
  vite = await createViteServer({
    server: {
      middlewareMode: true,
      ws: { server: httpServer }
    },
    appType: 'custom'
  });
  app.use(vite.middlewares);
  app.use(async (request, response, next) => {
    try {
      const html = await readFile(path.join(root, 'index.html'), 'utf8');
      response.status(200).set({ 'Content-Type': 'text/html' }).end(await vite.transformIndexHtml(request.originalUrl, html));
    } catch (error) {
      next(error);
    }
  });
}

app.use((error, request, response, next) => {
  console.error(error);
  if (response.headersSent) return next(error);
  response.status(500).json({ error: 'Internal server error.' });
});

const port = Number(process.env.PORT || 3000);
await prepareDataDirectory();
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`StudyVault ${isProduction ? 'server' : 'dev server'} running at http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  await vite?.close();
  httpServer.close(() => process.exit(0));
});