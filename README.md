# OpenRouter Model Compare

Send one prompt to three models at once through [OpenRouter](https://openrouter.ai) and compare the streamed answers side by side, with time to first token, total time, output tokens, and cost.

Defaults: `anthropic/claude-sonnet-5.5`, `moonshotai/kimi-k3`, `deepseek/deepseek-v4-pro`. Each panel's model field autocompletes from OpenRouter's catalog and remembers your choice.

## How it works

- `public/index.html`: the UI, a static page with no build step.
- `api/chat.js`: a Vercel function that forwards one chat request to OpenRouter and streams the response back. Your API key stays on the server.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | Your OpenRouter key |
| `APP_PASSWORD` | no | If set, visitors must enter this password before they can send prompts. Set it so strangers can't spend your credits. |

## Run locally

```sh
vercel env pull .env.local   # or create .env.local with OPENROUTER_API_KEY=...
vercel dev
```
