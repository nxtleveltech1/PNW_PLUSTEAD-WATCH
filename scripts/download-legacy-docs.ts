#!/usr/bin/env bun
/**
 * Downloads known documents from legacy PNW site and saves to public/documents/legacy/.
 * See docs/LEGACY_SITE_DISCOVERY.md Appendix B.3 and C.
 */

const BASE = "https://plumsteadwatch.org.za/httphandlers/document.ashx";
const DOCS: { name: string; catid: number; categoryName: string }[] = [
  { name: "SAGA_Release_26_January_2026.pdf", catid: 12, categoryName: "News" },
  { name: "March_2025.pdf", catid: 7, categoryName: "Financials" },
  { name: "Ooba_flyer_with_QR_link_Copy.pdf", catid: 1036, categoryName: "Ooba Solar" },
  { name: "Netcash_EFT_Mandate___Plumstead_Neighbourhood_Watch.pdf", catid: 1035, categoryName: "Debit Order Instruction" },
];

const HELP_BASE = "https://plumsteadwatch.org.za/help";
const HELP_PAGES = [
  { path: "index.html", out: "help-index.html" },
  { path: "pages/memreg.html", out: "memreg.html" },
  { path: "pages/patrola.html", out: "patrola.html" },
  { path: "pages/glossary.html", out: "glossary.html" },
];

const LEGACY_DOCS_DIR = "public/documents/legacy";
const LEGACY_HELP_DIR = "content/help/legacy";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function downloadDocument(name: string, catid: number): Promise<{ ok: boolean; path?: string; error?: string }> {
  const url = `${BASE}?name=${encodeURIComponent(name)}&catid=${catid}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const buf = await res.arrayBuffer();
    const filename = sanitizeFilename(name);
    const outPath = `${LEGACY_DOCS_DIR}/${filename}`;
    await Bun.write(outPath, buf);
    return { ok: true, path: `/documents/legacy/${filename}` };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function downloadHelpPage(path: string, out: string): Promise<{ ok: boolean; error?: string }> {
  const url = `${HELP_BASE}/${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const html = await res.text();
    await Bun.write(`${LEGACY_HELP_DIR}/${out}`, html);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

async function main() {
  const manifest: { categoryName: string; categoryId: number; documentName: string; filename: string; savedPath?: string; error?: string }[] = [];

  // Ensure dirs exist
  const { mkdir } = await import("fs/promises");
  await mkdir(LEGACY_DOCS_DIR, { recursive: true });
  await mkdir(LEGACY_HELP_DIR, { recursive: true });

  console.log("Downloading documents...");
  for (const doc of DOCS) {
    const result = await downloadDocument(doc.name, doc.catid);
    manifest.push({
      categoryName: doc.categoryName,
      categoryId: doc.catid,
      documentName: doc.name,
      filename: sanitizeFilename(doc.name),
      savedPath: result.path,
      error: result.error,
    });
    console.log(result.ok ? `  ✓ ${doc.name}` : `  ✗ ${doc.name}: ${result.error}`);
  }

  console.log("\nDownloading help pages...");
  for (const page of HELP_PAGES) {
    const result = await downloadHelpPage(page.path, page.out);
    console.log(result.ok ? `  ✓ ${page.path}` : `  ✗ ${page.path}: ${result.error}`);
  }

  await Bun.write(`${LEGACY_DOCS_DIR}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log("\nManifest written to public/documents/legacy/manifest.json");
}

main().catch(console.error);
