import React, { useState, useEffect } from "react";
import {
  PawPrint, Home, Activity, MessageCircle, MapPin, User,
  Heart, Bell, ChevronLeft, Plus, Send, Sparkles, Check, ChevronDown,
  Camera, Smile, Moon, Zap, Droplets, Utensils, Footprints,
  Scissors, Search, Settings, Shield, ChevronRight, Star, Pencil,
  UserPlus, QrCode, X, Lock,
} from "lucide-react";

import CodyWaving    from "./CodyWaving.png";
import ComiMain      from "./Comi-Image1.png";
import CodyWalkAway  from "./Cody walking away .png";
import Dog101        from "./101Dog.png";
import Corgi         from "./Corgi.png";
import Golden        from "./Golden.png";
import Husky         from "./Husky.png";
import Poodle        from "./Poodle.png";
import Siba          from "./Siba.png";
import IconFun      from "./ICON-FUN.png";
import IconSad      from "./ICON-SAD.png";
import IconSleepy   from "./ICON-SLEEPY.png";
import IconThinking from "./ICON-THINKING.png";
import IconWorry    from "./ICON-WORRY.png";

/* ============================================================
   COMI — Pet Wellness App Prototype  (Version 2)
   "I can finally understand my pet."

   HOW THIS FILE IS ORGANIZED:
   1. theme        -> all colors, fonts, radii
   2. data         -> sample data + breed list
   3. UI pieces    -> Card, Button, Chip, BreedDropdown...
   4. Screens      -> one function per screen
   5. App          -> state + screen switcher
   ============================================================ */

/* ============================================================
   PROTOTYPE / DEMO OWNER ACCOUNT
   ⚠️  Mock auth for demo/testing ONLY.
   Production: use Firebase Auth, Supabase Auth, or Auth0.
   Never store real credentials in frontend code.
   ============================================================ */
const DEMO_OWNER = {
  email:    "timothylai0601@gmail.com",
  password: "ComiDemo123!",
  name:     "Timothy",
  username: "timothy",
  role:     "owner",
};

/* ---------- 1. THEME ---------- */
const theme = {
  sky: "#93C5E0",
  ocean: "#5A8EC8",   // softer periwinkle-blue (was #5A8EC8)
  mist: "#EBF4FC",
  cloud: "#FFFFFF",
  coral: "#FFB5A7",
  yellow: "#FFE08A",
  mint: "#BFE3C8",
  lilac: "#D6C7F0",
  ink: "#34414E",
  slate: "#7C8B98",
  line: "#E6EEF5",
  radius: 24,
  shadow: "0 2px 12px rgba(90,142,200,0.08)",
};

/* ---------- 2. SAMPLE DATA ---------- */
const MOODS = [
  /* ── Positive ───────────────────────────────────────────── */
  { key: "happy",      label: "Happy",                  emoji: "😊", color: theme.yellow,  category: "positive" },
  { key: "playful",    label: "Playful",                emoji: "🎾", color: theme.coral,   category: "positive" },
  { key: "excited",    label: "Excited",                emoji: "🤩", color: "#FFD580",     category: "positive" },
  { key: "calm",       label: "Calm",                   emoji: "😌", color: theme.mint,    category: "positive" },
  { key: "cuddly",     label: "Cuddly",                 emoji: "🥰", color: "#FECDD3",     category: "positive" },
  /* ── Neutral ────────────────────────────────────────────── */
  { key: "normal",     label: "Normal",                 emoji: "😐", color: theme.cloud,   category: "neutral" },
  { key: "quiet",      label: "Quiet",                  emoji: "🤫", color: theme.mist,    category: "neutral" },
  { key: "sleepy",     label: "Sleepy",                 emoji: "😴", color: theme.sky,     category: "neutral" },
  { key: "low_energy", label: "Low energy",             emoji: "🔋", color: "#E0EFFF",     category: "neutral" },
  /* ── Concerning ─────────────────────────────────────────── */
  { key: "anxious",    label: "Anxious",                emoji: "😟", color: "#FFEEDD",     category: "negative" },
  { key: "stressed",   label: "Stressed",               emoji: "😰", color: "#FFE4D5",     category: "negative" },
  { key: "sad",        label: "Sad",                    emoji: "😢", color: "#D8EAFF",     category: "negative" },
  { key: "restless",   label: "Restless",               emoji: "😤", color: "#FFF0E0",     category: "negative" },
  { key: "hiding",     label: "Hiding",                 emoji: "🫣", color: "#EDE0FF",     category: "negative" },
  { key: "not_eating", label: "Not interested in food", emoji: "🍽️", color: "#FFE8E0",    category: "negative" },
  { key: "unusual",    label: "Unusual behaviour",      emoji: "❓", color: theme.lilac,   category: "negative" },
];

const BEHAVIORS = [
  { key: "eating",   label: "Eating",   icon: Utensils },
  { key: "sleeping", label: "Sleeping", icon: Moon },
  { key: "play",     label: "Play",     icon: Heart },
  { key: "energy",   label: "Energy",   icon: Zap },
  { key: "bathroom", label: "Bathroom", icon: Droplets },
  { key: "walks",    label: "Walks",    icon: Footprints },
];

const START_REMINDERS = [
  { id: 1, label: "Morning walk",  time: "8:00 AM",  icon: Footprints, on: true },
  { id: 2, label: "Breakfast",     time: "8:30 AM",  icon: Utensils,   on: true },
  { id: 3, label: "Fresh water",   time: "12:00 PM", icon: Droplets,   on: true },
  { id: 4, label: "Brushing",      time: "6:00 PM",  icon: Scissors,   on: false },
];

const START_POSTS = [
  {
    id: 1, who: "Mia & Luna", petName: "Luna",
    avatar: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?auto=format&fit=crop&w=80&q=80",
    text: "Luna learned a new trick today — she can roll over on command! So proud 🥹",
    likes: 24, tag: "Moment",
    comments: [
      { who: "Sam",  text: "That's amazing! What trick? 🎉" },
      { who: "Ari",  text: "Luna is such a superstar 🌟" },
    ],
  },
  {
    id: 2, who: "Sam", petName: "Biscuit",
    avatar: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=80&q=80",
    text: "Any tips for a puppy that won't settle at night? Biscuit keeps waking up at 3am 😅",
    likes: 9, tag: "Question",
    comments: [
      { who: "Mia",  text: "Try a warm blanket that smells like you! Worked for Luna 🧡" },
    ],
  },
  {
    id: 3, who: "Ari & Mochi", petName: "Mochi",
    avatar: "https://images.unsplash.com/photo-1606107558-0d25b9a517cb?auto=format&fit=crop&w=80&q=80",
    text: "Found the cutest pet-friendly café downtown ☕ They even have puppuccinos!",
    likes: 41, tag: "Moment",
    comments: [],
  },
  {
    id: 4, who: "Jess & Cooper", petName: "Cooper",
    avatar: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=80&q=80",
    text: "Tip: freeze xylitol-free peanut butter in a Kong toy — keeps Cooper busy for ages 🧊",
    likes: 33, tag: "Tip",
    comments: [
      { who: "Sam",  text: "Game changer! Trying this tonight 😄" },
      { who: "Mia",  text: "Luna goes absolutely wild for this too 😂" },
    ],
  },
];

const PLACES = [
  {
    id: 1, name: "Deer Lake Park",
    type: "Park", dist: "0.8 mi", walkTime: "16 min", driveTime: "4 min",
    petNote: "Beautiful off-leash area with a lakeside trail. Great for energetic dogs and social walks.",
    emoji: "🌳", top: "16%", left: "18%",
    mapsQuery: "Deer Lake Park Burnaby BC",
    locations: ["burnaby", "deer lake", "lake", "park"],
  },
  {
    id: 2, name: "Central Park Burnaby",
    type: "Park", dist: "1.2 mi", walkTime: "24 min", driveTime: "6 min",
    petNote: "Large green park with a running track. Dogs welcome on leash throughout.",
    emoji: "🌿", top: "50%", left: "44%",
    mapsQuery: "Central Park Burnaby BC",
    locations: ["burnaby", "central park", "park"],
  },
  {
    id: 3, name: "Barnet Marine Park",
    type: "Walk", dist: "2.4 mi", walkTime: "48 min", driveTime: "10 min",
    petNote: "Stunning waterfront trail with ocean views. Leash required on paths. Breathtaking on clear days.",
    emoji: "🥾", top: "12%", left: "68%",
    mapsQuery: "Barnet Marine Park Burnaby BC",
    locations: ["burnaby", "barnet", "marine", "waterfront", "trail"],
  },
  {
    id: 4, name: "Paws & Beans Café",
    type: "Café", dist: "0.5 mi", walkTime: "10 min", driveTime: "3 min",
    petNote: "Pet-friendly patio with fresh water bowls and dog-friendly baked treats at the counter.",
    emoji: "☕", top: "66%", left: "28%",
    mapsQuery: "Paws and Beans Cafe Burnaby BC",
    locations: ["burnaby", "café", "cafe", "coffee", "paws", "beans"],
  },
  {
    id: 5, name: "Happy Tails Grooming",
    type: "Grooming", dist: "0.7 mi", walkTime: "14 min", driveTime: "4 min",
    petNote: "Full grooming service including bath, trim, and nail care. Gentle and patient with all dogs.",
    emoji: "✂️", top: "80%", left: "56%",
    mapsQuery: "Happy Tails Grooming Burnaby BC",
    locations: ["burnaby", "grooming", "groom", "happy tails", "trim", "bath"],
  },
  {
    id: 6, name: "Metrotown Pet Store",
    type: "Store", dist: "1.0 mi", walkTime: "20 min", driveTime: "5 min",
    petNote: "Large pet supply store with food, toys, accessories, and a small vet clinic inside.",
    emoji: "🐾", top: "62%", left: "72%",
    mapsQuery: "Metrotown Pet Store Burnaby BC",
    locations: ["burnaby", "metrotown", "pet store", "store", "shop"],
  },
  {
    id: 7, name: "Burnaby Mountain Trail",
    type: "Walk", dist: "3.1 mi", walkTime: "62 min", driveTime: "14 min",
    petNote: "Forested mountain trail with sweeping views. Well-shaded and perfect for active dogs.",
    emoji: "⛰️", top: "28%", left: "80%",
    mapsQuery: "Burnaby Mountain Trail Burnaby BC",
    locations: ["burnaby", "burnaby mountain", "mountain", "trail", "hike"],
  },
  /* ── Events ── */
  {
    id: 8, name: "French Bulldog Meetup",
    type: "Event", dist: "0.8 mi", walkTime: "16 min", driveTime: "4 min",
    petNote: "Monthly meetup for Frenchie owners at Deer Lake Park. Friendly dogs of all breeds are very welcome too!",
    emoji: "🐾", top: "26%", left: "12%",
    mapsQuery: "Deer Lake Park Burnaby BC",
    locations: ["burnaby", "deer lake", "frenchie", "french bulldog", "meetup", "event"],
  },
  {
    id: 9, name: "Small Dog Social Walk",
    type: "Event", dist: "1.1 mi", walkTime: "22 min", driveTime: "5 min",
    petNote: "Weekly social walk for small breeds around Central Park. A great way to socialise your pup and meet local dog owners!",
    emoji: "🦮", top: "60%", left: "36%",
    mapsQuery: "Central Park Burnaby BC",
    locations: ["burnaby", "central park", "small dog", "social", "walk", "event"],
  },
  {
    id: 10, name: "Golden Retriever Park Day",
    type: "Event", dist: "3.1 mi", walkTime: "62 min", driveTime: "14 min",
    petNote: "Seasonal golden retriever gathering on Burnaby Mountain Trail. A sea of gorgeous golden fur awaits — bring a camera!",
    emoji: "🌟", top: "18%", left: "86%",
    mapsQuery: "Burnaby Mountain Trail Burnaby BC",
    locations: ["burnaby", "burnaby mountain", "golden retriever", "golden", "retriever", "event"],
  },
];

const PERSONALITY_TAGS = [
  "Playful", "Friendly", "Calm", "Shy", "Energetic",
  "Cuddly", "Curious", "Bold", "Anxious", "Nervous",
  "Independent", "Sensitive",
];

/* ---------- FOOD SAFETY DATABASE ----------
   Each entry has:
     keywords : string[] — terms to match in the user's message (lowercase)
     status   : "Safe" | "Caution" | "Unsafe"
     canEat   : short answer about the food
     howMuch  : serving guidance (or "None" for unsafe foods)
     avoid    : what parts / forms to keep away
     watchFor : symptoms to monitor
   To add a new food: copy any block below, paste it at the end of the array,
   and fill in the five fields. That's it — the rest happens automatically.
   ----------------------------------------------------------- */
/* ==========================================================================
   PET KNOWLEDGE BASE
   Local rule-based database powering AI Insights (prototype).
   Future version: connect to a backend API with vector search and a real
   LLM to handle free-form questions. Keep all API keys server-side only.
   Each entry: id, category, title, keywords[], safeAnswer, caution,
   whenToContactVet, relatedTips[], riskLevel ("low"|"medium"|"high")
   ========================================================================== */
const PET_KNOWLEDGE_BASE = [
  /* ── FOOD SAFETY ──────────────────────────────────────────────────────── */
  {
    id: "apple", category: "food_safety", title: "Can dogs eat apples?",
    keywords: ["apple", "apples"],
    safeAnswer: "Yes, {petName} can usually enjoy small pieces of fresh apple as a crunchy treat.",
    caution: "Always remove the seeds and core first. Apple seeds contain small amounts of cyanide compounds. Stick to one or two thin slices at a time.",
    whenToContactVet: "Contact your vet if {petName} accidentally eats a large amount of seeds, or shows vomiting, diarrhoea, or unusual behaviour.",
    relatedTips: ["Peel or core the apple before giving it.", "Avoid apple juice, apple pie, or any sugary apple products.", "Try freezing small apple slices for a cool summer treat."],
    riskLevel: "low",
  },
  {
    id: "tomato", category: "food_safety", title: "Can dogs eat tomatoes?",
    keywords: ["tomato", "tomatoes"],
    safeAnswer: "Ripe tomato flesh is usually okay for {petName} in very small amounts as an occasional treat.",
    caution: "Green tomatoes, leaves, stems, and the tomato plant itself contain solanine, which is harmful to dogs. Keep {petName} away from the tomato plant in your garden.",
    whenToContactVet: "Contact your vet if {petName} eats tomato leaves, stems, or a large amount of green tomato, or shows vomiting, drooling, lethargy, or weakness.",
    relatedTips: ["Use only ripe, red tomato flesh.", "Skip tomato sauce, ketchup, or canned tomatoes — they often contain garlic, onion, or salt."],
    riskLevel: "medium",
  },
  {
    id: "chocolate", category: "food_safety", title: "Can dogs eat chocolate?",
    keywords: ["chocolate", "cocoa", "cacao", "choc", "dark chocolate", "milk chocolate"],
    safeAnswer: "No. Chocolate is toxic to dogs and should never be given to {petName}.",
    caution: "Chocolate contains theobromine and caffeine, which dogs cannot process safely. Dark chocolate and baking chocolate are especially dangerous, but all types can be harmful.",
    whenToContactVet: "Contact your vet or an emergency animal clinic immediately if {petName} eats any amount of chocolate. Do not wait for symptoms.",
    relatedTips: ["Keep all chocolate products out of reach, including hot cocoa, cocoa powder, and chocolate biscuits.", "Even a small amount can cause serious harm."],
    riskLevel: "high",
  },
  {
    id: "grapes", category: "food_safety", title: "Can dogs eat grapes or raisins?",
    keywords: ["grape", "grapes", "raisin", "raisins", "sultana", "sultanas", "currant", "currants"],
    safeAnswer: "No. Grapes, raisins, and sultanas are toxic to dogs. {petName} should never eat these.",
    caution: "Even a small amount can cause sudden kidney failure in dogs. The exact toxic compound is still unknown, so no safe amount has been identified.",
    whenToContactVet: "Contact your vet immediately if {petName} eats any grapes, raisins, or sultanas — even just one or two. This is a genuine emergency.",
    relatedTips: ["Check ingredient lists in baked goods for hidden raisins or currants.", "Fruit cake, trail mix, and some cereals often contain raisins."],
    riskLevel: "high",
  },
  {
    id: "onion", category: "food_safety", title: "Can dogs eat onions?",
    keywords: ["onion", "onions", "shallot", "shallots", "chive", "chives", "leek", "leeks", "spring onion"],
    safeAnswer: "No. Onions and related vegetables are toxic to dogs and {petName} should avoid them completely.",
    caution: "Onions damage red blood cells in dogs and can cause anaemia. This includes all forms: raw, cooked, dried, and powdered.",
    whenToContactVet: "Contact your vet if {petName} eats any onion, chive, or leek, or shows weakness, pale gums, reduced appetite, or tiredness.",
    relatedTips: ["Avoid all foods cooked with onion, including soups, sauces, and seasonings.", "Onion powder and garlic powder in human food are especially concentrated and dangerous."],
    riskLevel: "high",
  },
  {
    id: "garlic", category: "food_safety", title: "Can dogs eat garlic?",
    keywords: ["garlic", "garlic powder", "garlic oil"],
    safeAnswer: "No. Garlic is toxic to dogs and should not be given to {petName} in any form.",
    caution: "Garlic is more potent than onion, gram for gram. It causes red blood cell damage and can lead to anaemia. Even small amounts regularly can cause harm.",
    whenToContactVet: "Contact your vet if {petName} eats garlic in any form, or shows weakness, pale gums, rapid breathing, or loss of appetite.",
    relatedTips: ["Read ingredient labels carefully — many human foods contain garlic as a seasoning.", "Garlic supplements for humans are also dangerous for dogs."],
    riskLevel: "high",
  },
  {
    id: "chicken", category: "food_safety", title: "Can dogs eat chicken?",
    keywords: ["chicken", "cooked chicken", "boiled chicken", "plain chicken"],
    safeAnswer: "Yes! Plain cooked chicken is a great lean protein for {petName} and is easy on the stomach.",
    caution: "Never give raw chicken due to the risk of salmonella. Avoid seasoned chicken, chicken bones (especially cooked bones which can splinter), and chicken with sauces.",
    whenToContactVet: "Contact your vet if {petName} swallows a bone, or shows vomiting, choking, or digestive discomfort.",
    relatedTips: ["Boiled or baked plain chicken with no seasonings is best.", "Chicken is great as a topper for regular food during an upset stomach."],
    riskLevel: "low",
  },
  {
    id: "peanut_butter", category: "food_safety", title: "Can dogs eat peanut butter?",
    keywords: ["peanut butter", "peanut", "peanuts", "pb"],
    safeAnswer: "Plain peanut butter without xylitol is generally safe and a popular treat for {petName}.",
    caution: "ALWAYS check the label for xylitol (also listed as 'birch sugar') — it is deadly for dogs. High in fat, so give only a small amount occasionally.",
    whenToContactVet: "Contact your vet immediately if the peanut butter contained xylitol, or if {petName} shows weakness, vomiting, tremors, or loss of coordination.",
    relatedTips: ["Look for natural peanut butter with just one ingredient: peanuts.", "A small lick or teaspoon is enough as a treat.", "Kong toys stuffed with peanut butter can be a great enrichment activity."],
    riskLevel: "medium",
  },
  {
    id: "rice", category: "food_safety", title: "Can dogs eat rice?",
    keywords: ["rice", "white rice", "brown rice", "plain rice"],
    safeAnswer: "Yes, plain cooked rice is gentle on {petName}'s stomach and a safe addition to meals.",
    caution: "Rice should not replace a balanced diet. Avoid fried rice, flavoured rice, or rice with seasonings, sauces, or additives.",
    whenToContactVet: "Plain rice is very gentle. Contact your vet only if {petName} has ongoing digestive issues.",
    relatedTips: ["Boiled white rice is often recommended for dogs with an upset tummy.", "Mix a small amount with plain boiled chicken for a gentle bland meal."],
    riskLevel: "low",
  },
  {
    id: "egg", category: "food_safety", title: "Can dogs eat eggs?",
    keywords: ["egg", "eggs", "boiled egg", "scrambled egg"],
    safeAnswer: "Yes, plain cooked eggs are a nutritious protein source for {petName}.",
    caution: "Avoid raw eggs due to the risk of salmonella and a protein called avidin that can interfere with biotin absorption. No butter, salt, or seasoning.",
    whenToContactVet: "Contact your vet if you notice any digestive upset or if {petName} eats a large quantity of raw egg.",
    relatedTips: ["Boiled or scrambled without any butter or salt is best.", "One egg a few times a week is a nice nutritious treat."],
    riskLevel: "low",
  },
  {
    id: "cheese", category: "food_safety", title: "Can dogs eat cheese?",
    keywords: ["cheese", "cheddar", "mozzarella", "dairy"],
    safeAnswer: "Small amounts of plain cheese are usually okay for {petName} as an occasional treat.",
    caution: "Cheese is high in fat and salt. Some dogs are lactose intolerant and may experience digestive upset. Avoid strong, mouldy, or seasoned cheeses.",
    whenToContactVet: "Contact your vet if {petName} shows diarrhoea, vomiting, or bloating after eating cheese.",
    relatedTips: ["Low-fat cheeses like mozzarella or cottage cheese are better options.", "Use tiny pieces of cheese for training — they are high-value rewards."],
    riskLevel: "medium",
  },
  {
    id: "banana", category: "food_safety", title: "Can dogs eat bananas?",
    keywords: ["banana", "bananas"],
    safeAnswer: "Yes, bananas are safe for {petName} and many dogs love the sweet taste!",
    caution: "Bananas are high in natural sugar, so give only a few small slices occasionally rather than every day. The peel is not toxic but can be hard to digest.",
    whenToContactVet: "Bananas are generally very well tolerated. Contact your vet if you notice unusual digestive upset.",
    relatedTips: ["Freeze banana slices for a cool summer treat.", "Mash a small amount and mix into food as a special topper."],
    riskLevel: "low",
  },
  {
    id: "avocado", category: "food_safety", title: "Can dogs eat avocado?",
    keywords: ["avocado", "avo", "guacamole"],
    safeAnswer: "No. Avocado contains persin, a compound that can be harmful to dogs. Keep it away from {petName}.",
    caution: "The flesh, skin, pit, and leaves all contain persin. Guacamole also contains onion and garlic, making it doubly dangerous.",
    whenToContactVet: "Contact your vet if {petName} eats any avocado and shows vomiting, diarrhoea, or difficulty breathing.",
    relatedTips: ["Dispose of avocado peels and pits safely out of reach.", "Watch outdoor compost bins where avocados may end up."],
    riskLevel: "high",
  },
  {
    id: "blueberry", category: "food_safety", title: "Can dogs eat blueberries?",
    keywords: ["blueberry", "blueberries"],
    safeAnswer: "Yes! Blueberries are a wonderful antioxidant-rich snack for {petName}.",
    caution: "Give a small handful at a time. Too many can cause loose stools. Avoid blueberry muffins or blueberry products with added sugar.",
    whenToContactVet: "Blueberries are very well tolerated. Only contact your vet if {petName} shows unusual reactions.",
    relatedTips: ["Fresh or frozen blueberries both work as treats.", "They make great small training treats."],
    riskLevel: "low",
  },
  {
    id: "xylitol", category: "food_safety", title: "Is xylitol safe for dogs?",
    keywords: ["xylitol", "birch sugar", "sugar free", "sugar-free", "stevia"],
    safeAnswer: "No. Xylitol is extremely toxic to dogs. {petName} must never eat anything containing xylitol.",
    caution: "Even a tiny amount can cause a dangerous drop in blood sugar and liver failure. Found in sugar-free gum, some peanut butter, baked goods, and some medications.",
    whenToContactVet: "This is an emergency. Contact your vet or animal poison control immediately if {petName} eats anything containing xylitol.",
    relatedTips: ["Always read labels on peanut butter, yoghurt, baked goods, and vitamins.", "Keep xylitol-containing products in a locked cupboard."],
    riskLevel: "high",
  },

  /* ── SLEEP ─────────────────────────────────────────────────────────────── */
  {
    id: "sleeping_more", category: "sleep", title: "Why is my dog sleeping more than usual?",
    keywords: ["sleeping more", "sleep more", "sleeping a lot", "sleeping too much", "napping more", "tired", "lethargic", "lethergy", "less active"],
    safeAnswer: "{petName} might be sleeping more due to a busy day, warm weather, growing (if a puppy), or simply needing rest. Extra sleep by itself is not always a concern.",
    caution: "If extra sleeping is combined with loss of appetite, weakness, unusual breathing, or other changes, it may signal something that needs attention.",
    whenToContactVet: "Contact your vet if the extra sleep lasts more than 2–3 days, or is combined with loss of appetite, weight loss, laboured breathing, pale gums, or any other symptoms.",
    relatedTips: ["Track {petName}'s sleep with the Comi Smart Dog Tag or sleep log.", "Note whether anything changed recently — new food, medication, season, or activity level.", "Puppies and older dogs naturally sleep more."],
    riskLevel: "medium",
  },
  {
    id: "daytime_naps", category: "sleep", title: "How much daytime napping is normal?",
    keywords: ["daytime nap", "daytime naps", "nap", "napping", "naps", "how long sleep", "how much sleep"],
    safeAnswer: "Dogs sleep between 12 and 14 hours a day on average. Daytime naps are completely normal — {petName} is probably just recharging between activities!",
    caution: "Monitor whether naps are balanced with normal activity periods. A dog that barely wakes up all day may need a wellness check.",
    whenToContactVet: "Only contact your vet if napping is combined with other changes like refusing food, weakness, or unusual behaviour.",
    relatedTips: ["A Comi Smart Dog Tag can help you track daytime rest patterns automatically.", "Young puppies and senior dogs sleep even more than the average — up to 18 hours a day."],
    riskLevel: "low",
  },
  {
    id: "restless_sleep", category: "sleep", title: "Why is my dog restless at night?",
    keywords: ["restless sleep", "restless at night", "waking up at night", "can't sleep", "whimpering at night", "pacing at night", "not sleeping"],
    safeAnswer: "{petName} might be restless at night due to anxiety, discomfort, needing a bathroom break, or changes in routine.",
    caution: "Ongoing nighttime restlessness can affect both you and {petName}. Look for patterns — does it happen after certain activities or at specific times?",
    whenToContactVet: "Contact your vet if restlessness is frequent, comes with pain signals (whimpering, limping), or if {petName} seems distressed and nothing helps.",
    relatedTips: ["Try a consistent bedtime routine — a short walk, then a quiet settle-down time.", "A comfortable, familiar bed in a calm location can help.", "Check for physical discomfort like itching or pain."],
    riskLevel: "medium",
  },
  {
    id: "sleep_after_exercise", category: "sleep", title: "Is it normal for dogs to sleep after exercise?",
    keywords: ["sleep after walk", "sleep after exercise", "tired after walk", "tired after play", "sleep after playing"],
    safeAnswer: "Completely normal! A good run or play session burns a lot of energy, and {petName} is just recovering. Deep sleep after exercise is healthy.",
    caution: "Make sure {petName} has access to fresh water after exercise. Watch for signs of overheating in hot weather.",
    whenToContactVet: "Contact your vet if {petName} seems unusually exhausted, struggles to recover after a light walk, or pants heavily for a long time.",
    relatedTips: ["Recovery sleep is healthy and normal.", "Avoid vigorous exercise in hot weather to prevent heatstroke.", "Let {petName} dictate the pace — not every dog needs the same amount of exercise."],
    riskLevel: "low",
  },

  /* ── MOOD & BEHAVIOUR ──────────────────────────────────────────────────── */
  {
    id: "worried_mood", category: "mood", title: "Why does my dog seem worried or anxious?",
    keywords: ["worried", "anxious", "anxiety", "nervous", "scared", "fearful", "stress", "stressed", "trembling", "shaking"],
    safeAnswer: "{petName} might feel worried due to loud noises, new environments, changes in routine, or separation. Dogs are very sensitive to their surroundings.",
    caution: "Chronic anxiety can affect {petName}'s quality of life. Try to identify triggers and create a calm, safe space.",
    whenToContactVet: "Contact your vet if anxiety is severe, frequent, or affecting {petName}'s eating and daily life. A vet can suggest behavioural support or other options.",
    relatedTips: ["Maintain a consistent routine — dogs feel safer with predictability.", "A safe den (crate, quiet corner) helps anxious dogs.", "Calming music or white noise can reduce anxiety.", "Never punish fearful behaviour — it makes anxiety worse."],
    riskLevel: "medium",
  },
  {
    id: "low_energy", category: "mood", title: "Why does my dog have low energy?",
    keywords: ["low energy", "no energy", "lazy", "not energetic", "sluggish", "lethargic", "not active", "not playing"],
    safeAnswer: "Low energy in {petName} can be normal after a busy day or during hot weather. It can also reflect a mood dip or a change in environment.",
    caution: "If low energy is a new and persistent change without an obvious cause, it is worth monitoring closely.",
    whenToContactVet: "Contact your vet if low energy lasts more than a few days, comes with loss of appetite, weight change, pale gums, or other symptoms.",
    relatedTips: ["Note whether anything changed recently — new food, routine, household member, or weather.", "Short, gentle playtime can help lift mood.", "Track patterns in the Comi wellness log."],
    riskLevel: "medium",
  },
  {
    id: "hiding", category: "mood", title: "Why is my dog hiding?",
    keywords: ["hiding", "hiding away", "hiding under", "under the bed", "won't come out", "withdrawn"],
    safeAnswer: "{petName} may be hiding to feel safe. Dogs retreat when they feel overwhelmed, scared, unwell, or in pain. It is worth observing closely.",
    caution: "A dog that suddenly starts hiding is often trying to tell you something. This can be a sign of discomfort, fear, or feeling unwell.",
    whenToContactVet: "Contact your vet if hiding is new, persistent, or combined with loss of appetite, vomiting, shaking, or pain signals.",
    relatedTips: ["Give {petName} space while keeping a gentle watch.", "Do not force them out — let them come to you.", "Check for any possible new stressors (noise, visitors, changes at home)."],
    riskLevel: "medium",
  },
  {
    id: "licking_paws", category: "behaviour", title: "Why is my dog licking their paws?",
    keywords: ["licking paws", "licking feet", "lick paws", "lick feet", "paw licking", "chewing paws"],
    safeAnswer: "Some paw licking is normal grooming, but frequent or obsessive licking in {petName} may signal allergies, irritation, stress, or something on the paw.",
    caution: "Check the paws for cuts, thorns, or irritation between the toes. Red, swollen, or raw paws need attention.",
    whenToContactVet: "Contact your vet if licking is constant, the paws look inflamed or discoloured, or {petName} is losing sleep over it.",
    relatedTips: ["After outdoor walks, gently wipe {petName}'s paws to remove allergens or irritants.", "Seasonal allergies are a common cause of paw licking.", "Anxiety can also cause repetitive licking — check for other stress signals."],
    riskLevel: "medium",
  },
  {
    id: "scratching_ears", category: "behaviour", title: "Why does my dog keep scratching their ears?",
    keywords: ["scratching ears", "scratch ears", "shaking head", "ear scratching", "ear infection", "itchy ears", "smelly ear"],
    safeAnswer: "Occasional ear scratching can be normal, but frequent scratching in {petName} often signals an ear infection, ear mites, allergies, or water trapped in the ear.",
    caution: "Ear problems can worsen quickly if left untreated. Look for signs of redness, discharge, smell, or {petName} tilting their head.",
    whenToContactVet: "Contact your vet if scratching is frequent, the ear looks red or swollen, there is discharge or odour, or {petName} seems uncomfortable.",
    relatedTips: ["Do not insert anything into the ear canal.", "Keep ears dry after baths or swimming.", "Floppy-eared breeds like Cocker Spaniels are more prone to ear infections."],
    riskLevel: "medium",
  },
  {
    id: "barking_more", category: "behaviour", title: "Why is my dog barking more than usual?",
    keywords: ["barking more", "barking a lot", "excessive barking", "won't stop barking", "barking at night"],
    safeAnswer: "{petName} may be barking more due to boredom, changes in the environment, alerting to sounds, or emotional changes like anxiety.",
    caution: "Sudden changes in barking patterns can sometimes signal pain or discomfort. Monitor whether the barking is new and unexplained.",
    whenToContactVet: "Contact your vet if barking is new and unexplained with no obvious trigger, or if {petName} also seems confused, restless, or in pain.",
    relatedTips: ["Ensure {petName} is getting enough mental and physical stimulation.", "Identify and reduce triggers where possible.", "Consistent, positive training can help manage excessive barking over time."],
    riskLevel: "medium",
  },
  {
    id: "separation_anxiety", category: "behaviour", title: "Does my dog have separation anxiety?",
    keywords: ["separation anxiety", "alone", "left alone", "not alone", "when i leave", "when i go out", "crying when left", "destructive when alone"],
    safeAnswer: "{petName} may struggle when left alone, which is very common in dogs. Separation anxiety shows up as barking, destructive behaviour, or accidents when home alone.",
    caution: "Separation anxiety can worsen without support. A consistent routine and gradual alone-time training helps most dogs.",
    whenToContactVet: "Contact your vet or a certified dog behaviourist if anxiety is severe, {petName} harms themselves, or nothing helps after trying home strategies.",
    relatedTips: ["Practice short departures and build up gradually.", "Leave a familiar-smelling item with {petName}.", "Puzzle toys and long-lasting chews help keep busy.", "A Comi Smart Dog Tag lets you track {petName}'s movement and rest while you are away."],
    riskLevel: "medium",
  },
  {
    id: "playful_mood", category: "mood", title: "Is playfulness a good sign?",
    keywords: ["playful", "playing", "happy", "energetic", "zoomies", "excited", "running around", "bouncy"],
    safeAnswer: "Absolutely! A playful {petName} is usually a happy and healthy one. Zoomies, tail wagging, and wanting to play are all great signs.",
    caution: "Make sure play stays safe — watch for overheating during intense sessions, especially in summer.",
    whenToContactVet: "No need to contact your vet for playfulness! Just enjoy it.",
    relatedTips: ["Regular play keeps {petName} mentally and physically healthy.", "Rotate toys to keep things interesting.", "Try new games like hide-and-seek or scent games for mental stimulation."],
    riskLevel: "low",
  },

  /* ── APPETITE & DIGESTIVE ──────────────────────────────────────────────── */
  {
    id: "eating_less", category: "appetite", title: "Why is my dog not eating?",
    keywords: ["not eating", "eating less", "lost appetite", "won't eat", "refusing food", "stopped eating", "off food"],
    safeAnswer: "{petName} might eat less due to stress, a recent change in food, warm weather, or feeling a bit off. A missed meal or two is not always cause for alarm.",
    caution: "A dog that refuses food for more than 24 hours, or who goes off food alongside other symptoms, needs attention.",
    whenToContactVet: "Contact your vet if {petName} skips more than one or two meals, is also vomiting or lethargic, is losing weight, or shows any other concerning signs.",
    relatedTips: ["Check whether the food changed recently — even a new batch can sometimes smell different.", "Try warming food slightly to enhance the smell.", "Hand-feeding or mixing a small amount of something tasty can help kick-start appetite."],
    riskLevel: "medium",
  },
  {
    id: "drinking_more", category: "appetite", title: "Why is my dog drinking more water?",
    keywords: ["drinking more", "drinking a lot", "thirsty", "more water", "excessive thirst", "polydipsia"],
    safeAnswer: "Occasional increased drinking is normal after exercise or in warm weather. But consistently drinking much more than usual can be a sign worth investigating.",
    caution: "Increased thirst in dogs can be an early sign of diabetes, kidney issues, or other conditions. It is worth tracking over a few days.",
    whenToContactVet: "Contact your vet if {petName} is drinking noticeably more water for more than 2–3 days, especially if combined with more frequent urination, weight loss, or tiredness.",
    relatedTips: ["Always make sure fresh water is available.", "Note roughly how much {petName} drinks each day to share with your vet.", "Keep {petName} well-hydrated in hot weather — but track whether thirst is higher than the heat alone explains."],
    riskLevel: "medium",
  },
  {
    id: "soft_stool", category: "digestive", title: "What does soft stool mean in dogs?",
    keywords: ["soft stool", "loose stool", "soft poo", "runny poo", "diarrhoea", "diarrhea", "runny stool", "watery stool", "loose poop"],
    safeAnswer: "Soft or loose stools in {petName} are often caused by dietary changes, eating something rich, stress, or mild digestive upset. One or two episodes is usually not serious.",
    caution: "Persistent soft stools, or diarrhoea with blood, mucus, or other symptoms, can indicate infection, parasites, or another issue.",
    whenToContactVet: "Contact your vet if diarrhoea continues for more than 24–48 hours, contains blood or mucus, is combined with vomiting or lethargy, or if {petName} seems dehydrated.",
    relatedTips: ["Offer a bland diet (plain boiled rice and chicken) for 24 hours.", "Keep fresh water available to prevent dehydration.", "Probiotics formulated for dogs can help restore gut balance — ask your vet."],
    riskLevel: "medium",
  },
  {
    id: "constipation", category: "digestive", title: "Why is my dog constipated?",
    keywords: ["constipated", "constipation", "not pooping", "not going to the toilet", "straining", "can't poop", "hard stool"],
    safeAnswer: "{petName} may be constipated due to dehydration, low fibre intake, lack of movement, or eating something that is hard to digest.",
    caution: "Straining without producing anything, or showing pain while trying to go, needs prompt attention. Dogs can sometimes develop blockages.",
    whenToContactVet: "Contact your vet if {petName} has not had a bowel movement in 2 days, is straining with apparent pain, or if you suspect they ate something non-food.",
    relatedTips: ["Ensure {petName} has access to plenty of fresh water.", "More exercise can help stimulate digestion.", "Never use human laxatives on dogs without vet advice."],
    riskLevel: "medium",
  },
  {
    id: "vomiting", category: "digestive", title: "My dog is vomiting — what should I do?",
    keywords: ["vomiting", "vomited", "throwing up", "sick", "threw up", "puking", "being sick"],
    safeAnswer: "A single episode of vomiting in {petName} is common and often not serious — it can happen from eating too fast, eating grass, or a mild stomach upset.",
    caution: "Repeated vomiting, vomiting blood, or vomiting combined with other symptoms is more concerning and should not be ignored.",
    whenToContactVet: "Contact your vet if {petName} vomits more than twice in a day, vomits blood, is also lethargic or refusing food, seems to be in pain, or is a puppy or senior dog.",
    relatedTips: ["Withhold food for a few hours after vomiting to let the stomach settle (water is okay).", "Introduce bland food slowly after the vomiting stops.", "If you think {petName} ate something harmful, contact your vet straight away."],
    riskLevel: "high",
  },

  /* ── HEAT CYCLE ────────────────────────────────────────────────────────── */
  {
    id: "heat_cycle", category: "heat_cycle", title: "What is a dog's heat cycle?",
    keywords: ["heat cycle", "in heat", "season", "menstrual", "cycle", "bleeding", "period"],
    safeAnswer: "A female dog's heat cycle (also called 'season') typically occurs every 6–8 months and lasts about 2–4 weeks. During this time {petName} may show behaviour and physical changes.",
    caution: "Keep your female dog away from unneutered males during this time. Even a brief encounter can lead to an unplanned pregnancy.",
    whenToContactVet: "Contact your vet if heat cycles are very irregular, if {petName} shows signs of a false pregnancy, or if bleeding is unusually heavy or prolonged.",
    relatedTips: ["Track cycle dates in the Comi calendar for pattern awareness.", "Use doggy pants/diapers to manage discharge at home.", "Consider speaking to your vet about spaying if you are not planning to breed."],
    riskLevel: "medium",
  },
  {
    id: "heat_mood", category: "heat_cycle", title: "Mood changes during heat cycle",
    keywords: ["moody during heat", "mood heat", "irritable in heat", "restless heat", "clingy during heat", "behaviour heat"],
    safeAnswer: "During a heat cycle, {petName} may become more clingy, restless, or irritable than usual. These mood shifts are driven by hormonal changes and are completely normal.",
    caution: "If mood changes are very extreme or {petName} seems distressed rather than just unsettled, it is worth checking in with your vet.",
    whenToContactVet: "Contact your vet if mood changes are severe, {petName} seems to be in pain, or if you are concerned about any aspect of the heat cycle.",
    relatedTips: ["Give {petName} extra comfort and a calm environment.", "Maintain a consistent routine during the cycle.", "Avoid busy, stressful outings during peak heat days."],
    riskLevel: "low",
  },
  {
    id: "heat_appetite", category: "heat_cycle", title: "Appetite changes during heat cycle",
    keywords: ["not eating during heat", "appetite heat", "eating less heat", "food heat"],
    safeAnswer: "It is common for female dogs to eat slightly less during their heat cycle. Hormonal changes can temporarily reduce appetite.",
    caution: "A complete refusal to eat for more than a day or two, or vomiting during a heat cycle, may need attention.",
    whenToContactVet: "Contact your vet if {petName} completely refuses food for more than 24–48 hours, or shows signs of discomfort beyond mild appetite changes.",
    relatedTips: ["Try smaller, more frequent meals.", "Warm food slightly to enhance the smell.", "Make sure fresh water is always available."],
    riskLevel: "low",
  },

  /* ── EXERCISE ──────────────────────────────────────────────────────────── */
  {
    id: "exercise", category: "exercise", title: "How much exercise does my dog need?",
    keywords: ["how much exercise", "exercise", "walk", "walking", "activity", "how long walk", "how many walks"],
    safeAnswer: "Most adult dogs benefit from at least 30–60 minutes of exercise per day, split across 2 walks. {petName}'s ideal amount depends on breed, age, and health.",
    caution: "Over-exercising puppies can harm developing joints. Senior dogs may need shorter, gentler walks. Always let {petName} set the pace.",
    whenToContactVet: "Contact your vet if {petName} seems tired, sore, or reluctant to exercise, especially if this is new.",
    relatedTips: ["High-energy breeds like Huskies or Border Collies need much more than a leisurely stroll.", "Mental exercise (puzzle toys, sniff walks) can be just as tiring as physical exercise.", "Track daily walks in the Comi behaviour log."],
    riskLevel: "low",
  },

  /* ── GROOMING ──────────────────────────────────────────────────────────── */
  {
    id: "grooming", category: "grooming", title: "How often should I groom my dog?",
    keywords: ["groom", "grooming", "brush", "brushing", "coat", "shedding", "bath", "bathing", "wash"],
    safeAnswer: "Grooming frequency for {petName} depends on their coat type. Short-haired dogs may need a weekly brush, while long-haired breeds often need daily brushing.",
    caution: "Matted fur can pull on skin and cause discomfort. Regular brushing prevents tangles and lets you check for lumps, ticks, or skin issues.",
    whenToContactVet: "Contact your vet or a vet dermatologist if you notice unusual hair loss, redness, scabs, or skin changes during grooming.",
    relatedTips: ["Start grooming sessions young so {petName} gets used to it.", "Use breed-appropriate brushes and shampoos.", "Check paws, ears, and teeth during each grooming session."],
    riskLevel: "low",
  },

  /* ── SMART DOG TAG & TRACKING ──────────────────────────────────────────── */
  {
    id: "smart_tag_tracking", category: "smart_tag", title: "How does the Comi Smart Dog Tag work?",
    keywords: ["smart tag", "dog tag", "qr tag", "smart dog tag", "tracking", "track sleep", "movement tracking", "comi plus", "gps tag"],
    safeAnswer: "The Comi Smart Dog Tag is a premium accessory that clips to {petName}'s collar. It tracks movement, rest periods, and activity levels throughout the day using motion sensors.",
    caution: "The Smart Dog Tag is a wellness companion — it estimates rest and activity patterns, but is not a medical device.",
    whenToContactVet: "No vet needed for tracking! But share interesting patterns you notice with your vet at check-up time.",
    relatedTips: ["The tag syncs automatically when {petName} is home on Wi-Fi.", "View sleep patterns, daily steps, and rest zones in the Wellness screen.", "Comi Plus subscribers get Smart Dog Tag setup and advanced insights."],
    riskLevel: "low",
  },
];

