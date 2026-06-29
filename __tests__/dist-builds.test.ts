/**
 * Sanity checks that each webpack application has published a valid production
 * build to its ./dist directory.  These tests do NOT re-run the build – they
 * assert that the committed dist artefacts are present and non-empty.
 */

import * as fs from "fs";
import * as path from "path";

function distPath(app: string, ...parts: string[]) {
  return path.resolve(__dirname, "..", app, "dist", ...parts);
}

function exists(p: string) {
  return fs.existsSync(p);
}

function isNonEmpty(p: string) {
  const stat = fs.statSync(p);
  return stat.size > 0;
}

const webpackApps = [
  "100k-club",
  "record-sales",
  "silver-age-pedigrees",
  "timeline",
];

describe.each(webpackApps)("%s dist build", (app) => {
  it("has an index.html", () => {
    expect(exists(distPath(app, "index.html"))).toBe(true);
  });

  it("has a non-empty index.html", () => {
    expect(isNonEmpty(distPath(app, "index.html"))).toBe(true);
  });

  it("has a scripts/index.js bundle", () => {
    expect(exists(distPath(app, "scripts", "index.js"))).toBe(true);
  });

  it("has a non-empty scripts/index.js bundle", () => {
    expect(isNonEmpty(distPath(app, "scripts", "index.js"))).toBe(true);
  });

  it("has a css directory", () => {
    expect(exists(distPath(app, "css"))).toBe(true);
  });

  it("has a favicon.ico", () => {
    expect(exists(distPath(app, "favicon.ico"))).toBe(true);
  });

  it("has a robots.txt", () => {
    expect(exists(distPath(app, "robots.txt"))).toBe(true);
  });

  it("has a site.webmanifest", () => {
    expect(exists(distPath(app, "site.webmanifest"))).toBe(true);
  });
});

// Timeline additionally ships an img/ directory
describe("timeline dist build extras", () => {
  it("has an img directory", () => {
    expect(exists(distPath("timeline", "img"))).toBe(true);
  });
});
