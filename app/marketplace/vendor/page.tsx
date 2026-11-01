"use client";

import Link from "next/link";
import VendorHeader from "../components/VendorHeader";


const steps = [
  ["01", "Apply to become a seller", "Complete the application with accurate contact and business details."],
  ["02", "Application review", "Marketplace management reviews your application and may request more information."],
  ["03", "Approval and activation", "Your seller account must be approved and activated before seller tools are available."],
  ["04", "Manage your store", "After activation, maintain product listings and manage available seller activities."],
];

const benefits = [
  ["◎", "Reach more customers", "List products in a shared marketplace where customers can discover different sellers."],
  ["▤", "Seller tools in one place", "Use the seller workspace to manage catalogue and order activity as features become available."],
  ["✓", "Review-first process", "Applications are reviewed before seller access is activated."],
  ["↗", "A clear path to start", "Understand the application, review and activation stages before you begin."],
];

export default function VendorGuidancePage() {
  return (
    <main className="vendor-page">
      <VendorHeader />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">UMEED MARKETPLACE · SELLER COMMUNITY</span>
            <h1>Your products.<br /><span>Your next opportunity.</span></h1>
            <p className="intro">
              Bring your business to Umeed Marketplace. Learn how the seller
              journey works, understand the review process and apply when you’re ready.
            </p>
            <div className="actions">
              <Link href="/marketplace/vendors/registration" className="primary">Become a vendor <b>→</b></Link>
              <Link href="/marketplace/vendor/login?purpose=application" className="secondary">Already applied? Check application</Link>
            </div>
            <div className="free-note"><span>✓</span><div><strong>Free to apply</strong><small>Applications are reviewed before activation.</small></div></div>
          </div>

          <div className="hero-art" aria-label="Seller store illustration">
            <div className="orb orb-one" /><div className="orb orb-two" />
            <div className="store-card">
              <div className="store-top"><span className="mark">U</span><span className="status"><i /> Seller journey</span></div>
              <div className="shop">
                <div className="roof" /><div className="awning"><i /><i /><i /><i /><i /></div>
                <div className="shop-body"><span className="door" /><span className="window" /></div>
              </div>
              <h2>Your store starts here</h2><p>Apply · Review · Activate · Grow</p>
              <div className="progress"><i /><i /><i /><i /></div>
              <div className="progress-label"><span>Application</span><span>Activation</span></div>
            </div>
            <div className="float float-a"><span>✦</span><div><b>Built for sellers</b><small>One clear journey</small></div></div>
            <div className="float float-b"><span className="green">✓</span><div><b>Verified access</b><small>Activation by management</small></div></div>
          </div>
        </div>
      </section>

      <section className="section steps-section">
        <header className="section-heading"><span className="eyebrow">HOW IT WORKS</span><h2>Four steps to get started</h2><p>Know what to expect before you apply to become a seller.</p></header>
        <div className="steps-grid">
          {steps.map(([number, title, description], index) => (
            <article className="step-card" key={number}>
              <div className="step-top"><span className={`step-icon tone-${index}`}>{["↗", "⌕", "✓", "▦"][index]}</span><b>{number}</b></div>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
        <div className="steps-cta"><div><strong>Ready to take the first step?</strong><span>Start your application when your details are ready.</span></div><Link href="/marketplace/vendors/registration" className="primary">Become a seller <b>→</b></Link></div>
      </section>

      <section className="benefits-section">
        <div className="section benefits-inner">
          <header className="section-heading"><span className="eyebrow">WHY WORK WITH US</span><h2>More clarity. One seller journey.</h2><p>A structured way to apply and, once activated, manage your marketplace activity.</p></header>
          <div className="benefits-grid">{benefits.map(([icon, title, description]) => <article className="benefit-card" key={title}><span className="benefit-icon">{icon}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </div>
      </section>

      <section className="section requirements">
        <div><span className="eyebrow">BEFORE YOU APPLY</span><h2>Start with accurate information.</h2><p className="body-copy">Submitting an application does not guarantee approval or activate a seller account automatically.</p>
          <ul><li><span>✓</span> Use a working email address and phone number.</li><li><span>✓</span> Enter accurate applicant and business details.</li><li><span>✓</span> Provide any additional information requested during review.</li><li><span>✓</span> Wait for management approval and activation.</li></ul>
        </div>
        <aside className="notice"><span className="info">i</span><h3>Application and activation</h3><p>Your application will be reviewed by management. Seller features remain unavailable until your account is approved and activated.</p><hr /><div className="fee"><span>Application fee</span><strong>Currently free</strong></div><small>If the fee policy changes, updated terms should be communicated before any fee is charged.</small></aside>
      </section>

      <section className="final-cta"><div><span className="eyebrow">YOUR SELLER JOURNEY STARTS HERE</span><h2>Ready to bring your products to Umeed?</h2><p>Apply to become a seller, or sign in to check an application you have already submitted.</p></div><div className="final-actions"><Link href="/marketplace/vendors/registration" className="primary">Become a vendor <b>→</b></Link><Link href="/marketplace/vendor/login?purpose=application" className="secondary">Check application</Link></div></section>

      <footer className="footer"><Link href="/marketplace" className="footer-brand"><span className="mark">U</span><span><b>Umeed Marketplace</b><small>Part of Umeed of Life</small></span></Link><p>A marketplace built around opportunity, trust and growth.</p><Link href="/marketplace" className="footer-back">Back to marketplace ↗</Link></footer>

      <style jsx>{`
        .vendor-page{--coral:#e75d55;--coral-dark:#cf4b43;--dark:#302c2a;--muted:#77716f;--line:#f0e4dd;min-height:100vh;background:#fffdfb;color:var(--dark);overflow:hidden}
        .hero{background:radial-gradient(circle at 82% 18%,#ffe2d5 0,transparent 28%),linear-gradient(115deg,#fffaf6,#fff0e7);border-bottom:1px solid #f8e8df}
        .hero-inner{width:min(1180px,100%);margin:auto;padding:65px 28px 72px;display:grid;grid-template-columns:1.04fr .96fr;gap:40px;align-items:center}
        .hero-copy{max-width:620px}.eyebrow{color:var(--coral-dark);font-size:11px;line-height:1.8;letter-spacing:1.6px;font-weight:800}
        h1{margin:20px 0 18px;font-size:clamp(38px,5vw,62px);line-height:1.07;letter-spacing:-2.5px;font-weight:850}h1 span{color:var(--coral)}
        .intro,.section-heading p,.body-copy,.final-cta p{color:var(--muted);font-size:14px;line-height:1.9}
        .intro{max-width:550px;font-size:15px}.actions{display:flex;flex-wrap:wrap;gap:11px;margin-top:26px}
        .primary,.secondary{min-height:48px;padding:13px 17px;display:inline-flex;justify-content:center;align-items:center;gap:12px;border-radius:12px;text-decoration:none;font-size:13px;font-weight:800;transition:.2s}
        .primary{background:var(--coral);color:#fff;box-shadow:0 9px 22px #e75d5527}.primary:hover{background:var(--coral-dark);transform:translateY(-2px)}.primary b{font-size:18px}
        .secondary{color:#6c4c40;background:#fff;border:1px solid #ecd8cd}.secondary:hover{background:#fff8f4;transform:translateY(-2px)}
        .free-note{display:flex;align-items:center;gap:10px;margin-top:23px}.free-note>span{width:25px;height:25px;display:grid;place-items:center;border-radius:50%;background:#e2f5e8;color:#27855b;font-weight:900}.free-note strong,.free-note small{display:block}.free-note strong{font-size:12px}.free-note small{margin-top:3px;color:#897b73;font-size:11px}
        .hero-art{min-height:390px;position:relative;display:grid;place-items:center}.orb{position:absolute;border-radius:50%}.orb-one{width:330px;height:330px;background:#ffdfcf}.orb-two{width:250px;height:250px;background:#f6c0ad;opacity:.65}
        .store-card{position:relative;z-index:1;width:min(330px,86%);padding:22px;border:1px solid #f5e9e2;border-radius:23px;background:#fff;box-shadow:0 25px 70px #8c55421a}
        .store-top{display:flex;align-items:center;justify-content:space-between}.mark{width:39px;height:39px;display:grid;place-items:center;border-radius:12px;background:var(--coral);color:#fff;font-size:21px;font-weight:900}
        .status{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:999px;background:#f5fbf6;color:#5c7765;font-size:10px}.status i{width:6px;height:6px;border-radius:50%;background:#50b77c}
        .shop{height:137px;margin:17px auto 18px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center}.roof{width:176px;height:27px;border-radius:10px 10px 3px 3px;background:var(--coral)}.awning{width:181px;height:22px;display:flex;overflow:hidden;border-radius:3px 3px 7px 7px;background:#f4a38c}.awning i{flex:1;border-right:2px solid #fff0e8}.shop-body{position:relative;width:165px;height:68px;border:2px solid #f1c8b7;background:#fff0e8}.door{position:absolute;left:28px;bottom:0;width:31px;height:49px;border-radius:5px 5px 0 0;background:#eaa48c}.window{position:absolute;top:12px;right:17px;width:43px;height:31px;border:3px solid white;background:#f7c7b4}
        .store-card h2{text-align:center;margin:0;font-size:18px;font-weight:800}.store-card>p{text-align:center;margin:7px 0 20px;color:#897b73;font-size:11px}.progress{display:flex;gap:5px}.progress i{flex:1;height:5px;border-radius:8px;background:#f3ded4}.progress i:first-child{background:var(--coral)}.progress-label{display:flex;justify-content:space-between;margin-top:7px;color:#97877e;font-size:9px}
        .float{position:absolute;z-index:2;display:flex;gap:10px;align-items:center;padding:12px 14px;border:1px solid #f3e7e0;border-radius:14px;background:#fff;box-shadow:0 12px 35px #704a3518}.float-a{top:25px;right:0}.float-b{bottom:19px;left:0}.float>span{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;color:var(--coral);background:#fff0e8;font-size:19px}.float>span.green{color:#27855b;background:#e2f5e8}.float b,.float small{display:block}.float b{font-size:11px}.float small{margin-top:4px;color:#8a7e77;font-size:9px}
        .section{width:min(1120px,100%);margin:0 auto;padding:76px 28px}.section-heading{max-width:650px;margin:0 auto 35px;text-align:center}.section-heading h2,.requirements h2,.final-cta h2{margin:12px 0;font-size:clamp(28px,3.5vw,40px);line-height:1.2;letter-spacing:-1.3px;font-weight:850}.section-heading p{margin:0 auto}
        .steps-grid,.benefits-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:15px}.step-card,.benefit-card{padding:23px 20px;border:1px solid var(--line);border-radius:18px;background:#fff;transition:transform .2s,box-shadow .2s}.step-card:hover,.benefit-card:hover{transform:translateY(-4px);box-shadow:0 15px 35px #8c55420d}
        .step-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:21px}.step-icon,.benefit-icon{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;color:var(--coral-dark);background:#fff0e8;font-size:21px;font-weight:800}.step-top>b{color:#e5d4cb;font-size:20px}.tone-1{background:#fbe6ef;color:#c04f77}.tone-2{background:#fff0d9;color:#c87929}.tone-3{background:#e1f5e8;color:#27855b}
        .step-card h3,.benefit-card h3{margin:0 0 9px;font-size:15px;line-height:1.5;font-weight:800}.step-card p,.benefit-card p{margin:0;color:var(--muted);font-size:12px;line-height:1.85}
        .steps-cta{margin-top:25px;padding:21px 24px;display:flex;justify-content:space-between;align-items:center;gap:20px;border-radius:17px;background:#fff5ef;border:1px solid #f5e5db}.steps-cta strong,.steps-cta div>span{display:block}.steps-cta strong{font-size:14px}.steps-cta div>span{margin-top:5px;color:var(--muted);font-size:12px}
        .benefits-section{background:#fff7f2;border-top:1px solid #f7e9e1;border-bottom:1px solid #f7e9e1}.benefits-section .section{padding-top:75px;padding-bottom:75px}.benefit-card{background:#fffdfb}.benefit-icon{margin-bottom:19px}
        .requirements{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;gap:55px}.body-copy{max-width:590px;margin:17px 0 24px}.requirements ul{display:grid;gap:14px;margin:0;padding:0;list-style:none}.requirements li{display:flex;gap:11px;align-items:flex-start;color:#5e554f;font-size:13px;line-height:1.7}.requirements li span{flex:0 0 22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#e2f5e8;color:#27855b;font-weight:900}
        .notice{padding:28px;border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 18px 45px #8c55420a}.info{width:35px;height:35px;display:grid;place-items:center;border-radius:50%;color:var(--coral);background:#fff0e8;font-weight:900}.notice h3{margin:17px 0 9px;font-size:19px}.notice p,.notice small{color:var(--muted);font-size:12px;line-height:1.9}.notice hr{border:0;border-top:1px solid var(--line);margin:19px 0}.fee{display:flex;justify-content:space-between;gap:10px;font-size:12px}.fee strong{color:#27855b}.notice small{display:block;margin-top:12px;font-size:11px}
        .final-cta{width:min(1120px,calc(100% - 56px));margin:0 auto 62px;padding:35px;display:flex;align-items:center;justify-content:space-between;gap:28px;border-radius:24px;background:linear-gradient(115deg,#fff0e7,#ffe1d4)}.final-cta>div:first-child{max-width:600px}.final-cta h2{font-size:clamp(26px,3vw,35px)}.final-cta p{margin:0}.final-actions{display:flex;flex-direction:column;gap:10px;min-width:220px}.final-actions .secondary{background:#ffffffb3}
        .footer{padding:25px max(28px,calc((100% - 1120px)/2));display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:17px;border-top:1px solid var(--line);background:#fff}.footer-brand{display:flex;align-items:center;gap:10px;color:var(--dark);text-decoration:none}.footer-brand b,.footer-brand small{display:block}.footer-brand b{font-size:13px}.footer-brand small{margin-top:3px;color:var(--coral-dark);font-size:10px}.footer p{margin:0;color:#897d76;font-size:11px}.footer-back{color:#6d554a;text-decoration:none;font-size:12px;font-weight:800}
        @media(max-width:1000px){.hero-inner{gap:22px}.steps-grid,.benefits-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.requirements{gap:30px}}
        @media(max-width:700px){.hero-inner{padding:44px 20px 49px;grid-template-columns:1fr;gap:14px}h1{font-size:clamp(39px,10vw,53px);letter-spacing:-1.8px}.intro{font-size:14px}.actions{flex-direction:column}.actions a{width:100%}.hero-art{min-height:350px}.orb-one{width:285px;height:285px}.orb-two{width:220px;height:220px}.float-a{top:2px;right:0}.float-b{bottom:0;left:0}.section{padding:57px 20px}.steps-grid,.benefits-grid{grid-template-columns:1fr}.steps-cta{align-items:stretch;flex-direction:column}.steps-cta .primary{width:100%}.requirements{grid-template-columns:1fr;gap:27px}.final-cta{width:calc(100% - 40px);margin-bottom:40px;padding:26px 21px;align-items:stretch;flex-direction:column}.final-actions{min-width:0}.footer{padding:24px 20px;align-items:flex-start;flex-direction:column}}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important;scroll-behavior:auto!important}}
      `}</style>
    </main>
  );
}
