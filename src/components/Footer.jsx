import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* About */}
        <div className="footer-section footer-about">
          <h3>Manbayee.com</h3>
          <p>
            குர்ஆன், ஹதீஸ் மற்றும் அவற்றின் பொருள்தொகுப்புகள் — ஸலஃபுஸ்
            ஸாலிஹீன்களின் வழிமுறைப்படி தெளிவாக அளிப்பதும், புரிந்துகொள்வதும்,
            செயல்படுத்துவதும் — அதுவே சீரிய பாதை.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>விரைவு இணைப்புகள்</h3>
          <div className="footer-links">
            <Link href="/">முகப்பு</Link>
            <Link href="/pirivugal">பிரிவுகள்</Link>
            <Link href="/kelvi-pathil">கேள்வி-பதில்</Link>
            <Link href="/ungal-paguthi">உங்கள் பகுதி</Link>
            <Link href="/patri">எங்களை பற்றி</Link>
          </div>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>பிரிவுகள்</h3>
          <div className="footer-links">
            <Link href="/pirivugal?cat=quran">குர்ஆன்</Link>
            <Link href="/pirivugal?cat=hadith">ஹதீஸ்</Link>
            <Link href="/pirivugal?cat=aqeedah">கொள்கை</Link>
            <Link href="/pirivugal?cat=rulings">சட்டங்கள்</Link>
            <Link href="/pirivugal?cat=history">வரலாறு</Link>
            <Link href="/pirivugal?cat=religions">மதங்கள்</Link>
          </div>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>தொடர்பு</h3>
          <div className="footer-contact">
            <p>📍 Pudupettai, Chennai</p>
            <p>📞 +91 98408 28225</p>
            <p>✉️ info@ahlulislam.net</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} Manbayee.com. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
        </div>
      </div>
    </footer>
  );
}
