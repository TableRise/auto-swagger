const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const express = require('express');
const request = require('supertest');
const { z } = require('zod');

const { createAutoSwagger } = require('../dist');

async function withTempProject(run) {
  const previousCwd = process.cwd();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'auto-swagger-'));

  process.chdir(tempDir);

  try {
    return await run(tempDir);
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function buildUsersRoutes() {
  return [
    { basePath: '/users' },
    {
      method: 'get',
      path: '/profile',
      controller: (req, res) => res.json({ order: req.order ?? [] }),
      options: {
        middlewares: [
          (req, _res, next) => {
            req.order = [...(req.order ?? []), 'route'];
            next();
          },
        ],
        security: 'cookieAuth',
        tag: 'users',
      },
    },
    {
      method: 'get',
      path: '/login',
      controller: (_req, res) => res.json({ public: true }),
      options: {
        tag: 'auth',
      },
    },
    {
      method: 'get',
      path: '/search',
      controller: (_req, res) => res.json({ ok: true }),
      options: {
        schemas: {
          query: z.object({
            email: z.string(),
            flow: z.string().optional(),
          }),
        },
        tag: 'users',
      },
    },
    {
      method: 'post',
      path: '/upload',
      controller: (_req, res) => res.status(201).json({ uploaded: true }),
      options: {
        schemas: {
          body: z.object({
            avatar: z.file(),
            title: z.string().optional(),
          }),
        },
        tag: 'users',
      },
    },
    {
      method: 'get',
      path: '/:id/orders/:orderId',
      controller: (_req, res) => res.json({ ok: true }),
      options: {
        tag: 'orders',
      },
    },
    {
      method: 'get',
      path: '/hidden',
      controller: (_req, res) => res.json({ hidden: true }),
      hide: true,
      options: {
        tag: 'users',
      },
    },
    {
      method: 'get',
      path: '/callback',
      basePath: '/oauth',
      controller: (_req, res) => res.json({ callback: true }),
      options: {
        tag: 'oauth',
      },
    },
  ];
}

test('registers routes, writes grouped docs, and serves docs routes', async () => {
  await withTempProject(async (tempDir) => {
    const originalConsoleLog = console.log;
    const loggedMessages = [];
    console.log = (...args) => {
      loggedMessages.push(args.join(' '));
    };

    const swagger = createAutoSwagger({
      docs: {
        title: 'Test API',
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'tablerise-auth',
          },
        },
      },
    });

    swagger.bindMiddleware(
      '/users',
      (req, _res, next) => {
        req.order = [...(req.order ?? []), 'prepend'];
        next();
      },
      { mode: 'prepend' }
    );

    swagger.bindMiddleware(
      '/users',
      (req, _res, next) => {
        req.order = [...(req.order ?? []), 'append'];
        next();
      },
      { exclude: ['/login'], mode: 'append' }
    );

    let firstRouter;
    let secondRouter;

    try {
      const providedRoutes = swagger.provideRoutes(buildUsersRoutes(), { group: 'users' });
      firstRouter = providedRoutes.register();
      secondRouter = providedRoutes.register();
    } finally {
      console.log = originalConsoleLog;
    }

    assert.strictEqual(firstRouter, secondRouter);

    const app = express();
    app.use(express.json());
    app.use(firstRouter);
    app.use(swagger.docs());

    const profileResponse = await request(app).get('/users/profile');
    assert.equal(profileResponse.status, 200);
    assert.deepEqual(profileResponse.body.order, ['prepend', 'route', 'append']);

    const loginResponse = await request(app).get('/users/login');
    assert.equal(loginResponse.status, 200);
    assert.deepEqual(loginResponse.body, { public: true });

    const docsFilePath = path.join(tempDir, 'api-docs', 'swagger-doc-users.json');
    assert.equal(fs.existsSync(docsFilePath), true);
    assert.match(
      loggedMessages.join('\n'),
      /Swagger docs generated for group "users" at ".*swagger-doc-users\.json"/
    );

    const docs = JSON.parse(fs.readFileSync(docsFilePath, 'utf8'));
    assert.ok(docs.paths['/users/profile'].get.security);
    assert.equal(docs.paths['/users/upload'].post.requestBody.content['multipart/form-data'].schema.properties.avatar.format, 'binary');
    assert.deepEqual(
      docs.paths['/users/{id}/orders/{orderId}'].get.parameters.map((item) => item.name).sort(),
      ['id', 'orderId']
    );
    assert.deepEqual(
      docs.paths['/users/search'].get.parameters.map((item) => ({
        in: item.in,
        name: item.name,
        required: item.required,
      })).sort((left, right) => left.name.localeCompare(right.name)),
      [
        { in: 'query', name: 'email', required: true },
        { in: 'query', name: 'flow', required: false },
      ]
    );
    assert.equal(docs.paths['/users/hidden'], undefined);
    assert.ok(docs.paths['/oauth/callback'].get);

    const docsIndexResponse = await request(app).get('/api-docs');
    assert.equal(docsIndexResponse.status, 200);
    assert.match(docsIndexResponse.text, /users/);
    assert.match(docsIndexResponse.text, /docs\.css/);
    assert.doesNotMatch(docsIndexResponse.text, /rel="icon"/);

    const docsStylesResponse = await request(app).get('/api-docs/docs.css');
    assert.equal(docsStylesResponse.status, 200);
    assert.match(docsStylesResponse.headers['content-type'], /text\/css/);
    assert.match(docsStylesResponse.text, /color-scheme:\s*dark/);
    assert.match(docsStylesResponse.text, /--docs-bg:\s*#0a0f1f/);
    assert.match(docsStylesResponse.text, /\.swagger-ui \.information-container,\s*\.swagger-ui \.scheme-container[\s\S]*background:\s*transparent !important/);
    assert.match(docsStylesResponse.text, /\.swagger-ui \.opblock \.opblock-summary-path,\s*\.swagger-ui \.opblock \.opblock-summary-path__deprecated\s*\{[\s\S]*font-size:\s*14px/);
    assert.match(docsStylesResponse.text, /@container swagger-ui \(max-width: 768px\)\s*\{[\s\S]*font-size:\s*10px/);
    assert.match(docsStylesResponse.text, /\.swagger-ui \.opblock-tag,\s*\.swagger-ui \.opblock \.opblock-summary-path[\s\S]*color:\s*#fff !important/);

    const docsLogoResponse = await request(app).get('/api-docs/logo.png');
    assert.equal(docsLogoResponse.status, 404);

    const docsUiResponse = await request(app).get('/api-docs/users');
    assert.equal(docsUiResponse.status, 200);
    assert.match(docsUiResponse.text, /swagger-ui/);
    assert.match(docsUiResponse.text, /docs\.css/);
    assert.match(docsUiResponse.text, /swagger-initializer\.js/);
    assert.doesNotMatch(docsUiResponse.text, /rel="icon"/);
    assert.doesNotMatch(docsUiResponse.text, /<img class="docs-logo"/);
    assert.doesNotMatch(docsUiResponse.text, /window\.onload = function/);

    const docsInitializerResponse = await request(app).get('/api-docs/users/swagger-initializer.js');
    assert.equal(docsInitializerResponse.status, 200);
    assert.match(docsInitializerResponse.headers['content-type'], /application\/javascript/);
    assert.match(docsInitializerResponse.text, /SwaggerUIBundle/);
    assert.match(docsInitializerResponse.text, /\/api-docs\/users\/swagger\.json/);

    const docsJsonResponse = await request(app).get('/api-docs/users/swagger.json');
    assert.equal(docsJsonResponse.status, 200);
    assert.equal(docsJsonResponse.body.info.title, 'Test API');
  });
});

test('fails fast when a route collection does not start with a basePath entry', async () => {
  await withTempProject(async () => {
    const swagger = createAutoSwagger();
    const providedRoutes = swagger.provideRoutes(
      [
        {
          method: 'get',
          path: '/broken',
          controller: (_req, res) => res.json({ ok: true }),
        },
      ],
      { group: 'broken' }
    );

    assert.throws(() => providedRoutes.register(), /must start with a \{ basePath: string \} entry/);
  });
});

test('renders the Swagger logo when api-docs/logo.jpeg exists', async () => {
  await withTempProject(async () => {
    fs.mkdirSync(path.join(process.cwd(), 'api-docs'), { recursive: true });
    fs.writeFileSync(
      path.join(process.cwd(), 'api-docs', 'logo.jpeg'),
      Buffer.from(
        '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVEQEBAAAAAAAAAAAAAAAAAAAAAf/aAAwDAQACEAMQAAAB6gD/xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAEFAqf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/AYf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/AYf/xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAY/An//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAE/IT//2gAMAwEAAgADAAAAEB//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/EH//xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/EH//xAAUEAEAAAAAAAAAAAAAAAAAAAAQ/9oACAEBAAE/EH//2Q==',
        'base64'
      )
    );

    const swagger = createAutoSwagger({
      docs: {
        title: 'Branded API',
      },
    });

    const router = swagger.provideRoutes(buildUsersRoutes(), { group: 'users' }).register();

    const app = express();
    app.use(router);
    app.use(swagger.docs());

    const docsUiResponse = await request(app).get('/api-docs/users');
    assert.equal(docsUiResponse.status, 200);
    assert.match(docsUiResponse.text, /<link rel="icon" href="\/api-docs\/logo\.jpeg" \/>/);
    assert.match(docsUiResponse.text, /<img class="docs-logo" src="\/api-docs\/logo\.jpeg" alt="API logo" \/>/);

    const docsIndexResponse = await request(app).get('/api-docs');
    assert.equal(docsIndexResponse.status, 200);
    assert.match(docsIndexResponse.text, /<link rel="icon" href="\/api-docs\/logo\.jpeg" \/>/);

    const logoResponse = await request(app).get('/api-docs/logo.jpeg');
    assert.equal(logoResponse.status, 200);
    assert.match(logoResponse.headers['content-type'], /image\/jpeg/);
  });
});

test('fails fast when group is missing or blank', async () => {
  await withTempProject(async () => {
    const swagger = createAutoSwagger();
    const routes = [
      { basePath: '/users' },
      {
        method: 'get',
        path: '/profile',
        controller: (_req, res) => res.json({ ok: true }),
      },
    ];

    assert.throws(
      () => swagger.provideRoutes(routes, {}).register(),
      /provideRoutes\(\.\.\.\) requires a non-empty group/
    );

    assert.throws(
      () => swagger.provideRoutes(routes, { group: '   ' }).register(),
      /provideRoutes\(\.\.\.\) requires a non-empty group/
    );
  });
});

test('fails when the docs output path is not writable as a directory', async () => {
  await withTempProject(async () => {
    fs.writeFileSync(path.join(process.cwd(), 'api-docs'), 'not a directory');

    const swagger = createAutoSwagger();
    const providedRoutes = swagger.provideRoutes(
      [
        { basePath: '/users' },
        {
          method: 'get',
          path: '/profile',
          controller: (_req, res) => res.json({ ok: true }),
        },
      ],
      { group: 'users' }
    );

    assert.throws(() => providedRoutes.register(), /Unable to create Swagger output directory/);
  });
});

test('throws on duplicate OpenAPI operations within the same group', async () => {
  await withTempProject(async () => {
    const swagger = createAutoSwagger();

    swagger.provideRoutes(
      [
        { basePath: '/users' },
        {
          method: 'get',
          path: '/profile',
          controller: (_req, res) => res.json({ ok: true }),
        },
      ],
      { group: 'users' }
    ).register();

    const duplicateProvider = swagger.provideRoutes(
      [
        { basePath: '/users' },
        {
          method: 'get',
          path: '/profile',
          controller: (_req, res) => res.json({ ok: true }),
        },
      ],
      { group: 'users' }
    );

    assert.throws(() => duplicateProvider.register(), /Duplicate OpenAPI operation/);
  });
});
