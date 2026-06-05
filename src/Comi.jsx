import React, { useState } from "react";
import {
  PawPrint, Home, Activity, MessageCircle, MapPin, User,
  Heart, Bell, ChevronLeft, Plus, Send, Sparkles, Check,
  Camera, Smile, Moon, Zap, Droplets, Utensils, Footprints,
  Scissors, Search, Settings, Shield, ChevronRight, Star,
} from "lucide-react";

/* ============================================================
   COMI — Pet Wellness App Prototype
   "I can finally understand my pet."

   HOW THIS FILE IS ORGANIZED (easy to edit):
   1. theme        -> all colors, fonts, radii in one place
   2. data         -> starting sample data (pet, reminders, posts...)
   3. UI pieces    -> small reusable components (Card, Button, Chip...)
   4. Screens      -> one function per screen
   5. App          -> holds state + decides which screen to show
   ============================================================ */

/* ---------- 1. THEME (edit colors & style here) ---------- */
const theme = {
  sky: "#8AC6EC",      // primary brand blue
  ocean: "#4A90C2",    // deeper blue (buttons / active)
  mist: "#EAF4FB",     // soft pastel blue background
  cloud: "#FFFFFF",    // cards
  coral: "#FFB5A7",    // warm accent
  yellow: "#FFE08A",   // playful highlight
  mint: "#BFE3C8",     // calm / positive
  lilac: "#D6C7F0",    // soft extra accent
  ink: "#34414E",      // main text
  slate: "#7C8B98",    // secondary text
  line: "#E6EEF5",     // borders / dividers
  radius: 24,          // default card roundness
  shadow: "0 8px 24px rgba(74,144,194,0.12)",
};

/* ---------- 2. SAMPLE DATA ---------- */
const MOODS = [
  { key: "happy", label: "Happy", emoji: "😊", color: theme.yellow },
  { key: "playful", label: "Playful", emoji: "🎾", color: theme.coral },
  { key: "calm", label: "Calm", emoji: "😌", color: theme.mint },
  { key: "tired", label: "Tired", emoji: "😴", color: theme.sky },
  { key: "stressed", label: "Stressed", emoji: "😟", color: "#F6C6B8" },
  { key: "unusual", label: "Unusual", emoji: "❓", color: theme.lilac },
];

const BEHAVIORS = [
  { key: "eating", label: "Eating", icon: Utensils },
  { key: "sleeping", label: "Sleeping", icon: Moon },
  { key: "play", label: "Play", icon: Heart },
  { key: "energy", label: "Energy", icon: Zap },
  { key: "bathroom", label: "Bathroom", icon: Droplets },
  { key: "walks", label: "Walks", icon: Footprints },
];

const START_REMINDERS = [
  { id: 1, label: "Morning walk", time: "8:00 AM", icon: Footprints, on: true },
  { id: 2, label: "Breakfast", time: "8:30 AM", icon: Utensils, on: true },
  { id: 3, label: "Fresh water", time: "12:00 PM", icon: Droplets, on: true },
  { id: 4, label: "Brushing", time: "6:00 PM", icon: Scissors, on: false },
];

const START_POSTS = [
  { id: 1, who: "Mia & Luna 🐕", text: "Luna learned a new trick today! So proud 🥹", likes: 24, tag: "Moment", emoji: "🐩" },
  { id: 2, who: "Sam", text: "Any tips for a puppy that won't settle at night?", likes: 9, tag: "Question", emoji: "🐶" },
  { id: 3, who: "Ari & Mochi", text: "Found the cutest pet-friendly café downtown ☕", likes: 41, tag: "Moment", emoji: "🐱" },
];

const PLACES = [
  { name: "Riverside Dog Park", type: "Park", dist: "0.4 mi", emoji: "🌳", top: "22%", left: "30%" },
  { name: "Paws & Beans Café", type: "Café", dist: "0.8 mi", emoji: "☕", top: "55%", left: "62%" },
  { name: "Happy Tails Grooming", type: "Service", dist: "1.1 mi", emoji: "✂️", top: "70%", left: "25%" },
  { name: "Meadow Walking Trail", type: "Walk", dist: "1.3 mi", emoji: "🥾", top: "35%", left: "70%" },
];

