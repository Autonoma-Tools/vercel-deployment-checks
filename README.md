# Vercel Deployment Checks: How to Add E2E Testing as a Quality Gate

Companion code for the Autonoma blog post 'Vercel Deployment Checks: How to Add E2E Testing as a Quality Gate'.

> Companion code for the Autonoma blog post: **[Vercel Deployment Checks: How to Add E2E Testing as a Quality Gate](https://getautonoma.com/blog/vercel-deployment-checks)**

## Requirements

- Node 20+
- A Vercel Pro or Enterprise account with API access
- ngrok (or equivalent tunneling tool) to expose the local server during development
- A Vercel access token with deployment check scope (create at https://vercel.com/account/tokens)

## Quickstart

```bash
git clone https://github.com/Autonoma-Tools/vercel-deployment-checks.git
cd vercel-deployment-checks
1. Install dependencies: `npm install`.
2. Copy `.env.example` to `.env` and set `VERCEL_ACCESS_TOKEN` (and optionally `PORT`, defaults to 3000).
3. Run: `npx ts-node src/checks-handler.ts`.
4. Expose locally with ngrok (`ngrok http 3000`) and register the public URL as a webhook in your Vercel project settings (events: `deployment.succeeded`).
5. Open a PR in the project, watch the handler receive the webhook, register the check via `POST /v1/deployments/:id/checks`, run your test suite, and `PATCH` the conclusion.
```

## Project structure

```
.
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── examples/
│   └── simulate-webhook.sh
├── package.json
├── src/
│   └── checks-handler.ts
└── tsconfig.json
```

- `src/` — primary source files for the snippets referenced in the blog post.
- `examples/` — runnable examples you can execute as-is.
- `docs/` — extended notes, diagrams, or supporting material (when present).

## About

This repository is maintained by [Autonoma](https://getautonoma.com) as reference material for the linked blog post. Autonoma builds autonomous AI agents that plan, execute, and maintain end-to-end tests directly from your codebase.

If something here is wrong, out of date, or unclear, please [open an issue](https://github.com/Autonoma-Tools/vercel-deployment-checks/issues/new).

## License

Released under the [MIT License](./LICENSE) © 2026 Autonoma Labs.
