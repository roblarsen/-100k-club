# Comic Sales Timeline

A D3/TypeScript visualization of comic book sale prices over time, with inflation adjustment.

## Getting Started

Clone or download the project and then run

```
npm install
npm run start
```

## Building for Production

```
npm run build
```

## CPI / Inflation Data

Inflation-adjusted prices use US CPI data stored in `data/cpi-us.json`.

### How it works

- `scripts/inflation.ts` reads `data/cpi-us.json` and exports an `inflation({ amount, year })` function.
- CPI values are keyed as `YYYY-MM` for monthly data and `YYYY-00` for the annual average.
- When a year is passed without a month, the annual average (`YYYY-00`) is used.
- The default "to" year is always the last full calendar year (current year minus 1).

### Updating CPI data locally

```
npm run update:cpi
```

This runs `scripts/update-cpi-data.ts` via `ts-node`, fetches the latest CPI values from the `cpi-us` npm package, and rewrites `data/cpi-us.json`.

### Automated monthly updates

A GitHub Actions workflow (`.github/workflows/update-cpi-data.yml`) runs on the 2nd of each month at 12:00 UTC and on manual dispatch. It:

1. Installs dependencies in `timeline/`
2. Runs `npm run update:cpi`
3. Commits and pushes `data/cpi-us.json` back to the branch if the file changed