const PERSONALITY_TAGS = ["Playful", "Shy", "Friendly", "Energetic", "Cuddly", "Curious", "Calm", "Bold"];

/* ---------- 3. REUSABLE UI PIECES ---------- */
function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.cloud,
        borderRadius: theme.radius,
        boxShadow: theme.shadow,
        padding: 18,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", style }) {
  const styles = {
    primary: { background: theme.ocean, color: "#fff", border: "none" },
    secondary: { background: "#fff", color: theme.ocean, border: `2px solid ${theme.sky}` },
    soft: { background: theme.mist, color: theme.ocean, border: "none" },
  };
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "15px 18px",
        borderRadius: 999,
        fontFamily: "Quicksand, sans-serif",
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
        transition: "transform .08s ease",
        ...styles[variant],
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function Chip({ label, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 16px",
        borderRadius: 999,
        border: active ? `2px solid ${theme.ocean}` : `2px solid ${theme.line}`,
        background: active ? (color || theme.sky) : "#fff",
        color: active ? theme.ink : theme.slate,
        fontFamily: "Nunito, sans-serif",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0 14px" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ background: "#fff", border: "none", borderRadius: 999, width: 38, height: 38, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: theme.shadow }}
        >
          <ChevronLeft size={20} color={theme.ocean} />
        </button>
      )}
      <h2 style={{ flex: 1, fontFamily: "Quicksand", fontWeight: 700, fontSize: 20, color: theme.ink, margin: 0 }}>{title}</h2>
      {right}
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 2px 10px" }}>
      <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink }}>{children}</span>
      {action}
    </div>
  );
}

function Mascot({ size = 64 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: theme.sky, display: "grid", placeItems: "center", fontSize: size * 0.55, boxShadow: "0 6px 14px rgba(74,144,194,0.25)" }}>
      🐶
    </div>
  );
}

/* ---------- 4. SCREENS ---------- */

// 1. Welcome
function Welcome({ go }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: 28, gap: 18 }}>
      <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 64, boxShadow: theme.shadow }}>🐶</div>
      <h1 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 34, color: theme.ocean, margin: 0 }}>Comi</h1>
      <p style={{ fontFamily: "Nunito", fontSize: 19, color: theme.ink, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
        "I can finally understand my pet."
      </p>
      <p style={{ fontFamily: "Nunito", fontSize: 15, color: theme.slate, maxWidth: 280, lineHeight: 1.5 }}>
        Track moods, notice patterns, and understand your pet's daily wellness — the friendly way.
      </p>
      <div style={{ width: "100%", marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        <Button onClick={() => go("auth")}>Get started 🐾</Button>
        <Button variant="soft" onClick={() => go("auth")}>I already have an account</Button>
      </div>
    </div>
  );
}

// 2. Sign Up / Log In
function Auth({ go }) {
  const [mode, setMode] = useState("signup");
  return (
    <div style={{ minHeight: "100%", padding: 24, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <Mascot />
        <h2 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 24, color: theme.ink, marginTop: 12 }}>
          {mode === "signup" ? "Welcome to Comi" : "Welcome back!"}
        </h2>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Chip label="Sign Up" active={mode === "signup"} onClick={() => setMode("signup")} />
        <Chip label="Log In" active={mode === "login"} onClick={() => setMode("login")} />
      </div>
      <Field placeholder="Your name" />
      <Field placeholder="Email" />
      <Field placeholder="Password" type="password" />
      <Button onClick={() => go("setup")}>{mode === "signup" ? "Create account" : "Log in"}</Button>
      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 13, color: theme.slate }}>
        Continue with Google or Apple
      </p>
    </div>
  );
}

function Field({ placeholder, type = "text", value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "14px 16px", borderRadius: 16, border: `2px solid ${theme.line}`,
        fontFamily: "Nunito", fontSize: 15, color: theme.ink, outline: "none", background: "#fff", boxSizing: "border-box",
      }}
    />
  );
}