/* ==========================================================================
   KNOWLEDGE BASE SEARCH ENGINE
   ========================================================================== */
function normalizeQ(text) {
  return text.toLowerCase().trim().replace(/[?!.,]/g, " ").replace(/\s+/g, " ");
}

function searchKnowledgeBase(question) {
  const q = normalizeQ(question);
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of PET_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.split(" ").length * 2; // multi-word keywords score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

function personalizeText(text, petName) {
  return text.replace(/\{petName\}/g, petName);
}

const RISK_STYLE = {
  low:    { label: "Usually safe",  bg: "#D4F0E0", color: "#2E7D5E" },
  medium: { label: "Use caution",   bg: "#FFF4CC", color: "#8A6500" },
  high:   { label: "Contact vet",   bg: "#FFD5CC", color: "#C0392B" },
};

/* ── Legacy helpers (kept for compatibility) ─────────────────────────────── */
const FOOD_SAFETY = [
  {
    name: "Tomato",
    keywords: ["tomato", "tomatoes"],
    status: "Caution",
    canEat: "Ripe tomato flesh can be okay in very small amounts as an occasional treat.",
    howMuch: "Start with a tiny piece. Do not make it a regular or large snack.",
    avoid: "Green tomatoes, tomato leaves, stems, and tomato plants — these parts contain solanine.",
    watchFor: "Vomiting, diarrhoea, tiredness, or unusual behaviour.",
  },
  {
    name: "Chocolate",
    keywords: ["chocolate", "cocoa", "cacao", "choc"],
    status: "Unsafe",
    canEat: "Chocolate is toxic to dogs and should never be given to them.",
    howMuch: "None at all — no amount is considered safe.",
    avoid: "All types: dark, milk, white, cocoa powder, and baking chocolate.",
    watchFor: "Vomiting, diarrhoea, restlessness, tremors, rapid breathing, or seizures. Contact a vet right away.",
  },
  {
    name: "Grapes / Raisins",
    keywords: ["grape", "grapes", "raisin", "raisins", "sultana", "sultanas", "currant", "currants"],
    status: "Unsafe",
    canEat: "Grapes, raisins, and sultanas are toxic to dogs and should never be given to them.",
    howMuch: "None at all — even a small amount can cause serious harm.",
    avoid: "Fresh grapes, raisins, sultanas, currants, and any baked goods or foods that contain them.",
    watchFor: "Vomiting, diarrhoea, lethargy, or decreased urination. Contact a vet immediately.",
  },
  {
    name: "Onion",
    keywords: ["onion", "onions", "shallot", "shallots", "chive", "chives", "leek", "leeks", "spring onion"],
    status: "Unsafe",
    canEat: "Onions and related vegetables are toxic to dogs and should be avoided completely.",
    howMuch: "None at all — small amounts can build up over time and cause harm.",
    avoid: "Raw, cooked, or powdered onions, as well as chives, leeks, and shallots.",
    watchFor: "Weakness, reduced appetite, pale gums, and signs of digestive upset.",
  },
  {
    name: "Garlic",
    keywords: ["garlic"],
    status: "Unsafe",
    canEat: "Garlic is toxic to dogs and should not be given to them.",
    howMuch: "None at all — it is more potent than onion and even small amounts can be harmful.",
    avoid: "Fresh garlic, garlic powder, garlic oil, and any food that contains garlic.",
    watchFor: "Weakness, pale gums, digestive upset, reduced appetite, or tiredness.",
  },
  {
    name: "Apple",
    keywords: ["apple", "apples"],
    status: "Safe",
    canEat: "Apple flesh is safe for dogs and makes a refreshing crunchy snack.",
    howMuch: "One or two thin slices at a time is a perfect serving.",
    avoid: "Apple seeds and the core — seeds contain small amounts of cyanide compounds.",
    watchFor: "Apples are very well tolerated. Watch for any seed or core pieces that sneak in.",
  },
  {
    name: "Banana",
    keywords: ["banana", "bananas"],
    status: "Safe",
    canEat: "Bananas are safe for dogs and many love the sweet taste! They are high in natural sugar though.",
    howMuch: "A few small slices as an occasional treat. Not every day due to the sugar content.",
    avoid: "The banana peel — not toxic but it can be hard to digest.",
    watchFor: "Loose stools if given in large quantities. Otherwise bananas are usually very well tolerated.",
  },
  {
    name: "Carrot",
    keywords: ["carrot", "carrots"],
    status: "Safe",
    canEat: "Carrots are a wonderful snack for dogs! Low in calories and great for chewing.",
    howMuch: "One or two baby carrots, or a few sticks — a brilliant guilt-free treat.",
    avoid: "Nothing specific — carrots are one of the safest treats you can give a dog.",
    watchFor: "Carrots are very well tolerated. Enjoy!",
  },
  {
    name: "Peanut Butter",
    keywords: ["peanut butter", "peanut", "peanuts"],
    status: "Caution",
    canEat: "Plain peanut butter without xylitol is generally safe and a popular dog treat.",
    howMuch: "A small teaspoon occasionally. High in fat, so do not give it every day.",
    avoid: "Any peanut butter containing xylitol — xylitol is toxic to dogs. Always check the label.",
    watchFor: "Digestive upset if given too much. Check the label every single time to confirm it is xylitol-free.",
  },
  {
    name: "Chicken",
    keywords: ["chicken"],
    status: "Safe",
    canEat: "Plain cooked chicken is a great lean protein and easy on the stomach.",
    howMuch: "A few small pieces as a treat, or mixed into regular food. Keep portions sensible.",
    avoid: "Raw chicken (food safety risk), chicken bones (choking hazard), and seasoned or sauced chicken.",
    watchFor: "Plain cooked chicken is very well tolerated. Watch for hidden seasonings.",
  },
  {
    name: "Rice",
    keywords: ["rice", "white rice", "brown rice"],
    status: "Safe",
    canEat: "Plain cooked rice is gentle on the stomach and a common ingredient in bland meals.",
    howMuch: "A small amount mixed with their usual food is fine. It should not replace their regular balanced diet.",
    avoid: "Fried rice, flavoured rice, and rice with seasonings, sauces, or additives.",
    watchFor: "Plain rice is very gentle. Too much plain rice over time may not provide balanced nutrition.",
  },
  {
    name: "Avocado",
    keywords: ["avocado", "avocados", "avo", "guacamole"],
    status: "Unsafe",
    canEat: "Avocado contains persin, a compound that can be harmful to dogs.",
    howMuch: "None at all — keep avocado away from dogs.",
    avoid: "Avocado flesh, skin, pit, and leaves. Also avoid guacamole which contains avocado.",
    watchFor: "Vomiting, diarrhoea, congestion, or difficulty breathing. Contact a vet if your dog eats avocado.",
  },
];

/* ── AI response helpers ─────────────────────────────────────────────────────
   Four small functions that power the Comi AI Insights chat.
   Edit each one independently to improve accuracy or add new topics.
   ──────────────────────────────────────────────────────────────────────────── */

/** Step 1 — clean user input before any matching */
/* Legacy helper — no longer used in AiScreen but kept so existing code that
   still references it (if any) does not break during the transition. */
function normalizeQuestion(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

const BREEDS = [
  "Akita", "Australian Shepherd", "Beagle", "Border Collie", "Boston Terrier",
  "Boxer", "Bulldog", "Cavalier King Charles Spaniel", "Chihuahua", "Corgi",
  "Dachshund", "Dalmatian", "French Bulldog", "German Shepherd", "Golden Retriever",
  "Great Dane", "Husky", "Labrador Retriever", "Maltese", "Mixed breed",
  "Other", "Pomeranian", "Poodle", "Rottweiler", "Samoyed",
  "Shiba Inu", "Yorkshire Terrier",
];

/* Calculate a human-readable age string from a birthday ISO string */
function calcAge(birthday) {
  if (!birthday) return "";
  const birth = new Date(birthday);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months <= 0) return "";
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""}`;
}

const MOOD_ICONS = [
  { key: "fun",      label: "Fun",      src: IconFun,      moodKey: "playful" },
  { key: "sad",      label: "Sad",      src: IconSad,      moodKey: "sad"     },
  { key: "sleepy",   label: "Sleepy",   src: IconSleepy,   moodKey: "sleepy"  },
  { key: "thinking", label: "Thinking", src: IconThinking, moodKey: "calm"    },
  { key: "worry",    label: "Worry",    src: IconWorry,    moodKey: "anxious" },
];

/* ---------- MASCOT CUSTOMIZATION ---------- */

const MASCOT_BREEDS = [
  { label: "French Bulldog",  image: Dog101,   emoji: "🐾" },
  { label: "Corgi",           image: Corgi,    emoji: "🦊" },
  { label: "Golden Retriever",image: Golden,   emoji: "🌟" },
  { label: "Husky",           image: Husky,    emoji: "❄️" },
  { label: "Poodle",          image: Poodle,   emoji: "🐩" },
  { label: "Shiba Inu",       image: Siba,     emoji: "🦊" },
  { label: "Dalmatian",       image: ComiMain, emoji: "⚫" },
  { label: "Mixed breed",     image: ComiMain, emoji: "🐶" },
];

const MASCOT_COLORS    = ["Grey", "Cream", "Brown", "Black", "White", "Golden", "Mixed"];
const MASCOT_MARKINGS  = ["No markings", "Face patch", "Spots", "Dark ears", "Light belly"];
const MASCOT_POSES     = ["Happy", "Sleepy", "Playful", "Calm", "Worried"];

function getMascotImage(pet) {
  const breed = pet?.mascot?.breed;
  if (breed) {
    const found = MASCOT_BREEDS.find(b => b.label === breed);
    if (found) return found.image;
    // Handles special keys like "cody" that live in mascotMoodAssets but not MASCOT_BREEDS
    const neutral = mascotMoodAssets[breed]?.neutral;
    if (neutral) return neutral;
  }
  return ComiMain;
}

/* Maps mood key values (from MOODS array) to the 5 mood slots */
const MOOD_TO_SLOT = {
  playful: "fun", happy: "fun",
  sad: "sad", low_energy: "sad",
  sleepy: "sleepy",
  calm: "thinking",
  anxious: "worry",
};

/* Per-breed mood asset table.
   All slots currently use the same breed image as a placeholder.
   When per-mood PNGs are ready, import them and assign per slot.
   Example future slot:
     import CorgiFun from "./assets/mascots/corgi/fun.png";
     mascotMoodAssets["Corgi"].fun = CorgiFun;                 */
const mascotMoodAssets = {
  "cody":             { fun: IconFun,    sad: IconSad,    worry: IconWorry,  sleepy: IconSleepy, thinking: IconThinking, neutral: ComiMain },
  "French Bulldog":   { fun: Dog101,     sad: Dog101,     worry: Dog101,     sleepy: Dog101,     thinking: Dog101,     neutral: Dog101     },
  "Corgi":            { fun: Corgi,      sad: Corgi,      worry: Corgi,      sleepy: Corgi,      thinking: Corgi,      neutral: Corgi      },
  "Golden Retriever": { fun: Golden,     sad: Golden,     worry: Golden,     sleepy: Golden,     thinking: Golden,     neutral: Golden     },
  "Husky":            { fun: Husky,      sad: Husky,      worry: Husky,      sleepy: Husky,      thinking: Husky,      neutral: Husky      },
  "Poodle":           { fun: Poodle,     sad: Poodle,     worry: Poodle,     sleepy: Poodle,     thinking: Poodle,     neutral: Poodle     },
  "Shiba Inu":        { fun: Siba,       sad: Siba,       worry: Siba,       sleepy: Siba,       thinking: Siba,       neutral: Siba       },
  "Dalmatian":        { fun: ComiMain,   sad: ComiMain,   worry: ComiMain,   sleepy: ComiMain,   thinking: ComiMain,   neutral: ComiMain   },
  "Mixed breed":      { fun: ComiMain,   sad: ComiMain,   worry: ComiMain,   sleepy: ComiMain,   thinking: ComiMain,   neutral: ComiMain   },
};

/* Returns the right mascot image for a pet's breed + mood.
   Fallback chain: breed+mood → breed neutral → breed image → ComiMain */
function getMascotMoodImage(pet, moodKey) {
  const breed       = pet?.mascot?.breed;
  const slot        = MOOD_TO_SLOT[moodKey] || "neutral";
  const breedAssets = breed ? mascotMoodAssets[breed] : null;
  if (breedAssets?.[slot])  return breedAssets[slot];
  if (breedAssets?.neutral) return breedAssets.neutral;
  return getMascotImage(pet);
}

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

function Button({ children, onClick, variant = "primary", style, disabled }) {
  const styles = {
    primary:   { background: theme.ocean, color: "#fff",      border: "none" },
    secondary: { background: "#fff",      color: theme.ocean, border: `2px solid ${theme.sky}` },
    soft:      { background: theme.mist,  color: theme.ocean, border: "none" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "15px 18px", borderRadius: 999,
        fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "transform .08s ease",
        opacity: disabled ? 0.5 : 1,
        ...styles[variant],
        ...style,
      }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e)=> (e.currentTarget.style.transform = "scale(1)")}
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
        padding: "9px 16px", borderRadius: 999,
        border: active ? `2px solid ${theme.ocean}` : `2px solid #80A0FF`,
        background: active ? (color || theme.sky) : "#fff",
        color: active ? theme.ink : theme.slate,
        fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
        cursor: "pointer", whiteSpace: "nowrap",
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
          style={{ background: theme.mist, border: "none", borderRadius: 999, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer" }}
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

function Mascot({ pet, size = 64 }) {
  return (
    <img src={getMascotImage(pet)} alt={pet?.name || "Comi"} style={{ width: size, height: size, objectFit: "contain" }} />
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
        width: "100%", padding: "14px 16px", borderRadius: 16, border: `2px solid #80A0FF`,
        fontFamily: "Nunito", fontSize: 15, color: theme.ink, outline: "none", background: "#fff",
        boxSizing: "border-box",
      }}
    />
  );
}

function PersonalityPicker({ value, onChange, exclude, placeholder = "Choose a trait" }) {
  const [open, setOpen] = useState(false);
  const opts = PERSONALITY_TAGS.filter(t => t !== exclude);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 16,
          border: `2px solid ${value ? theme.ocean : "#80A0FF"}`,
          background: value ? theme.sky : "#fff",
          fontFamily: "Nunito", fontWeight: 700, fontSize: 15,
          color: value ? theme.ink : theme.slate,
          cursor: "pointer", textAlign: "left", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {value || placeholder}
        <ChevronDown size={16} color={theme.slate} />
      </button>
      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(52,65,78,0.35)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setOpen(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "20px 20px 36px", width: "100%", maxWidth: 390 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "#E6EEF5", margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: "#34414E", margin: "0 0 14px" }}>{placeholder}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {value && (
                <button onClick={() => { onChange(""); setOpen(false); }} style={{ padding: "9px 16px", borderRadius: 999, border: `2px solid #E6EEF5`, background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#7C8B98", cursor: "pointer" }}>
                  Clear
                </button>
              )}
              {opts.map(t => (
                <button
                  key={t}
                  onClick={() => { onChange(t); setOpen(false); }}
                  style={{
                    padding: "9px 16px", borderRadius: 999, cursor: "pointer",
                    border: `2px solid ${value === t ? "#5A8EC8" : "#80A0FF"}`,
                    background: value === t ? "#8AC6EC" : "#EAF4FB",
                    fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                    color: "#34414E",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Searchable breed dropdown */
function BreedDropdown({ value, onChange }) {
  const [query, setQuery]   = useState(value || "");
  const [open, setOpen]     = useState(false);

  const filtered = query.length > 0
    ? BREEDS.filter((b) => b.toLowerCase().includes(query.toLowerCase()))
    : BREEDS;

  const select = (breed) => {
    setQuery(breed);
    onChange(breed);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search breed..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          style={{
            width: "100%", padding: "14px 40px 14px 16px", borderRadius: 16,
            border: `2px solid ${open ? theme.ocean : "#80A0FF"}`,
            fontFamily: "Nunito", fontSize: 15, color: theme.ink,
            outline: "none", background: "#fff", boxSizing: "border-box",
          }}
        />
        <Search size={16} color={theme.slate} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", border: `2px solid #80A0FF`, borderRadius: 16,
          boxShadow: theme.shadow, zIndex: 100, maxHeight: 180, overflowY: "auto", marginTop: 4,
        }}>
          {filtered.map((b) => (
            <div
              key={b}
              onMouseDown={() => select(b)}
              style={{ padding: "11px 16px", fontFamily: "Nunito", fontSize: 14, color: theme.ink, cursor: "pointer", borderBottom: `1px solid ${theme.line}` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.mist)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {b}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Pet avatar — shows uploaded photo or pet's selected mascot as fallback */
function PetAvatar({ pet, petPhoto, size = 48, style }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: theme.sky, display: "grid", placeItems: "center",
      overflow: "hidden", flexShrink: 0, ...style,
    }}>
      {petPhoto
        ? <img src={petPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="pet" />
        : <img src={getMascotImage(pet)} alt={pet?.name || "Comi"} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
      }
    </div>
  );
}

/* Structured card shown for food-safety answers */
function KnowledgeAnswerCard({ entry, petName }) {
  const risk = RISK_STYLE[entry.riskLevel] || RISK_STYLE.low;
  const p = (text) => personalizeText(text, petName);

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: 16,
      boxShadow: "0 2px 14px rgba(90,142,200,0.13)",
      border: `1.5px solid ${risk.bg}`,
    }}>
      {/* Title */}
      <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 10px" }}>
        {p(entry.title)}
      </p>

      {/* Answer */}
      <p style={{ fontFamily: "Nunito", fontSize: 13.5, color: theme.ink, lineHeight: 1.55, margin: "0 0 10px" }}>
        {p(entry.safeAnswer)}
      </p>

      {/* Caution box */}
      <div style={{ background: risk.bg, borderRadius: 12, padding: "8px 12px", marginBottom: 8 }}>
        <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: risk.color, margin: "0 0 3px" }}>
          ⚠️ Caution
        </p>
        <p style={{ fontFamily: "Nunito", fontSize: 12.5, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
          {p(entry.caution)}
        </p>
      </div>

      {/* When to contact vet */}
      <div style={{ background: "#EAF4FB", borderRadius: 12, padding: "8px 12px", marginBottom: 8 }}>
        <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, margin: "0 0 3px" }}>
          🩺 When to contact your vet
        </p>
        <p style={{ fontFamily: "Nunito", fontSize: 12.5, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
          {p(entry.whenToContactVet)}
        </p>
      </div>

      {/* Tips */}
      {entry.relatedTips?.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ink, margin: "0 0 5px" }}>
            💡 Tips
          </p>
          {entry.relatedTips.map((tip, i) => (
            <p key={i} style={{ fontFamily: "Nunito", fontSize: 12.5, color: theme.ink, margin: "0 0 3px", paddingLeft: 10, lineHeight: 1.4 }}>
              · {p(tip)}
            </p>
          ))}
        </div>
      )}

      {/* Footer: risk badge + disclaimer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, flexWrap: "wrap", gap: 6 }}>
        <span style={{
          fontFamily: "Nunito", fontWeight: 700, fontSize: 11.5,
          padding: "4px 12px", borderRadius: 999,
          background: risk.bg, color: risk.color,
        }}>
          {risk.label}
        </span>
        <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate }}>
          ⚕️ Friendly guidance · always consult your vet
        </span>
      </div>
    </div>
  );
}

const labelStyle = { fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, display: "block", marginBottom: 6 };

/* ---------- 4. SCREENS ---------- */

// 1. Welcome
function Welcome({ go }) {
  const btnBase = {
    width: "100%", padding: "15px 18px", borderRadius: 999, cursor: "pointer",
    fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, border: "none",
    transition: "transform .08s ease",
  };
  const press   = (e) => (e.currentTarget.style.transform = "scale(0.97)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  return (
    <div style={{
      height: "100%",
      background: "transparent",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Headline */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "52px 32px 0",
      }}>
        <h1 style={{
          fontFamily: "Quicksand", fontWeight: 800, fontSize: 32,
          color: "#fff", margin: 0, lineHeight: 1.18,
        }}>
          I can finally<br />understand<br />my pet.
        </h1>
      </div>

      {/* Hero mascot — anchored bottom, covers lower ~2/3 */}
      <img
        src={CodyWaving}
        alt="Cody"
        style={{
          position: "absolute",
          bottom: -270,
          left: "40%",
          transform: "translateX(-50%)",
          width: 1100,
          height: 1100,
          objectFit: "contain",
          zIndex: 1,
        }}
      />

      {/* Soft fade so buttons read cleanly over Cody */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 250,
        background: `linear-gradient(to bottom, transparent 0%, rgba(92,173,212,0.55) 52%, rgba(92,173,212,0.93) 100%)`,
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* Buttons — pinned to bottom, on top of Cody */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "0 28px 44px",
        zIndex: 3,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <button
          onClick={() => go("auth")}
          style={{ ...btnBase, background: "#fff", color: theme.ocean, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
        >
          Get started
        </button>
        <button
          onClick={() => go("auth")}
          style={{ ...btnBase, background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)" }}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
        >
          I already have an account
        </button>
      </div>

    </div>
  );
}

// 2. Sign Up / Log In
function Auth({ go, onSignup, onDemoLogin }) {
  const [step, setStep] = useState("landing"); // "landing" | "signup" | "login"

  // All form state declared upfront (React rules of hooks)
  const [formName,       setFormName]       = useState("");
  const [formUsername,   setFormUsername]   = useState("");
  const [formEmail,      setFormEmail]      = useState("");
  const [formPassword,   setFormPassword]   = useState("");
  const [formConfirmPw,  setFormConfirmPw]  = useState("");
  const [formNewsletter, setFormNewsletter] = useState(true);
  const [loginCred,      setLoginCred]      = useState("");
  const [loginPass,      setLoginPass]      = useState("");
  const [errors,         setErrors]         = useState({});

  // Mock user store helpers
  const getStoredUsers = () => {
    const demoEntry = {
      username: DEMO_OWNER.username,
      email:    DEMO_OWNER.email,
      password: DEMO_OWNER.password,
      name:     DEMO_OWNER.name,
      role:     DEMO_OWNER.role,
    };
    try {
      const raw  = localStorage.getItem("comi_users");
      const base = (raw ? JSON.parse(raw) : null) || [];
      const hasDemo = base.some(u => u.email?.trim().toLowerCase() === DEMO_OWNER.email.toLowerCase());
      const users = hasDemo ? base : [...base, demoEntry];
      localStorage.setItem("comi_users", JSON.stringify(users));
      return users;
    } catch {
      return [demoEntry];
    }
  };
  const saveStoredUsers = (users) => {
    try { localStorage.setItem("comi_users", JSON.stringify(users)); } catch {}
  };

  // Direct demo-account login — bypasses credential checking entirely
  const handleDemoAccountLogin = () => {
    console.log("[Comi] Demo account login triggered");
    try { if (onSignup)    onSignup({ name: DEMO_OWNER.name, email: DEMO_OWNER.email, username: DEMO_OWNER.username, role: DEMO_OWNER.role }); } catch(e) { console.error("[Comi] onSignup error:", e); }
    try { if (onDemoLogin) onDemoLogin(); } catch(e) { console.error("[Comi] onDemoLogin error:", e); }
    console.log("[Comi] Navigating to home");
    go("home");
  };

  const press   = (e) => (e.currentTarget.style.transform = "scale(0.97)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  const authAnim = `
    @keyframes codyWalkBody {
      0%   { transform: translateY(3px)  rotate(-2deg);   }
      10%  { transform: translateY(1px)  rotate(-1.8deg); }
      20%  { transform: translateY(-4px) rotate(-0.8deg); }
      30%  { transform: translateY(-5px) rotate(0deg);    }
      40%  { transform: translateY(-2px) rotate(0.8deg);  }
      50%  { transform: translateY(3px)  rotate(2deg);    }
      60%  { transform: translateY(1px)  rotate(1.8deg);  }
      70%  { transform: translateY(-4px) rotate(0.8deg);  }
      80%  { transform: translateY(-5px) rotate(0deg);    }
      90%  { transform: translateY(-2px) rotate(-0.8deg); }
      100% { transform: translateY(3px)  rotate(-2deg);   }
    }
    @keyframes codyWalkSway {
      0%   { transform: translateX(-3px); }
      25%  { transform: translateX(0px);  }
      50%  { transform: translateX(3px);  }
      75%  { transform: translateX(0px);  }
      100% { transform: translateX(-3px); }
    }
    @keyframes codyWalkShadow {
      0%, 50%, 100% { width: 80px; opacity: 0.45; }
      25%, 75%       { width: 56px; opacity: 0.15; }
    }
  `;

  // Shared field style for forms
  const fi = {
    padding: "13px 16px", borderRadius: 14, border: "1.5px solid #D4E6F4",
    fontFamily: "Nunito, sans-serif", fontSize: 15, color: "#34414E",
    outline: "none", background: "#F7FBFE", boxSizing: "border-box",
    width: "100%", display: "block", transition: "border-color 0.15s",
  };
  const fiFocus = (e) => (e.target.style.borderColor = "#5AB4DC");
  const fiBlur  = (e) => (e.target.style.borderColor = "#D4E6F4");
  const fiErr   = (e) => (e.target.style.borderColor = "#F08080");

  // Shared SVG icons
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
  const AppleIcon = () => (
    <svg viewBox="0 0 814 1000" width="15" height="18" fill="#1D1D1F" style={{ flexShrink: 0 }}>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.5-155.4-128.6C46.9 727.5 0 620 0 516.8 0 223.1 190.3 68.6 375.7 68.6c92.3 0 169.1 60.8 226.1 60.8 57 0 147.9-63.2 225.7-63.2 28.7 0 102.7 4.5 155.5 53.8zM543.3 49c-55.6 23.8-100.9 86.8-100.9 152.6 0 8.3 1.3 16.6 2.6 23.2 4.5.6 11.6 1.3 18.6 1.3 49.3 0 99.3-28.7 133.5-83.5 22.5-35.7 36.5-82.1 36.5-125.3 0-7-1.3-14-1.9-17.3-4.5.6-12.1 1.9-18.6 2.6C579 3.2 563.7 27.5 543.3 49z"/>
    </svg>
  );

  const socialBtnStyle = {
    width: "100%", padding: "13px 16px", borderRadius: 14,
    border: "1.5px solid #D8EBF5", background: "#fff",
    fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
    color: "#34414E", cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 10, transition: "transform 0.08s ease",
  };

  /* ── LANDING (second screen: choice card) ── */
  if (step === "landing") {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "transparent",
        overflow: "hidden",
      }}>
        <style>{authAnim}</style>

        {/* Top bar: back + logo */}
        <div style={{
          flexShrink: 0, display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 20px 0",
        }}>
          <button
            onClick={() => go("welcome")}
            style={{
              background: "rgba(255,255,255,0.28)", border: "none", borderRadius: 999,
              width: 36, height: 36, display: "grid", placeItems: "center",
              cursor: "pointer", flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} color="#fff" />
          </button>
          <span style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 20, color: "rgba(255,255,255,0.94)", letterSpacing: "0.07em" }}>
            comi
          </span>
          <div style={{ width: 36 }} />
        </div>

        {/* Mascot — Cody walking in place */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "0 0 16px", marginLeft: -30 }}>
          <div style={{ position: "relative", animation: "codyWalkSway 0.8s linear infinite" }}>
            <img
              src={CodyWalkAway}
              alt="Cody walking"
              style={{
                width: 320, height: "auto", objectFit: "contain",
                animation: "codyWalkBody 0.8s linear infinite",
                transformOrigin: "center 88%",
                pointerEvents: "none", display: "block",
              }}
            />
            {/* Ground shadow — pulses with each step contact */}
            <div style={{
              position: "absolute", bottom: -2, left: "50%",
              height: 10, borderRadius: "50%",
              background: "rgba(30,90,150,0.20)",
              animation: "codyWalkShadow 0.8s linear infinite",
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* White rounded bottom card */}
        <div style={{
          flexShrink: 0, background: "#fff",
          borderRadius: "28px 28px 0 0",
          padding: "12px 22px 22px",
          boxShadow: "0 -6px 32px rgba(80,130,190,0.13)",
        }}>
          {/* Card headline */}
          <h2 style={{
            fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 22,
            color: "#2A3D52", margin: "0 0 4px", textAlign: "center",
          }}>
            Create your Comi account
          </h2>
          <p style={{
            fontFamily: "Nunito, sans-serif", fontSize: 13.5, color: "#7C8B98",
            margin: "0 0 20px", textAlign: "center", lineHeight: 1.5,
          }}>
            Save your pet's mood, wellness patterns,<br />reminders, and profile.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Create account — primary */}
            <button
              onClick={() => { setFormName(""); setFormUsername(""); setFormEmail(""); setFormPassword(""); setFormConfirmPw(""); setErrors({}); setStep("signup"); }}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              style={{
                width: "100%", padding: "16px", borderRadius: 999, border: "none",
                background: "linear-gradient(135deg, #5AB4DC 0%, #3A8DBE 100%)",
                color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
                cursor: "pointer", boxShadow: "0 6px 22px rgba(58,141,190,0.28)",
                transition: "transform 0.08s ease",
              }}
            >
              Create account
            </button>

            {/* Log in — ghost */}
            <button
              onClick={() => setStep("login")}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              style={{
                width: "100%", padding: "14px", borderRadius: 999,
                border: "2px solid #C8DCF0", background: "transparent",
                color: "#3A8DBE", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
                cursor: "pointer", transition: "transform 0.08s ease",
              }}
            >
              Log in
            </button>

            {/* Demo quick-login */}
            <button
              onClick={handleDemoAccountLogin}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              style={{
                width: "100%", padding: "14px", borderRadius: 999,
                border: "2px dashed #A8D4EA", background: "rgba(168,212,234,0.12)",
                color: "#3A8DBE", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
                cursor: "pointer", transition: "transform 0.08s ease",
              }}
            >
              Use demo account
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#E4EFF8" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#AABFD0" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#E4EFF8" }} />
            </div>

            {/* Google */}
            <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={socialBtnStyle}>
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Apple */}
            <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={socialBtnStyle}>
              <AppleIcon />
              Continue with Apple
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── SIGNUP FORM ── */
  if (step === "signup") {
    const validate = () => {
      const users = getStoredUsers();
      const errs = {};
      if (!formName.trim())     errs.name     = "Please enter your name.";
      if (!formUsername.trim()) errs.username = "Please choose a username.";
      else if (users.some(u => u.username?.toLowerCase() === formUsername.toLowerCase()))
        errs.username = "Username is already taken.";
      if (!formEmail.trim())    errs.email    = "Please enter your email.";
      else if (users.some(u => u.email?.toLowerCase() === formEmail.toLowerCase()))
        errs.email = "An account with this email already exists.";
      if (formPassword.length < 8) errs.password = "Password must be at least 8 characters.";
      if (formConfirmPw !== formPassword) errs.confirm = "Passwords don't match.";
      return errs;
    };

    const handleCreate = () => {
      const errs = validate();
      if (Object.keys(errs).length) { setErrors(errs); return; }
      const users = getStoredUsers();
      users.push({ username: formUsername, email: formEmail, password: formPassword, name: formName, newsletter: formNewsletter });
      saveStoredUsers(users);
      if (onSignup) onSignup({ name: formName, email: formEmail, username: formUsername, newsletter: formNewsletter });
      go("privacy");
    };

    const fieldBorder = (key) => errors[key] ? "#F08080" : "#D4E6F4";
    const clearErr    = (key) => setErrors(p => ({ ...p, [key]: undefined }));

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0F8FD", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 0" }}>
          <button
            onClick={() => { setErrors({}); setStep("landing"); }}
            style={{ background: "#fff", border: "none", borderRadius: 999, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.10)", flexShrink: 0 }}
          >
            <ChevronLeft size={18} color="#3A8DBE" />
          </button>
          <div>
            <h2 style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 22, color: "#2A3D52", margin: 0 }}>
              Create account
            </h2>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#8BA0B4", margin: "1px 0 0" }}>
              Join Comi and understand your pet better.
            </p>
          </div>
        </div>

        {/* Scrollable form */}
        <form autoComplete="off" onSubmit={e => { e.preventDefault(); handleCreate(); }} style={{ flex: 1, margin: "14px 16px 16px", background: "#fff", borderRadius: 24, padding: "20px 18px 22px", boxShadow: "0 4px 20px rgba(90,142,200,0.08)", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>

          {/* Full name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input placeholder="Full name" name="fullName" autoComplete="off" value={formName}
              onChange={e => { setFormName(e.target.value); clearErr("name"); }}
              onFocus={fiFocus} onBlur={fiBlur}
              style={{ ...fi, borderColor: fieldBorder("name") }} />
            {errors.name && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#E06060", paddingLeft: 4 }}>{errors.name}</span>}
          </div>

          {/* Username */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input placeholder="Username" name="username" autoComplete="off" value={formUsername}
              onChange={e => { setFormUsername(e.target.value); clearErr("username"); }}
              onFocus={fiFocus} onBlur={fiBlur}
              style={{ ...fi, borderColor: fieldBorder("username") }} />
            {errors.username && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#E06060", paddingLeft: 4 }}>{errors.username}</span>}
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input placeholder="Email" type="email" name="signupEmail" autoComplete="new-email" value={formEmail}
              onChange={e => { setFormEmail(e.target.value); clearErr("email"); }}
              onFocus={fiFocus} onBlur={fiBlur}
              style={{ ...fi, borderColor: fieldBorder("email") }} />
            {errors.email && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#E06060", paddingLeft: 4 }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input placeholder="Password" type="password" name="newPassword" autoComplete="new-password" value={formPassword}
              onChange={e => { setFormPassword(e.target.value); clearErr("password"); }}
              onFocus={fiFocus} onBlur={fiBlur}
              style={{ ...fi, borderColor: fieldBorder("password") }} />
            {errors.password && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#E06060", paddingLeft: 4 }}>{errors.password}</span>}
          </div>

          {/* Confirm password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <input placeholder="Confirm password" type="password" name="confirmPassword" autoComplete="new-password" value={formConfirmPw}
              onChange={e => { setFormConfirmPw(e.target.value); clearErr("confirm"); }}
              onFocus={fiFocus} onBlur={fiBlur}
              style={{ ...fi, borderColor: fieldBorder("confirm") }} />
            {errors.confirm && <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#E06060", paddingLeft: 4 }}>{errors.confirm}</span>}
          </div>

          {/* Newsletter */}
          <div
            onClick={() => setFormNewsletter(v => !v)}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 14px", background: "#F0F8FD", borderRadius: 14,
              border: `1.5px solid ${formNewsletter ? "#5AB4DC" : "#D4E6F4"}`,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
              border: `2px solid ${formNewsletter ? "#5AB4DC" : "#AACCE0"}`,
              background: formNewsletter ? "#5AB4DC" : "transparent",
              display: "grid", placeItems: "center",
            }}>
              {formNewsletter && <Check size={12} color="#fff" />}
            </div>
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#3A4E60", lineHeight: 1.5, flex: 1 }}>
              Send me Comi updates, pet wellness tips, and community news.
            </span>
          </div>

          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#A0B4C4", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
            By creating an account you agree to Comi's privacy and consent terms.
          </p>

          <button
            type="submit"
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "16px", borderRadius: 999, border: "none",
              background: "linear-gradient(135deg, #5AB4DC 0%, #3A8DBE 100%)",
              color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
              cursor: "pointer", boxShadow: "0 6px 20px rgba(58,141,190,0.28)",
              transition: "transform 0.08s ease", marginTop: 4,
            }}
          >
            Create account
          </button>
        </form>
      </div>
    );
  }

  /* ── LOGIN FORM ── */
  const handleLogin = () => {
    const cred = loginCred.trim().toLowerCase();
    const pass = loginPass.trim();
    console.log("[Comi] handleLogin called. cred:", cred);

    if (!cred || !pass) {
      setErrors({ login: "Please enter your email/username and password." });
      return;
    }

    // Accept common typo variants for the demo email
    const DEMO_EMAIL_VARIANTS = [
      DEMO_OWNER.email.toLowerCase(),
      "tmothylai0601@gmail.com",
    ];
    const isDemoEmail    = DEMO_EMAIL_VARIANTS.includes(cred);
    const isDemoUsername = cred === DEMO_OWNER.username.toLowerCase();

    console.log("[Comi] Demo match — email:", isDemoEmail, "username:", isDemoUsername);

    if (isDemoEmail || isDemoUsername) {
      if (pass !== DEMO_OWNER.password) {
        setErrors({ login: "Incorrect password." });
        return;
      }
      console.log("[Comi] Demo credentials valid — logging in");
      handleDemoAccountLogin();
      return;
    }

    // Regular accounts via localStorage
    let users = [];
    try { users = getStoredUsers(); } catch(e) { console.error("[Comi] getStoredUsers error:", e); }
    console.log("[Comi] Checking", users.length, "stored users");
    const found = users.find(u =>
      u.email?.trim().toLowerCase() === cred ||
      u.username?.trim().toLowerCase() === cred
    );
    if (!found) { setErrors({ login: "Account not found." }); return; }
    if (found.password !== pass) { setErrors({ login: "Incorrect password." }); return; }
    console.log("[Comi] Regular user found:", found.name, "— logging in");
    try { if (onSignup) onSignup({ name: found.name, email: found.email, username: found.username }); } catch {}
    go("home");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F0F8FD", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 0" }}>
        <button
          onClick={() => { setErrors({}); setStep("landing"); }}
          style={{ background: "#fff", border: "none", borderRadius: 999, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.10)", flexShrink: 0 }}
        >
          <ChevronLeft size={18} color="#3A8DBE" />
        </button>
        <div>
          <h2 style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 22, color: "#2A3D52", margin: 0 }}>
            Welcome back
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#8BA0B4", margin: "1px 0 0" }}>
            Sign in to continue to Comi.
          </p>
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={e => { e.preventDefault(); handleLogin(); }}
        style={{ flex: 1, margin: "14px 16px 16px", background: "#fff", borderRadius: 24, padding: "22px 18px 24px", boxShadow: "0 4px 20px rgba(90,142,200,0.08)", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}
      >

        <input
          placeholder="Email or username" name="loginIdentifier" autoComplete="username" value={loginCred}
          onChange={e => { setLoginCred(e.target.value); setErrors({}); }}
          onFocus={fiFocus} onBlur={fiBlur}
          style={{ ...fi, borderColor: errors.login ? "#F08080" : "#D4E6F4" }}
        />
        <input
          placeholder="Password" type="password" name="loginPassword" autoComplete="current-password" value={loginPass}
          onChange={e => { setLoginPass(e.target.value); setErrors({}); }}
          onFocus={fiFocus} onBlur={fiBlur}
          style={{ ...fi, borderColor: errors.login ? "#F08080" : "#D4E6F4" }}
        />

        {errors.login && (
          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#E06060", paddingLeft: 2 }}>
            {errors.login}
          </span>
        )}

        <button
          type="button"
          onClick={() => setErrors(p => ({ ...p, forgot: true }))}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#5AB4DC", textAlign: "right", padding: 0, marginTop: -4 }}
        >
          Forgot password?
        </button>

        <button
          type="submit"
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{
            width: "100%", padding: "16px", borderRadius: 999, border: "none",
            background: "linear-gradient(135deg, #5AB4DC 0%, #3A8DBE 100%)",
            color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
            cursor: "pointer", boxShadow: "0 6px 20px rgba(58,141,190,0.28)",
            transition: "transform 0.08s ease",
          }}
        >
          Log in
        </button>

        {/* Demo quick-login — always works for prototype testing */}
        <button
          type="button"
          onClick={handleDemoAccountLogin}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{
            width: "100%", padding: "13px", borderRadius: 999,
            border: "2px dashed #A8D4EA", background: "rgba(168,212,234,0.12)",
            color: "#3A8DBE", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
            cursor: "pointer", transition: "transform 0.08s ease",
          }}
        >
          Use demo account
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "#E4EFF8" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#AABFD0" }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#E4EFF8" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <button type="button" onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={socialBtnStyle}>
            <GoogleIcon />
            Continue with Google
          </button>
          <button type="button" onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={socialBtnStyle}>
            <AppleIcon />
            Continue with Apple
          </button>
        </div>

        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 13, color: "#8BA0B4", textAlign: "center", margin: "4px 0 0" }}>
          Don't have an account?{" "}
          <span
            onClick={() => { setErrors({}); setStep("signup"); }}
            style={{ color: "#3A8DBE", fontWeight: 700, cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}

// 2b. Privacy & Consent (shown after sign-up, before pet setup)
function PrivacyScreen({ go }) {
  const [agreed, setAgreed] = useState(false);
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", minHeight: "100%", gap: 16 }}>
      <TopBar title="Before we start" onBack={() => go("auth")} />
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>
          A quick note about how Comi works
        </p>
      </div>

      <Card>
        {[
          "Comi stores your pet's profile and wellness check-ins to help you notice patterns over time.",
          "Comi offers friendly everyday guidance — not medical advice.",
          "For any health concerns, please contact your vet. Your vet knows your pet best!",
          "This is a prototype. Please don't enter real sensitive personal information.",
        ].map((text, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? `1px solid ${theme.line}` : "none" }}>
            <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: 0, lineHeight: 1.55 }}>{text}</p>
          </div>
        ))}
      </Card>

      {/* Checkbox row */}
      <label
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px", background: "#fff", borderRadius: 16,
          border: `2px solid ${agreed ? theme.ocean : "#80A0FF"}`,
          cursor: "pointer", transition: "border-color 0.15s",
        }}
      >
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ display: "none" }} />
        <div style={{
          width: 22, height: 22, borderRadius: 7, flexShrink: 0,
          border: `2px solid ${agreed ? theme.ocean : "#80A0FF"}`,
          background: agreed ? theme.ocean : "#fff",
          display: "grid", placeItems: "center", transition: "all 0.15s",
        }}>
          {agreed && <Check size={13} color="#fff" strokeWidth={3} />}
        </div>
        <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ink }}>
          I understand and agree
        </span>
      </label>

      <Button onClick={() => go("setup")} disabled={!agreed}>
        Continue
      </Button>
    </div>
  );
}

// 3. Pet Profile Setup
function Setup({ go, pet, setPet, petPhoto, setPetPhoto, onSave, onBack, isAddingPet }) {
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [primary,          setPrimary]          = useState(pet.personality[0] || "");
  const [second,           setSecond]           = useState(pet.personality[1] || "");
  const [petSex,           setPetSex]           = useState(pet.sex || "");
  const [lastHeatDate,     setLastHeatDate]     = useState(pet.lastHeatDate || "");
  const [heatNotes,        setHeatNotes]        = useState(pet.heatNotes || "");
  // mascot customization
  const [mascotBreed,    setMascotBreed]    = useState(pet.mascot?.breed    || "");
  const [mascotColor,    setMascotColor]    = useState(pet.mascot?.color    || "");
  const [mascotMarkings, setMascotMarkings] = useState(pet.mascot?.markings || "No markings");
  const [mascotPose,     setMascotPose]     = useState(pet.mascot?.pose     || "Happy");

  const mascotPreviewImg = mascotBreed
    ? (MASCOT_BREEDS.find(b => b.label === mascotBreed)?.image || ComiMain)
    : ComiMain;

  const handleCreateProfile = () => {
    const personalities = [primary, second].filter(Boolean);
    const mascot = mascotBreed
      ? { breed: mascotBreed, color: mascotColor || "Mixed", markings: mascotMarkings, pose: mascotPose }
      : null;
    const updatedPet = {
      ...pet,
      sex: petSex,
      personality: personalities,
      mascot,
      ...(petSex === "female" && { lastHeatDate, heatNotes }),
    };
    if (onSave) {
      onSave(updatedPet);
    } else {
      setPet(updatedPet);
      go("home");
    }
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setPetPhoto(URL.createObjectURL(file));
    setShowPhotoOptions(false);
  };

  const ageDisplay = calcAge(pet.birthday);

  return (
    <div style={{ padding: 22, paddingBottom: 32 }}>
      <TopBar title={isAddingPet ? "Add another pet" : "Add your pet"} onBack={onBack || (() => go("privacy"))} />

      {/* Avatar with upload button */}
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 22px" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 96, height: 96, borderRadius: "50%", background: theme.mist,
            display: "grid", placeItems: "center", fontSize: 44,
            border: `3px solid #fff`, boxShadow: theme.shadow, overflow: "hidden", cursor: "pointer",
          }} onClick={() => setShowPhotoOptions(true)}>
            {petPhoto
              ? <img src={petPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="pet" />
              : <img src={getMascotImage(pet)} alt={pet.name || "Comi"} style={{ width: "80%", height: "80%", objectFit: "contain" }} />}
          </div>
          <div
            onClick={() => setShowPhotoOptions(true)}
            style={{ position: "absolute", bottom: 0, right: 0, background: theme.ocean, borderRadius: "50%", width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: theme.shadow }}
          >
            <Camera size={16} color="#fff" />
          </div>
        </div>
      </div>

      {/* Photo options bottom sheet */}
      {showPhotoOptions && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowPhotoOptions(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "22px 22px 32px", width: "100%", maxWidth: 390 }} onClick={(e) => e.stopPropagation()}>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: theme.ink, margin: "0 0 16px", textAlign: "center" }}>
              Add a pet photo
            </p>
            {/* Take photo (camera capture) */}
            <label style={{ display: "block", padding: "14px 16px", borderRadius: 16, background: theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink, marginBottom: 10, cursor: "pointer", textAlign: "center" }}>
              📷 Take photo
              <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
            </label>
            {/* Choose from library */}
            <label style={{ display: "block", padding: "14px 16px", borderRadius: 16, background: theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink, marginBottom: 10, cursor: "pointer", textAlign: "center" }}>
              🖼️ Choose from photo library
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            </label>
            <button onClick={() => setShowPhotoOptions(false)} style={{ width: "100%", padding: 14, borderRadius: 16, border: "none", background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.slate, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <label style={labelStyle}>Pet's name</label>
      <Field placeholder="e.g. Cody" value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} />
      <div style={{ height: 12 }} />

      <label style={labelStyle}>Sex</label>
      <div style={{ display: "flex", gap: 10 }}>
        {[["male", "♂ Male"], ["female", "♀ Female"]].map(([val, lbl]) => (
          <button key={val} onClick={() => setPetSex(val)} style={{
            flex: 1, padding: "13px 0", borderRadius: 14, cursor: "pointer",
            border: `2px solid ${petSex === val ? theme.ocean : "#80A0FF"}`,
            background: petSex === val ? theme.sky : "#fff",
            fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ink,
          }}>
            {lbl}
          </button>
        ))}
      </div>
      <div style={{ height: 12 }} />

      <label style={labelStyle}>Type / breed</label>
      <BreedDropdown value={pet.breed} onChange={(val) => setPet({ ...pet, breed: val })} />
      <div style={{ height: 12 }} />

      <label style={labelStyle}>Pet's birthday</label>
      <input
        type="date"
        value={pet.birthday || ""}
        onChange={(e) => setPet({ ...pet, birthday: e.target.value })}
        max={new Date().toISOString().split("T")[0]}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 16,
          border: `2px solid #80A0FF`, fontFamily: "Nunito",
          fontSize: 15, color: theme.ink, outline: "none",
          background: "#fff", boxSizing: "border-box",
        }}
      />
      {ageDisplay && (
        <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ocean, margin: "5px 0 0 4px", fontWeight: 700 }}>
          Age: {ageDisplay}
        </p>
      )}
      <div style={{ height: 12 }} />

      <label style={labelStyle}>Weight</label>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          placeholder="e.g. 24"
          value={pet.weight || ""}
          min="0"
          onChange={(e) => setPet({ ...pet, weight: e.target.value })}
          style={{
            flex: 1, padding: "14px 16px", borderRadius: 16,
            border: `2px solid #80A0FF`, fontFamily: "Nunito",
            fontSize: 15, color: theme.ink, outline: "none",
            background: "#fff", boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["lb", "kg"].map((unit) => (
            <button
              key={unit}
              onClick={() => setPet({ ...pet, weightUnit: unit })}
              style={{
                padding: "0 18px", borderRadius: 16, cursor: "pointer",
                border: `2px solid ${pet.weightUnit === unit ? theme.ocean : "#80A0FF"}`,
                background: pet.weightUnit === unit ? theme.sky : "#fff",
                fontFamily: "Nunito", fontWeight: 700, fontSize: 14,
                color: pet.weightUnit === unit ? theme.ink : theme.slate,
              }}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 16 }} />

      {/* Female health tracking — shown only when sex is female */}
      {petSex === "female" && (
        <div style={{ background: "#FEF0F5", borderRadius: 18, padding: 16, marginBottom: 16, border: "2px solid #F9C7D8" }}>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 14px" }}>
            ♀ Female health
          </p>
          <label style={labelStyle}>Last heat / cycle date (optional)</label>
          <input
            type="date"
            value={lastHeatDate}
            onChange={(e) => setLastHeatDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 14,
              border: "2px solid #F9C7D8", fontFamily: "Nunito",
              fontSize: 15, color: theme.ink, outline: "none",
              background: "#fff", boxSizing: "border-box", marginBottom: 12,
            }}
          />
          <label style={labelStyle}>Notes (optional)</label>
          <textarea
            value={heatNotes}
            onChange={(e) => setHeatNotes(e.target.value)}
            placeholder="e.g. Last cycle lasted about 3 weeks"
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 14,
              border: "2px solid #F9C7D8", fontFamily: "Nunito",
              fontSize: 14, color: theme.ink, outline: "none",
              resize: "none", height: 72, boxSizing: "border-box", background: "#fff",
            }}
          />
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#C4617B", margin: "10px 0 0", lineHeight: 1.5 }}>
            Comi helps you notice patterns. This is not a medical record.
          </p>
        </div>
      )}

      <label style={labelStyle}>Personality</label>
      <PersonalityPicker value={primary} onChange={setPrimary} placeholder="Choose a personality" />
      <div style={{ height: 12 }} />

      <label style={labelStyle}>Second personality (optional)</label>
      <PersonalityPicker value={second} onChange={setSecond} exclude={primary} placeholder="Add a second trait (optional)" />

      {/* ── Mascot customization ── */}
      <div style={{ marginTop: 28, marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 1, background: "#E6EEF5" }} />
          <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: "#7C8B98", whiteSpace: "nowrap" }}>Choose your Comi mascot</span>
          <div style={{ flex: 1, height: 1, background: "#E6EEF5" }} />
        </div>
        <p style={{ fontFamily: "Nunito", fontSize: 13, color: "#7C8B98", margin: "0 0 14px", textAlign: "center", lineHeight: 1.5 }}>
          Pick a mascot style that looks like {pet.name || "your pet"}. This will be your Comi character.
        </p>

        {/* Breed selector */}
        <label style={labelStyle}>Breed / style</label>
        <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
          {MASCOT_BREEDS.map(b => (
            <button
              key={b.label}
              onClick={() => setMascotBreed(mascotBreed === b.label ? "" : b.label)}
              style={{
                flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, padding: "10px 10px 8px", borderRadius: 18, cursor: "pointer",
                border: `2px solid ${mascotBreed === b.label ? "#5A8EC8" : "#80A0FF"}`,
                background: mascotBreed === b.label ? "#EAF4FB" : "#fff",
                minWidth: 72,
              }}
            >
              <img src={b.image} alt={b.label} style={{ width: 48, height: 48, objectFit: "contain" }} />
              <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: mascotBreed === b.label ? "#5A8EC8" : "#7C8B98", textAlign: "center", lineHeight: 1.3 }}>
                {b.label}
              </span>
            </button>
          ))}
        </div>

        {/* Color */}
        <label style={labelStyle}>Main color</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
          {MASCOT_COLORS.map(c => (
            <button key={c} onClick={() => setMascotColor(mascotColor === c ? "" : c)} style={{
              padding: "8px 14px", borderRadius: 999, cursor: "pointer",
              border: `2px solid ${mascotColor === c ? "#5A8EC8" : "#80A0FF"}`,
              background: mascotColor === c ? "#EAF4FB" : "#fff",
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
              color: mascotColor === c ? "#5A8EC8" : "#7C8B98",
            }}>{c}</button>
          ))}
        </div>

        {/* Markings */}
        <label style={labelStyle}>Markings</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
          {MASCOT_MARKINGS.map(m => (
            <button key={m} onClick={() => setMascotMarkings(m)} style={{
              padding: "8px 14px", borderRadius: 999, cursor: "pointer",
              border: `2px solid ${mascotMarkings === m ? "#5A8EC8" : "#80A0FF"}`,
              background: mascotMarkings === m ? "#EAF4FB" : "#fff",
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
              color: mascotMarkings === m ? "#5A8EC8" : "#7C8B98",
            }}>{m}</button>
          ))}
        </div>

        {/* Personality pose */}
        <label style={labelStyle}>Personality pose</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
          {MASCOT_POSES.map(p => (
            <button key={p} onClick={() => setMascotPose(p)} style={{
              padding: "8px 14px", borderRadius: 999, cursor: "pointer",
              border: `2px solid ${mascotPose === p ? "#5A8EC8" : "#80A0FF"}`,
              background: mascotPose === p ? "#EAF4FB" : "#fff",
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
              color: mascotPose === p ? "#5A8EC8" : "#7C8B98",
            }}>{p}</button>
          ))}
        </div>

        {/* Preview card */}
        {mascotBreed && (
          <div style={{ background: "linear-gradient(135deg, #EAF4FB 0%, #D6EEF9 100%)", borderRadius: 24, padding: "18px 18px 16px", marginBottom: 18, border: "2px solid #80A0FF", textAlign: "center" }}>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#5A8EC8", margin: "0 0 10px" }}>
              Meet {pet.name || "your pet"}'s Comi mascot
            </p>
            <img src={mascotPreviewImg} alt={mascotBreed} style={{ width: 100, height: 100, objectFit: "contain", marginBottom: 10 }} />
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {[mascotBreed, mascotColor, mascotMarkings, mascotPose].filter(Boolean).map(tag => (
                <span key={tag} style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: "#5A8EC8", background: "#fff", padding: "3px 10px", borderRadius: 999 }}>{tag}</span>
              ))}
            </div>
            <p style={{ fontFamily: "Nunito", fontSize: 11, color: "#7C8B98", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
              Future version: Comi can turn your pet photo into a custom illustrated mascot.
            </p>
          </div>
        )}

        {!mascotBreed && (
          <div style={{ textAlign: "center", padding: "14px 0 6px" }}>
            <p style={{ fontFamily: "Nunito", fontSize: 13, color: "#7C8B98", margin: 0 }}>
              Select a breed above to preview your mascot
            </p>
          </div>
        )}
      </div>

      <div style={{ height: 10 }} />
      <Button onClick={handleCreateProfile} disabled={!primary}>Create profile</Button>
      <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", textAlign: "center", margin: "10px 0 0", lineHeight: 1.5 }}>
        You can update your mascot anytime from the pet profile.
      </p>
    </div>
  );
}

