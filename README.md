# Jeremie Klose — Portfolio

Personal portfolio built with Angular 22, TypeScript 6, Three.js, PrimeNG 22 and Tailwind CSS. Features a scroll-driven 3D space journey and a downloadable CV.

## Local setup

Use Node.js 24.15 or newer within the Node 24 release line.

```powershell
npm ci
Copy-Item .env.example .env
```

Add your own valid PrimeUI Community or Commercial license to `.env`:

```text
PRIMEUI_LICENSE=your_license_key
```

The local `.env` and generated TypeScript license file are excluded from Git. The npm lifecycle scripts generate the license configuration before starting, building or testing. Without a key, the project still builds but PrimeNG displays its license notice. Obtain a license at https://primeui.store/.

```powershell
npm run start
```

On Windows this opens Google Chrome at http://localhost:4200/. On other platforms use `npm run prestart` followed by `npx ng serve --open`.

## Build and tests

```powershell
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

Production output: `dist/portafolioAngular/browser`. For CI or hosting, set `PRIMEUI_LICENSE` as an environment variable and build with `npm run build`.