// 3. Pet Profile Setup
function Setup({ go, pet, setPet }) {
  const togglePersonality = (tag) => {
    setPet((p) => ({
      ...p,
      personality: p.personality.includes(tag)
        ? p.personality.filter((t) => t !== tag)
        : [...p.personality, tag],
    }));
  };
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Add your pet" onBack={() => go("auth")} />
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 20px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: theme.mist, display: "grid", placeItems: "center", fontSize: 44, border: `3px solid #fff`, boxShadow: theme.shadow }}>
            {pet.emoji}
          </div>
          <div style={{ position: "absolute", bottom: 0, right: 0, background: theme.ocean, borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center" }}>
            <Camera size={16} color="#fff" />
          </div>
        </div>
      </div>

      <label style={labelStyle}>Pet's name</label>
      <Field placeholder="e.g. Cody" value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} />
      <div style={{ height: 12 }} />
      <label style={labelStyle}>Type / breed</label>
      <Field placeholder="e.g. Golden Retriever" value={pet.breed} onChange={(e) => setPet({ ...pet, breed: e.target.value })} />
      <div style={{ height: 12 }} />
      <label style={labelStyle}>Age</label>
      <Field placeholder="e.g. 2 years" value={pet.age} onChange={(e) => setPet({ ...pet, age: e.target.value })} />
      <div style={{ height: 16 }} />
      <label style={labelStyle}>Personality</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        {PERSONALITY_TAGS.map((t) => (
          <Chip key={t} label={t} active={pet.personality.includes(t)} color={theme.coral} onClick={() => togglePersonality(t)} />
        ))}
      </div>
      <div style={{ height: 26 }} />
      <Button onClick={() => go("home")}>Create profile 🐾</Button>
    </div>
  );
}
const labelStyle = { fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, display: "block", marginBottom: 6 };

// 4. Home Dashboard
function HomeScreen({ go, pet, todayMood, reminders }) {
  const mood = MOODS.find((m) => m.key === todayMood);
  return (
    <div style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <p style={{ fontFamily: "Nunito", color: theme.slate, fontSize: 14, margin: 0 }}>Good morning 🌤️</p>
          <h2 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 22, color: theme.ink, margin: 0 }}>{pet.name} & you</h2>
        </div>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: theme.sky, display: "grid", placeItems: "center", fontSize: 26 }}>{pet.emoji}</div>
      </div>

      {/* Today's mood */}
      <Card style={{ background: mood ? mood.color : theme.cloud, marginBottom: 16 }} onClick={() => go("mood")}>
        {mood ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 40 }}>{mood.emoji}</span>
            <div>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: 0, opacity: 0.7 }}>Today {pet.name} seems</p>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 22, color: theme.ink, margin: 0 }}>{mood.label}</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: 0 }}>How's {pet.name} today?</p>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: "4px 0 0" }}>Tap to check in 🐾</p>
            </div>
            <div style={{ background: theme.ocean, borderRadius: 999, padding: 10 }}><Smile size={22} color="#fff" /></div>
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <QuickAction icon={Activity} label="Track behavior" onClick={() => go("behavior")} bg={theme.mint} />
        <QuickAction icon={Sparkles} label="AI insights" onClick={() => go("ai")} bg={theme.lilac} />
      </div>

      {/* Wellness summary */}
      <SectionTitle action={<Tap onClick={() => go("insights")}>See all</Tap>}>This week</SectionTitle>
      <Card style={{ marginBottom: 18 }} onClick={() => go("insights")}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: theme.mist, borderRadius: 16, padding: 10 }}><Activity size={22} color={theme.ocean} /></div>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: 0, lineHeight: 1.4 }}>
            <b>{pet.name} has been a little calmer this week.</b> Sleep looks steady. Nice and balanced! 💙
          </p>
        </div>
      </Card>

      {/* Today's reminders */}
      <SectionTitle action={<Tap onClick={() => go("reminders")}>All</Tap>}>Today's reminders</SectionTitle>
      <Card>
        {reminders.filter((r) => r.on).slice(0, 3).map((r, i, arr) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : "none" }}>
            <div style={{ background: theme.mist, borderRadius: 12, padding: 8 }}><r.icon size={18} color={theme.ocean} /></div>
            <span style={{ flex: 1, fontFamily: "Nunito", fontWeight: 600, color: theme.ink, fontSize: 15 }}>{r.label}</span>
            <span style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate }}>{r.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, bg }) {
  return (
    <button onClick={onClick} style={{ background: bg, border: "none", borderRadius: 20, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, textAlign: "left", boxShadow: theme.shadow }}>
      <Icon size={24} color={theme.ink} />
      <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink }}>{label}</span>
    </button>
  );
}
function Tap({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", color: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{children}</button>;
}

// 5. Daily Mood Check-In
function MoodScreen({ go, pet, setTodayMood }) {
  const [picked, setPicked] = useState(null);
  const [note, setNote] = useState("");
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Mood check-in" onBack={() => go("home")} />
      <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 20, color: theme.ink, textAlign: "center", margin: "10px 0 4px" }}>
        How does {pet.name} seem today?
      </p>
      <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, textAlign: "center", marginBottom: 20 }}>Pick what feels closest 🐾</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {MOODS.map((m) => (
          <button key={m.key} onClick={() => setPicked(m.key)}
            style={{
              background: picked === m.key ? m.color : "#fff",
              border: picked === m.key ? `2px solid ${theme.ocean}` : `2px solid ${theme.line}`,
              borderRadius: 20, padding: "16px 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
            <span style={{ fontSize: 30 }}>{m.emoji}</span>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink }}>{m.label}</span>
          </button>
        ))}
      </div>

      <div style={{ height: 20 }} />
      <label style={labelStyle}>Anything you noticed? (optional)</label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Extra cuddly after the walk"
        style={{ width: "100%", padding: 14, borderRadius: 16, border: `2px solid ${theme.line}`, fontFamily: "Nunito", fontSize: 14, color: theme.ink, outline: "none", resize: "none", height: 80, boxSizing: "border-box" }} />

      <div style={{ height: 18 }} />
      <Button onClick={() => { if (picked) { setTodayMood(picked); go("home"); } }} style={{ opacity: picked ? 1 : 0.5 }}>
        Save today's mood
      </Button>
    </div>
  );
}

