"use client";

export default function SubscribeForm() {
  return (
    <form
      className="subscribe-form"
      onSubmit={(event) => {
        event.preventDefault();
        alert("நன்றி! சந்தா பதிவு செய்யப்பட்டது.");
        event.target.reset();
      }}
    >
      <input type="email" placeholder="உங்கள் மின்னஞ்சல்" required />
      <button type="submit">Subscribe</button>
    </form>
  );
}
