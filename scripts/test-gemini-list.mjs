const key = ((process.env.GEMINI_API_KEY || process.argv[2] || "")).trim();
if (!key) {
  console.error("Missing GEMINI_API_KEY");
  process.exit(1);
}

async function main() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
  try {
    const res = await fetch(url);
    const body = await res.json();
    if (!res.ok) {
      console.error("ListModels failed", res.status, body);
      process.exit(2);
    }
    const names = (body.models || []).map((m) => m.name).slice(0, 10);
    console.log("Models:", names);
    process.exit(0);
  } catch (e) {
    console.error("Request error", e.message || String(e));
    process.exit(2);
  }
}

main();
