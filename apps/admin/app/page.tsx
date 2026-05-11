import { productStages, languages } from "@yapper/shared";

export default function AdminHome() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: 32 }}>
      <p style={{ color: "#38bdf8", fontWeight: 700 }}>Yapper Admin</p>
      <h1 style={{ fontSize: 48, margin: 0 }}>Content operations dashboard</h1>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 32 }}>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Languages</strong>
          <p>{Object.keys(languages).length} configured</p>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Product stages</strong>
          <p>{productStages.length} configured</p>
        </div>
        <div style={{ border: "1px solid #334155", borderRadius: 24, padding: 24 }}>
          <strong>Review queue</strong>
          <p>Pending implementation</p>
        </div>
      </section>
    </main>
  );
}