// 4. Home Dashboard
function HomeScreen({ go, pet, todayMood, reminders, petPhoto, onOpenPetSwitcher }) {

  const press   = (e) => (e.currentTarget.style.transform = "scale(0.97)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(170deg, #A8CCDF 0%, #5FA8CF 42%, #3D88BE 100%)",
      overflow: "hidden",
    }}>

      {/* ── Top bar — pet dropdown centered ── */}
      <div style={{
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 22px 0",
      }}>
        <button
          onClick={onOpenPetSwitcher}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{
            background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.38)",
            borderRadius: 999, padding: "8px 18px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7, transition: "transform 0.08s ease",
          }}
        >
          <span style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>
            {pet.name}
          </span>
          <ChevronDown size={14} color="rgba(255,255,255,0.85)" />
        </button>
      </div>

      {/* ── Mascot + headline + chips + action — all in one flex column ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}>

        {/* Mascot — takes remaining vertical space, capped so chips/button always stay in view */}
        <div style={{ flex: 1, minHeight: 0, maxHeight: 382, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <img
            src={getMascotMoodImage(pet, todayMood?.key)}
            alt={pet.name}
            style={{ width: 420, height: 420, maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transform: "translateX(-10px)" }}
          />
        </div>

        {/* Headline */}
        <h1 style={{
          flexShrink: 0,
          fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 26,
          color: "#fff", textAlign: "center", margin: "4px 24px 0", lineHeight: 1.24,
        }}>
          {todayMood
            ? `${pet.name} is feeling ${todayMood.label.toLowerCase()} today!`
            : `How is ${pet.name} feeling today?`}
        </h1>

        {/* Mood strength */}
        {todayMood?.intensity && (
          <p style={{ flexShrink: 0, fontFamily: "Nunito, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.72)", margin: "4px 0 0" }}>
            Mood strength: {todayMood.intensity}/10
          </p>
        )}

        {/* ── Quick-access feature chips ── */}
        <div style={{ flexShrink: 0, padding: "8px 14px 0", alignSelf: "stretch", display: "flex", gap: 7, overflowX: "auto" }}>
          {[
            { label: "AI Insights", screen: "ai" },
            { label: "Behaviour",   screen: "behavior" },
            { label: "Wellness",    screen: "insights" },
            { label: "Reminders",   screen: "reminders" },
            { label: "Places",      screen: "community" },
          ].map(({ label, screen }) => (
            <button
              key={screen}
              onClick={() => go(screen)}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              style={{
                flexShrink: 0, padding: "8px 16px", borderRadius: 999,
                background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.38)",
                fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 12.5, color: "#fff",
                cursor: "pointer", whiteSpace: "nowrap", transition: "transform 0.08s ease",
                letterSpacing: "0.01em",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Mood update action ── */}
        <div style={{ flexShrink: 0, padding: "10px 22px 20px", alignSelf: "stretch" }}>
          <button
            onClick={() => go("mood")}
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "14px", borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.15)",
              fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 15, color: "#fff",
              cursor: "pointer", transition: "transform 0.08s ease",
            }}
          >
            {todayMood ? "Update today's mood" : "Log today's mood"}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick, bg }) {
  return (
    <button onClick={onClick} style={{ background: "#EFF8FE", border: `1.5px solid #80A0FF`, borderRadius: theme.radius, padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
      <div style={{ background: "#D6EEF9", borderRadius: 10, padding: 7, alignSelf: "flex-start" }}>
        <Icon size={20} color={theme.ocean} />
      </div>
      <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink }}>{label}</span>
    </button>
  );
}

