# Express.js + TypeScript + ESLint + Prettier Starter

A minimal, batteries-included starter for building an Express.js API with TypeScript, ESLint, and Prettier. Uses ESM, strict TypeScript, and modern tooling for a smooth DX.

### Features
- **Express 5** with a simple starter route
- **TypeScript** with strict settings and ES2022 target
- **ESM** (`"type": "module"`)
- **Dev server** with `tsx --watch`
- **ESLint 9** + **TypeScript ESLint**
- **Prettier 3** with opinionated formatting

### Prerequisites
- **Node.js 18+** recommended
- **npm** (comes with Node)

### Getting Started
1. Install dependencies
```bash
npm install
```

2. Create environment file (optional for now)
```bash
cp .envexample .env
```

3. Start the dev server (auto-reloads on change)
```bash
npm run dev
```

4. Build and run production
```bash
npm run build
npm start
```

The server runs on port `3000` by default. Try:
```bash
curl http://localhost:3000/
```

### Available Scripts
- **dev**: `tsx --watch src/index.ts` — start the development server with hot-reload
- **build**: `tsc` — compile TypeScript to `dist/`
- **start**: `node dist/index.js` — run the compiled app
- **lint**: `eslint .` — check code quality
- **lint:fix**: `eslint --fix .` — fix auto-fixable lint issues
- **format:check**: `prettier --check .` — verify formatting
- **format**: `prettier --write .` — apply formatting

### Project Structure
```
.
├─ src/
│  └─ index.ts            # App entry (Hello World route)
├─ dist/                  # Build output (generated)
├─ eslint.config.ts       # ESLint configuration
├─ tsconfig.json          # TypeScript configuration
├─ .prettierrc            # Prettier configuration
├─ .prettierignore        # Prettier ignore
├─ .eslintignore          # ESLint ignore
├─ .envexample            # Environment template
└─ package.json
```

### Tech Details
- **TypeScript config**: extends `@tsconfig/node22`, targets ES2022, `strict` enabled, `outDir: dist`, `rootDir: src`
- **ESLint**: configured for TypeScript and integrates Prettier via `eslint-plugin-prettier`
- **Prettier**: single quotes, semicolons, LF line endings, 100-char print width

### Starter Route
The default route responds with a simple message.

```ts
// src/index.ts
import express, { Request, Response } from 'express';

const app = express();
const port: number = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
  console.log('Response Sent');
});

app.listen(port, () => {
  console.log(`APP Running on Port ${port}`);
});
```