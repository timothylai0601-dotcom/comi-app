import { useState, useEffect } from 'react'
import CodyMascotHero from './CodyMascotHero.png'
import AppMockupScreenshot from './AppMockupScreenshot.png'
import LandingBackground from './LandingBackground.jpg'

/*
  EDIT ME to update the Beta Results numbers shown on the landing page.
  These act as a floor — if real form/localStorage activity produces a
  higher count, the higher number is shown instead. No other code needs to change.
*/
const betaResults = {
  usersTried: 23,
  feedbackResponses: 0,
  waitlistSignups: 0,
  comiPlusInterested: 0,
}

const CONTACT_EMAIL = 'timothylai0601@gmail.com'

/* ---------- localStorage + submission helpers ---------- */
/* Landing-page-only data. Keys are prefixed "comi_landing_" so they never
   collide with the real app's own localStorage keys (comi_users, comi_pets, etc). */

function readList(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function appendToList(key, entry) {
  const list = readList(key)
  list.push(entry)
  try { localStorage.setItem(key, JSON.stringify(list)) } catch { /* storage unavailable */ }
  return list
}

function bumpMvpTries() {
  try {
    const next = Number(localStorage.getItem('comi_landing_mvp_tries') || 0) + 1
    localStorage.setItem('comi_landing_mvp_tries', String(next))
    return next
  } catch {
    return 0
  }
}

function openMailto(to, subject, lines) {
  const url = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  window.location.href = url
}

async function postJson(endpoint, data) {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch {
    /* best-effort — the local save already happened, so the demo evidence is safe either way */
  }
}

function computeStats() {
  const feedback = readList('comi_landing_feedback')
  const waitlist = readList('comi_landing_waitlist')
  let tries = 0
  try { tries = Number(localStorage.getItem('comi_landing_mvp_tries') || 0) } catch { /* ignore */ }

  const waitlistEmails = new Set(waitlist.map((w) => (w.email || '').trim().toLowerCase()).filter(Boolean))

  const interestedEmails = new Set()
  feedback.forEach((f) => {
    if (f.email && (f.comiPlusInterest === 'Yes' || f.comiPlusInterest === 'Maybe')) interestedEmails.add(f.email.trim().toLowerCase())
  })
  waitlist.forEach((w) => {
    if (w.email && (w.comiPlusInterest === 'Yes' || w.comiPlusInterest === 'Maybe')) interestedEmails.add(w.email.trim().toLowerCase())
  })

  return {
    usersTried: Math.max(betaResults.usersTried, tries),
    feedbackResponses: Math.max(betaResults.feedbackResponses, feedback.length),
    waitlistSignups: Math.max(betaResults.waitlistSignups, waitlistEmails.size),
    comiPlusInterested: Math.max(betaResults.comiPlusInterested, interestedEmails.size),
  }
}

/* ---------- small form primitives ---------- */

function TextField({ label, type = 'text', value, onChange, required }) {
  return (
    <label className="lp-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </label>
  )
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="lp-field">
      <span>{label}</span>
      <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function ChoiceGroup({ label, options, value, onChange }) {
  return (
    <div className="lp-field">
      <span>{label}</span>
      <div className="lp-choice-row">
        {options.map((opt) => (
          <button
            type="button"
            key={opt}
            className={'lp-choice' + (value === opt ? ' lp-choice-active' : '')}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function Modal({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="lp-modal-backdrop" onClick={onClose}>
      <div className="lp-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button type="button" className="lp-modal-close" onClick={onClose} aria-label="Close">×</button>
        {children}
      </div>
    </div>
  )
}

/* ---------- forms ---------- */

function FeedbackForm({ onSubmitted, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isPetOwner, setIsPetOwner] = useState('')
  const [understands, setUnderstands] = useState('')
  const [mostUseful, setMostUseful] = useState('')
  const [wouldUse, setWouldUse] = useState('')
  const [comiPlusInterest, setComiPlusInterest] = useState('')
  const [improve, setImprove] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      name, email, isPetOwner, understands, mostUseful, wouldUse, comiPlusInterest, improve,
      submittedAt: new Date().toISOString(),
    }
    appendToList('comi_landing_feedback', data)
    const endpoint = import.meta.env.VITE_FEEDBACK_FORM_ENDPOINT
    if (endpoint) {
      postJson(endpoint, data)
    } else {
      openMailto(CONTACT_EMAIL, 'Comi Feedback', [
        `Name: ${name}`,
        `Email: ${email}`,
        `Pet owner: ${isPetOwner}`,
        `Understands what the app is for: ${understands}`,
        `Most useful feature: ${mostUseful}`,
        `Would use Comi for their own pet: ${wouldUse}`,
        `Interested in Comi Plus: ${comiPlusInterest}`,
        `What to improve: ${improve}`,
      ])
    }
    setSubmitted(true)
    onSubmitted()
  }

  if (submitted) {
    return (
      <div className="lp-modal-success">
        <h3>Thank you! Your feedback was sent.</h3>
        <button type="button" className="lp-btn lp-btn-primary" onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <form className="lp-modal-form" onSubmit={handleSubmit}>
      <h3>Help improve Comi</h3>
      <p className="lp-modal-sub">Try the MVP and share your feedback. Your response helps shape the next version of Comi.</p>
      <TextField label="Name" value={name} onChange={setName} required />
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <ChoiceGroup label="Are you a pet owner?" options={['Yes', 'No', 'Planning to be one']} value={isPetOwner} onChange={setIsPetOwner} />
      <ChoiceGroup label="After trying Comi, do you understand what the app is for?" options={['Yes', 'Somewhat', 'No']} value={understands} onChange={setUnderstands} />
      <ChoiceGroup
        label="Which feature feels most useful?"
        options={['Mood Check-in', 'Wellness Calendar', 'AI Insight', 'Community / Places', 'Custom Mascot', 'Comi Plus Smart Dog Tag']}
        value={mostUseful}
        onChange={setMostUseful}
      />
      <ChoiceGroup label="Would you use Comi for your own pet?" options={['Yes', 'Maybe', 'No']} value={wouldUse} onChange={setWouldUse} />
      <ChoiceGroup label="Would you be interested in Comi Plus Smart Dog Tag?" options={['Yes', 'Maybe', 'No']} value={comiPlusInterest} onChange={setComiPlusInterest} />
      <TextAreaField label="What would you improve in the next version?" value={improve} onChange={setImprove} />
      <button type="submit" className="lp-btn lp-btn-primary lp-modal-submit">Send Feedback</button>
    </form>
  )
}

function WaitlistForm({ onSubmitted, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [hasPet, setHasPet] = useState('')
  const [comiPlusInterest, setComiPlusInterest] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { name, email, hasPet, comiPlusInterest, submittedAt: new Date().toISOString(), source: 'waitlist' }
    appendToList('comi_landing_waitlist', data)
    const endpoint = import.meta.env.VITE_WAITLIST_FORM_ENDPOINT
    if (endpoint) {
      postJson(endpoint, data)
    } else {
      openMailto(CONTACT_EMAIL, 'Comi Waitlist Sign-up', [
        `Name: ${name}`,
        `Email: ${email}`,
        `Has a pet: ${hasPet}`,
        `Interested in Comi Plus: ${comiPlusInterest}`,
      ])
    }
    setSubmitted(true)
    onSubmitted()
  }

  if (submitted) {
    return (
      <div className="lp-modal-success">
        <h3>You are on the Comi waitlist!</h3>
        <button type="button" className="lp-btn lp-btn-primary" onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <form className="lp-modal-form" onSubmit={handleSubmit}>
      <h3>Join the Comi waitlist</h3>
      <p className="lp-modal-sub">Sign up to get updates about Comi and future Comi Plus Smart Dog Tag features.</p>
      <TextField label="Name" value={name} onChange={setName} required />
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <ChoiceGroup label="Do you have a pet?" options={['Yes', 'No', 'Planning to get one']} value={hasPet} onChange={setHasPet} />
      <ChoiceGroup label="Are you interested in Comi Plus Smart Dog Tag?" options={['Yes', 'Maybe', 'No']} value={comiPlusInterest} onChange={setComiPlusInterest} />
      <button type="submit" className="lp-btn lp-btn-primary lp-modal-submit">Join Waitlist</button>
      <p className="lp-modal-note">This is a beta waitlist, not a paid sign-up.</p>
    </form>
  )
}

function SignUpForm({ onSubmitted, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    appendToList('comi_landing_accounts', { name, email, password, createdAt: new Date().toISOString() })
    appendToList('comi_landing_waitlist', { name, email, hasPet: '', comiPlusInterest: '', submittedAt: new Date().toISOString(), source: 'signup' })
    setSubmitted(true)
    onSubmitted()
  }

  if (submitted) {
    return (
      <div className="lp-modal-success">
        <h3>Account created. You are signed up for Comi updates.</h3>
        <button type="button" className="lp-btn lp-btn-primary" onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <form className="lp-modal-form" onSubmit={handleSubmit}>
      <h3>Create your Comi account</h3>
      <p className="lp-modal-sub">A quick demo sign-up for the beta launch — no real backend yet.</p>
      <TextField label="Name" value={name} onChange={setName} required />
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <TextField label="Password" type="password" value={password} onChange={setPassword} required />
      <button type="submit" className="lp-btn lp-btn-primary lp-modal-submit">Create account</button>
    </form>
  )
}

function SignInForm({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const accounts = readList('comi_landing_accounts')
    const match = accounts.find((a) => a.email.trim().toLowerCase() === email.trim().toLowerCase() && a.password === password)
    setResult(match ? 'success' : 'notfound')
  }

  if (result === 'success') {
    return (
      <div className="lp-modal-success">
        <h3>Welcome back to Comi.</h3>
        <button type="button" className="lp-btn lp-btn-primary" onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <form className="lp-modal-form" onSubmit={handleSubmit}>
      <h3>Sign in to Comi</h3>
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <TextField label="Password" type="password" value={password} onChange={setPassword} required />
      {result === 'notfound' && <p className="lp-modal-error">Account not found. Please sign up first.</p>}
      <button type="submit" className="lp-btn lp-btn-primary lp-modal-submit">Sign In</button>
    </form>
  )
}

/* ---------- page content data ---------- */

const STEPS = [
  'Create a pet profile',
  'Track mood and notes',
  'Review patterns in Wellness',
  'Ask AI Insight',
  'Explore Community and Places',
]

const FEATURES = [
  { title: 'Mood Check-in', text: "Record your pet's daily mood, mood strength, and quick notes.", accent: '#FF8F87' },
  { title: 'Wellness Calendar', text: 'Look back at saved entries and notice patterns over time.', accent: '#BFE3C8' },
  { title: 'AI Insight', text: "Ask simple wellness questions based on your pet's daily routine.", accent: '#D6C7F0' },
  { title: 'Community / Places', text: 'Explore pet groups, events, and dog-friendly places.', accent: '#FFE28A' },
  { title: 'Custom Mascot', text: 'Make the app feel personal with a mascot inspired by your pet.', accent: '#93C5E0' },
  { title: 'Smart Dog Tag', text: 'A future Comi Plus feature for QR/NFC profile sharing and tracking.', accent: '#5A91D6' },
]

const PLUS_ITEMS = [
  'Smart Dog Tag',
  'QR / NFC digital pet info card',
  'GPS tracking',
  'Movement tracking',
  'Sleep / rest estimates',
  'Advanced wellness alerts',
  'Lost pet support',
]

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState(null) // null | 'feedback' | 'waitlist' | 'signup' | 'signin'
  const [stats, setStats] = useState(computeStats)

  const refreshStats = () => setStats(computeStats())
  const openModal = (name) => { setMenuOpen(false); setModal(name) }
  const closeModal = () => setModal(null)
  const handleTryMvp = () => { bumpMvpTries(); refreshStats() }

  return (
    <div className="landing">
      <style>{CSS}</style>

      {/* ---------- Navbar ---------- */}
      <nav className="lp-nav">
        <div className="lp-nav-card">
          <div className="lp-brand-group">
            <span className="lp-brand-mark"><img src={CodyMascotHero} alt="" /></span>
            <span className="lp-brand">Comi</span>
          </div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#comi-plus">Comi Plus</a>
            <a href="#beta-results">Beta Results</a>
            <button type="button" className="lp-nav-link-btn" onClick={() => openModal('signin')}>Sign In</button>
            <button type="button" className="lp-nav-signup" onClick={() => openModal('signup')}>Sign Up</button>
            <a className="lp-nav-cta" href="#app" onClick={handleTryMvp}>Try the MVP</a>
          </div>
          <button className="lp-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen((v) => !v)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#223247" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="lp-mobile-menu">
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#comi-plus" onClick={() => setMenuOpen(false)}>Comi Plus</a>
            <a href="#beta-results" onClick={() => setMenuOpen(false)}>Beta Results</a>
            <button type="button" onClick={() => openModal('signin')}>Sign In</button>
            <button type="button" onClick={() => openModal('signup')}>Sign Up</button>
            <a href="#app" onClick={() => { handleTryMvp(); setMenuOpen(false) }}>Try the MVP</a>
          </div>
        )}
      </nav>

      {/* ---------- Hero ---------- */}
      <header className="lp-hero">
        <div className="lp-wrap">
          <div className="lp-hero-band">
            <div className="lp-hero-inner">
              <div className="lp-hero-copy">
                <h1 className="lp-title">Comi</h1>
                <p className="lp-headline">pet wellness app</p>
                <p className="lp-desc">Track your pet's mood, notes, wellness patterns, AI insights, and future Smart Dog Tag features in one friendly place.</p>
                <div className="lp-hero-actions">
                  <a className="lp-btn lp-btn-primary" href="#app" onClick={handleTryMvp}>Try the MVP</a>
                  <button type="button" className="lp-btn lp-btn-secondary" onClick={() => openModal('feedback')}>Give Feedback</button>
                  <button type="button" className="lp-btn lp-btn-secondary" onClick={() => openModal('waitlist')}>Join Waitlist</button>
                </div>
              </div>

              <div className="lp-hero-visual">
                <div className="lp-phone-stage">
                  <div className="lp-phone-frame">
                    <div className="lp-phone-speaker" />
                    <img src={AppMockupScreenshot} alt="Comi app home screen showing a mood check-in for a dog named Cody" />
                  </div>
                  <div className="lp-badge-circle">
                    <p>I can<br />finally<br />understand<br />my dog.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Problem / core value ---------- */}
      <section className="lp-problem">
        <div className="lp-wrap">
          <div className="lp-problem-card">
            <h2>Pet owners notice changes, but do not always know what they mean.</h2>
            <p>A shift in mood, appetite, sleep, or behaviour could be nothing — or it could be the start of a pattern. Comi helps owners track small changes before they forget them.</p>
            <p className="lp-problem-line">Comi helps you see the full picture.</p>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works">
        <div className="lp-wrap">
          <div className="lp-section-head">
            <span className="lp-tag">How Comi works</span>
            <h2>A simple daily flow</h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((label, i) => (
              <div className="lp-step-card" key={label}>
                <div className="lp-step-num">{i + 1}</div>
                <h3>{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section id="features">
        <div className="lp-wrap">
          <div className="lp-section-head">
            <span className="lp-tag">Features</span>
            <h2>Everything a pet parent needs day to day</h2>
          </div>
          <div className="lp-features">
            {FEATURES.map((f) => (
              <div className="lp-feature-card" key={f.title} style={{ borderTopColor: f.accent }}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Comi Plus ---------- */}
      <section id="comi-plus" className="lp-plus-section">
        <div className="lp-wrap">
          <div className="lp-plus-card">
            <span className="lp-plus-badge">Future premium concept</span>
            <h2>Comi Plus Smart Dog Tag</h2>
            <p className="lp-plus-desc">Comi Plus is a future premium concept built around a Smart Dog Tag. In the MVP, the hardware is simulated, but the feature shows how Comi could connect digital wellness tracking with real pet safety.</p>
            <ul className="lp-plus-list">
              {PLUS_ITEMS.map((item) => (
                <li key={item}><span className="lp-check">✓</span>{item}</li>
              ))}
            </ul>
            <button type="button" className="lp-btn lp-btn-primary" onClick={() => openModal('waitlist')}>Join Comi Plus Waitlist</button>
            <p className="lp-plus-note">Joining the waitlist reserves your spot for updates — it does not charge you.</p>
          </div>
        </div>
      </section>

      {/* ---------- Beta results ---------- */}
      <section id="beta-results">
        <div className="lp-wrap">
          <div className="lp-beta-card">
            <div className="lp-section-head">
              <h2>Beta Launch Results</h2>
              <p>These numbers can be updated after sharing the MVP with real users.</p>
            </div>
            <div className="lp-stats">
              <div className="lp-stat-card"><div className="lp-num">{stats.feedbackResponses}</div><div className="lp-label">Feedback responses</div></div>
              <div className="lp-stat-card"><div className="lp-num">{stats.waitlistSignups}</div><div className="lp-label">Waitlist sign-ups</div></div>
              <div className="lp-stat-card"><div className="lp-num">{stats.comiPlusInterested}</div><div className="lp-label">Interested in Comi Plus</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section>
        <div className="lp-wrap">
          <div className="lp-final-cta">
            <h2>Help shape Comi</h2>
            <p>Comi is currently a public beta MVP. Try the product, share feedback, or join the Comi Plus waitlist to support the next version.</p>
            <div className="lp-hero-actions lp-final-actions">
              <a className="lp-btn lp-btn-primary" href="#app" onClick={handleTryMvp}>Try the MVP</a>
              <button type="button" className="lp-btn lp-btn-secondary" onClick={() => openModal('feedback')}>Give Feedback</button>
              <button type="button" className="lp-btn lp-btn-secondary" onClick={() => openModal('waitlist')}>Join Waitlist</button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer>
        <div className="lp-wrap">
          <div className="lp-brand-group" style={{ justifyContent: 'center' }}>
            <span className="lp-brand-mark"><img src={CodyMascotHero} alt="" /></span>
            <span className="lp-brand">Comi</span>
          </div>
          <div className="lp-foot-links">
            <a href="#app" onClick={handleTryMvp}>Try MVP</a>
            <button type="button" onClick={() => openModal('feedback')}>Feedback</button>
            <button type="button" onClick={() => openModal('waitlist')}>Waitlist</button>
          </div>
          <p className="lp-foot-note">MVP prototype</p>
        </div>
      </footer>

      {modal === 'feedback' && (
        <Modal onClose={closeModal}><FeedbackForm onSubmitted={refreshStats} onClose={closeModal} /></Modal>
      )}
      {modal === 'waitlist' && (
        <Modal onClose={closeModal}><WaitlistForm onSubmitted={refreshStats} onClose={closeModal} /></Modal>
      )}
      {modal === 'signup' && (
        <Modal onClose={closeModal}><SignUpForm onSubmitted={refreshStats} onClose={closeModal} /></Modal>
      )}
      {modal === 'signin' && (
        <Modal onClose={closeModal}><SignInForm onClose={closeModal} /></Modal>
      )}
    </div>
  )
}

const CSS = `
.landing{
  --blue:#5A91D6; --blue-deep:#4677AC; --page:#EEF7FF; --card:#FFFFFF; --border:#BFDDF6;
  --navy:#223247; --muted:#6F8294; --yellow:#FFE28A; --heart:#FF8F87;
  --radius-lg:26px; --radius-md:18px;
  --shadow: 0 12px 32px rgba(50,90,150,0.22);
  font-family:'Nunito',sans-serif; color:var(--navy);
  background-color: var(--page);
  background-image: linear-gradient(rgba(255,255,255,0.76), rgba(255,255,255,0.76)), url(${LandingBackground});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  width:100%; min-height:100dvh;
}
.landing *{ box-sizing:border-box; }
.landing h1,.landing h2,.landing h3,.landing .lp-brand{ font-family:'Quicksand',sans-serif; font-weight:800; margin:0; }
.landing p{ margin:0; line-height:1.6; }
.landing a{ text-decoration:none; color:inherit; }
.landing img{ max-width:100%; display:block; }
.landing button{ font-family:inherit; }
.lp-wrap{ max-width:1140px; margin:0 auto; padding:0 20px; position:relative; }
.landing section{ padding:56px 0; position:relative; }

/* ---------- navbar ---------- */
.lp-nav{ position:sticky; top:0; z-index:50; padding-top:18px; }
.lp-nav-card{
  max-width:1140px; margin:0 auto; background:#fff; border-radius:32px;
  box-shadow:0 12px 34px rgba(90,142,200,0.18); padding:14px 16px 14px 20px;
  display:flex; align-items:center; justify-content:space-between;
}
.lp-brand-group{ display:flex; align-items:center; gap:10px; }
.lp-brand-mark{ width:38px; height:38px; border-radius:50%; background:#DDEFFF; display:grid; place-items:center; flex-shrink:0; overflow:hidden; border:2px solid #fff; box-shadow:0 2px 8px rgba(90,142,200,0.3); }
.lp-brand-mark img{ width:34px; height:34px; object-fit:contain; }
.lp-brand{ font-size:20px; color:var(--blue-deep); letter-spacing:0.01em; }
.lp-nav-links{ display:flex; gap:4px; align-items:center; }
.lp-nav-links a:not(.lp-nav-cta), .lp-nav-links .lp-nav-link-btn{
  font-weight:700; font-size:14px; color:var(--navy); padding:10px 14px; border-radius:999px;
  transition:background .15s ease; background:none; border:none; cursor:pointer; font-family:inherit;
}
.lp-nav-links a:not(.lp-nav-cta):hover, .lp-nav-links .lp-nav-link-btn:hover{ background:var(--page); }
.lp-nav-signup{
  background:var(--page); color:var(--blue-deep); border:1.5px solid var(--border); font-weight:700;
  font-size:14px; padding:9px 16px; border-radius:999px; cursor:pointer; font-family:inherit; margin-left:2px;
}
.lp-nav-cta{ background:var(--blue); color:#fff !important; padding:11px 20px !important; border-radius:999px; margin-left:6px; box-shadow:0 6px 16px rgba(90,142,200,0.32); }
.lp-menu-btn{ display:none; background:var(--page); border:none; cursor:pointer; padding:8px; border-radius:999px; }
.lp-mobile-menu{ display:flex; flex-direction:column; background:#fff; border-radius:24px; margin:8px 20px 0; box-shadow:0 12px 30px rgba(90,142,200,0.16); overflow:hidden; max-width:1100px; margin-left:auto; margin-right:auto; }
.lp-mobile-menu a, .lp-mobile-menu button{
  padding:15px 22px; font-weight:700; color:var(--navy); border-bottom:1px solid var(--border); font-size:15px;
  background:none; border-left:none; border-right:none; border-top:none; text-align:left; cursor:pointer; font-family:inherit;
}
.lp-mobile-menu a:last-child, .lp-mobile-menu button:last-child{ border-bottom:none; color:var(--blue-deep); }
@media (max-width:900px){ .lp-nav-links{ display:none; } .lp-menu-btn{ display:block; } }

/* ---------- buttons ---------- */
.lp-btn{ display:inline-flex; align-items:center; justify-content:center; padding:15px 26px; border-radius:999px; font-family:'Quicksand',sans-serif; font-weight:700; font-size:15.5px; cursor:pointer; border:none; text-align:center; transition:transform .15s ease, box-shadow .15s ease; }
.lp-btn:hover{ transform:translateY(-2px); }
.lp-btn-primary{ background:var(--blue); color:#fff; box-shadow:0 10px 22px rgba(90,142,200,0.35); }
.lp-btn-secondary{ background:#fff; color:var(--blue-deep); border:2px solid var(--border); }
.lp-hero-actions{ display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }
.lp-hero-actions .lp-btn{ padding:13px 22px; font-size:14.5px; }
@media (max-width:600px){ .lp-hero-actions .lp-btn{ flex:1 1 100%; } }

/* ---------- hero ---------- */
.lp-hero{ padding-top:26px; padding-bottom:0; overflow:visible; position:relative; }
.lp-hero-band{
  background:linear-gradient(135deg, #6FA3DC 0%, #5A91D6 55%, #4677AC 100%);
  border-radius:40px; box-shadow:0 30px 60px rgba(70,119,172,0.32);
  padding:48px 44px; overflow:visible; position:relative;
}
.lp-hero-inner{ display:grid; grid-template-columns:0.95fr 1fr; gap:8px; align-items:center; position:relative; }
.lp-title{ font-size:88px; color:#fff; line-height:1; margin-top:0; }
.lp-headline{ font-size:25px; font-weight:800; font-family:'Quicksand',sans-serif; color:#fff; margin-top:16px; line-height:1.3; max-width:430px; }
.lp-desc{ font-size:15.5px; color:rgba(255,255,255,0.82); margin-top:10px; max-width:420px; line-height:1.55; }

.lp-hero-band .lp-btn-primary{ background:#fff; color:var(--blue-deep); }
.lp-hero-band .lp-btn-secondary{ background:rgba(255,255,255,0.12); color:#fff; border:2px solid rgba(255,255,255,0.55); }

.lp-hero-visual{ position:relative; }
.lp-phone-stage{ position:relative; display:grid; place-items:center; padding:12px; overflow:visible; }
.lp-phone-frame{ position:relative; z-index:1; width:242px; background:#15202B; border-radius:36px; padding:10px; box-shadow:0 22px 46px rgba(10,25,45,0.38); }
.lp-phone-speaker{ position:absolute; top:10px; left:50%; transform:translateX(-50%); width:54px; height:5px; border-radius:3px; background:#0B121A; z-index:2; }
.lp-phone-frame img{ border-radius:26px; width:100%; display:block; }

.lp-badge-circle{
  position:absolute; right:-2px; bottom:-6px; width:138px; height:138px; border-radius:50%;
  background:#fff; border:1px solid var(--border); box-shadow:0 14px 30px rgba(20,40,70,0.28);
  display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;
  padding:10px; z-index:4;
}
.lp-badge-circle p{ font-family:'Quicksand',sans-serif; font-weight:800; font-size:13.5px; color:var(--navy); line-height:1.3; }

@media (max-width:860px){
  .lp-hero-band{ padding:36px 26px; border-radius:32px; }
  .lp-hero-inner{ grid-template-columns:1fr; gap:0; }
  .lp-title{ font-size:60px; }
  .lp-headline{ max-width:100%; }
  .lp-desc{ max-width:100%; }
  .lp-badge-circle{ width:124px; height:124px; right:4px; bottom:-16px; }
  .lp-badge-circle p{ font-size:12.5px; }
}
@media (max-width:520px){
  .lp-hero-band{ padding:28px 20px; }
  .lp-title{ font-size:48px; }
  .lp-headline{ font-size:21px; }
  .lp-phone-frame{ width:220px; }
}

/* ---------- problem / core value ---------- */
.lp-problem{ padding-top:22px; }
.lp-problem-card{
  background:#fff; border:1px solid var(--border); border-radius:32px; padding:44px 32px;
  text-align:center; box-shadow:var(--shadow);
}
.lp-problem-card h2{ font-size:28px; color:var(--navy); max-width:660px; margin:0 auto; line-height:1.35; }
.lp-problem-card p{ color:var(--muted); font-size:15.5px; max-width:560px; margin:16px auto 0; }
.lp-problem-line{ color:var(--blue-deep) !important; font-weight:800 !important; font-family:'Quicksand',sans-serif; font-size:16.5px !important; margin-top:12px !important; }

.lp-section-head{ text-align:center; max-width:600px; margin:0 auto 40px; }
.lp-section-head .lp-tag{ color:var(--blue-deep); font-weight:800; font-size:13px; letter-spacing:0.08em; text-transform:uppercase; }
.lp-section-head h2{ font-size:32px; color:var(--navy); margin-top:8px; }
.lp-section-head p{ color:var(--muted); margin-top:12px; font-size:15.5px; }

.lp-steps{ display:grid; grid-template-columns:repeat(5,1fr); gap:18px; }
@media (max-width:860px){ .lp-steps{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:520px){ .lp-steps{ grid-template-columns:1fr; } }
.lp-step-card{ background:#fff; border:1px solid var(--border); border-radius:var(--radius-md); padding:22px 18px; box-shadow:var(--shadow); }
.lp-step-num{ width:34px; height:34px; border-radius:50%; background:var(--page); color:var(--blue-deep); display:grid; place-items:center; font-family:'Quicksand',sans-serif; font-weight:800; font-size:15px; margin-bottom:14px; }
.lp-step-card h3{ font-size:15.5px; color:var(--navy); font-weight:700; line-height:1.35; }

.lp-features{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
@media (max-width:860px){ .lp-features{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:560px){ .lp-features{ grid-template-columns:1fr; } }
.lp-feature-card{ background:#fff; border:1px solid var(--border); border-top:4px solid; border-radius:var(--radius-lg); padding:24px 22px; box-shadow:var(--shadow); transition:transform .15s ease, box-shadow .15s ease; }
.lp-feature-card:hover{ transform:translateY(-3px); box-shadow:0 16px 40px rgba(90,142,200,0.18); }
.lp-feature-card h3{ font-size:16.5px; color:var(--navy); margin-bottom:8px; }
.lp-feature-card p{ font-size:14px; color:var(--muted); }

/* ---------- comi plus ---------- */
.lp-plus-section{ padding-top:12px; }
.lp-plus-card{
  background:#DDEFFF; border:1px solid var(--border); border-radius:36px; padding:44px;
  text-align:center; max-width:760px; margin:0 auto; box-shadow:var(--shadow);
}
.lp-plus-badge{ display:inline-block; background:#fff; color:var(--blue-deep); font-weight:700; font-size:12.5px; padding:7px 16px; border-radius:999px; margin-bottom:16px; letter-spacing:0.03em; border:1px solid var(--border); }
.lp-plus-card h2{ font-size:28px; color:var(--navy); }
.lp-plus-desc{ color:var(--muted); margin-top:14px; font-size:15px; max-width:560px; margin-left:auto; margin-right:auto; }
.lp-plus-list{ list-style:none; margin:26px auto 0; padding:0; display:grid; width:fit-content; gap:12px; text-align:left; }
.lp-plus-list li{ display:flex; gap:10px; align-items:center; font-size:14.5px; color:var(--navy); font-weight:600; }
.lp-check{ color:var(--blue); font-weight:800; font-size:16px; width:20px; flex-shrink:0; }
.lp-plus-note{ margin-top:18px; font-size:12.5px; color:var(--muted); font-style:italic; }
.lp-plus-card .lp-btn{ margin-top:24px; }

/* ---------- beta results ---------- */
.lp-beta-card{ background:#EEF7FF; border:1px solid var(--border); border-radius:32px; padding:44px 32px; box-shadow:var(--shadow); }
.lp-stats{ display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
@media (max-width:860px){ .lp-stats{ grid-template-columns:1fr; } }
.lp-stat-card{ background:#fff; border:1px solid var(--border); border-radius:var(--radius-md); padding:22px 18px; text-align:center; box-shadow:var(--shadow); }
.lp-num{ font-family:'Quicksand',sans-serif; font-weight:800; font-size:28px; color:var(--blue); }
.lp-label{ font-size:12.5px; color:var(--navy); margin-top:6px; font-weight:700; }

/* ---------- final cta ---------- */
.lp-final-cta{
  background:#fff; border:1px solid var(--border); border-radius:32px; padding:48px 32px;
  text-align:center; box-shadow:var(--shadow);
}
.lp-final-cta h2{ font-size:30px; color:var(--navy); }
.lp-final-cta p{ color:var(--muted); font-size:15.5px; max-width:560px; margin:14px auto 0; }
.lp-final-actions{ justify-content:center; margin-top:26px; }

footer{ padding:36px 0 56px; text-align:center; }
footer p{ color:var(--muted); font-size:13px; margin-top:6px; }
.lp-foot-links{ margin-top:16px; display:flex; gap:18px; justify-content:center; flex-wrap:wrap; }
.lp-foot-links a, .lp-foot-links button{ font-weight:700; font-size:13px; color:var(--blue-deep); cursor:pointer; background:none; border:none; padding:0; font-family:inherit; }
.lp-foot-note{ margin-top:14px; }

/* ---------- modals ---------- */
.lp-modal-backdrop{
  position:fixed; inset:0; background:rgba(34,50,71,0.45); z-index:200;
  display:flex; align-items:center; justify-content:center; padding:20px;
}
.lp-modal-card{
  background:#fff; border-radius:28px; padding:32px 28px; width:100%; max-width:480px;
  max-height:88vh; overflow-y:auto; position:relative; box-shadow:0 30px 70px rgba(20,40,70,0.35);
}
.lp-modal-close{
  position:absolute; top:16px; right:16px; width:34px; height:34px; border-radius:50%;
  background:var(--page); border:none; cursor:pointer; font-size:20px; line-height:1; color:var(--muted);
  display:grid; place-items:center;
}
.lp-modal-form h3, .lp-modal-success h3{ font-family:'Quicksand',sans-serif; font-weight:800; font-size:22px; color:var(--navy); margin:0 0 8px; padding-right:30px; }
.lp-modal-sub{ color:var(--muted); font-size:14px; margin:0 0 22px; line-height:1.5; }
.lp-field{ display:block; margin-bottom:16px; }
.lp-field > span{ display:block; font-weight:700; font-size:13.5px; color:var(--navy); margin-bottom:6px; }
.lp-field input, .lp-field textarea{
  width:100%; padding:12px 14px; border-radius:14px; border:1.5px solid var(--border);
  background:var(--page); font-family:'Nunito',sans-serif; font-size:14.5px; color:var(--navy);
  outline:none; resize:vertical; transition:border-color .15s ease;
}
.lp-field input:focus, .lp-field textarea:focus{ border-color:var(--blue); }
.lp-choice-row{ display:flex; flex-wrap:wrap; gap:8px; }
.lp-choice{
  padding:9px 14px; border-radius:999px; border:1.5px solid var(--border); background:#fff;
  color:var(--navy); font-weight:700; font-size:13px; cursor:pointer; font-family:'Nunito',sans-serif;
}
.lp-choice-active{ background:var(--blue); border-color:var(--blue); color:#fff; }
.lp-modal-submit{ width:100%; margin-top:8px; }
.lp-modal-note{ text-align:center; font-size:12px; color:var(--muted); font-style:italic; margin-top:12px; }
.lp-modal-success{ text-align:center; padding:20px 0 4px; }
.lp-modal-success h3{ padding-right:0; margin-bottom:20px; }
.lp-modal-error{ color:#C0392B; font-size:13.5px; font-weight:700; margin:-6px 0 14px; }
@media (max-width:520px){ .lp-modal-card{ padding:26px 20px; border-radius:22px; } }
`