function Tap({ children, onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", color: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{children}</button>;
}

/* ── mood history helpers ── */
function buildSampleMoodHistory(pet) {
  const base = new Date();
  const keys  = ["playful","happy","sad","sleepy","calm","anxious","playful","happy","playful","sad"];
  const skip  = new Set([2, 6, 13, 20, 27]); // days with no entry
  const out   = [];
  for (let i = 29; i >= 1; i--) {
    if (skip.has(i)) continue;
    const d    = new Date(base); d.setDate(d.getDate() - i);
    const key  = keys[(29 - i) % keys.length];
    const mood = MOODS.find(m => m.key === key) || MOODS[0];
    out.push({ ...mood, date: d.toISOString().split("T")[0], intensity: 5 + ((29 - i) % 4), note: "" });
  }
  return out;
}

function getPetMoodHistory(pet) {
  const stored = pet?.moodHistory || [];
  if (stored.length >= 5) return stored;
  const sample = buildSampleMoodHistory(pet);
  // merge: stored entries override sample for same date
  const map = {};
  sample.forEach(h => { map[h.date] = h; });
  stored.forEach(h => { map[h.date] = h; });
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

// 5. Daily Mood Check-In
function MoodScreen({ go, pet, saveMood, initialEntry, onClearEdit }) {
  const [picked,        setPicked]        = useState(initialEntry?.key || null);
  const [moodIntensity, setMoodIntensity] = useState(initialEntry?.intensity ?? 5);
  const [note,          setNote]          = useState(initialEntry?.note || "");

  const moodEntry  = MOODS.find((m) => m.key === picked);
  const isNegative = moodEntry?.category === "negative";

  const handleSave = () => {
    if (!picked) return;
    saveMood({ ...moodEntry, intensity: moodIntensity, note, savedAt: new Date().toISOString() });
    if (onClearEdit) onClearEdit();
    go(initialEntry ? "mood_calendar" : "home");
  };

  const today   = new Date();
  const dateStr = today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const sleepHours = pet.sleepData
    ? ((Number(pet.sleepData.night) || 0) + (Number(pet.sleepData.nap) || 0)).toFixed(1)
    : null;

  return (
    <div style={{ background: theme.mist, minHeight: "100%", paddingBottom: 32, boxSizing: "border-box" }}>
      <style>{`.comi-slider{-webkit-appearance:none;appearance:none;width:100%;height:8px;border-radius:999px;outline:none;cursor:pointer;}.comi-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:26px;height:26px;background:#5A8EC8;border-radius:50%;cursor:pointer;border:3px solid #fff;box-shadow:0 2px 8px rgba(90,142,200,0.4);}.comi-slider::-moz-range-thumb{width:26px;height:26px;background:#5A8EC8;border-radius:50%;cursor:pointer;border:3px solid #fff;}`}</style>

      {/* Compact gradient header — no overflow tricks */}
      <div style={{ background: "linear-gradient(to bottom, #5FA8CF, #3D88BE)", padding: "14px 18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={() => go("home")} style={{ background: "rgba(255,255,255,0.22)", border: "none", borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
            <ChevronLeft size={16} color="#fff" />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PetAvatar pet={pet} petPhoto={null} size={30} />
            <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#fff" }}>{pet.name}</span>
          </div>
          <button onClick={() => go("insights")} style={{ background: "rgba(255,255,255,0.22)", border: "none", borderRadius: 999, padding: "5px 10px", cursor: "pointer" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: "#fff" }}>Calendar</span>
          </button>
        </div>
        <p style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.72)", margin: 0 }}>{dateStr}</p>
        <h1 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 22, color: "#fff", margin: "3px 0 0", lineHeight: 1.2 }}>
          What's {pet.name}'s mood today?
        </h1>
      </div>

      {/* All content below header — no negative margins, no overflow */}
      <div style={{ padding: "14px 14px 0" }}>

        {/* Mood picker card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "16px 12px", boxShadow: "0 4px 20px rgba(90,142,200,0.12)", marginBottom: 12 }}>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 12, color: theme.slate, margin: "0 0 12px", textAlign: "center", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Pick what feels closest
          </p>
          {/* 5 buttons in a row — images scale to fit column width */}
          <div style={{ display: "flex", gap: 6 }}>
            {MOOD_ICONS.map(({ key, label, src, moodKey }) => {
              const active = picked === moodKey;
              const entry  = MOODS.find(m => m.key === moodKey);
              return (
                <button key={key} onClick={() => setPicked(active ? null : moodKey)}
                  style={{
                    flex: 1, minWidth: 0,
                    background: active ? (entry?.color || theme.sky) : theme.mist,
                    border: `2px solid ${active ? theme.ocean : "transparent"}`,
                    borderRadius: 16, padding: "10px 2px 8px",
                    cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    boxShadow: active ? "0 3px 10px rgba(90,142,200,0.18)" : "none",
                    transition: "all 0.12s ease",
                    overflow: "hidden",
                  }}
                >
                  {/* Image uses 100% of button width so it always fits */}
                  <img src={src} alt={label} style={{ width: "100%", maxWidth: 56, height: "auto", aspectRatio: "1", objectFit: "contain", display: "block" }} />
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: active ? theme.ocean : theme.ink, whiteSpace: "nowrap" }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood preview — breed mascot image */}
        {moodEntry && (
          <div style={{ background: moodEntry.color, borderRadius: 18, padding: "12px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <img src={getMascotMoodImage(pet, picked)} alt={moodEntry.label} style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: theme.ink, margin: 0 }}>{moodEntry.label}</p>
              <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, margin: 0, opacity: 0.65, textTransform: "capitalize" }}>{moodEntry.category} mood</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.55)", borderRadius: 12, padding: "6px 12px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, lineHeight: 1 }}>{moodIntensity}/10</div>
              <div style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate }}>strength</div>
            </div>
          </div>
        )}

        {/* 2-column wellness mini-cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div style={{ background: "#FDE9D5", borderRadius: 18, padding: "12px" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink, opacity: 0.65, display: "block", marginBottom: 5 }}>Sleep last night</span>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 24, color: theme.ink, margin: 0 }}>
              {sleepHours ? `${sleepHours}h` : <span style={{ fontSize: 18, opacity: 0.35 }}>—</span>}
            </p>
          </div>
          <div style={{ background: "#E8E4F7", borderRadius: 18, padding: "12px" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink, opacity: 0.65, display: "block", marginBottom: 5 }}>Mood strength</span>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 24, color: theme.ink, margin: 0 }}>
              {picked ? `${moodIntensity}/10` : <span style={{ fontSize: 18, opacity: 0.35 }}>—</span>}
            </p>
          </div>
        </div>

        {/* Intensity slider */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "14px 16px 12px", border: `1.5px solid #80A0FF`, marginBottom: 12 }}>
          <label style={labelStyle}>How strong is this mood?</label>
          <input
            type="range" className="comi-slider" min={1} max={10} step={1} value={moodIntensity}
            onChange={(e) => setMoodIntensity(Number(e.target.value))}
            style={{ background: `linear-gradient(to right,${theme.ocean} 0%,${theme.ocean} ${((moodIntensity-1)/9)*100}%,#80A0FF ${((moodIntensity-1)/9)*100}%,#80A0FF 100%)` }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate }}>Light · 1</span>
            <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate }}>Very strong · 10</span>
          </div>
        </div>

        {/* Note */}
        <label style={labelStyle}>Add a note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`Example: ${pet.name} seemed quieter after the walk.`}
          style={{ width: "100%", padding: 12, borderRadius: 14, border: `1.5px solid #80A0FF`, fontFamily: "Nunito", fontSize: 14, color: theme.ink, outline: "none", resize: "none", height: 76, boxSizing: "border-box", marginBottom: 12 }}
        />

        {isNegative && (
          <div style={{ background: "#FFF4F3", border: `1.5px solid ${theme.coral}`, borderRadius: 14, padding: "11px 14px", marginBottom: 12 }}>
            <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
              👀 <b>Keep an eye on this.</b> If it continues, contact your vet.
            </p>
          </div>
        )}

        <Button onClick={handleSave} disabled={!picked}>Save today's mood</Button>
      </div>
    </div>
  );
}

// ── Wellness page chart helpers ───────────────────────────────────────────

function getCustomMoodIcon(moodKey) {
  const slot = MOOD_TO_SLOT[moodKey] || null;
  if (slot === "fun")      return IconFun;
  if (slot === "sad")      return IconSad;
  if (slot === "sleepy")   return IconSleepy;
  if (slot === "thinking") return IconThinking;
  if (slot === "worry")    return IconWorry;
  return null;
}

function WellnessLineChart({ data, color, h }) {
  const W = 220, H = h || 54;
  const col = color || "#5A8EC8";
  const valid = data.filter(v => v !== null);
  if (!valid.length) return (
    <div style={{ height: H, display: "grid", placeItems: "center" }}>
      <span style={{ fontFamily: "Nunito", fontSize: 10, color: "#7C8B98" }}>No data yet</span>
    </div>
  );
  const pts = data.map((v, i) => ({
    x: data.length === 1 ? W / 2 : 4 + (i / (data.length - 1)) * (W - 8),
    y: v !== null ? 4 + (1 - v / 10) * (H - 8) : null,
  }));
  let d = "";
  pts.forEach((p, i) => {
    if (p.y === null) return;
    d += (d === "" || pts[i - 1]?.y === null) ? `M${p.x},${p.y}` : `L${p.x},${p.y}`;
  });
  const vp = pts.filter(p => p.y !== null);
  const area = vp.length > 1
    ? `M${vp[0].x},${H} ${vp.map(p => `L${p.x},${p.y}`).join("")} L${vp[vp.length - 1].x},${H}Z`
    : "";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {area && <path d={area} fill={col} opacity={0.12} />}
      {d && <path d={d} fill="none" stroke={col} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />}
      {vp.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={3} fill="#fff" stroke={col} strokeWidth={2} />)}
    </svg>
  );
}