// 6. Behavior & Routine Tracker
function BehaviorScreen({ go, pet }) {
  const [levels, setLevels] = useState({});
  const LEVELS = ["Less", "Normal", "More"];
  const set = (k, v) => setLevels((s) => ({ ...s, [k]: v }));
  const done = Object.keys(levels).length;
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Track behavior" onBack={() => go("home")} />
      <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, marginBottom: 6 }}>
        {done} of {BEHAVIORS.length} tracked today
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        {BEHAVIORS.map((b) => (
          <Card key={b.key} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ background: theme.mist, borderRadius: 14, padding: 9 }}><b.icon size={20} color={theme.ocean} /></div>
              <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink }}>{b.label}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {LEVELS.map((lv) => (
                <button key={lv} onClick={() => set(b.key, lv)}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer",
                    border: levels[b.key] === lv ? `2px solid ${theme.ocean}` : `2px solid ${theme.line}`,
                    background: levels[b.key] === lv ? theme.sky : "#fff",
                    fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink,
                  }}>
                  {lv}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <Button onClick={() => go("home")}>Log today's behavior</Button>
    </div>
  );
}

// 7. Wellness Insights
function InsightsScreen({ go, pet }) {
  const [range, setRange] = useState("Week");
  const weekDots = ["happy", "playful", "calm", "tired", "tired", "calm", "happy"];
  const sleepBars = [50, 60, 70, 80, 75, 65, 60];
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Wellness insights" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Chip label="Week" active={range === "Week"} onClick={() => setRange("Week")} />
        <Chip label="Month" active={range === "Month"} onClick={() => setRange("Month")} />
      </div>

      <Card style={{ background: theme.mint, marginBottom: 14 }}>
        <p style={{ fontFamily: "Nunito", fontSize: 15, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
          😴 <b>{pet.name} has been more tired this week.</b> You may want to keep an eye on his rest and energy.
        </p>
      </Card>
      <Card style={{ background: theme.coral, marginBottom: 18 }}>
        <p style={{ fontFamily: "Nunito", fontSize: 15, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
          🎾 <b>Playtime is a little lower than usual.</b> A short play session might lift his mood!
        </p>
      </Card>

      <SectionTitle>Mood this week</SectionTitle>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDots.map((mk, i) => {
            const m = MOODS.find((x) => x.key === mk);
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: m.color, display: "grid", placeItems: "center", fontSize: 15, margin: "0 auto" }}>{m.emoji}</div>
                <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <SectionTitle>Sleep pattern</SectionTitle>
      <Card>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 90, gap: 6 }}>
          {sleepBars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: "100%", height: h, background: theme.sky, borderRadius: 10 }} />
              <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate }}>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </Card>
      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        Comi helps you notice patterns. It does not replace your vet. 💙
      </p>
    </div>
  );
}

