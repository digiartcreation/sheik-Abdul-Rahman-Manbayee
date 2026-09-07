import Reveal from "@/components/Reveal";

export default function PatriPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ color: "rgba(255,255,255,0.6)" }}>About Us</p>
          <h1>எங்களை பற்றி</h1>
          <p>
            இஸ்லாமிய அறிவை தமிழில் தெளிவாகவும் எளிமையாகவும் சரியாகவும்
            அளிப்பதே எங்கள் நோக்கம்.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <Reveal className="intro-card">
            <p className="bismillah" dir="rtl">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>

            <div className="section-heading">
              <p className="eyebrow">Our Mission</p>
              <h2>எங்கள் நோக்கம்</h2>
            </div>

            <p className="intro-lead">
              குர்ஆன், ஹதீஸ் மற்றும் அவற்றின் பொருள்தொகுப்புகள் — ஸலஃபுஸ்
              ஸாலிஹீன்களின் வழிமுறைப்படி தெளிவாக அளிப்பதும்,
              புரிந்துகொள்வதும், செயல்படுத்துவதும் — அதுவே{" "}
              <strong>சீரிய பாதை</strong>.
            </p>

            <p style={{ lineHeight: 2, color: "var(--text-secondary)", marginBottom: 24 }}>
              Ahlul Islam இணையதளம் தமிழ் முஸ்லிம்களுக்கு இஸ்லாமிய கல்வியை
              எளிமையாகவும் தெளிவாகவும் வழங்குவதற்காக உருவாக்கப்பட்டது.
              குர்ஆன் விளக்கம், ஹதீஸ் ஆய்வுகள், இஸ்லாமிய சட்டங்கள்,
              அகீதா (கொள்கை), வரலாறு, மற்ற மதங்கள் பற்றிய ஆய்வுகள்
              என பல பிரிவுகளில் தகவல்களை வழங்குகிறோம்.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section section-alt">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">Our Values</p>
            <h2>எங்கள் கொள்கைகள்</h2>
          </Reveal>

          <div className="card-grid" style={{ maxWidth: 900, margin: "0 auto" }}>
            {[
              { num: "01", title: "தெளிவு", desc: "குர்ஆனையும் ஹதீஸையும் தமிழில் எளிமையாக விளக்குகிறோம்." },
              { num: "02", title: "நம்பகத்தன்மை", desc: "ஸலஃபுஸ் ஸாலிஹீன்களின் வழிமுறையை அடிப்படையாக கொள்கிறோம்." },
              { num: "03", title: "செயல்திறன்", desc: "அறிந்ததை வாழ்வில் செயல்படுத்த வழிகாட்டுகிறோம்." },
            ].map((v, i) => (
              <Reveal key={v.num} delay={i * 90} variant="scale" className="intro-card" style={{ textAlign: "center" }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--secondary)", fontFamily: "var(--font-ui)" }}>{v.num}</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "12px 0 8px" }}>{v.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 24, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            {[
              { num: "7+", label: "பிரிவுகள்" },
              { num: "160+", label: "கட்டுரைகள்" },
              { num: "100%", label: "தமிழ் மொழியில்" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 90} variant="scale" className="intro-card" style={{ padding: "32px 24px" }}>
                <strong style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)", fontFamily: "var(--font-ui)", display: "block" }}>{s.num}</strong>
                <span style={{ color: "var(--text-secondary)", fontWeight: 600, marginTop: 8, display: "block" }}>{s.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