function WellnessBarChart({ data, labels, color, h }) {
  const W = 220, H = h || 54;
  const col = color || "#93C5E0";
  const max = Math.max(...data, 1);
  const n = data.length, gap = 3;
  const bw = (W - (n - 1) * gap) / n;
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} width="100%">
      {data.map((v, i) => {
        const bh = Math.max((v / max) * H, 3);
        const x = i * (bw + gap), y = H - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={3} fill={col} opacity={0.85} />
            {labels && <text x={x + bw / 2} y={H + 11} textAnchor="middle" fontSize={8} fill="#7C8B98" fontFamily="Nunito">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function WellnessDonutChart({ segments, size }) {
  const sz = size || 76;
  const total = segments.reduce((s, sg) => s + sg.value, 0);
  if (!total) return null;
  const cx = sz / 2, cy = sz / 2, r = sz * 0.4, inner = sz * 0.25;
  if (segments.length === 1) return (
    <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill={segments[0].color} />
      <circle cx={cx} cy={cy} r={inner} fill="#fff" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight="700" fill="#34414E" fontFamily="Quicksand">{total}</text>
    </svg>
  );
  let ang = -Math.PI / 2;
  const arcs = segments.map(sg => {
    const sw = (sg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang);
    ang += sw;
    const x2 = cx + r * Math.cos(ang), y2 = cy + r * Math.sin(ang);
    return { d: `M${cx},${cy}L${x1},${y1}A${r},${r},0,${sw > Math.PI ? 1 : 0},1,${x2},${y2}Z`, color: sg.color };
  });
  return (
    <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} style={{ flexShrink: 0 }}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      <circle cx={cx} cy={cy} r={inner} fill="#fff" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fontWeight="700" fill="#34414E" fontFamily="Quicksand">{total}</text>
    </svg>
  );
}

function WellnessPillBarChart({ bars, maxVal, h, showLabels }) {
  const H  = h || 76;
  const LH = showLabels ? 16 : 0;
  const bw = 24, gap = 10;
  const W  = bars.length * bw + (bars.length - 1) * gap;
  const mx = Math.max(maxVal || 0, 1);
  return (
    <svg viewBox={`0 0 ${W} ${H + LH}`} width="100%" style={{ display: "block" }}>
      {bars.map((bar, i) => {
        const x    = i * (bw + gap);
        const barH = bar.value > 0 ? Math.max((bar.value / mx) * H, bw) : 0;
        const y    = H - barH;
        return (
          <g key={i}>
            {/* Background track — full-height light pill */}
            <rect x={x} y={0} width={bw} height={H} rx={bw / 2} fill={bar.color} opacity={0.16} />
            {/* Filled amount growing from bottom */}
            {barH > 0 && (
              <rect x={x} y={y} width={bw} height={barH} rx={bw / 2} fill={bar.color} />
            )}
            {showLabels && (
              <text x={x + bw / 2} y={H + LH} textAnchor="middle" fontSize={8} fill="#7C8B98" fontFamily="Nunito">
                {bar.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function WellnessSleepRings({ rings }) {
  const sz = 28, sw = 4.5;
  const r  = (sz - sw) / 2;
  const cx = sz / 2, cy = sz / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      {rings.map((ring, i) => {
        const pct  = Math.max(0, Math.min(ring.value, 1));
        const dash = pct * circ;
        const gap  = circ - dash;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} style={{ transform: "rotate(-90deg)", display: "block" }}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={ring.color} strokeWidth={sw} opacity={0.18} />
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={ring.color} strokeWidth={sw}
                strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
              />
            </svg>
            <span style={{ fontFamily: "Nunito", fontSize: 8, color: "#7C8B98" }}>{ring.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// 5b. Mood Calendar Screen
function MoodCalendarScreen({ go, pet, onEditEntry }) {
  const today      = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selDay,   setSelDay]   = useState(null);
  const [rangeTab, setRangeTab] = useState("Month");

  const history = getPetMoodHistory(pet);

  const fullHistory = (() => {
    const todayStr = today.toISOString().split("T")[0];
    if (!pet.todayMood) return history;
    const already = history.find(h => h.date === todayStr);
    if (already) return history;
    return [...history, { ...pet.todayMood, date: todayStr }];
  })();

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const firstDayOfWk = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dateStr = (d) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const moodFor = (d) => fullHistory.find(h => h.date === dateStr(d)) || null;

  const cells   = [...Array(firstDayOfWk).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const selMood = selDay !== null ? moodFor(selDay) : null;

  // Month entries
  const monthEntries = fullHistory.filter(h => {
    const d = new Date(h.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  // Last 7 days (for week chart data)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    return { date: d, entry: fullHistory.find(h => h.date === ds) || null, label: ["Su","Mo","Tu","We","Th","Fr","Sa"][d.getDay()] };
  });

  // Current week Sun–Sat
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  // Period entries (week vs month)
  const periodEntries = rangeTab === "Week" ? last7.map(d => d.entry).filter(Boolean) : monthEntries;

  const mostCommonMood = (() => {
    if (!periodEntries.length) return null;
    const counts = {};
    periodEntries.forEach(h => { counts[h.key] = (counts[h.key] || 0) + 1; });
    const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return MOODS.find(m => m.key === topKey);
  })();

  // ── Chart data ────────────────────────────────────────────────────────
  const trendData   = last7.map(d => d.entry ? (d.entry.intensity || 5) : null);
  const trendLabels = last7.map(d => d.label[0]);

  const moodSlotColors = { fun: "#FFE08A", sad: "#D8EAFF", sleepy: "#93C5E0", thinking: "#BFE3C8", worry: "#FFEEDD" };
  const slotNames      = { fun: "Fun", sad: "Sad", sleepy: "Sleepy", thinking: "Thinking", worry: "Worry" };
  const slotCounts = {};
  periodEntries.forEach(e => {
    const slot = MOOD_TO_SLOT[e.key] || "fun";
    slotCounts[slot] = (slotCounts[slot] || 0) + 1;
  });
  const donutData = Object.entries(slotCounts).map(([slot, count]) => ({
    label: slotNames[slot] || slot,
    color: moodSlotColors[slot] || "#EBF4FC",
    value: count,
  }));

  const sleepSample = [7, 8, 6, 9, 5, 8, 7];
  const petSleepH = pet.sleepData
    ? parseFloat(((Number(pet.sleepData.night) || 0) + (Number(pet.sleepData.nap) || 0)).toFixed(1))
    : null;
  if (petSleepH !== null) sleepSample[6] = petSleepH;
  const lowSleepDays = sleepSample.filter(h => h < 7).length;

  const behaviourData = [
    { label: "Playful",    count: 4, color: "#FFB5A7" },
    { label: "Low energy", count: 2, color: "#93C5E0" },
    { label: "Worried",    count: 1, color: "#FFEEDD" },
    { label: "Restless",   count: 1, color: "#D6C7F0" },
  ];

  // Insight one-liners
  const validTrend    = trendData.filter(v => v !== null);
  const avgIntensity  = validTrend.length ? validTrend.reduce((a, b) => a + b, 0) / validTrend.length : 0;
  const trendInsight  = avgIntensity >= 7 ? "Mostly positive this week." : avgIntensity >= 5 ? "Balanced mood this week." : validTrend.length ? "Some tough days this week." : "Log moods to see trends.";
  const donutInsight  = donutData.length ? `${[...donutData].sort((a, b) => b.value - a.value)[0].label} most this ${rangeTab.toLowerCase()}.` : "No moods logged yet.";
  const sleepInsight  = `${lowSleepDays} low-sleep day${lowSleepDays !== 1 ? "s" : ""} this week.`;

  // Mood Mix pill bar data — always show all 5 slots
  const moodMixPaletteNew = { fun: "#FFD97D", sad: "#AAC4F0", sleepy: "#93C5E0", thinking: "#8DC9A0", worry: "#F4B8C1" };
  const moodMixBars = ["fun", "sad", "sleepy", "thinking", "worry"].map(slot => ({
    label: slotNames[slot],
    value: slotCounts[slot] || 0,
    color: moodMixPaletteNew[slot],
  }));
  const moodMixMax = Math.max(...moodMixBars.map(b => b.value), 1);

  // Sleep ring chart data
  const avgSleepH      = sleepSample.reduce((a, b) => a + b, 0) / sleepSample.length;
  const tonightH       = sleepSample[sleepSample.length - 1];
  const goodNightRatio = sleepSample.filter(h => h >= 7).length / sleepSample.length;
  const sleepRings = [
    { value: avgSleepH / 10,   color: "#5A8EC8", label: "Avg" },
    { value: tonightH / 10,    color: "#93C5E0", label: "Last" },
    { value: goodNightRatio,   color: "#AAD4F4", label: "Week" },
  ];

  // Top behaviour label for insight line
  const topBehaviour = [...behaviourData].sort((a, b) => b.count - a.count)[0]?.label || "Playful";

  const CC = {
    card:    { background: "#fff", borderRadius: 20, padding: "16px 14px 13px", border: "1.5px solid rgba(128,160,255,0.22)", boxShadow: "0 2px 14px rgba(90,142,200,0.09)" },
    cardLg:  { background: "#fff", borderRadius: 22, padding: "18px 16px 15px", border: "1.5px solid rgba(128,160,255,0.22)", boxShadow: "0 2px 14px rgba(90,142,200,0.09)" },
    label:   { fontFamily: "Nunito", fontWeight: 700, fontSize: 9,  color: "#7C8B98", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" },
    labelLg: { fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: "#7C8B98", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" },
    insight: { fontFamily: "Nunito", fontSize: 10, color: "#7C8B98", margin: "8px 0 0", lineHeight: 1.3 },
  };

  return (
    <div style={{ background: theme.mist, minHeight: "100%", paddingBottom: 40 }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => go("home")} style={{ background: "#fff", border: "none", borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.12)", flexShrink: 0 }}>
            <ChevronLeft size={16} color={theme.ocean} />
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: theme.ink, margin: 0 }}>Mood Calendar</h2>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>{pet.name}</p>
          </div>
          <button onClick={() => go("mood")} style={{ background: theme.ocean, border: "none", borderRadius: 14, padding: "7px 14px", cursor: "pointer", boxShadow: "0 2px 10px rgba(90,142,200,0.3)" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff" }}>+ Check-in</span>
          </button>
        </div>
      </div>

      {/* ── Week / Month toggle ─────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 14px" }}>
        {["Week", "Month"].map(t => (
          <button key={t} onClick={() => { setRangeTab(t); setSelDay(null); }} style={{
            padding: "9px 22px", borderRadius: 999, border: "none", cursor: "pointer",
            background: rangeTab === t ? theme.ocean : "#fff",
            color: rangeTab === t ? "#fff" : theme.slate,
            fontFamily: "Quicksand", fontWeight: 700, fontSize: 13,
            boxShadow: rangeTab === t ? "0 4px 14px rgba(90,142,200,0.30)" : "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {rangeTab === "Month" ? (
        /* ── MONTH CALENDAR ─────────────────────────────────────────────── */
        <div style={{ margin: "0 14px" }}>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={prevMonth} style={{ background: "#fff", border: "none", borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(90,142,200,0.12)" }}>
              <ChevronLeft size={16} color={theme.ocean} />
            </button>
            <h3 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>{monthName}</h3>
            <button onClick={nextMonth} style={{ background: "#fff", border: "none", borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(90,142,200,0.12)" }}>
              <ChevronLeft size={16} color={theme.ocean} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>

          <div style={{ background: "#fff", borderRadius: 24, padding: "14px 8px 12px", boxShadow: "0 4px 20px rgba(90,142,200,0.10)" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 5 }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate }}>{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const mood    = moodFor(day);
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSel   = day === selDay;
                const icon    = mood ? getCustomMoodIcon(mood.key) : null;
                return (
                  <button key={i} onClick={() => setSelDay(day === selDay ? null : day)}
                    style={{
                      background: mood ? mood.color + "90" : isSel ? theme.mist : "#F4F8FC",
                      borderRadius: 12,
                      border: isSel ? `2.5px solid ${theme.ocean}` : isToday ? `2px solid ${theme.sky}` : "2px solid transparent",
                      padding: "4px 1px 3px",
                      cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                      minHeight: 54,
                      boxShadow: isSel ? "0 2px 10px rgba(90,142,200,0.22)" : "none",
                      transition: "all 0.1s",
                    }}
                  >
                    {icon
                      ? <img src={icon} alt={mood.label} style={{ width: 34, height: 34, objectFit: "contain" }} />
                      : <div style={{ width: 34, height: 34, display: "grid", placeItems: "center" }}>
                          {isToday
                            ? <div style={{ width: 6, height: 6, borderRadius: 999, background: theme.sky }} />
                            : <span style={{ fontSize: 8, color: "#C8D8E8" }}>—</span>}
                        </div>
                    }
                    <span style={{ fontFamily: "Nunito", fontSize: 9, fontWeight: isToday ? 800 : 500, color: mood ? theme.ink : theme.slate }}>{day}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── WEEK VIEW ──────────────────────────────────────────────────── */
        <div style={{ margin: "0 14px" }}>
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 8px", textAlign: "center" }}>
            {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <div style={{ background: "#fff", borderRadius: 24, padding: "14px 8px 16px", boxShadow: "0 4px 20px rgba(90,142,200,0.10)" }}>
            {/* 7-day row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {weekDates.map((wd, i) => {
                const ds    = wd.toISOString().split("T")[0];
                const mood  = fullHistory.find(h => h.date === ds) || null;
                const isTdy = wd.toDateString() === today.toDateString();
                const isSel = selDay !== null && wd.getDate() === selDay && wd.getMonth() === viewDate.getMonth();
                const icon  = mood ? getCustomMoodIcon(mood.key) : null;
                return (
                  <button key={i}
                    onClick={() => { setViewDate(new Date(wd.getFullYear(), wd.getMonth(), 1)); setSelDay(isSel ? null : wd.getDate()); }}
                    style={{
                      background: mood ? mood.color + "90" : "#F4F8FC",
                      borderRadius: 14,
                      border: isSel ? `2.5px solid ${theme.ocean}` : isTdy ? `2px solid ${theme.sky}` : "2px solid transparent",
                      padding: "8px 2px 6px", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                      transition: "all 0.1s",
                    }}
                  >
                    <span style={{ fontFamily: "Nunito", fontSize: 9, fontWeight: 700, color: theme.slate }}>
                      {["Su","Mo","Tu","We","Th","Fr","Sa"][wd.getDay()]}
                    </span>
                    {icon
                      ? <img src={icon} alt={mood.label} style={{ width: 42, height: 42, objectFit: "contain" }} />
                      : <div style={{ width: 42, height: 42, display: "grid", placeItems: "center" }}>
                          <span style={{ fontSize: 10, color: "#C8D8E8" }}>—</span>
                        </div>
                    }
                    <span style={{ fontFamily: "Nunito", fontWeight: isTdy ? 800 : 500, fontSize: 11, color: mood ? theme.ink : theme.slate }}>
                      {wd.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Weekly mood trend mini chart */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${theme.line}` }}>
              <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Mood strength this week
              </p>
              <WellnessLineChart data={trendData} color={theme.ocean} h={44} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                {trendLabels.map((l, i) => (
                  <span key={i} style={{ fontFamily: "Nunito", fontSize: 8, color: theme.slate, flex: 1, textAlign: "center" }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Day detail card ─────────────────────────────────────────────── */}
      {selDay !== null && (
        <div style={{
          margin: "12px 14px 0",
          background: selMood ? selMood.color + "44" : "#fff",
          borderRadius: 22, padding: "16px 16px",
          boxShadow: "0 4px 16px rgba(90,142,200,0.10)",
          border: "1.5px solid rgba(128,160,255,0.30)",
        }}>
          {/* Date row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 2px" }}>
                {new Date(dateStr(selDay) + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>{pet.name}</p>
            </div>
            <button onClick={() => setSelDay(null)} style={{ background: "rgba(90,142,200,0.10)", border: "none", borderRadius: 999, width: 28, height: 28, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <X size={13} color={theme.slate} />
            </button>
          </div>

          {selMood ? (
            <>
              {/* Mood row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                {(() => {
                  const icon = getCustomMoodIcon(selMood.key);
                  return icon ? <img src={icon} alt={selMood.label} style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} /> : null;
                })()}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 4px" }}>{selMood.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 10 }, (_, j) => (
                        <div key={j} style={{ width: 12, height: 5, borderRadius: 999, background: j < (selMood.intensity || 5) ? theme.ocean : theme.line }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ocean, fontWeight: 700 }}>{selMood.intensity || 5}/10</span>
                  </div>
                </div>
                <img src={getMascotMoodImage(pet, selMood.key)} alt={selMood.label} style={{ width: 46, height: 46, objectFit: "contain", flexShrink: 0, borderRadius: 12 }} />
              </div>

              {/* Detail rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: 12, padding: "8px 12px" }}>
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate, textTransform: "uppercase", letterSpacing: "0.04em" }}>Note · </span>
                  {selMood.note
                    ? <span style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink }}>"{selMood.note}"</span>
                    : <span style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, fontStyle: "italic" }}>No note added for this day.</span>
                  }
                </div>
                {pet.sleepData ? (
                  <div style={{ background: "rgba(255,255,255,0.65)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Moon size={13} color={theme.ocean} />
                    <span style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink }}>
                      Sleep: {((Number(pet.sleepData.night) || 0) + (Number(pet.sleepData.nap) || 0)).toFixed(1)}h
                      {pet.sleepData.quality ? ` · ${pet.sleepData.quality}` : ""}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Edit entry button */}
              {onEditEntry && (
                <button
                  onClick={() => onEditEntry(selMood)}
                  style={{
                    marginTop: 12, width: "100%", padding: "11px", borderRadius: 999,
                    border: `2px solid ${theme.ocean}`, background: "rgba(255,255,255,0.7)",
                    color: theme.ocean, fontFamily: "Quicksand", fontWeight: 700, fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Edit entry
                </button>
              )}
            </>
          ) : (
            <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>No check-in yet for this day.</p>
          )}
        </div>
      )}

      {/* ── Mood Summary banner ─────────────────────────────────────────── */}
      {mostCommonMood && (
        <div style={{ margin: "12px 14px 0", background: mostCommonMood.color, borderRadius: 22, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.ink, opacity: 0.65, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {rangeTab} Summary
            </p>
            <h3 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 22, color: theme.ink, margin: "0 0 4px" }}>{mostCommonMood.label}</h3>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, opacity: 0.7, margin: 0, lineHeight: 1.4 }}>
              {pet.name} felt {mostCommonMood.label.toLowerCase()} most this {rangeTab.toLowerCase()}.
            </p>
          </div>
          <img src={getMascotMoodImage(pet, mostCommonMood.key)} alt={mostCommonMood.label} style={{ width: 68, height: 68, objectFit: "contain", flexShrink: 0 }} />
        </div>
      )}

      {/* ── Wellness Insights — flex row: left large, right two stacked ─── */}
      <div style={{ margin: "14px 14px 0" }}>
        <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 10px" }}>Wellness Insights</p>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>

          {/* LEFT col — Mood Mix */}
          <div style={{ flex: "0 0 57%", minWidth: 0, display: "flex" }}>
            <div style={{ ...CC.cardLg, flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={CC.labelLg}>Mood Mix</p>
              {moodMixBars.some(b => b.value > 0) ? (
                <>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
                    <WellnessPillBarChart bars={moodMixBars} maxVal={moodMixMax} h={190} showLabels />
                  </div>
                  <p style={CC.insight}>{donutInsight}</p>
                </>
              ) : (
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>Log moods to see.</p>
              )}
            </div>
          </div>

          {/* RIGHT col — two equal-height cards stacked */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>

            {/* TOP RIGHT — Sleep (single ring) */}
            <div style={{ ...CC.card, flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={CC.label}>Sleep</p>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {(() => {
                  const sz = 52, sw = 7;
                  const r  = (sz - sw) / 2;
                  const cx = sz / 2, cy = sz / 2;
                  const circ = 2 * Math.PI * r;
                  const pct  = Math.min(avgSleepH / 10, 1);
                  const dash = pct * circ;
                  const gap  = circ - dash;
                  return (
                    <div style={{ position: "relative", width: sz, height: sz }}>
                      <svg viewBox={`0 0 ${sz} ${sz}`} width={sz} height={sz} style={{ transform: "rotate(-90deg)", display: "block" }}>
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#93C5E0" strokeWidth={sw} opacity={0.18} />
                        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#5A8EC8" strokeWidth={sw}
                          strokeDasharray={`${dash} ${gap}`} strokeLinecap="round"
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, lineHeight: 1 }}>{avgSleepH.toFixed(1)}</span>
                        <span style={{ fontFamily: "Nunito", fontSize: 8, color: theme.slate, lineHeight: 1.5 }}>hrs</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <p style={CC.insight}>{sleepInsight}</p>
            </div>

            {/* BOTTOM RIGHT — Behaviour */}
            <div style={{ ...CC.card, flex: 1, display: "flex", flexDirection: "column" }}>
              <p style={CC.label}>Behaviour</p>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                {behaviourData.map((b, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontFamily: "Nunito", fontSize: 8, color: theme.ink, fontWeight: 600 }}>{b.label}</span>
                      <span style={{ fontFamily: "Nunito", fontSize: 8, fontWeight: 700, color: theme.slate }}>{b.count}</span>
                    </div>
                    <div style={{ background: "#EEF3FA", borderRadius: 999, height: 7 }}>
                      <div style={{ background: b.color, borderRadius: 999, height: 7, width: `${Math.min((b.count / behaviourData[0].count) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p style={CC.insight}>{topBehaviour} most often.</p>
            </div>

          </div>
        </div>
      </div>

      {/* ── Comi Plus locked insight cards ──────────────────────────────── */}
      <div style={{ margin: "18px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: 0 }}>Smart Tag Insights</p>
          <span style={{ background: "#6E4FC8", color: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 9, padding: "2px 9px", borderRadius: 999 }}>Comi Plus</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Sleep Pattern", desc: "Nap cycles & night rest from Smart Tag", color: "#D6C7F0" },
            { label: "Activity Trend", desc: "Daily steps & movement score", color: "#D6EBF8" },
            { label: "Rest Zones", desc: "Where {petName} rests most during the day", color: "#BFE3C8" },
          ].map((card) => (
            <div key={card.label} style={{
              flex: 1, background: card.color, borderRadius: 18, padding: "14px 12px",
              position: "relative", overflow: "hidden", minHeight: 100,
            }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(2px)", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, zIndex: 2 }}>
                <div style={{ background: "#6E4FC8", borderRadius: 999, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={10} color="#fff" />
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: "#fff" }}>Unlock</span>
                </div>
              </div>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 11, color: theme.ink, margin: "0 0 3px", position: "relative", zIndex: 1 }}>{card.label}</p>
              <p style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate, margin: 0, lineHeight: 1.4, position: "relative", zIndex: 1 }}>
                {card.desc.replace("{petName}", pet.name)}
              </p>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", marginTop: 12, padding: "11px 0", borderRadius: 999, border: "none", background: "#6E4FC8", fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer" }}>
          Join waitlist for Comi Plus
        </button>
      </div>
    </div>
  );
}

// 6. Behavior & Routine Tracker
function BehaviorScreen({ go, pet, sleepData, saveSleep, onUpdateCamEvents }) {
  const [levels,     setLevels]    = useState({});
  const [sleepSaved, setSleepSaved] = useState(!!sleepData);
  const [sleep,      setSleep]     = useState(
    sleepData
      ? { night: String(sleepData.night), nap: String(sleepData.nap), quality: sleepData.quality, note: sleepData.note || "" }
      : { night: "", nap: "", quality: "", note: "" }
  );

  const LEVELS  = ["Less", "Normal", "More"];
  const QUALITY = ["Restless", "Normal", "Deep"];

  const set    = (k, v) => setLevels((s) => ({ ...s, [k]: v }));
  const nightH = Math.max(0, parseFloat(sleep.night) || 0);
  const napH   = Math.max(0, parseFloat(sleep.nap)   || 0);
  const totalH = parseFloat((nightH + napH).toFixed(1));

  const sleepInsight = () => {
    if (!sleepSaved || !sleepData) return null;
    const t = sleepData.night + sleepData.nap;
    if (t >= 12) return `${pet.name} slept more than usual today. You may want to watch their energy and mood. 💤`;
    if (t <= 6)  return `${pet.name} slept less than usual today. A calmer evening routine may help. 🌙`;
    return `${pet.name}'s sleep looks steady today. 🌙`;
  };

  const handleSaveSleep = () => {
    if (!sleep.quality) return;
    saveSleep({ night: nightH, nap: napH, quality: sleep.quality, note: sleep.note, savedAt: new Date().toISOString() });
    setSleepSaved(true);
  };

  const nonSleepBehaviors = BEHAVIORS.filter((b) => b.key !== "sleeping");
  const done = Object.keys(levels).length + (sleepSaved ? 1 : 0);

  const fieldInput = {
    width: "100%", padding: "10px 12px", borderRadius: 12,
    border: `2px solid #80A0FF`, fontFamily: "Nunito",
    fontSize: 15, color: theme.ink, outline: "none",
  };

  return (
    <div style={{ padding: 22, paddingBottom: 32 }}>
      <TopBar title="Track behavior" onBack={() => go("home")} />
      <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, marginBottom: 14 }}>
        {done} of {BEHAVIORS.length} tracked today
      </p>

      {/* ── Sleeping — expanded tracker ── */}
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ background: theme.mist, borderRadius: 14, padding: 9 }}>
            <Moon size={20} color={theme.ocean} />
          </div>
          <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink }}>
            Sleeping
          </span>
          {sleepSaved && (
            <span style={{ marginLeft: "auto", background: theme.mint, color: "#2E7D5E", borderRadius: 999, padding: "3px 10px", fontFamily: "Nunito", fontWeight: 700, fontSize: 12 }}>
              ✓ Saved
            </span>
          )}
        </div>

        <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: "0 0 14px", lineHeight: 1.5 }}>
          Track sleep to help Comi notice wellness patterns over time.
        </p>

        {/* Night sleep + Nap */}
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 4px" }}>Night sleep</p>
            <div style={{ position: "relative" }}>
              <input
                type="number" min="0" max="16" step="0.5"
                value={sleep.night}
                onChange={(e) => { setSleep((s) => ({ ...s, night: e.target.value })); setSleepSaved(false); }}
                placeholder="0"
                style={{ ...fieldInput, paddingRight: 40 }}
              />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "Nunito", fontSize: 13, color: theme.slate, pointerEvents: "none" }}>hrs</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 4px" }}>Nap time</p>
            <div style={{ position: "relative" }}>
              <input
                type="number" min="0" max="8" step="0.5"
                value={sleep.nap}
                onChange={(e) => { setSleep((s) => ({ ...s, nap: e.target.value })); setSleepSaved(false); }}
                placeholder="0"
                style={{ ...fieldInput, paddingRight: 40 }}
              />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontFamily: "Nunito", fontSize: 13, color: theme.slate, pointerEvents: "none" }}>hrs</span>
            </div>
          </div>
        </div>

        {/* Total sleep */}
        {totalH > 0 && (
          <div style={{ background: theme.mist, borderRadius: 12, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Moon size={16} color={theme.ocean} />
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ocean }}>
              Total sleep today: {totalH} {totalH === 1 ? "hour" : "hours"}
            </span>
          </div>
        )}

        {/* Sleep quality */}
        <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 8px" }}>Sleep quality</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {QUALITY.map((q) => (
            <button key={q}
              onClick={() => { setSleep((s) => ({ ...s, quality: q })); setSleepSaved(false); }}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer",
                border: sleep.quality === q ? `2px solid ${theme.ocean}` : `2px solid #80A0FF`,
                background: sleep.quality === q ? theme.sky : "#fff",
                fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink,
              }}>
              {q}
            </button>
          ))}
        </div>

        {/* Optional note */}
        <input
          value={sleep.note}
          onChange={(e) => { setSleep((s) => ({ ...s, note: e.target.value })); setSleepSaved(false); }}
          placeholder={`Add a note… e.g. ${pet.name} slept after the park.`}
          style={{ ...fieldInput, marginBottom: 14 }}
        />

        {/* Save */}
        <button
          onClick={handleSaveSleep}
          disabled={!sleep.quality}
          style={{
            width: "100%", padding: "13px 0", borderRadius: 999, border: "none",
            cursor: sleep.quality ? "pointer" : "not-allowed",
            background: sleep.quality ? theme.ocean : theme.line,
            fontFamily: "Quicksand", fontWeight: 700, fontSize: 16,
            color: sleep.quality ? "#fff" : theme.slate, transition: "background .2s",
          }}>
          Save sleep data
        </button>

        {/* Insight shown after saving */}
        {sleepInsight() && (
          <div style={{ background: theme.mint, borderRadius: 14, padding: "12px 14px", marginTop: 12 }}>
            <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
              {sleepInsight()}
            </p>
          </div>
        )}
      </Card>

      {/* ── Comi Smart Dog Tag premium promo ── */}
      {(() => {
        return (
          <div style={{
            borderRadius: 22, padding: "18px 18px 16px", marginBottom: 12,
            background: "linear-gradient(135deg, #EAF4FB 0%, #D6C7F0 100%)",
            border: "1.5px solid rgba(130,100,220,0.18)",
            boxShadow: "0 2px 14px rgba(90,142,200,0.10)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 13, marginBottom: 14 }}>
              <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 14, padding: 10, flexShrink: 0, boxShadow: "0 2px 8px rgba(110,79,200,0.12)" }}>
                <QrCode size={20} color="#6E4FC8" strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>
                    Comi Smart Dog Tag
                  </p>
                  <span style={{ background: "#6E4FC8", color: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 9, padding: "2px 8px", borderRadius: 999 }}>
                    Comi Plus
                  </span>
                </div>
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0, lineHeight: 1.5 }}>
                  A smart collar tag that tracks {pet.name}'s movement, rest periods, and daily steps — syncs automatically to Wellness.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["GPS-free movement", "Rest detection", "Daily step count"].map((label) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.65)", borderRadius: 12, padding: "5px 11px" }}>
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button style={{ flex: 1, padding: "11px 0", borderRadius: 999, border: "none", background: "#6E4FC8", fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer" }}>
                Join waitlist
              </button>
              <button style={{ flex: 1, padding: "11px 0", borderRadius: 999, border: "1.5px solid rgba(130,100,220,0.35)", background: "rgba(255,255,255,0.6)", fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#6E4FC8", cursor: "pointer" }}>
                Learn more
              </button>
            </div>
          </div>
        );
      })()}

      {/* DEAD CODE PLACEHOLDER — camera connected section removed */}
      {false && (() => {
        /* Connected — show status, recent event insight, summary grid */
        const events    = pet.cameraEvents || [];
        const cam       = pet.connectedCamera;
        const recent    = events.find(e => !e.endTime) || events[events.length - 1];
        const nightMins = events.filter(e => e.activityType === "sleeping" && e.confirmedByUser !== false).reduce((s, e) => s + (e.durationMinutes || 0), 0);
        const napMins   = events.filter(e => e.activityType === "resting"  && e.confirmedByUser !== false).reduce((s, e) => s + (e.durationMinutes || 0), 0);

        const confirmEvent = (id, value) =>
          onUpdateCamEvents && onUpdateCamEvents(events.map(e => e.id === id ? { ...e, confirmedByUser: value } : e));

        return (
          <Card style={{ padding: 16, marginBottom: 12, background: theme.mist }}>
            {/* Header — connected status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Camera size={16} color={theme.ocean} />
              <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, flex: 1 }}>
                Home camera connected
              </span>
              <LiveDot />
            </div>

            {/* Most recent camera insight */}
            {recent && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "0 0 2px", lineHeight: 1.5 }}>
                  {`${pet.name} ${recent.activityType === "sleeping" ? "slept" : recent.activityType === "resting" ? "rested" : recent.activityType === "moving" ? "moved around" : recent.activityType}${recent.restZone ? ` on the ${recent.restZone.toLowerCase()}` : ""}${cam.room ? ` in the ${cam.room.toLowerCase()}` : ""} for ${fmtDur(recent.durationMinutes)}.`}
                </p>
                <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, margin: "0 0 8px" }}>
                  {Math.round((recent.confidence || 0) * 100)}% confidence · {recent.endTime ? "completed" : "in progress"}
                </p>
                {recent.confirmedByUser === null ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => confirmEvent(recent.id, true)} style={{
                      padding: "6px 14px", borderRadius: 999, border: "none",
                      background: theme.mint, fontFamily: "Nunito", fontWeight: 700,
                      fontSize: 12, color: theme.ink, cursor: "pointer",
                    }}>Correct</button>
                    <button onClick={() => go("camera_events")} style={{
                      padding: "6px 14px", borderRadius: 999, border: `1px solid #80A0FF`,
                      background: "#fff", fontFamily: "Nunito", fontWeight: 700,
                      fontSize: 12, color: theme.ink, cursor: "pointer",
                    }}>Edit</button>
                    <button onClick={() => confirmEvent(recent.id, false)} style={{
                      padding: "6px 14px", borderRadius: 999, border: "none",
                      background: "#F0F0F0", fontFamily: "Nunito", fontWeight: 700,
                      fontSize: 12, color: theme.ink, cursor: "pointer",
                    }}>Ignore</button>
                  </div>
                ) : (
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: recent.confirmedByUser ? "#2E7D5E" : theme.slate }}>
                    {recent.confirmedByUser ? "✓ Confirmed" : "Ignored"}
                  </span>
                )}
              </div>
            )}

            {/* Rest summary grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <StatCell label="Night sleep"   value={fmtDur(nightMins)} />
              <StatCell label="Daytime naps"  value={fmtDur(napMins)} />
              <StatCell label="Total rest"    value={fmtDur(nightMins + napMins)} />
              <StatCell label="Top rest spot" value={topRestZone(events)} />
            </div>

            {napMins > 0 && (
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ocean, fontWeight: 700, margin: "0 0 8px" }}>
                Camera detected {fmtDur(napMins)} of daytime rest today.
              </p>
            )}

            <button onClick={() => go("camera_events")} style={{
              background: "none", border: "none", color: theme.ocean,
              fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
              cursor: "pointer", padding: 0,
            }}>
              View full activity log →
            </button>
          </Card>
        );
      })()}

      {/* ── Other behavior cards ── */}
      {nonSleepBehaviors.map((b) => (
        <Card key={b.key} style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ background: theme.mist, borderRadius: 14, padding: 9 }}><b.icon size={20} color={theme.ocean} /></div>
            <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink }}>{b.label}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {LEVELS.map((lv) => (
              <button key={lv} onClick={() => set(b.key, lv)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 12, cursor: "pointer",
                  border: levels[b.key] === lv ? `2px solid ${theme.ocean}` : `2px solid #80A0FF`,
                  background: levels[b.key] === lv ? theme.sky : "#fff",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ink,
                }}>
                {lv}
              </button>
            ))}
          </div>
        </Card>
      ))}

      <div style={{ height: 18 }} />
      <Button onClick={() => go("home")}>Log today's behavior</Button>
      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
        Comi helps you notice patterns. It does not replace your vet.
      </p>
    </div>
  );
}

// 7. Wellness Insights
function InsightsScreen({ go, pet, sleepData, todayMood }) {
  const [range, setRange] = useState("Week");

  // Today's position in the Mon-first week (0=Mon … 6=Sun)
  const jsDay    = new Date().getDay();
  const todayIdx = jsDay === 0 ? 6 : jsDay - 1;

  // Mood chart: sample dots for 6 days, today's real mood replaces the correct dot
  const BASE_MOOD_DOTS = ["happy", "playful", "calm", "sleepy", "low_energy", "calm", "happy"];
  const weekDots = BASE_MOOD_DOTS.map((key, i) =>
    i === todayIdx && todayMood ? todayMood.key : key
  );

  // Sleep chart: sample heights with today's bar replaced by real data when available
  const SAMPLE_H     = [50, 60, 70, 80, 75, 65, 60];
  const hasRealSleep = !!sleepData;
  const bars = SAMPLE_H.map((h, i) => {
    if (i === todayIdx && hasRealSleep) {
      const total = sleepData.night + sleepData.nap;
      return { h: Math.max(14, Math.round((total / 14) * 90)), real: true, hours: total };
    }
    return { h, real: false };
  });

  // Sleep insight card
  const sleepCard = (() => {
    if (!hasRealSleep) return {
      bg: theme.mint, icon: IconSleepy,
      text: `Start tracking ${pet.name}'s sleep in the behavior screen to see personalised insights here.`,
    };
    const total = sleepData.night + sleepData.nap;
    if (total >= 12) return { bg: theme.yellow, icon: IconSleepy, text: `${pet.name} slept more than usual today. You may want to watch their energy and mood.` };
    if (total <= 6)  return { bg: theme.coral,  icon: IconSleepy, text: `${pet.name} slept less than usual today. A calmer evening routine may help.` };
    return              { bg: theme.mint,   icon: IconSleepy, text: `${pet.name}'s sleep looks steady today. Keep up the good routine!` };
  })();

  // Mood icons used only for the small sleep/play insight cards
  const MOOD_ICON = { playful: IconFun, happy: IconFun, sad: IconSad, low_energy: IconSad, sleepy: IconSleepy, calm: IconThinking, anxious: IconWorry };

  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Wellness insights" onBack={() => go("home")} />
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Chip label="Week"  active={range === "Week"}  onClick={() => setRange("Week")} />
        <Chip label="Month" active={range === "Month"} onClick={() => setRange("Month")} />
      </div>

      {/* Sleep insight */}
      <Card style={{ background: sleepCard.bg, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={sleepCard.icon} alt="sleep" style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }} />
          <p style={{ fontFamily: "Nunito", fontSize: 15, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
            <b>{sleepCard.text}</b>
          </p>
        </div>
      </Card>

      <Card style={{ background: theme.coral, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={IconFun} alt="play" style={{ width: 48, height: 48, objectFit: "contain", flexShrink: 0 }} />
          <p style={{ fontFamily: "Nunito", fontSize: 15, color: theme.ink, margin: 0, lineHeight: 1.5 }}>
            <b>Playtime is a little lower than usual.</b> A short play session might lift their mood!
          </p>
        </div>
      </Card>

      {/* Mood chart */}
      <SectionTitle>Mood this week</SectionTitle>
      {!todayMood && (
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 8px", lineHeight: 1.5 }}>
          Sample weekly pattern — log today's mood to see your data here
        </p>
      )}
      <Card style={{ marginBottom: todayMood ? 10 : 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDots.map((mk, i) => {
            const m = MOODS.find((x) => x.key === mk);
            if (!m) return null;
            const isToday = i === todayIdx;
            return (
              <div key={i} style={{ textAlign: "center", flex: 1 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", background: m.color,
                  display: "grid", placeItems: "center", margin: "0 auto 4px",
                  border: isToday && todayMood ? `2.5px solid ${theme.ocean}` : `2px solid transparent`,
                  boxShadow: isToday && todayMood ? "0 2px 8px rgba(90,142,200,0.25)" : "none",
                  overflow: "hidden",
                }}>
                  <img src={getMascotMoodImage(pet, m.key)} alt={m.label} style={{ width: 38, height: 38, objectFit: "contain" }} />
                </div>
                <span style={{ fontFamily: "Nunito", fontSize: 11, color: isToday ? theme.ocean : theme.slate, fontWeight: isToday ? 700 : 400 }}>
                  {["M","T","W","T","F","S","S"][i]}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today's mood summary card */}
      {todayMood && (
        <Card style={{ marginBottom: 16, background: todayMood.color }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={getMascotMoodImage(pet, todayMood.key)}
              alt={todayMood.label}
              style={{ width: 64, height: 64, objectFit: "contain", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, margin: 0, opacity: 0.7 }}>Today's mood</p>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink, margin: 0 }}>
                {todayMood.label} · {todayMood.intensity}/10
              </p>
              {todayMood.note ? (
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "3px 0 0", opacity: 0.8, lineHeight: 1.4 }}>
                  {todayMood.note}
                </p>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      {/* Sleep chart */}
      <SectionTitle>Sleep pattern</SectionTitle>
      {!hasRealSleep && (
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 8px", lineHeight: 1.5 }}>
          Sample weekly pattern — log sleep to see your data here
        </p>
      )}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 90, gap: 6 }}>
          {bars.map((bar, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {bar.real && (
                <span style={{ fontFamily: "Nunito", fontSize: 10, fontWeight: 700, color: theme.ocean }}>{bar.hours}h</span>
              )}
              <div style={{ width: "100%", height: bar.h, borderRadius: 10, background: bar.real ? theme.ocean : theme.sky }} />
              <span style={{ fontFamily: "Nunito", fontSize: 11, color: i === todayIdx ? theme.ocean : theme.slate, fontWeight: i === todayIdx ? 700 : 400 }}>
                {["M","T","W","T","F","S","S"][i]}
              </span>
            </div>
          ))}
        </div>
        {hasRealSleep && sleepData.note ? (
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "10px 0 0", lineHeight: 1.5 }}>
            {sleepData.note}
          </p>
        ) : null}
      </Card>

      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
        Comi helps you notice patterns. It does not replace your vet.
      </p>
    </div>
  );
}

// 8. AI Pet Insights — food safety cards + general guidance (prototype, no real API)
function AiScreen({ go, pet, aiHistory, setAiHistory }) {
  const [input, setInput] = useState("");
  const messagesEndRef = React.useRef(null);

  const defaultMsg = {
    from: "comi",
    text: `Hi! I'm Comi. Ask me anything about ${pet.name}'s food, mood, sleep, or behaviour. Tap a question below or type your own!`,
  };

  const messages = aiHistory?.length ? aiHistory : [defaultMsg];
  const setMessages = (updater) => {
    const next = typeof updater === "function" ? updater(messages) : updater;
    setAiHistory(next);
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  /* Core send function — called by both the button and suggestion chips */
  const sendText = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { from: "me", text: trimmed, timestamp: new Date().toISOString() };

    /* Future: replace searchKnowledgeBase with a real API call to
       a backend endpoint that uses an LLM (e.g. Claude) for richer answers.
       API keys must live server-side only — never in the frontend bundle. */
    const entry = searchKnowledgeBase(trimmed);
    const comiMsg = entry
      ? {
          from: "comi", type: "kb",
          entry,
          petId: pet.id,
          question: trimmed,
          riskLevel: entry.riskLevel,
          timestamp: new Date().toISOString(),
        }
      : {
          from: "comi",
          text: `I'm not fully sure about that yet, but I'm always learning! For health concerns, please contact your vet. You can also try asking about a specific food, mood, or behaviour.`,
          timestamp: new Date().toISOString(),
        };

    setMessages((m) => [...m, userMsg, comiMsg]);
    setInput("");
  };

  const send = () => sendText(input);

  const suggestions = [
    `Can ${pet.name} eat apple?`,
    `Can ${pet.name} eat chocolate?`,
    `Why is ${pet.name} sleeping more?`,
    `${pet.name} seems worried`,
    `${pet.name} is licking paws`,
    `${pet.name} not eating`,
    `Is xylitol dangerous?`,
    `${pet.name}'s heat cycle`,
  ];

  return (
    <div style={{ padding: "22px 22px 16px", display: "flex", flexDirection: "column", height: "100%" }}>
      <TopBar title={`Ask about ${pet.name}`} onBack={() => go("home")} />

      {/* Safety notice */}
      <div style={{
        background: "#FFF8E6", borderRadius: 14, padding: "9px 13px",
        marginBottom: 10, display: "flex", gap: 8, alignItems: "flex-start", flexShrink: 0,
        border: "1px solid #FFE08A",
      }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, margin: 0, lineHeight: 1.45 }}>
          <b>Comi gives friendly everyday guidance, not medical advice.</b> For any health concerns, please contact your vet.
        </p>
      </div>

      {/* Chat messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.from === "me" ? "flex-end" : "flex-start",
              maxWidth: m.type === "kb" ? "97%" : "82%",
              width: m.type === "kb" ? "97%" : undefined,
            }}
          >
            {/* Comi avatar label */}
            {m.from === "comi" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: theme.sky, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
                  <img src={ComiMain} alt="Comi" style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                </div>
                <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, fontWeight: 700 }}>Comi</span>
              </div>
            )}

            {/* KB answer card OR plain bubble */}
            {m.type === "kb" ? (
              <KnowledgeAnswerCard entry={m.entry} petName={pet.name} />
            ) : (
              <div style={{
                background: m.from === "me" ? theme.ocean : "#fff",
                color: m.from === "me" ? "#fff" : theme.ink,
                padding: "11px 14px", borderRadius: 18,
                borderBottomRightRadius: m.from === "me" ? 4 : 18,
                borderBottomLeftRadius:  m.from === "me" ? 18 : 4,
                fontFamily: "Nunito", fontSize: 14, lineHeight: 1.5, boxShadow: theme.shadow,
              }}>
                {m.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips — clicking auto-submits immediately */}
      <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "8px 0 6px", flexShrink: 0 }}>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => sendText(s)}
            style={{
              flexShrink: 0, padding: "7px 13px", borderRadius: 999,
              border: `1.5px solid #80A0FF`, background: "#fff",
              fontFamily: "Nunito", fontSize: 12.5, color: theme.ocean,
              cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about food, mood, sleep…"
          style={{
            flex: 1, padding: "13px 16px", borderRadius: 999,
            border: `2px solid #80A0FF`, fontFamily: "Nunito",
            fontSize: 14, outline: "none", color: theme.ink,
          }}
        />
        <button
          onClick={send}
          style={{
            background: theme.ocean, border: "none", borderRadius: "50%",
            width: 46, height: 46, display: "grid", placeItems: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <Send size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}

const CAL_CATEGORIES = ["Vet","Medication","Grooming","Walk","Food","Training","Heat Cycle","Sleep","Behaviour","Custom"];
const CAL_CAT_COLORS = {
  Vet: "#FFD5CC", Medication: "#FFE08A", Grooming: "#BFE3C8", Walk: "#B8D9F0",
  Food: "#FECDD3", Training: "#D6C7F0", "Heat Cycle": "#FEF0F5",
  Sleep: "#E0EFFF", Behaviour: "#FFF0E0", Custom: "#EAF4FB",
};

function CalendarScreen({ go, reminders, setReminders, calendarNotes, setCalendarNotes, pet, pets }) {
  const toggle = (id) => setReminders(rs => rs.map(r => r.id === id ? { ...r, on: !r.on } : r));
  const [addOpen, setAddOpen] = useState(false);
  const [editNote, setEditNote] = useState(null); // null = new, else note object

  const [noteTitle,    setNoteTitle]    = useState("");
  const [noteCat,      setNoteCat]      = useState("Custom");
  const [noteDate,     setNoteDate]     = useState(new Date().toISOString().split("T")[0]);
  const [noteTime,     setNoteTime]     = useState("");
  const [noteRepeat,   setNoteRepeat]   = useState("None");
  const [noteText,     setNoteText]     = useState("");
  const [notePetId,    setNotePetId]    = useState(pet?.id || 1);

  const openAdd = () => {
    setEditNote(null);
    setNoteTitle(""); setNoteCat("Custom"); setNoteDate(new Date().toISOString().split("T")[0]);
    setNoteTime(""); setNoteRepeat("None"); setNoteText(""); setNotePetId(pet?.id || 1);
    setAddOpen(true);
  };

  const openEdit = (note) => {
    setEditNote(note);
    setNoteTitle(note.title); setNoteCat(note.category); setNoteDate(note.date);
    setNoteTime(note.time || ""); setNoteRepeat(note.repeat || "None");
    setNoteText(note.note || ""); setNotePetId(note.petId || pet?.id || 1);
    setAddOpen(true);
  };

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    const entry = { title: noteTitle, category: noteCat, date: noteDate, time: noteTime, repeat: noteRepeat, note: noteText, petId: notePetId, done: false };
    if (editNote) {
      setCalendarNotes(ns => ns.map(n => n.id === editNote.id ? { ...n, ...entry } : n));
    } else {
      setCalendarNotes(ns => [{ id: Date.now(), ...entry }, ...ns]);
    }
    setAddOpen(false);
  };

  const deleteNote = (id) => setCalendarNotes(ns => ns.filter(n => n.id !== id));
  const toggleDone = (id) => setCalendarNotes(ns => ns.map(n => n.id === id ? { ...n, done: !n.done } : n));

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid #C8DCEF",
    fontFamily: "Nunito", fontSize: 14, color: "#34414E", outline: "none",
    background: "#fff", boxSizing: "border-box",
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayNotes  = calendarNotes.filter(n => n.date === todayStr);
  const upcomingNotes = calendarNotes.filter(n => n.date > todayStr).sort((a,b) => a.date.localeCompare(b.date));
  const pastNotes   = calendarNotes.filter(n => n.date < todayStr).sort((a,b) => b.date.localeCompare(a.date));

  const NoteCard = ({ note }) => (
    <Card style={{ marginBottom: 10, opacity: note.done ? 0.6 : 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <button
          onClick={() => toggleDone(note.id)}
          style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${note.done ? "#5A8EC8" : "#80A0FF"}`, background: note.done ? "#5A8EC8" : "transparent", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}
        >
          {note.done && <Check size={12} color="#fff" />}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
            <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#34414E", textDecoration: note.done ? "line-through" : "none" }}>{note.title}</span>
            <span style={{ fontFamily: "Nunito", fontSize: 11, fontWeight: 700, color: "#5A8EC8", background: CAL_CAT_COLORS[note.category] || "#EAF4FB", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>{note.category}</span>
          </div>
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", margin: 0 }}>
            {note.date}{note.time ? ` · ${note.time}` : ""}{note.repeat && note.repeat !== "None" ? ` · ${note.repeat}` : ""}
          </p>
          {note.note && <p style={{ fontFamily: "Nunito", fontSize: 13, color: "#34414E", margin: "4px 0 0", lineHeight: 1.4 }}>{note.note}</p>}
        </div>
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button onClick={() => openEdit(note)} style={{ background: "#EAF4FB", border: "none", borderRadius: 10, width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <Pencil size={13} color="#5A8EC8" />
          </button>
          <button onClick={() => deleteNote(note.id)} style={{ background: "#FFF0F0", border: "none", borderRadius: 10, width: 30, height: 30, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <X size={13} color="#C0392B" />
          </button>
        </div>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 22, paddingBottom: 40 }}>
      <TopBar title="Care & Calendar" onBack={() => go("profile")} />

      {/* Add calendar note button */}
      <button
        onClick={openAdd}
        style={{ width: "100%", padding: "13px 18px", borderRadius: 999, border: "2px dashed #80A0FF", background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: "#5A8EC8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, marginBottom: 20 }}
      >
        <Plus size={17} /> Add calendar note
      </button>

      {/* Daily reminders */}
      <SectionTitle>Daily reminders</SectionTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {reminders.map(r => (
          <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
            <div style={{ background: "#EAF4FB", borderRadius: 12, padding: 9 }}><r.icon size={18} color="#5A8EC8" /></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#34414E", margin: 0 }}>{r.label}</p>
              <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", margin: 0 }}>{r.time}</p>
            </div>
            <Toggle on={r.on} onClick={() => toggle(r.id)} />
          </Card>
        ))}
      </div>

      {/* Today's notes */}
      {todayNotes.length > 0 && (
        <>
          <SectionTitle>Today</SectionTitle>
          {todayNotes.map(n => <NoteCard key={n.id} note={n} />)}
        </>
      )}

      {/* Upcoming notes */}
      {upcomingNotes.length > 0 && (
        <>
          <SectionTitle>Upcoming</SectionTitle>
          {upcomingNotes.map(n => <NoteCard key={n.id} note={n} />)}
        </>
      )}

      {/* Past notes */}
      {pastNotes.length > 0 && (
        <>
          <SectionTitle>Past</SectionTitle>
          {pastNotes.map(n => <NoteCard key={n.id} note={n} />)}
        </>
      )}

      {calendarNotes.length === 0 && (
        <Card style={{ textAlign: "center", padding: 24 }}>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: "#7C8B98", margin: 0 }}>No calendar notes yet. Tap "+ Add calendar note" to get started!</p>
        </Card>
      )}

      {/* Add / Edit modal */}
      {addOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setAddOpen(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "20px 22px 40px", width: "100%", maxWidth: 390, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: "#34414E", margin: 0 }}>
                {editNote ? "Edit note" : "Add calendar note"}
              </p>
              <button onClick={() => setAddOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#7C8B98" /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Title" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} style={inputStyle} />

              <div>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: "#34414E", margin: "0 0 8px" }}>Category</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {CAL_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setNoteCat(cat)} style={{ padding: "7px 13px", borderRadius: 999, border: `2px solid ${noteCat === cat ? "#5A8EC8" : "#80A0FF"}`, background: noteCat === cat ? (CAL_CAT_COLORS[cat] || "#EAF4FB") : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: noteCat === cat ? "#34414E" : "#7C8B98", cursor: "pointer" }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <input type="date" value={noteDate} onChange={e => setNoteDate(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                <input type="time" value={noteTime} onChange={e => setNoteTime(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              </div>

              <div>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: "#34414E", margin: "0 0 8px" }}>Repeat</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {["None","Daily","Weekly","Monthly"].map(r => (
                    <button key={r} onClick={() => setNoteRepeat(r)} style={{ padding: "7px 13px", borderRadius: 999, border: `2px solid ${noteRepeat === r ? "#5A8EC8" : "#80A0FF"}`, background: noteRepeat === r ? "#EAF4FB" : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: noteRepeat === r ? "#5A8EC8" : "#7C8B98", cursor: "pointer" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <textarea placeholder="Note / description (optional)" value={noteText} onChange={e => setNoteText(e.target.value)} style={{ ...inputStyle, resize: "none", height: 72 }} />

              {pets && pets.length > 1 && (
                <div>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: "#34414E", margin: "0 0 8px" }}>Related pet</p>
                  <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {pets.map(p => (
                      <button key={p.id} onClick={() => setNotePetId(p.id)} style={{ padding: "7px 13px", borderRadius: 999, border: `2px solid ${notePetId === p.id ? "#5A8EC8" : "#80A0FF"}`, background: notePetId === p.id ? "#EAF4FB" : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: notePetId === p.id ? "#5A8EC8" : "#7C8B98", cursor: "pointer" }}>
                        {p.name || "Pet"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <Button onClick={saveNote} disabled={!noteTitle.trim()}>
                {editNote ? "Save changes" : "Add note"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 48, height: 28, borderRadius: 999, border: "none", background: on ? theme.ocean : theme.line, position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: 3, left: on ? 23 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
    </button>
  );
}

/* Dog avatar for community posts — maps hardcoded post IDs to breed images, falls back to Siba */
function CommunityAvatar({ post, userPhoto, size = 38 }) {
  const isUser = post.who === "You";
  if (isUser && userPhoto) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <img src={userPhoto} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="You" />
      </div>
    );
  }
  if (post.avatar) {
    return (
      <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #EAF4FB" }}>
        <img src={post.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={post.who} />
      </div>
    );
  }
  const PALETTE = ["#B8D9F0", "#FECDD3", "#BFE3C8", "#FFE08A", "#D6C7F0", "#FFB5A7"];
  const bg = PALETTE[(post.id - 1) % PALETTE.length] || theme.mist;
  const initial = isUser ? "Y" : (post.who?.charAt(0)?.toUpperCase() || "?");
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "grid", placeItems: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: Math.round(size * 0.42), color: theme.ink }}>
        {initial}
      </span>
    </div>
  );
}

// 10. Community
const TAG_STYLES = {
  Moment:   { bg: theme.mint,    text: "#2E7D5E" },
  Question: { bg: theme.yellow,  text: "#8A6500" },
  Tip:      { bg: theme.lilac,   text: "#5E3FA3" },
  Event:    { bg: "#D6C7F0",     text: "#5E3FA3" },
  Photo:    { bg: "#FECDD3",     text: "#C4617B" },
};

const COMMUNITY_GROUPS = [
  { id: 1, name: "Raw Food Diet Recipes", desc: "Share and discover raw feeding recipes for dogs.", members: 1243, photo: "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 2, name: "French Bulldog Meetups", desc: "Monthly meetups and events for Frenchie owners.", members: 876, photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 3, name: "Small Dog Owners", desc: "Tips, tricks, and community for small breed owners.", members: 2104, photo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 4, name: "Dog Events Vancouver", desc: "Local dog events, walks, and pet-friendly spots.", members: 659, photo: "https://images.unsplash.com/photo-1534361960057-19f4434a4fc6?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 5, name: "Puppy Training Tips", desc: "Positive reinforcement training for puppies of all breeds.", members: 3241, photo: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 6, name: "Dog-Friendly Cafés", desc: "Find and share dog-friendly cafés, restaurants, and patios.", members: 891, photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 7, name: "Sleep & Behaviour Help", desc: "Community support for dogs with sleep or anxiety issues.", members: 512, photo: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&q=80", joined: false },
  { id: 8, name: "Groomer Recommendations", desc: "Find and share trusted groomers near you.", members: 734, photo: "https://images.unsplash.com/photo-1512798262621-e55f18a51c56?auto=format&fit=crop&w=120&q=80", joined: false },
];

const SUGGESTED_FRIENDS = [
  { id: 1, who: "Mia & Luna", breed: "Poodle", photo: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?auto=format&fit=crop&w=100&q=80" },
  { id: 2, who: "Sam & Biscuit", breed: "Labrador", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=100&q=80" },
  { id: 3, who: "Ari & Mochi", breed: "Shiba Inu", photo: "https://images.unsplash.com/photo-1606107558-0d25b9a517cb?auto=format&fit=crop&w=100&q=80" },
  { id: 4, who: "Jess & Cooper", breed: "Golden Retriever", photo: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=100&q=80" },
];

const DOG_EVENTS = [
  { id: 1, title: "Frenchie Meetup", date: "Jul 12", location: "Deer Lake Park", attendees: 24, photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80" },
  { id: 2, title: "Puppy Playdate", date: "Jul 19", location: "Central Park", attendees: 18, photo: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=400&q=80" },
  { id: 3, title: "Saturday Pack Walk", date: "Jul 26", location: "Burnaby Lake Trail", attendees: 32, photo: "https://images.unsplash.com/photo-1534361960057-19f4434a4fc6?auto=format&fit=crop&w=400&q=80" },
];

function CommunityScreen({ posts, setPosts, pet, petPhoto }) {
  const [tab,           setTab]           = useState("For You");
  const [searchQ,       setSearchQ]       = useState("");
  const [searchFocus,   setSearchFocus]   = useState(false);
  const [askOpen,       setAskOpen]       = useState(false);
  const [askText,       setAskText]       = useState("");
  const [askPhoto,      setAskPhoto]      = useState(null);
  const [askTag,        setAskTag]        = useState("Moment");
  const [commentOpenId, setCommentOpenId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [packFriends,   setPackFriends]   = useState({});
  const [groups,        setGroups]        = useState(COMMUNITY_GROUPS);

  const TABS = ["For You", "Friends", "Groups", "Events", "Photos", "Places"];

  const like    = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  const addComment = (id) => {
    const text = (commentInputs[id] || "").trim();
    if (!text) return;
    setPosts(ps => ps.map(p => p.id === id ? { ...p, comments: [...p.comments, { who: "You", text }] } : p));
    setCommentInputs(ci => ({ ...ci, [id]: "" }));
  };
  const submitPost  = () => {
    if (!askText.trim() && !askPhoto) return;
    setPosts(ps => [{ id: Date.now(), who: "You", petName: pet.name, text: askText, photo: askPhoto, likes: 0, tag: askTag, comments: [] }, ...ps]);
    setAskText(""); setAskPhoto(null); setAskOpen(false);
  };
  const toggleGroup = (id) => setGroups(gs => gs.map(g => g.id === id ? { ...g, joined: !g.joined } : g));
  const togglePack  = (id) => setPackFriends(pf => ({ ...pf, [id]: !pf[id] }));
  const handlePostPhoto = (e) => { const f = e.target.files?.[0]; if (f) setAskPhoto(URL.createObjectURL(f)); };

  const HEALTH_WORDS = ["vet","sick","health","hurt","injury","wound","bleed","limp","pain","vomit","diarr","seiz","not eating"];
  const isHealthPost = (text) => HEALTH_WORDS.some(kw => (text || "").toLowerCase().includes(kw));

  const q = searchQ.toLowerCase();
  const filteredPosts   = (tab === "For You" ? posts : tab === "Events" ? posts.filter(p => p.tag === "Event") : tab === "Photos" ? posts.filter(p => p.photo) : posts)
    .filter(p => !q || p.who?.toLowerCase().includes(q) || p.text?.toLowerCase().includes(q));
  const filteredGroups  = groups.filter(g => !q || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
  const filteredFriends = SUGGESTED_FRIENDS.filter(f => !q || f.who.toLowerCase().includes(q) || f.breed.toLowerCase().includes(q));

  /* ── Post card ── */
  const PostCard = ({ p }) => {
    const ts     = TAG_STYLES[p.tag] || { bg: theme.mist, text: theme.ocean };
    const isOpen = commentOpenId === p.id;
    const inPack = !!packFriends[p.id];
    return (
      <div style={{ background: "#fff", borderRadius: 22, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 16px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
        <div style={{ padding: "14px 14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <CommunityAvatar post={p} userPhoto={petPhoto} size={40} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.who}</span>
              {p.petName && <span style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate }}>{p.petName}</span>}
            </div>
            <span style={{ fontFamily: "Nunito", fontSize: 11, fontWeight: 700, color: ts.text, background: ts.bg, padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>{p.tag}</span>
          </div>
          {p.text && <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: "0 0 10px", lineHeight: 1.55 }}>{p.text}</p>}
        </div>
        {p.photo && <img src={p.photo} alt="post" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />}
        <div style={{ padding: "10px 14px 12px", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => like(p.id)} style={{ background: "#FFF0EE", border: "none", borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: "#D0604A", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, padding: "6px 12px" }}>
            <Heart size={14} fill="#FFB5A7" color="#FFB5A7" /> {p.likes}
          </button>
          <button onClick={() => setCommentOpenId(isOpen ? null : p.id)} style={{ background: isOpen ? theme.mist : "#F4F8FC", border: "none", borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: isOpen ? theme.ocean : theme.slate, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, padding: "6px 12px" }}>
            <MessageCircle size={14} /> {p.comments.length}
          </button>
          <button onClick={() => togglePack(p.id)} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, padding: "6px 14px", borderRadius: 999, cursor: "pointer", border: "none", background: inPack ? theme.ocean : theme.mist, color: inPack ? "#fff" : theme.ocean }}>
            {inPack ? <><Check size={13} /> Pack</> : <><UserPlus size={13} /> Add</>}
          </button>
        </div>
        {isOpen && (
          <div style={{ borderTop: `1px solid ${theme.line}`, padding: "12px 14px 14px" }}>
            {isHealthPost(p.text) && (
              <div style={{ background: "#FFF8E1", borderRadius: 12, padding: "8px 12px", marginBottom: 10, display: "flex", gap: 8 }}>
                <span>⚕️</span>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, margin: 0, lineHeight: 1.5 }}>If this involves a health concern, please contact your vet. Community advice is not medical advice.</p>
              </div>
            )}
            {p.comments.map((c, i) => (
              <div key={i} style={{ background: theme.mist, borderRadius: 12, padding: "8px 12px", marginBottom: 6 }}>
                <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 12, color: theme.ocean }}>{c.who}</span>
                {c.text && <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "2px 0 0" }}>{c.text}</p>}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input value={commentInputs[p.id] || ""} onChange={e => setCommentInputs(ci => ({ ...ci, [p.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addComment(p.id)} placeholder="Write a comment…" style={{ flex: 1, padding: "9px 14px", borderRadius: 999, border: `1.5px solid ${theme.line}`, fontFamily: "Nunito", fontSize: 13, outline: "none", color: theme.ink, background: "#fff" }} />
              <button onClick={() => addComment(p.id)} style={{ background: theme.ocean, border: "none", borderRadius: "50%", width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                <Send size={14} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: theme.mist, minHeight: "100%", paddingBottom: 32 }}>

      {/* ── Hero banner ── */}
      <div style={{ background: "linear-gradient(135deg, #4A82C0 0%, #6AAED8 55%, #93C5E0 100%)", padding: "18px 20px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -28, right: -28, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.10)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -18, left: -18, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
        <p style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.72)", margin: "0 0 2px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>Welcome to</p>
        <h1 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 22, color: "#fff", margin: "0 0 4px", lineHeight: 1.2 }}>The Comi Pack</h1>
        <p style={{ fontFamily: "Nunito", fontSize: 12.5, color: "rgba(255,255,255,0.80)", margin: "0 0 14px", lineHeight: 1.4 }}>Connect with pet owners, share moments, and grow together.</p>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <button onClick={() => setAskOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, background: "#fff", border: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 12.5, color: theme.ocean, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}>
            <Plus size={14} /> Share moment
          </button>
          <div style={{ display: "flex", alignItems: "center", padding: "8px 14px", borderRadius: 999, background: "rgba(255,255,255,0.18)" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff" }}>{posts.length + 12}k members</span>
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ position: "relative" }}>
          <Search size={15} color={theme.slate} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
            placeholder="Search friends, groups, posts…"
            style={{ width: "100%", padding: "11px 36px 11px 38px", borderRadius: 999, border: `1.5px solid ${searchFocus ? theme.ocean : "rgba(90,142,200,0.18)"}`, fontFamily: "Nunito", fontSize: 13, color: theme.ink, outline: "none", background: "#fff", boxSizing: "border-box", boxShadow: "0 2px 8px rgba(90,142,200,0.07)" }}
          />
          {searchQ && <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}><X size={15} color={theme.slate} /></button>}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ padding: "10px 16px 0", display: "flex", gap: 7, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flexShrink: 0, padding: "8px 20px", borderRadius: 999, border: "none", background: tab === t ? theme.ocean : "#fff", color: tab === t ? "#fff" : theme.slate, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: tab === t ? "0 3px 10px rgba(90,142,200,0.26)" : "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.12s" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "14px 14px 0" }}>

        {/* ── FOR YOU ── */}
        {tab === "For You" && !searchQ && (
          <>
            {/* Suggested Friends */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
                <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink }}>Suggested Friends</span>
                <button onClick={() => setTab("Friends")} style={{ background: "none", border: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, cursor: "pointer" }}>See all</button>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {SUGGESTED_FRIENDS.map(f => (
                  <div key={f.id} style={{ flexShrink: 0, width: 108, background: "#fff", borderRadius: 18, padding: "14px 10px 12px", textAlign: "center", boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", border: `2px solid ${theme.mist}` }}>
                      <img src={f.photo} alt={f.who} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 12, color: theme.ink, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.who.split(" & ")[1] || f.who}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate, margin: "0 0 8px" }}>{f.breed}</p>
                    <button onClick={() => togglePack(f.id)} style={{ width: "100%", padding: "5px 0", borderRadius: 999, border: "none", background: packFriends[f.id] ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: packFriends[f.id] ? "#fff" : theme.ocean, cursor: "pointer" }}>
                      {packFriends[f.id] ? "✓ Pack" : "+ Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Groups */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
                <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink }}>Popular Groups</span>
                <button onClick={() => setTab("Groups")} style={{ background: "none", border: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, cursor: "pointer" }}>See all</button>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {groups.slice(0, 5).map(g => (
                  <div key={g.id} style={{ flexShrink: 0, width: 148, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                    <div style={{ width: "100%", height: 80, overflow: "hidden", background: "#EAF4FB" }}>
                      <img src={g.photo} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "9px 10px 11px" }}>
                      <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 12, color: theme.ink, margin: "0 0 2px", lineHeight: 1.3 }}>{g.name}</p>
                      <p style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate, margin: "0 0 7px" }}>{g.members.toLocaleString()} members</p>
                      <button onClick={() => toggleGroup(g.id)} style={{ width: "100%", padding: "5px 0", borderRadius: 999, border: "none", background: g.joined ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: g.joined ? "#fff" : theme.ocean, cursor: "pointer" }}>
                        {g.joined ? "✓ Joined" : "Join"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
                <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink }}>Upcoming Events</span>
                <button onClick={() => setTab("Events")} style={{ background: "none", border: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, cursor: "pointer" }}>See all</button>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {DOG_EVENTS.map(ev => (
                  <div key={ev.id} style={{ flexShrink: 0, width: 195, background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                    <div style={{ width: "100%", height: 88, overflow: "hidden" }}>
                      <img src={ev.photo} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "9px 12px 11px" }}>
                      <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 3px" }}>{ev.title}</p>
                      <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, margin: 0 }}>{ev.date} · {ev.location}</p>
                      <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ocean, margin: "2px 0 0", fontWeight: 700 }}>{ev.attendees} going</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Dog Tag card */}
            <div style={{
              background: "linear-gradient(135deg, #EAF4FB 0%, #D6C7F0 100%)",
              borderRadius: 22, padding: "16px 16px 14px",
              marginBottom: 20,
              boxShadow: "0 2px 14px rgba(90,142,200,0.10)",
              border: "1.5px solid rgba(130,100,220,0.14)",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              {/* QR mockup box */}
              <div style={{ flexShrink: 0, width: 62, height: 62, borderRadius: 14, background: "#fff", boxShadow: "0 2px 8px rgba(90,142,200,0.14)", display: "grid", placeItems: "center", overflow: "hidden" }}>
                <QrCode size={36} color="#5A8EC8" strokeWidth={1.5} />
              </div>

              {/* Text + buttons */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, margin: "0 0 3px" }}>Comi QR Dog Tag</p>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 10px", lineHeight: 1.4 }}>
                  Let other owners scan {pet.name}'s tag to view his profile and add him to their Pack.
                </p>
                <div style={{ display: "flex", gap: 7 }}>
                  <button style={{ padding: "7px 14px", borderRadius: 999, border: "none", background: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.22)" }}>
                    View QR
                  </button>
                  <button style={{ padding: "7px 14px", borderRadius: 999, border: `1.5px solid rgba(130,100,220,0.30)`, background: "rgba(255,255,255,0.70)", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#6E4FC8", cursor: "pointer" }}>
                    Order Tag
                  </button>
                </div>
              </div>
            </div>

            {/* From the Pack header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
              <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink }}>From the Pack</span>
              <button onClick={() => setAskOpen(true)} style={{ display: "flex", alignItems: "center", gap: 4, background: theme.mist, border: "none", borderRadius: 999, padding: "6px 13px", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, cursor: "pointer" }}>
                <Plus size={13} /> Post
              </button>
            </div>
          </>
        )}

        {/* Search results hint */}
        {searchQ && tab === "For You" && (
          <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: "0 2px 12px" }}>Results for "{searchQ}"</p>
        )}

        {/* ── FRIENDS TAB ── */}
        {tab === "Friends" && (
          <>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 2px 12px" }}>Suggested for you</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {filteredFriends.map(f => (
                <div key={f.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                  <div style={{ width: "100%", height: 80, overflow: "hidden", background: theme.mist }}>
                    <img src={f.photo} alt={f.who} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "10px 12px 12px" }}>
                    <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: "0 0 2px" }}>{f.who}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, margin: "0 0 8px" }}>{f.breed}</p>
                    <button onClick={() => togglePack(f.id)} style={{ width: "100%", padding: "7px 0", borderRadius: 999, border: "none", background: packFriends[f.id] ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: packFriends[f.id] ? "#fff" : theme.ocean, cursor: "pointer" }}>
                      {packFriends[f.id] ? "✓ In Pack" : "+ Add to Pack"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredFriends.length === 0 && <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, textAlign: "center", marginTop: 24 }}>No results for "{searchQ}"</p>}
          </>
        )}

        {/* ── GROUPS TAB ── */}
        {tab === "Groups" && (
          <>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 2px 12px" }}>Discover groups</p>
            {filteredGroups.map(g => (
              <div key={g.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 12, boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                <div style={{ width: "100%", height: 96, overflow: "hidden" }}>
                  <img src={g.photo} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "12px 14px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, margin: "0 0 3px" }}>{g.name}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 4px", lineHeight: 1.4 }}>{g.desc}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ocean, margin: 0, fontWeight: 700 }}>{g.members.toLocaleString()} members</p>
                  </div>
                  <button onClick={() => toggleGroup(g.id)} style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 999, border: "none", background: g.joined ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: g.joined ? "#fff" : theme.ocean, cursor: "pointer" }}>
                    {g.joined ? "✓ Joined" : "Join"}
                  </button>
                </div>
              </div>
            ))}
            {filteredGroups.length === 0 && <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, textAlign: "center", marginTop: 24 }}>No groups match "{searchQ}"</p>}
          </>
        )}

        {/* ── EVENTS TAB ── */}
        {tab === "Events" && (
          <>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 2px 12px" }}>Upcoming events</p>
            {DOG_EVENTS.map(ev => (
              <div key={ev.id} style={{ background: "#fff", borderRadius: 20, overflow: "hidden", marginBottom: 12, boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
                <div style={{ width: "100%", height: 120, overflow: "hidden" }}>
                  <img src={ev.photo} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "12px 14px 14px" }}>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 4px" }}>{ev.title}</p>
                  <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 2px" }}>{ev.date}</p>
                  <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 10px" }}>{ev.location}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean }}>{ev.attendees} going</span>
                    <button style={{ padding: "8px 18px", borderRadius: 999, border: "none", background: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff", cursor: "pointer" }}>RSVP</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── PLACES tab ── */}
        {tab === "Places" && <CommunityPlaces pet={pet} />}

        {/* ── POST FEED (For You + Photos tabs) ── */}
        {(tab === "For You" || tab === "Photos") && (
          filteredPosts.length === 0
            ? <div style={{ textAlign: "center", padding: "28px 0" }}><p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>{searchQ ? `No results for "${searchQ}"` : "Nothing here yet — be the first to post!"}</p></div>
            : filteredPosts.map(p => <PostCard key={p.id} p={p} />)
        )}

        <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 11, color: theme.slate, marginTop: 4, lineHeight: 1.6 }}>Community advice is not medical advice.</p>
      </div>

      {/* ── Post composer sheet ── */}
      {askOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setAskOpen(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "22px 20px 36px", width: "100%", maxWidth: 390 }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: theme.line, margin: "0 auto 16px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: theme.ink, margin: 0 }}>Share with the Pack</p>
              <button onClick={() => { setAskOpen(false); setAskPhoto(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color={theme.slate} /></button>
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
              {["Moment","Question","Tip","Event","Photo"].map(t => (
                <button key={t} onClick={() => setAskTag(t)} style={{ padding: "6px 13px", borderRadius: 999, border: "none", background: askTag === t ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: askTag === t ? "#fff" : theme.ocean, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            <textarea value={askText} onChange={e => setAskText(e.target.value)} placeholder="What would you like to share?" style={{ width: "100%", padding: "12px 14px", borderRadius: 16, border: `1.5px solid ${theme.line}`, fontFamily: "Nunito", fontSize: 14, color: theme.ink, outline: "none", resize: "none", height: 80, boxSizing: "border-box", marginBottom: 10 }} />
            {askPhoto
              ? <div style={{ position: "relative", marginBottom: 10 }}>
                  <img src={askPhoto} alt="preview" style={{ width: "100%", maxHeight: 150, objectFit: "cover", borderRadius: 14, display: "block" }} />
                  <button onClick={() => setAskPhoto(null)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.40)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={13} color="#fff" /></button>
                </div>
              : <label style={{ display: "block", padding: "10px", borderRadius: 999, background: theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ocean, textAlign: "center", cursor: "pointer", marginBottom: 10 }}>
                  📷 Add photo<input type="file" accept="image/*" onChange={handlePostPhoto} style={{ display: "none" }} />
                </label>
            }
            <Button onClick={submitPost} disabled={!askText.trim() && !askPhoto}>Post to the Pack</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// 11a. Places tab embedded inside Community
function CommunityPlaces({ pet }) {
  const [filter, setFilter] = useState("All");
  const [query,  setQuery]  = useState("");
  const [locStatus, setLocStatus] = useState("prompt");
  const [currentLoc, setCurrentLoc] = useState("Burnaby, BC");
  const [coords, setCoords] = useState(null);
  const FILTERS = ["All", "Park", "Walk", "Café", "Vet", "Groomer"];

  const requestLocation = () => {
    if (!navigator.geolocation) { setCurrentLoc("Burnaby, BC"); setLocStatus("granted"); return; }
    setLocStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setCurrentLoc("Near you"); setLocStatus("granted"); },
      (err) => { setCurrentLoc("Burnaby, BC"); setLocStatus(err.code === 1 ? "denied" : "granted"); },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const filtered = PLACES.filter(p => {
    const matchType  = filter === "All" || p.type === filter;
    const q = query.toLowerCase().trim();
    const matchQuery = !q || [p.name, p.type, ...p.locations].some(s => s.toLowerCase().includes(q));
    return matchType && matchQuery;
  });

  const mapsUrl = (place) => coords
    ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${encodeURIComponent(place.mapsQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`;

  return (
    <div>
      {/* Location prompt */}
      {locStatus === "prompt" && (
        <div style={{ background: theme.mist, borderRadius: 16, padding: "14px 16px", marginBottom: 12, border: `1.5px solid ${theme.sky}` }}>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, margin: "0 0 4px" }}>
            Allow location for better results?
          </p>
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 10px", lineHeight: 1.5 }}>
            Shows places near you and enables directions.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={requestLocation} style={{ flex: 1, padding: "9px 0", borderRadius: 999, border: "none", background: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#fff", cursor: "pointer" }}>Use my location</button>
            <button onClick={() => setLocStatus("dismissed")} style={{ flex: 1, padding: "9px 0", borderRadius: 999, border: `1.5px solid ${theme.line}`, background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.slate, cursor: "pointer" }}>Not now</button>
          </div>
        </div>
      )}
      {locStatus === "locating" && (
        <div style={{ background: theme.mist, borderRadius: 14, padding: "10px 14px", marginBottom: 12 }}>
          <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0 }}>Finding your location…</p>
        </div>
      )}
      {locStatus === "granted" && (
        <div style={{ background: theme.mint, borderRadius: 14, padding: "8px 14px", marginBottom: 12 }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#2E7D5E", margin: 0 }}>
            {coords ? "Using your current location" : `Showing places near ${currentLoc}`}
          </p>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={15} color={theme.slate} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search parks, cafés, vets…"
          style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: 999, border: `1.5px solid ${theme.line}`, fontFamily: "Nunito", fontSize: 13, color: theme.ink, outline: "none", background: "#fff", boxSizing: "border-box" }}
        />
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, marginBottom: 14, scrollbarWidth: "none" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, border: "none", background: filter === f ? theme.ocean : theme.mist, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: filter === f ? "#fff" : theme.ocean, cursor: "pointer" }}>{f}</button>
        ))}
      </div>

      {/* Place cards */}
      {filtered.length === 0
        ? <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, textAlign: "center", margin: "20px 0" }}>No places found.</p>
        : filtered.map(place => (
          <div key={place.id} style={{ background: "#fff", borderRadius: 20, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 12px rgba(90,142,200,0.09)", border: "1.5px solid rgba(90,142,200,0.07)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ background: theme.mist, borderRadius: 14, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                {place.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, margin: 0 }}>{place.name}</p>
                  <span style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, flexShrink: 0, marginLeft: 6 }}>{place.dist}</span>
                </div>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 6px" }}>{place.type} · 🚶 {place.walkTime}</p>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, margin: "0 0 8px", lineHeight: 1.4 }}>{place.petNote}</p>
                <a href={mapsUrl(place)} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, border: "none", background: theme.ocean, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff", textDecoration: "none", cursor: "pointer" }}>
                  Directions
                </a>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// 11. Map / Explore
function ExploreScreen({ pet }) {
  const [filter,     setFilter]    = useState("All");
  const [query,      setQuery]     = useState("");
  const [locStatus,  setLocStatus] = useState("prompt");  // "prompt"|"locating"|"granted"|"denied"|"dismissed"
  const [currentLoc, setCurrentLoc]= useState("Burnaby, BC");
  const [coords,     setCoords]    = useState(null);       // { lat, lng } — real GPS when allowed
  const [selected,   setSelected]  = useState(null);       // expanded place/event

  /* Request real GPS from the browser */
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLoc("Burnaby, BC"); setLocStatus("granted"); return;
    }
    setLocStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setCurrentLoc("Near your current area");
        setLocStatus("granted");
      },
      (err) => {
        if (err.code === 1 /* PERMISSION_DENIED */) {
          setLocStatus("denied");
        } else {
          /* Timeout / unavailable — fall back gracefully */
          setCurrentLoc("Burnaby, BC"); setLocStatus("granted");
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  /* Filter places + events by category chip and search text */
  const filtered = PLACES.filter((p) => {
    const matchType  = filter === "All" || p.type === filter;
    const q          = query.toLowerCase().trim();
    const matchQuery = !q || [p.name, p.type, ...p.locations].some((s) => s.toLowerCase().includes(q));
    return matchType && matchQuery;
  });

  /* Google Maps URL — directions when real GPS is available, search otherwise */
  const mapsUrl = (place) =>
    coords
      ? `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${encodeURIComponent(place.mapsQuery)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapsQuery)}`;

  const travelPill = (icon, label, time) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, background: theme.mist, borderRadius: 12, padding: "6px 12px" }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div>
        <p style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate, margin: 0 }}>{label}</p>
        <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: 0 }}>Approx. {time}</p>
      </div>
    </div>
  );

  const mapLabel = locStatus === "granted"
    ? (coords ? "Your location" : currentLoc)
    : "Near Burnaby";

  return (
    <div style={{ padding: 22, paddingBottom: 30 }}>
      <TopBar title="Explore together" />

      {/* ── Location permission card ── */}
      {locStatus === "prompt" && (
        <div style={{ background: theme.mist, borderRadius: theme.radius, padding: 16, marginBottom: 14, border: `2px solid ${theme.sky}`, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 3px" }}>
                Allow Comi to use your location?
              </p>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0, lineHeight: 1.5 }}>
                This helps Comi show nearby places and enables directions in Google Maps.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={requestLocation} style={{ padding: "10px 14px", fontSize: 13 }}>
              Use my current location
            </Button>
            <Button variant="soft" onClick={() => setLocStatus("dismissed")} style={{ padding: "10px 14px", fontSize: 13 }}>
              Not now
            </Button>
          </div>
        </div>
      )}

      {/* ── Finding location… ── */}
      {locStatus === "locating" && (
        <div style={{ background: theme.mist, borderRadius: 14, padding: "12px 16px", marginBottom: 14 }}>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>Finding your location…</p>
        </div>
      )}

      {/* ── Location denied ── */}
      {locStatus === "denied" && (
        <div style={{ background: "#FFF4F3", borderRadius: 14, padding: "12px 16px", marginBottom: 14, border: `2px solid ${theme.coral}` }}>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: "0 0 8px", lineHeight: 1.5 }}>
            <b>Location permission was not allowed.</b> You can search manually instead.
          </p>
          <button
            onClick={() => setLocStatus("dismissed")}
            style={{ background: "none", border: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ocean, cursor: "pointer", padding: 0 }}>
            Continue without location →
          </button>
        </div>
      )}

      {/* ── Location granted confirmation ── */}
      {locStatus === "granted" && coords && (
        <div style={{ background: theme.mint, borderRadius: 14, padding: "10px 14px", marginBottom: 14 }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "#2E7D5E", margin: 0 }}>
            Using your current location · Sample places shown near Burnaby
          </p>
        </div>
      )}

      {/* ── Search bar ── */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={16} color={theme.slate} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          type="text"
          placeholder="Search a place, area, or event…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", padding: "12px 38px 12px 38px", borderRadius: 16,
            border: `2px solid ${query ? theme.ocean : "#80A0FF"}`,
            fontFamily: "Nunito", fontSize: 14, color: theme.ink,
            outline: "none", background: "#fff", boxSizing: "border-box",
          }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: theme.slate, display: "grid", placeItems: "center" }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Map mockup ── */}
      <div style={{ position: "relative", width: "100%", height: 220, borderRadius: 22, overflow: "hidden", background: "linear-gradient(160deg,#DCEEFB 0%,#C8E6D0 55%,#D8EAF8 100%)", boxShadow: theme.shadow, marginBottom: 14 }}>
        {/* Road grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.32 }}>
          <div style={{ position: "absolute", top: "42%", left: 0, right: 0, height: 7, background: "#fff", borderRadius: 4 }} />
          <div style={{ position: "absolute", top: "18%", left: 0, right: "30%", height: 4, background: "#fff", borderRadius: 4 }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "44%", width: 7, background: "#fff", borderRadius: 4 }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "70%", width: 4, background: "#fff", borderRadius: 4 }} />
        </div>
        {/* Park blobs */}
        <div style={{ position: "absolute", top: "6%",  left: "10%", width: 54, height: 36, borderRadius: 12, background: "rgba(166,220,178,0.55)" }} />
        <div style={{ position: "absolute", top: "48%", left: "50%", width: 40, height: 28, borderRadius: 10, background: "rgba(166,220,178,0.45)" }} />
        <div style={{ position: "absolute", top: "22%", left: "62%", width: 32, height: 22, borderRadius: 8,  background: "rgba(166,220,178,0.4)" }} />

        {/* Place / event pins */}
        {filtered.map((p) => {
          const active = selected?.id === p.id;
          const isEvent = p.type === "Event";
          return (
            <div
              key={p.id}
              onClick={() => setSelected(active ? null : p)}
              style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%,-50%)", textAlign: "center", cursor: "pointer", zIndex: 2 }}
            >
              <div style={{
                background: active ? theme.ocean : isEvent ? theme.lilac : "#fff",
                borderRadius: "50%", width: 36, height: 36,
                display: "grid", placeItems: "center", fontSize: 17,
                boxShadow: theme.shadow,
                border: `2.5px solid ${active ? theme.ocean : isEvent ? "#9F85D0" : theme.sky}`,
                transition: "all 0.15s",
              }}>
                {p.emoji}
              </div>
              {active && (
                <div style={{ background: theme.ocean, borderRadius: 6, padding: "2px 7px", marginTop: 3 }}>
                  <span style={{ fontFamily: "Nunito", fontSize: 10, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>
                    {p.name}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* No results overlay */}
        {filtered.length === 0 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 14, padding: "8px 18px" }}>
              <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.slate, margin: 0 }}>No places found 🔍</p>
            </div>
          </div>
        )}

        {/* Mini detail card — slides up when a pin is tapped */}
        {selected ? (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.97)", padding: "10px 14px", borderTop: `1px solid ${theme.line}`, zIndex: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{selected.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: theme.ink, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {selected.name}
                </p>
                <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.slate, margin: 0 }}>
                  🚶 Approx. {selected.walkTime} · 🚗 Approx. {selected.driveTime}
                </p>
              </div>
              <a
                href={mapsUrl(selected)} target="_blank" rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none", flexShrink: 0 }}
              >
                <div style={{ background: theme.ocean, borderRadius: 10, padding: "6px 10px" }}>
                  <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#fff", whiteSpace: "nowrap" }}>
                    {coords ? "Get Directions" : "Open in Maps"}
                  </span>
                </div>
              </a>
            </div>
          </div>
        ) : (
          /* Location label — only visible when no pin is selected */
          <div style={{ position: "absolute", bottom: 10, left: 10, background: "#fff", borderRadius: 999, padding: "5px 12px", fontFamily: "Nunito", fontSize: 12, fontWeight: 700, color: theme.ocean, display: "flex", alignItems: "center", gap: 4, boxShadow: theme.shadow }}>
            <MapPin size={13} />
            {mapLabel}
          </div>
        )}
      </div>

      {/* ── Prototype accuracy note ── */}
      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 12px", lineHeight: 1.5 }}>
        ⚠️ Places and travel times are sample estimates in this prototype.
      </p>

      {/* ── Category chips (includes Event) ── */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14, paddingBottom: 2 }}>
        {["All", "Park", "Walk", "Café", "Grooming", "Store", "Event"].map((f) => (
          <Chip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {/* ── Place / event cards ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <img src={getMascotImage(pet)} alt={pet?.name || "Comi"} style={{ width: 86, height: 86, objectFit: "contain", opacity: 0.75 }} />
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, lineHeight: 1.6, margin: "10px 0 0" }}>
            No places match your search.<br />Try "park", "café", "event", or "golden".
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((p) => {
            const active  = selected?.id === p.id;
            const isEvent = p.type === "Event";
            return (
              <Card
                key={p.id}
                onClick={() => setSelected(active ? null : p)}
                style={{
                  padding: 14,
                  border: `2px solid ${active ? theme.ocean : isEvent ? theme.lilac : "transparent"}`,
                  transition: "border-color 0.15s",
                }}
              >
                {/* Summary row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: isEvent ? theme.lilac : theme.mist, display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>{p.name}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>
                      {isEvent
                        ? <span style={{ background: "#EDE0FF", color: "#6B4EAF", borderRadius: 999, padding: "1px 8px", fontWeight: 700, fontSize: 11 }}>Event</span>
                        : p.type
                      }{" · Approx. "}{p.dist}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, whiteSpace: "nowrap" }}>
                      🚶 Approx. {p.walkTime}
                    </span>
                    <ChevronRight size={18} color={active ? theme.ocean : theme.slate} style={{ transform: active ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                  </div>
                </div>

                {/* Expanded detail */}
                {active && (
                  <div style={{ marginTop: 14, borderTop: `1px solid ${theme.line}`, paddingTop: 14 }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                      {travelPill("🚶", "Walk", p.walkTime)}
                      {travelPill("🚗", "Drive", p.driveTime)}
                    </div>
                    <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "0 0 14px", lineHeight: 1.55 }}>
                      {p.petNote}
                    </p>
                    <a
                      href={mapsUrl(p)} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration: "none", display: "block" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="secondary" style={{ fontSize: 13, padding: "10px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                          <MapPin size={15} /> {coords ? "Get Directions" : "Open in Google Maps"}
                        </span>
                      </Button>
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Privacy note */}
      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 11.5, color: theme.slate, marginTop: 20, lineHeight: 1.5 }}>
        Location is used only to show nearby places. Your coordinates are never stored or shared.
      </p>
    </div>
  );
}

// 12. Profile / Settings — shows pet photo, age, weight, and edit button
function ProfileScreen({ go, pet, petPhoto, onAddPet, pets, petPhotos, onEditPet, savedMsg, onClearSaved }) {
  const [notif,  setNotif]  = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastText, setToastText] = useState("");

  useEffect(() => {
    if (savedMsg) {
      setToastText(savedMsg);
      setShowToast(true);
      const t = setTimeout(() => { setShowToast(false); onClearSaved?.(); }, 2800);
      return () => clearTimeout(t);
    }
  }, [savedMsg]);

  const allPets = pets?.length ? pets : [pet];

  return (
    <div style={{ padding: "22px 22px 36px" }}>
      <TopBar title="Profile" />

      {/* ── Toast confirmation ─────────────────────────────────────────── */}
      {showToast && (
        <div style={{
          background: "#2E7D5E", color: "#fff", fontFamily: "Nunito", fontWeight: 700,
          fontSize: 13, padding: "11px 18px", borderRadius: 16,
          boxShadow: "0 4px 16px rgba(46,125,94,0.22)", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Check size={15} color="#fff" /> {toastText}
        </div>
      )}

      {/* ── Pet Profiles ──────────────────────────────────────────────── */}
      <SectionTitle>Pet Profiles</SectionTitle>
      <div style={{ marginBottom: 4 }}>
        {allPets.map(p => {
          const isActive = p.id === pet.id;
          const age = calcAge(p.birthday);
          return (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", background: "#fff", borderRadius: 20,
              border: `1.5px solid ${isActive ? "rgba(90,142,200,0.35)" : "rgba(128,160,255,0.18)"}`,
              boxShadow: isActive ? "0 3px 14px rgba(90,142,200,0.14)" : "0 2px 8px rgba(90,142,200,0.07)",
              marginBottom: 10,
            }}>
              <PetAvatar pet={p} petPhoto={(petPhotos || {})[p.id] || null} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                  <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink }}>{p.name}</span>
                  {isActive && (
                    <span style={{ background: theme.ocean, color: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 9, padding: "2px 8px", borderRadius: 999 }}>Active</span>
                  )}
                </div>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {[p.breed, age].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => onEditPet?.(p.id)}
                style={{
                  background: theme.mist, border: "1.5px solid rgba(128,160,255,0.25)",
                  borderRadius: 12, padding: "7px 15px",
                  fontFamily: "Nunito", fontWeight: 700, fontSize: 12,
                  color: theme.ocean, cursor: "pointer", flexShrink: 0,
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <Pencil size={12} /> Edit
              </button>
            </div>
          );
        })}
        <button
          onClick={onAddPet}
          style={{ width: "100%", padding: "13px 18px", borderRadius: 999, border: "2px dashed #80A0FF", background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: "#5A8EC8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}
        >
          <Plus size={17} /> Add another pet
        </button>
      </div>

      {/* ── Wellness preferences ───────────────────────────────────────── */}
      <SectionTitle>Wellness preferences</SectionTitle>
      <Card style={{ marginBottom: 18 }}>
        <Row icon={Bell}     label="Reminder notifications"><Toggle on={notif}  onClick={() => setNotif(!notif)} /></Row>
        <Divider />
        <Row icon={Activity} label="Weekly wellness summary"><Toggle on={weekly} onClick={() => setWeekly(!weekly)} /></Row>
      </Card>

      {/* ── Comi Plus ─────────────────────────────────────────────────── */}
      <SectionTitle>Comi Plus</SectionTitle>
      <div style={{
        background: "linear-gradient(135deg, #EAF4FB 0%, #D6C7F0 100%)",
        borderRadius: 22, padding: "18px 18px 16px", marginBottom: 18,
        border: "1.5px solid rgba(130,100,220,0.18)",
        boxShadow: "0 2px 14px rgba(90,142,200,0.10)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: 12, padding: 9, flexShrink: 0 }}>
            <QrCode size={20} color="#6E4FC8" strokeWidth={1.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>Smart Dog Tag</p>
              <span style={{ background: "#6E4FC8", color: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 9, padding: "2px 8px", borderRadius: 999 }}>Coming Soon</span>
            </div>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0, lineHeight: 1.5 }}>
              A collar tag that tracks {pet.name}'s movement, rest, and steps — syncs to Wellness automatically.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["Movement", "Rest detect", "Daily steps"].map((label) => (
            <div key={label} style={{ flex: 1, background: "rgba(255,255,255,0.65)", borderRadius: 12, padding: "8px 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.ink }}>{label}</span>
            </div>
          ))}
        </div>
        <button style={{ width: "100%", padding: "11px 0", borderRadius: 999, border: "none", background: "#6E4FC8", fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#fff", cursor: "pointer" }}>
          Join waitlist for Comi Plus
        </button>
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7B5EA7", margin: "10px 0 0", textAlign: "center", lineHeight: 1.5 }}>
          Smart Dog Tag · QR profile sharing · Advanced Wellness insights
        </p>
      </div>

      {/* ── App ───────────────────────────────────────────────────────── */}
      <SectionTitle>App</SectionTitle>
      <Card>
        <div style={{ cursor: "pointer" }} onClick={() => go("reminders")}>
          <Row icon={Bell}    label="Care & Calendar"><ChevronRight size={18} color={theme.slate} /></Row>
        </div>
        <Divider />
        <Row icon={Shield}  label="Privacy & data"><ChevronRight size={18} color={theme.slate} /></Row>
        <Divider />
        <Row icon={Settings} label="Settings"><ChevronRight size={18} color={theme.slate} /></Row>
      </Card>

      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 12, color: theme.slate, marginTop: 16 }}>Comi · a friendly pet wellness companion</p>
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

/* ---------- CAMERA HELPERS ---------- */

const ACT_LABELS = {
  sleeping: "Sleeping",
  resting: "Resting",
  moving: "Moving around",
  playing: "Playing",
  barking: "Barking",
  eating: "Eating / drinking",
  not_detected: "Not detected",
};

const ACT_COLORS = {
  sleeping: "#D6EBF8",
  resting:  "#EAF4FB",
  moving:   "#FFE08A",
  playing:  "#BFE3C8",
  barking:  "#FFB5A7",
  eating:   "#FFE4B5",
  not_detected: "#F0F0F0",
};

function fmtDur(min) {
  if (!min) return "";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtTime(iso) {
  if (!iso) return "Now";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function topRestZone(events) {
  const counts = {};
  events.forEach(e => {
    if (e.restZone && e.confirmedByUser !== false)
      counts[e.restZone] = (counts[e.restZone] || 0) + (e.durationMinutes || 0);
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function ConfirmButtons({ onConfirm, onIgnore }) {
  const btn = (label, onClick, bg) => (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 999, border: "none",
      background: bg, fontFamily: "Nunito", fontWeight: 700,
      fontSize: 12, color: theme.ink, cursor: "pointer",
    }}>
      {label}
    </button>
  );
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
      {btn("Correct", onConfirm, theme.mint)}
      {btn("Ignore",  onIgnore,  "#F0F0F0")}
    </div>
  );
}

function StatCell({ label, value }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "10px 12px" }}>
      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ink, margin: 0 }}>{value || "—"}</p>
    </div>
  );
}

function LiveDot() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2E7D5E" }} />
      <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: "#2E7D5E" }}>Live</span>
    </div>
  );
}