// 8. AI Pet Insights (chat style)
function AiScreen({ go, pet }) {
  const [messages, setMessages] = useState([
    { from: "comi", text: `Hi! I'm Comi 🐶 Ask me anything about ${pet.name}'s daily care, mood, or routines.` },
  ]);
  const [input, setInput] = useState("");

  const reply = (text) => {
    const t = text.toLowerCase();
    let r = `That's a great question! I can help you notice patterns and understand ${pet.name} better. For anything health-related, your vet is always the best person to ask. 💙`;
    if (t.includes("eat") || t.includes("food")) r = `If ${pet.name} is eating a little less, try keeping meals at the same time each day and notice if it continues. You may want to monitor this — and contact your vet if it lasts more than a couple of days. 🐾`;
    else if (t.includes("sleep") || t.includes("tired")) r = `Pets often rest more after busy or warm days. Keep an eye on ${pet.name}'s energy over the week. If the tiredness keeps growing, consider checking in with your vet. 😴`;
    else if (t.includes("play") || t.includes("walk")) r = `A short walk or a new toy can do wonders for mood! Try a 10-minute play session and notice how ${pet.name} responds. 🎾`;
    else if (t.includes("water") || t.includes("drink")) r = `Fresh water always helps! Refill the bowl a couple of times a day. If you notice big changes in drinking, it's worth mentioning to your vet. 💧`;
    return r;
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: "me", text: input };
    const comiMsg = { from: "comi", text: reply(input) };
    setMessages((m) => [...m, userMsg, comiMsg]);
    setInput("");
  };

  const suggestions = ["Why is he tired?", "Eating tips", "Fun play ideas"];

  return (
    <div style={{ padding: 22, display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title="Comi AI" onBack={() => go("home")} />
      <div style={{ background: theme.yellow, borderRadius: 14, padding: "8px 12px", marginBottom: 12 }}>
        <p style={{ fontFamily: "Nunito", fontSize: 11.5, color: theme.ink, margin: 0, lineHeight: 1.4 }}>
          ⚠️ Comi gives friendly everyday guidance, not medical advice. For health concerns, please contact your vet.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
            <div style={{
              background: m.from === "me" ? theme.ocean : "#fff",
              color: m.from === "me" ? "#fff" : theme.ink,
              padding: "11px 14px", borderRadius: 18,
              borderBottomRightRadius: m.from === "me" ? 4 : 18,
              borderBottomLeftRadius: m.from === "me" ? 18 : 4,
              fontFamily: "Nunito", fontSize: 14, lineHeight: 1.45, boxShadow: theme.shadow,
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 0" }}>
        {suggestions.map((s) => (
          <Chip key={s} label={s} onClick={() => { setInput(s); }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Comi something..."
          style={{ flex: 1, padding: "13px 16px", borderRadius: 999, border: `2px solid ${theme.line}`, fontFamily: "Nunito", fontSize: 14, outline: "none", color: theme.ink }} />
        <button onClick={send} style={{ background: theme.ocean, border: "none", borderRadius: "50%", width: 46, height: 46, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
          <Send size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// 9. Reminders
function RemindersScreen({ go, reminders, setReminders }) {
  const toggle = (id) => setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Care reminders" onBack={() => go("home")} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reminders.map((r) => (
          <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16 }}>
            <div style={{ background: theme.mist, borderRadius: 14, padding: 10 }}><r.icon size={20} color={theme.ocean} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>{r.label}</p>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0 }}>{r.time}</p>
            </div>
            <Toggle on={r.on} onClick={() => toggle(r.id)} />
          </Card>
        ))}
      </div>
      <div style={{ height: 18 }} />
      <Button variant="secondary" onClick={() => {}}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Plus size={18} /> Add reminder</span>
      </Button>
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 48, height: 28, borderRadius: 999, border: "none", background: on ? theme.ocean : theme.line, position: "relative", cursor: "pointer", transition: "background .2s" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
    </button>
  );
}

// 10. Community
function CommunityScreen({ posts, setPosts }) {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? posts : posts.filter((p) => p.tag === filter);
  const like = (id) => setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="The Comi pack 🐾" />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["All", "Moment", "Question"].map((f) => (
          <Chip key={f} label={f === "All" ? "All" : f + "s"} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {shown.map((p) => (
          <Card key={p.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.mist, display: "grid", placeItems: "center", fontSize: 20 }}>{p.emoji}</div>
              <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink }}>{p.who}</span>
              <span style={{ marginLeft: "auto", fontFamily: "Nunito", fontSize: 11, color: theme.ocean, background: theme.mist, padding: "3px 10px", borderRadius: 999, fontWeight: 700 }}>{p.tag}</span>
            </div>
            <p style={{ fontFamily: "Nunito", fontSize: 14.5, color: theme.ink, margin: "0 0 10px", lineHeight: 1.45 }}>{p.text}</p>
            <button onClick={() => like(p.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, color: theme.coral, fontFamily: "Nunito", fontWeight: 700, fontSize: 13 }}>
              <Heart size={16} fill={theme.coral} color={theme.coral} /> {p.likes}
            </button>
          </Card>
        ))}
      </div>
      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 12, color: theme.slate, marginTop: 16 }}>Be kind — we're all learning 💙</p>
    </div>
  );
}