/* ---------- CAMERA SETUP SCREEN (14. multi-step wizard) ---------- */
function CameraSetupScreen({ go, pets, selectedPetId, onSave }) {
  const TOTAL = 5;
  const [step,         setStep]         = useState(1);
  const [cameraType,   setCameraType]   = useState("");
  const [assignedId,   setAssignedId]   = useState(selectedPetId);
  const [room,         setRoom]         = useState("");
  const [zones,        setZones]        = useState([]);
  const [agreed,       setAgreed]       = useState(false);

  const CAMERA_OPTS = ["Demo camera", "Living room camera", "Bedroom camera"];
  const ROOM_OPTS   = ["Living room", "Bedroom", "Kitchen", "Other"];
  const ZONE_OPTS   = ["Bean bag", "Dog bed", "Sofa", "Crate", "Floor mat", "Other"];

  const toggleZone = (z) =>
    setZones(prev => prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z]);

  const assignedPet = pets.find(p => p.id === assignedId) || pets[0];

  const canNext = [
    () => !!cameraType,
    () => !!assignedId,
    () => !!room,
    () => zones.length > 0,
    () => agreed,
  ];

  const generateEvents = (cam) => {
    const now = new Date();
    const base = new Date(now);
    base.setHours(0, 0, 0, 0);
    const at = (offsetH, jitterM = 0) =>
      new Date(base.getTime() + offsetH * 3600000 + jitterM * 60000).toISOString();
    const zone = cam.restZones[0] || "rest spot";
    return [
      { id: 1, petId: cam.assignedPetId, activityType: "sleeping",      room: cam.room, restZone: zone,  startTime: at(7, 0),  endTime: at(7, 28),  durationMinutes: 28,  confidence: 0.91, confirmedByUser: null },
      { id: 2, petId: cam.assignedPetId, activityType: "resting",       room: cam.room, restZone: zone,  startTime: at(9, 0),  endTime: at(11, 15), durationMinutes: 135, confidence: 0.87, confirmedByUser: null },
      { id: 3, petId: cam.assignedPetId, activityType: "moving",        room: cam.room, restZone: null,  startTime: at(11,15), endTime: at(11, 30), durationMinutes: 14,  confidence: 0.93, confirmedByUser: null },
      { id: 4, petId: cam.assignedPetId, activityType: "resting",       room: cam.room, restZone: zone,  startTime: at(13, 0), endTime: null,       durationMinutes: 42,  confidence: 0.89, confirmedByUser: null },
    ];
  };

  const handleSave = () => {
    if (!agreed) return;
    const cam = { connected: true, cameraName: cameraType, room, assignedPetId: assignedId, restZones: zones };
    onSave(cam, generateEvents(cam));
    go("profile");
  };

  const RadioOption = ({ label, selected, onSelect }) => (
    <button onClick={onSelect} style={{
      width: "100%", padding: "14px 16px", borderRadius: 16,
      border: `2px solid ${selected ? theme.ocean : "#80A0FF"}`,
      background: selected ? theme.mist : "#fff",
      fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink,
      cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        border: `2px solid ${selected ? theme.ocean : "#80A0FF"}`,
        background: selected ? theme.ocean : "transparent",
        display: "grid", placeItems: "center",
      }}>
        {selected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
      </div>
      {label}
    </button>
  );

  const CheckOption = ({ label, selected, onToggle }) => (
    <button onClick={onToggle} style={{
      width: "100%", padding: "13px 16px", borderRadius: 16,
      border: `2px solid ${selected ? theme.ocean : "#80A0FF"}`,
      background: selected ? theme.mist : "#fff",
      fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink,
      cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${selected ? theme.ocean : "#80A0FF"}`,
        background: selected ? theme.ocean : "transparent",
        display: "grid", placeItems: "center",
      }}>
        {selected && <Check size={12} color="#fff" />}
      </div>
      {label}
    </button>
  );

  return (
    <div style={{ padding: 22, paddingBottom: 40 }}>
      <TopBar title="Connect camera" onBack={() => step > 1 ? setStep(s => s - 1) : go("profile")} />

      {/* Step progress bar */}
      <div style={{ display: "flex", gap: 5, marginBottom: 24 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < step ? theme.ocean : theme.line,
            transition: "background 0.2s",
          }} />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 6px" }}>What type of camera?</p>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 18px", lineHeight: 1.5 }}>Choose the camera you'd like to connect to Comi.</p>
          {CAMERA_OPTS.map(c => <RadioOption key={c} label={c} selected={cameraType === c} onSelect={() => setCameraType(c)} />)}
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 6px" }}>Which pet does this track?</p>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 18px", lineHeight: 1.5 }}>Each camera is linked to one pet profile so data stays separate.</p>
          {pets.map(p => <RadioOption key={p.id} label={p.name || "Unnamed pet"} selected={assignedId === p.id} onSelect={() => setAssignedId(p.id)} />)}
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 6px" }}>Which room is the camera in?</p>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 18px", lineHeight: 1.5 }}>This helps Comi label activity by location.</p>
          {ROOM_OPTS.map(r => <RadioOption key={r} label={r} selected={room === r} onSelect={() => setRoom(r)} />)}
        </>
      )}

      {step === 4 && (
        <>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 6px" }}>Where does {assignedPet?.name || "your pet"} usually rest?</p>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 18px", lineHeight: 1.5 }}>Comi will look for rest activity in these spots. Select all that apply.</p>
          {ZONE_OPTS.map(z => <CheckOption key={z} label={z} selected={zones.includes(z)} onToggle={() => toggleZone(z)} />)}
          {zones.length > 0 && (
            <div style={{ background: theme.mist, borderRadius: 14, padding: "12px 14px", marginTop: 4 }}>
              <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: theme.ocean, margin: 0 }}>
                {`${assignedPet?.name || "Your pet"}'s ${room.toLowerCase()} · ${zones.join(", ").toLowerCase()}`}
              </p>
            </div>
          )}
        </>
      )}

      {step === 5 && (
        <>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 6px" }}>One last thing</p>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 18px", lineHeight: 1.5 }}>Please read how Comi uses camera data before connecting.</p>
          <Card style={{ marginBottom: 16 }}>
            {[
              "Comi uses camera activity only to estimate pet routines like resting, sleeping, and movement.",
              "This prototype does not store real video or transmit footage anywhere.",
              "Camera tracking is optional. You can disconnect at any time.",
              "Comi gives friendly everyday guidance — not medical or veterinary advice.",
            ].map((text, i, arr) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : "none" }}>
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: 0, lineHeight: 1.55 }}>{text}</p>
              </div>
            ))}
          </Card>
          <label style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 16px", background: "#fff", borderRadius: 16,
            border: `2px solid ${agreed ? theme.ocean : "#80A0FF"}`, cursor: "pointer",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 8, flexShrink: 0,
              border: `2px solid ${agreed ? theme.ocean : "#80A0FF"}`,
              background: agreed ? theme.ocean : "transparent",
              display: "grid", placeItems: "center",
            }}>
              {agreed && <Check size={13} color="#fff" />}
            </div>
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} style={{ display: "none" }} />
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ink, lineHeight: 1.4 }}>
              I understand and agree to how Comi uses camera activity data.
            </span>
          </label>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <Button onClick={step < TOTAL ? () => setStep(s => s + 1) : handleSave} disabled={!canNext[step - 1]()}>
          {step < TOTAL ? "Continue" : "Connect camera"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- CAMERA EVENTS SCREEN (15. activity log + confirmation) ---------- */
function CameraEventsScreen({ go, pet, onUpdateEvents }) {
  const camera  = pet.connectedCamera;
  const events  = pet.cameraEvents || [];

  const current = events.find(e => !e.endTime);

  const restEvents = events.filter(e =>
    (e.activityType === "resting" || e.activityType === "sleeping") &&
    e.confirmedByUser !== false
  );
  const totalRestMins = restEvents.reduce((s, e) => s + (e.durationMinutes || 0), 0);

  const confirm = (id, value) =>
    onUpdateEvents(events.map(e => e.id === id ? { ...e, confirmedByUser: value } : e));

  return (
    <div style={{ padding: 22, paddingBottom: 40 }}>
      <TopBar title="Camera activity" onBack={() => go("behavior")} />

      {/* Connected status pill */}
      {camera?.connected && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: theme.mint, borderRadius: 999, padding: "5px 13px", marginBottom: 16 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2E7D5E" }} />
          <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#2E7D5E" }}>
            {camera.cameraName} · {camera.room}
          </span>
        </div>
      )}

      {/* Current activity hero card */}
      {current && (
        <Card style={{ background: ACT_COLORS[current.activityType] || theme.mist, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 3px" }}>Right now</p>
            <LiveDot />
          </div>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: "0 0 3px" }}>
            {pet.name} is {(ACT_LABELS[current.activityType] || current.activityType).toLowerCase()}
          </p>
          {current.restZone && (
            <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "0 0 2px" }}>
              {current.room} · {current.restZone}
            </p>
          )}
          <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "0 0 6px" }}>
            {fmtDur(current.durationMinutes)} and counting
          </p>
          {current.confirmedByUser === null
            ? <ConfirmButtons onConfirm={() => confirm(current.id, true)} onIgnore={() => confirm(current.id, false)} />
            : <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.slate }}>
                {current.confirmedByUser ? "✓ Confirmed" : "Ignored"}
              </span>
          }
        </Card>
      )}

      {/* Daily summary */}
      <SectionTitle>Today's rest summary</SectionTitle>
      <Card style={{ background: theme.mist, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <StatCell label="Total rest" value={fmtDur(totalRestMins)} />
          <StatCell label="Top spot"   value={topRestZone(events)} />
        </div>
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0, lineHeight: 1.5 }}>
          Camera estimates help Comi understand daytime rest patterns.
        </p>
      </Card>

      {/* Activity log */}
      <SectionTitle>Activity log</SectionTitle>
      {events.length === 0
        ? <Card><p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>No activity logged yet.</p></Card>
        : events.slice().reverse().map((e) => (
          <Card key={e.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", marginTop: 5, flexShrink: 0,
                background: ACT_COLORS[e.activityType] || theme.mist,
                border: `2px solid ${(e.activityType === "sleeping" || e.activityType === "resting") ? theme.ocean : "#80A0FF"}`,
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: theme.ink, margin: "0 0 2px" }}>
                  {ACT_LABELS[e.activityType]}{e.restZone ? ` · ${e.restZone}` : ""}
                </p>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "0 0 4px" }}>
                  {fmtTime(e.startTime)} → {e.endTime ? fmtTime(e.endTime) : "now"} · {fmtDur(e.durationMinutes)}
                  {" · "}{Math.round((e.confidence || 0) * 100)}% confidence
                </p>
                {e.confirmedByUser === null
                  ? <ConfirmButtons onConfirm={() => confirm(e.id, true)} onIgnore={() => confirm(e.id, false)} />
                  : <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: e.confirmedByUser ? "#2E7D5E" : theme.slate }}>
                      {e.confirmedByUser ? "✓ Confirmed" : "Ignored"}
                    </span>
                }
              </div>
            </div>
          </Card>
        ))
      }

      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
        Camera tracking is optional. Comi uses activity events only, not real video.
      </p>
    </div>
  );
}

/* ---------- BOTTOM NAVIGATION ---------- */
function BottomNav({ active, go }) {
  const tabs = [
    { key: "home",      icon: Home,          label: "Home" },
    { key: "ai",        icon: Sparkles,      label: "AI" },
    { key: "community", icon: MessageCircle, label: "Community" },
    { key: "insights",  icon: Activity,      label: "Wellness" },
    { key: "profile",   icon: User,          label: "Profile" },
  ];
  return (
    <div style={{ position: "relative", zIndex: 20, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px 14px", background: "#fff", borderTop: `1px solid ${theme.line}`, flexShrink: 0 }}>
      {tabs.map((t) => {
        const on = active === t.key || (t.key === "insights" && active === "mood_calendar");
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

/* ---------- 5. APP ---------- */

const DEFAULT_PET_TEMPLATE = {
  name: "", breed: "", birthday: "",
  weight: "", weightUnit: "lb",
  sex: "", personality: [], emoji: "🐶",
  todayMood: null, sleepData: null, moodHistory: [],
  lastHeatDate: "", heatNotes: "",
  connectedCamera: null,
  cameraEvents: [],
  mascot: null, // { breed, color, markings, pose }
};

const ensurePetFields = (p) => ({ ...DEFAULT_PET_TEMPLATE, ...p });

function buildDemoCodyPet() {
  const ago = (days) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split("T")[0];
  };
  const todayStr = new Date().toISOString().split("T")[0];
  return ensurePetFields({
    id: 1,
    name: "Cody",
    breed: "French Bulldog",
    birthday: "2022-03-15",
    weight: "22",
    weightUnit: "lb",
    sex: "Male",
    personality: ["Playful", "Cuddly", "Energetic"],
    emoji: "🐾",
    mascot: { breed: "cody", color: "Cream", markings: "Face patch", pose: "Happy" },
    todayMood: {
      key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7",
      category: "positive", intensity: 8, note: "Morning zoomies at the park!",
      savedAt: new Date().toISOString(),
    },
    sleepData: {
      night: 8, nap: 1.5, quality: "Deep",
      note: "Good rest after a long afternoon walk.",
      savedAt: new Date().toISOString(),
    },
    moodHistory: [
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 8,  note: "Morning zoomies at the park!", date: todayStr  },
      { key: "happy",   label: "Happy",   emoji: "😊", color: "#FFE08A", category: "positive", intensity: 7,  note: "",                             date: ago(1)     },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 9,  note: "Dog park visit!",               date: ago(2)     },
      { key: "sleepy",  label: "Sleepy",  emoji: "😴", color: "#93C5E0", category: "neutral",  intensity: 4,  note: "Rainy day nap",                 date: ago(3)     },
      { key: "calm",    label: "Calm",    emoji: "😌", color: "#BFE3C8", category: "positive", intensity: 6,  note: "",                              date: ago(4)     },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 8,  note: "",                              date: ago(5)     },
      { key: "anxious", label: "Anxious", emoji: "😟", color: "#FFEEDD", category: "negative", intensity: 3,  note: "Thunderstorm last night",        date: ago(6)     },
      { key: "happy",   label: "Happy",   emoji: "😊", color: "#FFE08A", category: "positive", intensity: 8,  note: "New toy!",                      date: ago(7)     },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 10, note: "Beach day!",                    date: ago(8)     },
      { key: "calm",    label: "Calm",    emoji: "😌", color: "#BFE3C8", category: "positive", intensity: 6,  note: "",                              date: ago(9)     },
      { key: "sleepy",  label: "Sleepy",  emoji: "😴", color: "#93C5E0", category: "neutral",  intensity: 5,  note: "",                              date: ago(10)    },
      { key: "happy",   label: "Happy",   emoji: "😊", color: "#FFE08A", category: "positive", intensity: 7,  note: "",                              date: ago(11)    },
      { key: "sad",     label: "Sad",     emoji: "😢", color: "#D8EAFF", category: "negative", intensity: 3,  note: "Vet visit today",               date: ago(12)    },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 7,  note: "",                              date: ago(13)    },
      { key: "calm",    label: "Calm",    emoji: "😌", color: "#BFE3C8", category: "positive", intensity: 5,  note: "",                              date: ago(14)    },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 8,  note: "Puppy playdate",                date: ago(15)    },
      { key: "sleepy",  label: "Sleepy",  emoji: "😴", color: "#93C5E0", category: "neutral",  intensity: 4,  note: "Long walk tired him out",       date: ago(16)    },
      { key: "happy",   label: "Happy",   emoji: "😊", color: "#FFE08A", category: "positive", intensity: 8,  note: "",                              date: ago(17)    },
      { key: "playful", label: "Playful", emoji: "🎾", color: "#FFB5A7", category: "positive", intensity: 9,  note: "Agility training!",             date: ago(18)    },
      { key: "calm",    label: "Calm",    emoji: "😌", color: "#BFE3C8", category: "positive", intensity: 6,  note: "",                              date: ago(19)    },
    ],
    cameraEvents: [],
  });
}