// 11. Map / Explore
function ExploreScreen() {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? PLACES : PLACES.filter((p) => p.type === filter);
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Explore together" />
      <div style={{ position: "relative", width: "100%", height: 200, borderRadius: 22, overflow: "hidden", background: "linear-gradient(160deg,#DCEEFB,#CDE7D6)", boxShadow: theme.shadow, marginBottom: 14 }}>
        {/* simple map-style decoration */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
          <div style={{ position: "absolute", top: "40%", left: 0, right: 0, height: 8, background: "#fff" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "45%", width: 8, background: "#fff" }} />
        </div>
        {shown.map((p, i) => (
          <div key={i} style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ background: "#fff", borderRadius: "50%", width: 38, height: 38, display: "grid", placeItems: "center", fontSize: 18, boxShadow: theme.shadow, border: `2px solid ${theme.ocean}` }}>{p.emoji}</div>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "#fff", borderRadius: 999, padding: "6px 12px", fontFamily: "Nunito", fontSize: 12, fontWeight: 700, color: theme.ocean, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPin size={14} /> Near Burnaby
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
        {["All", "Park", "Walk", "Café", "Service"].map((f) => (
          <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {shown.map((p, i) => (
          <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: theme.mist, display: "grid", placeItems: "center", fontSize: 22 }}>{p.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>{p.name}</p>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0 }}>{p.type} · {p.dist}</p>
            </div>
            <ChevronRight size={20} color={theme.slate} />
          </Card>
        ))}
      </div>
    </div>
  );
}

// 12. Profile / Settings
function ProfileScreen({ pet }) {
  const [notif, setNotif] = useState(true);
  const [weekly, setWeekly] = useState(true);
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Profile" />
      <Card style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: theme.sky, display: "grid", placeItems: "center", fontSize: 40, margin: "0 auto 10px" }}>{pet.emoji}</div>
        <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 20, color: theme.ink, margin: 0 }}>{pet.name}</p>
        <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "2px 0 10px" }}>{pet.breed} · {pet.age}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {pet.personality.map((t) => (
            <span key={t} style={{ background: theme.coral, color: theme.ink, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, padding: "4px 12px", borderRadius: 999 }}>{t}</span>
          ))}
        </div>
      </Card>

      <SectionTitle>Wellness preferences</SectionTitle>
      <Card style={{ marginBottom: 18 }}>
        <Row icon={Bell} label="Reminder notifications"><Toggle on={notif} onClick={() => setNotif(!notif)} /></Row>
        <Divider />
        <Row icon={Activity} label="Weekly wellness summary"><Toggle on={weekly} onClick={() => setWeekly(!weekly)} /></Row>
      </Card>

      <SectionTitle>App</SectionTitle>
      <Card>
        <Row icon={User} label="Edit pet profile"><ChevronRight size={18} color={theme.slate} /></Row>
        <Divider />
        <Row icon={Shield} label="Privacy & data"><ChevronRight size={18} color={theme.slate} /></Row>
        <Divider />
        <Row icon={Settings} label="Settings"><ChevronRight size={18} color={theme.slate} /></Row>
      </Card>
      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 12, color: theme.slate, marginTop: 16 }}>Comi · a friendly pet wellness companion 🐾</p>
    </div>
  );
}
function Row({ icon: Icon, label, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <div style={{ background: theme.mist, borderRadius: 12, padding: 8 }}><Icon size={18} color={theme.ocean} /></div>
      <span style={{ flex: 1, fontFamily: "Nunito", fontWeight: 600, fontSize: 15, color: theme.ink }}>{label}</span>
      {children}
    </div>
  );
}
function Divider() { return <div style={{ height: 1, background: theme.line, margin: "4px 0" }} />; }

/* ---------- BOTTOM NAVIGATION ---------- */
function BottomNav({ active, go }) {
  const tabs = [
    { key: "home", icon: Home, label: "Home" },
    { key: "insights", icon: Activity, label: "Insights" },
    { key: "community", icon: MessageCircle, label: "Community" },
    { key: "explore", icon: MapPin, label: "Explore" },
    { key: "profile", icon: User, label: "Profile" },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px 14px", background: "#fff", borderTop: `1px solid ${theme.line}`, flexShrink: 0 }}>
      {tabs.map((t) => {
        const on = active === t.key;
        return (
          <button key={t.key} onClick={() => go(t.key)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 4px" }}>
            <t.icon size={22} color={on ? theme.ocean : theme.slate} fill={on ? theme.sky : "none"} />
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: on ? theme.ocean : theme.slate }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 5. APP (state + screen switcher) ---------- */
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [pet, setPet] = useState({ name: "Cody", breed: "Golden Retriever", age: "2 years", personality: ["Playful", "Friendly"], emoji: "🐶" });
  const [todayMood, setTodayMood] = useState(null);
  const [reminders, setReminders] = useState(START_REMINDERS);
  const [posts, setPosts] = useState(START_POSTS);

  const go = (s) => setScreen(s);
  const TAB_SCREENS = ["home", "insights", "community", "explore", "profile"];
  const showNav = TAB_SCREENS.includes(screen);

  const render = () => {
    switch (screen) {
      case "welcome": return <Welcome go={go} />;
      case "auth": return <Auth go={go} />;
      case "setup": return <Setup go={go} pet={pet} setPet={setPet} />;
      case "home": return <HomeScreen go={go} pet={pet} todayMood={todayMood} reminders={reminders} />;
      case "mood": return <MoodScreen go={go} pet={pet} setTodayMood={setTodayMood} />;
      case "behavior": return <BehaviorScreen go={go} pet={pet} />;
      case "insights": return <InsightsScreen go={go} pet={pet} />;
      case "ai": return <AiScreen go={go} pet={pet} />;
      case "reminders": return <RemindersScreen go={go} reminders={reminders} setReminders={setReminders} />;
      case "community": return <CommunityScreen posts={posts} setPosts={setPosts} />;
      case "explore": return <ExploreScreen />;
      case "profile": return <ProfileScreen pet={pet} />;
      default: return <Welcome go={go} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#D8EAF8,#EAF4FB)", display: "flex", justifyContent: "center", alignItems: "center", padding: 16, fontFamily: "Nunito, sans-serif" }}>
      {/* load friendly rounded fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }`}</style>

      {/* phone frame */}
      <div style={{ width: 390, maxWidth: "100%", height: 800, maxHeight: "92vh", background: theme.mist, borderRadius: 40, overflow: "hidden", boxShadow: "0 24px 60px rgba(74,144,194,0.25)", display: "flex", flexDirection: "column", border: "10px solid #fff", position: "relative" }}>
        {/* faux status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 22px 4px", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, color: theme.ink, flexShrink: 0 }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}><PawPrint size={14} color={theme.ocean} /> Comi</span>
        </div>
        {/* scrollable screen content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {render()}
        </div>
        {/* bottom nav (only on main tabs) */}
        {showNav && <BottomNav active={screen} go={go} />}
      </div>
    </div>
  );
}