const DEMO_CODY_REMINDERS = [
  { id: 1, label: "Morning walk",  time: "7:00 AM",  icon: Footprints, on: true  },
  { id: 2, label: "Breakfast",     time: "7:30 AM",  icon: Utensils,   on: true  },
  { id: 3, label: "Fresh water",   time: "12:00 PM", icon: Droplets,   on: true  },
  { id: 4, label: "Evening walk",  time: "6:00 PM",  icon: Footprints, on: true  },
  { id: 5, label: "Dinner",        time: "6:30 PM",  icon: Utensils,   on: true  },
  { id: 6, label: "Brushing",      time: "8:00 PM",  icon: Scissors,   on: false },
];

const DEMO_AI_HISTORY = [
  { from: "comi", text: "Hi! I'm Comi 🐾 Ask me anything about Cody's food, mood, sleep, or behaviour. Tap a question below or type your own!" },
  { from: "me",   text: "Can Cody eat strawberries?",                    timestamp: "2026-06-25T10:00:00Z" },
  { from: "comi", text: "Yes, Cody can enjoy fresh strawberries in moderation! 🍓 They're a good source of vitamin C and fibre. Remove the green tops, slice them small, and offer no more than 2–3 pieces as a treat. Avoid canned or syrup-packed strawberries.", timestamp: "2026-06-25T10:00:05Z" },
  { from: "me",   text: "Why is Cody scratching his face a lot?",        timestamp: "2026-06-26T14:20:00Z" },
  { from: "comi", text: "French Bulldogs like Cody can scratch their face due to skin folds collecting moisture, allergies (food or environmental), or irritation from dust and grass. Try gently cleaning the skin folds daily with a soft cloth. If the scratching persists or the skin looks red, a vet check is a good idea! 🐾", timestamp: "2026-06-26T14:20:08Z" },
];

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [editMoodEntry, setEditMoodEntry] = useState(null);

  // --- multi-pet state ---
  const [pets, setPets] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("comi_pets") || "null");
      if (Array.isArray(saved) && saved.length > 0) return saved.map(ensurePetFields);
    } catch {}
    // migrate from legacy single-pet storage
    try {
      const lp = JSON.parse(localStorage.getItem("comi_pet") || "null");
      const lm = JSON.parse(localStorage.getItem("comi_mood") || "null");
      const ls = JSON.parse(localStorage.getItem("comi_sleep") || "null");
      if (lp) return [ensurePetFields({ ...lp, id: 1, todayMood: lm, sleepData: ls })];
    } catch {}
    return [ensurePetFields({
      id: 1, name: "Cody", breed: "Golden Retriever",
      birthday: "2022-06-01", weight: "24", weightUnit: "lb",
      personality: ["Playful", "Friendly"],
    })];
  });

  const [selectedPetId, setSelectedPetId] = useState(() => {
    try { return Number(localStorage.getItem("comi_selected_pet_id")) || 1; }
    catch { return 1; }
  });

  // session-only (not serialisable to JSON)
  const [petPhotos,   setPetPhotos]   = useState({});
  const [petReminders, setPetReminders] = useState({ 1: START_REMINDERS.map(r => ({ ...r })) });

  // add-pet flow
  const [addingPet,       setAddingPet]       = useState(false);
  const [setupDraft,      setSetupDraft]      = useState(null);
  const [setupDraftPhoto, setSetupDraftPhoto] = useState(null);
  const [setupFrom,       setSetupFrom]       = useState("privacy");

  // pet switcher overlay
  const [showPetSwitcher, setShowPetSwitcher] = useState(false);

  // community
  const [posts, setPosts] = useState(START_POSTS);

  // per-pet AI Insights history (keyed by petId)
  const [petAiHistory, setPetAiHistory] = useState({});
  const selectedAiHistory = petAiHistory[selectedPetId] || [];
  const setSelectedAiHistory = (updater) => {
    const next = typeof updater === "function" ? updater(selectedAiHistory) : updater;
    setPetAiHistory(prev => ({ ...prev, [selectedPetId]: next }));
  };

  // user account
  const [userData, setUserData] = useState({ name: "", email: "", city: "", newsletter: false });

  // calendar notes
  const [calendarNotes, setCalendarNotes] = useState([
    { id: 1, title: "Annual vet check-up", category: "Vet", date: "2026-07-15", time: "10:00", repeat: "None", note: "Bring vaccination records. Annual wellness exam.", petId: 1, done: false },
    { id: 2, title: "Cody slept on bean bag most of the afternoon", category: "Sleep", date: new Date().toISOString().split("T")[0], time: "", repeat: "None", note: "Camera detected a longer nap than usual.", petId: 1, done: false },
  ]);

  // Navigation — defined early so all closures below can safely reference it
  const go = (s) => setScreen(s);

  // derived
  const selectedPet = pets.find(p => p.id === selectedPetId) || pets[0];

  // --- helpers ---
  const savePets = (next) => {
    try { localStorage.setItem("comi_pets", JSON.stringify(next)); } catch {}
    setPets(next);
  };

  const updateSelectedPet = (updates) =>
    savePets(pets.map(p => p.id === selectedPetId ? { ...p, ...updates } : p));

  const saveMood  = (entry) => {
    const dateKey = new Date().toISOString().split("T")[0];
    const cur     = selectedPet?.moodHistory || [];
    const updated = [...cur.filter(h => h.date !== dateKey), { ...entry, date: dateKey }];
    updateSelectedPet({ todayMood: entry, moodHistory: updated });
  };
  const saveSleep = (entry) => updateSelectedPet({ sleepData: entry });
  const saveCamera       = (cam, events) => updateSelectedPet({ connectedCamera: cam, cameraEvents: events });
  const updateCamEvents  = (events)       => updateSelectedPet({ cameraEvents: events });

  const selectedReminders = petReminders[selectedPetId] || START_REMINDERS.map(r => ({ ...r }));
  const setSelectedReminders = (updater) => {
    const next = typeof updater === "function" ? updater(selectedReminders) : updater;
    setPetReminders(prev => ({ ...prev, [selectedPetId]: next }));
  };

  const selectPet = (id) => {
    setSelectedPetId(id);
    try { localStorage.setItem("comi_selected_pet_id", String(id)); } catch {}
    setShowPetSwitcher(false);
  };

  const handleAddNewPet = () => {
    setAddingPet(true);
    setSetupDraft(null);
    setSetupDraftPhoto(null);
    setShowPetSwitcher(false);
    go("setup");
  };

  const goToEditSetup = () => {
    setSetupFrom("profile");
    go("setup");
  };

  const [profileSavedMsg, setProfileSavedMsg] = useState(null);

  const handleEditPet = (petId) => {
    setSelectedPetId(petId);
    try { localStorage.setItem("comi_selected_pet_id", String(petId)); } catch {}
    setAddingPet(false);
    setSetupFrom("profile");
    go("setup");
  };

  // what gets passed to Setup
  const setupPet      = addingPet ? (setupDraft || { ...DEFAULT_PET_TEMPLATE, id: 0 }) : selectedPet;
  const setupSetPet   = addingPet ? setSetupDraft : updateSelectedPet;
  const setupPhoto    = addingPet ? setupDraftPhoto : (petPhotos[selectedPetId] || null);
  const setupSetPhoto = addingPet
    ? (url) => setSetupDraftPhoto(url)
    : (url) => setPetPhotos(prev => ({ ...prev, [selectedPetId]: url }));

  const setupOnSave = addingPet
    ? (updatedPet) => {
      const newId = pets.length > 0 ? Math.max(...pets.map(p => p.id)) + 1 : 2;
      const finalPet = {
        ...DEFAULT_PET_TEMPLATE,
        ...updatedPet,
        id: newId,
        todayMood: null,
        sleepData: null,
      };
      savePets([...pets, finalPet]);
      if (setupDraftPhoto) setPetPhotos(prev => ({ ...prev, [newId]: setupDraftPhoto }));
      setPetReminders(prev => ({ ...prev, [newId]: START_REMINDERS.map(r => ({ ...r })) }));
      setSelectedPetId(newId);
      try { localStorage.setItem("comi_selected_pet_id", String(newId)); } catch {}
      setAddingPet(false);
      setSetupDraft(null);
      setSetupDraftPhoto(null);
      go("home");
    }
    : (updatedPet) => {
      updateSelectedPet(updatedPet);
      if (setupFrom === "profile") {
        setProfileSavedMsg(`${updatedPet.name || selectedPet.name}'s profile updated.`);
        go("profile");
      } else {
        go("home");
      }
    };

  const setupOnBack = addingPet
    ? () => { setAddingPet(false); setSetupDraft(null); setSetupDraftPhoto(null); go("home"); }
    : () => go(setupFrom);

  // Loads all Cody demo data when the owner account logs in
  const handleDemoLogin = () => {
    const demoPet = buildDemoCodyPet();
    savePets([demoPet]);
    setSelectedPetId(1);
    try { localStorage.setItem("comi_selected_pet_id", "1"); } catch {}
    setPetReminders({ 1: DEMO_CODY_REMINDERS });
    setPetAiHistory({ 1: DEMO_AI_HISTORY });
  };
  const TAB_SCREENS = ["home", "insights", "mood_calendar", "community", "profile"];
  const showNav = TAB_SCREENS.includes(screen);

  const render = () => {
    const sp = selectedPet;
    const photo = petPhotos[selectedPetId] || null;
    switch (screen) {
      case "welcome":   return <Welcome go={go} />;
      case "auth":      return <Auth go={go} onSignup={setUserData} onDemoLogin={handleDemoLogin} />;
      case "privacy":   return <PrivacyScreen go={go} />;
      case "setup":     return <Setup go={go} pet={setupPet} setPet={setupSetPet} petPhoto={setupPhoto} setPetPhoto={setupSetPhoto} onSave={setupOnSave} onBack={setupOnBack} isAddingPet={addingPet} />;
      case "home":      return <HomeScreen go={go} pet={sp} todayMood={sp.todayMood} reminders={selectedReminders} petPhoto={photo} onOpenPetSwitcher={() => setShowPetSwitcher(true)} />;
      case "mood":          return <MoodScreen go={go} pet={sp} saveMood={saveMood} initialEntry={editMoodEntry} onClearEdit={() => setEditMoodEntry(null)} />;
      case "mood_calendar": return <MoodCalendarScreen go={go} pet={sp} onEditEntry={(entry) => { setEditMoodEntry(entry); go("mood"); }} />;
      case "behavior":  return <BehaviorScreen go={go} pet={sp} sleepData={sp.sleepData} saveSleep={saveSleep} onUpdateCamEvents={updateCamEvents} />;
      case "insights":   return <MoodCalendarScreen go={go} pet={sp} onEditEntry={(entry) => { setEditMoodEntry(entry); go("mood"); }} />;
      case "wellness_old": return <InsightsScreen go={go} pet={sp} sleepData={sp.sleepData} todayMood={sp.todayMood} />;
      case "ai":        return <AiScreen go={go} pet={sp} aiHistory={selectedAiHistory} setAiHistory={setSelectedAiHistory} />;
      case "reminders": return <CalendarScreen go={go} reminders={selectedReminders} setReminders={setSelectedReminders} calendarNotes={calendarNotes} setCalendarNotes={setCalendarNotes} pet={selectedPet} pets={pets} />;
      case "community": return <CommunityScreen posts={posts} setPosts={setPosts} pet={sp} petPhoto={photo} />;
      case "explore":       return <ExploreScreen pet={sp} />;
      case "camera_setup":  return <CameraSetupScreen go={go} pets={pets} selectedPetId={selectedPetId} onSave={saveCamera} />;
      case "camera_events": return <CameraEventsScreen go={go} pet={sp} onUpdateEvents={updateCamEvents} />;
      case "profile":       return <ProfileScreen go={go} pet={sp} petPhoto={photo} onAddPet={handleAddNewPet} pets={pets} petPhotos={petPhotos} onEditPet={handleEditPet} savedMsg={profileSavedMsg} onClearSaved={() => setProfileSavedMsg(null)} />;
      default:          return <Welcome go={go} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#D8EAF8,#EAF4FB)", display: "flex", justifyContent: "center", alignItems: "center", padding: 16, fontFamily: "Nunito, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Quicksand:wght@500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>

      {/* phone frame */}
      <div style={{ width: 390, maxWidth: "100%", height: 800, maxHeight: "92vh", background: screen === "welcome" ? "linear-gradient(170deg, #B8D8EC 0%, #93C5E0 38%, #5A8EC8 100%)" : screen === "auth" ? "linear-gradient(160deg, #A8D4EA 0%, #7EBCDA 45%, #5A9EC8 100%)" : screen === "home" ? "linear-gradient(170deg, #A8CCDF 0%, #5FA8CF 42%, #3D88BE 100%)" : screen === "community" ? "linear-gradient(135deg, #4A82C0 0%, #6AAED8 55%, #93C5E0 100%)" : theme.mist, borderRadius: 40, overflow: "hidden", boxShadow: "0 24px 60px rgba(90,142,200,0.25)", display: "flex", flexDirection: "column", border: "10px solid #fff", position: "relative" }}>
        {/* faux status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 22px 4px", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, color: (screen === "welcome" || screen === "auth" || screen === "home" || screen === "community") ? "#fff" : theme.ink, flexShrink: 0, background: "transparent" }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center", fontFamily: "Quicksand", fontWeight: 700 }}>Comi</span>
        </div>
        {/* scrollable screen content */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", minHeight: 0 }}>
          {render()}
        </div>
        {/* bottom nav */}
        {showNav && <BottomNav active={screen} go={go} />}

        {/* Pet switcher overlay — rendered at phone-frame level to use position:absolute correctly */}
        {showPetSwitcher && (
          <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column" }}>
            {/* backdrop */}
            <div
              onClick={() => setShowPetSwitcher(false)}
              style={{ flex: 1, background: "rgba(52,65,78,0.32)" }}
            />
            {/* sheet */}
            <div style={{
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "6px 22px 36px",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.10)",
            }}>
              {/* drag handle */}
              <div style={{ width: 40, height: 4, borderRadius: 2, background: theme.line, margin: "12px auto 18px" }} />
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 16, color: theme.ink, margin: "0 0 12px" }}>
                Your pets
              </p>
              {pets.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectPet(p.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 14px", borderRadius: 16, marginBottom: 8,
                    background: p.id === selectedPetId ? theme.mist : "transparent",
                    border: `2px solid ${p.id === selectedPetId ? theme.ocean : "transparent"}`,
                    cursor: "pointer",
                  }}
                >
                  <PetAvatar pet={p} petPhoto={petPhotos[p.id] || null} size={38} />
                  <span style={{ flex: 1, fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink, textAlign: "left" }}>
                    {p.name || "Unnamed pet"}
                  </span>
                  {p.id === selectedPetId && <Check size={16} color={theme.ocean} />}
                </button>
              ))}
              <button
                onClick={handleAddNewPet}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 16,
                  background: "transparent", border: `2px dashed #80A0FF`,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  marginTop: 4,
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: theme.mist, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Plus size={18} color={theme.ocean} />
                </div>
                <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ocean }}>
                  Add another pet
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
