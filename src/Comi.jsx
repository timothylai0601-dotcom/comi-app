import React, { useState } from "react";
import {
  PawPrint, Home, Activity, MessageCircle, MapPin, User,
  Heart, Bell, ChevronLeft, Plus, Send, Sparkles, Check, ChevronDown,
  Camera, Smile, Moon, Zap, Droplets, Utensils, Footprints,
  Scissors, Search, Settings, Shield, ChevronRight, Star, Pencil,
  UserPlus, QrCode, X,
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
    text: "Luna learned a new trick today — she can roll over on command! So proud 🥹",
    likes: 24, tag: "Moment", emoji: "🐩",
    comments: [
      { who: "Sam",  text: "That's amazing! What trick? 🎉" },
      { who: "Ari",  text: "Luna is such a superstar 🌟" },
    ],
  },
  {
    id: 2, who: "Sam", petName: "Biscuit",
    text: "Any tips for a puppy that won't settle at night? Biscuit keeps waking up at 3am 😅",
    likes: 9, tag: "Question", emoji: "🐶",
    comments: [
      { who: "Mia",  text: "Try a warm blanket that smells like you! Worked for Luna 🧡" },
    ],
  },
  {
    id: 3, who: "Ari & Mochi", petName: "Mochi",
    text: "Found the cutest pet-friendly café downtown ☕ They even have puppuccinos!",
    likes: 41, tag: "Moment", emoji: "🐱",
    comments: [],
  },
  {
    id: 4, who: "Jess & Cooper", petName: "Cooper",
    text: "Tip: freeze xylitol-free peanut butter in a Kong toy — keeps Cooper busy for ages 🧊",
    likes: 33, tag: "Tip", emoji: "🦮",
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
    relatedTips: ["Track {petName}'s sleep with the Comi camera or sleep log.", "Note whether anything changed recently — new food, medication, season, or activity level.", "Puppies and older dogs naturally sleep more."],
    riskLevel: "medium",
  },
  {
    id: "daytime_naps", category: "sleep", title: "How much daytime napping is normal?",
    keywords: ["daytime nap", "daytime naps", "nap", "napping", "naps", "how long sleep", "how much sleep"],
    safeAnswer: "Dogs sleep between 12 and 14 hours a day on average. Daytime naps are completely normal — {petName} is probably just recharging between activities!",
    caution: "Monitor whether naps are balanced with normal activity periods. A dog that barely wakes up all day may need a wellness check.",
    whenToContactVet: "Only contact your vet if napping is combined with other changes like refusing food, weakness, or unusual behaviour.",
    relatedTips: ["A Comi home camera can help you track daytime rest patterns automatically.", "Young puppies and senior dogs sleep even more than the average — up to 18 hours a day."],
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
    relatedTips: ["Practice short departures and build up gradually.", "Leave a familiar-smelling item with {petName}.", "Puzzle toys and long-lasting chews help keep busy.", "A Comi home camera lets you check on {petName} while you are away."],
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

  /* ── CAMERA & TRACKING ─────────────────────────────────────────────────── */
  {
    id: "camera_tracking", category: "camera", title: "How does home camera sleep tracking work?",
    keywords: ["camera", "home camera", "sleep tracking", "track sleep", "camera tracking", "pet camera", "monitor"],
    safeAnswer: "A Comi home camera can detect when {petName} is resting or sleeping during the day, helping you see rest patterns without being home.",
    caution: "This is a prototype that uses simulated activity events. A real camera integration would detect motion patterns to estimate naps and active time.",
    whenToContactVet: "No vet needed for tracking! But share interesting patterns you notice with your vet at check-up time.",
    relatedTips: ["Set up the camera in the room where {petName} spends most of the day.", "The camera log shows estimated naps, movement, and rest zones.", "Future Comi updates will improve camera accuracy."],
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
  "cody":             { fun: CodyWaving, sad: CodyWaving, worry: CodyWaving, sleepy: CodyWaving, thinking: CodyWaving, neutral: CodyWaving },
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
  const press   = (e) => (e.currentTarget.style.transform = "scale(0.97)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  const floatAnim = `
    @keyframes welcomeFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-14px); }
    }
  `;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{floatAnim}</style>

      {/* comi logo top-right */}
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", padding: "14px 24px 0" }}>
        <span style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 22, color: "rgba(255,255,255,0.92)", letterSpacing: "0.06em" }}>
          comi
        </span>
      </div>

      {/* Mascot + headline, vertically centered */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", minHeight: 0 }}>
        <img
          src={CodyWaving}
          alt="Cody"
          style={{
            width: 260, height: "auto", objectFit: "contain",
            animation: "welcomeFloat 3.4s ease-in-out infinite",
            pointerEvents: "none", display: "block",
          }}
        />
        <h1 style={{
          fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 27,
          color: "#fff", textAlign: "center", margin: "20px 0 8px", lineHeight: 1.22,
        }}>
          I can finally<br />understand my pet.
        </h1>
        <p style={{
          fontFamily: "Nunito, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.78)",
          textAlign: "center", margin: 0, lineHeight: 1.5,
        }}>
          Track your pet's wellness every day.
        </p>
      </div>

      {/* White bottom card */}
      <div style={{
        flexShrink: 0, background: "#fff",
        borderRadius: "28px 28px 0 0",
        padding: "26px 24px 40px",
        boxShadow: "0 -6px 32px rgba(80,130,190,0.14)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <button
          onClick={() => go("auth")}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{
            width: "100%", padding: "16px", borderRadius: 999, border: "none",
            background: "linear-gradient(135deg, #5AB4DC 0%, #3A8DBE 100%)",
            color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 17,
            cursor: "pointer", boxShadow: "0 6px 22px rgba(58,141,190,0.30)",
            transition: "transform 0.08s ease",
          }}
        >
          Get started
        </button>
        <button
          onClick={() => go("auth")}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{
            width: "100%", padding: "14px", borderRadius: 999,
            border: "2px solid #C4DCF0", background: "transparent",
            color: "#3A8DBE", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
            cursor: "pointer", transition: "transform 0.08s ease",
          }}
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}

// 2. Sign Up / Log In
function Auth({ go, onSignup }) {
  const [step, setStep] = useState("landing"); // "landing" | "signup" | "login"

  // All hooks must be declared before any early return (React rules of hooks)
  const [formName,       setFormName]       = useState("");
  const [formEmail,      setFormEmail]       = useState("");
  const [formPassword,   setFormPassword]   = useState("");
  const [formConfirmPw,  setFormConfirmPw]  = useState("");
  const [formPhone,      setFormPhone]      = useState("");
  const [formCity,       setFormCity]       = useState("");
  const [formNewsletter, setFormNewsletter] = useState(true);

  const landingAnim = `
    @keyframes codyFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
  `;

  const fieldStyle = {
    padding: "13px 16px",
    borderRadius: 14,
    border: "1.5px solid #C8DCEF",
    fontFamily: "Nunito, sans-serif",
    fontSize: 15,
    color: theme.ink,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
    width: "100%",
    display: "block",
    transition: "border-color 0.15s",
  };

  const press   = (e) => (e.currentTarget.style.transform = "scale(0.97)");
  const release = (e) => (e.currentTarget.style.transform = "scale(1)");

  /* ── LANDING ── */
  if (step === "landing") {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(170deg, #3A88BB 0%, #56AACC 45%, #82C6E2 100%)",
        overflow: "hidden",
      }}>
        <style>{landingAnim}</style>

        {/* Comi logo */}
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "flex-end", padding: "14px 22px 0" }}>
          <span style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 20, color: "rgba(255,255,255,0.92)", letterSpacing: "0.08em" }}>
            comi
          </span>
        </div>

        {/* Mascot — centering wrapper + inner img carries animation so transforms don't conflict */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)" }}>
            <img
              src={CodyWaving}
              alt="Cody"
              style={{ width: 560, height: "auto", animation: "codyFloat 3.2s ease-in-out infinite", pointerEvents: "none", display: "block" }}
            />
          </div>
        </div>

        {/* Tagline */}
        <h1 style={{ flexShrink: 0, fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 26, color: "#fff", textAlign: "center", margin: "12px 28px 0", lineHeight: 1.26 }}>
          I can finally understand my pet.
        </h1>

        {/* Buttons */}
        <div style={{ flexShrink: 0, padding: "22px 22px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Get started */}
          <button
            onClick={() => setStep("signup")}
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "17px", borderRadius: 999, border: "none",
              background: "#fff", color: theme.ocean,
              fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 17,
              cursor: "pointer", boxShadow: "0 6px 24px rgba(0,0,0,0.16)",
              transition: "transform 0.08s ease",
            }}
          >
            Get started
          </button>

          {/* Log in */}
          <button
            onClick={() => setStep("login")}
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "15px", borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.14)",
              color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 16,
              cursor: "pointer", transition: "transform 0.08s ease",
            }}
          >
            Log in
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.28)" }} />
            <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.28)" }} />
          </div>

          {/* Google */}
          <button
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 14, border: "none",
              background: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
              color: theme.ink, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, transition: "transform 0.08s ease",
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Apple */}
          <button
            onMouseDown={press} onMouseUp={release} onMouseLeave={release}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 14, border: "none",
              background: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14,
              color: theme.ink, cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, transition: "transform 0.08s ease",
            }}
          >
            <svg viewBox="0 0 814 1000" width="16" height="16" fill={theme.ink} style={{ flexShrink: 0 }}>
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.5-155.4-128.6C46.9 727.5 0 620 0 516.8 0 223.1 190.3 68.6 375.7 68.6c92.3 0 169.1 60.8 226.1 60.8 57 0 147.9-63.2 225.7-63.2 28.7 0 102.7 4.5 155.5 53.8zM543.3 49c-55.6 23.8-100.9 86.8-100.9 152.6 0 8.3 1.3 16.6 2.6 23.2 4.5.6 11.6 1.3 18.6 1.3 49.3 0 99.3-28.7 133.5-83.5 22.5-35.7 36.5-82.1 36.5-125.3 0-7-1.3-14-1.9-17.3-4.5.6-12.1 1.9-18.6 2.6C579 3.2 563.7 27.5 543.3 49z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    );
  }

  /* ── FORM (signup or login) ── */
  const isSignup = step === "signup";

  const handleCreateAccount = () => {
    if (onSignup) onSignup({ name: formName, email: formEmail, city: formCity, newsletter: formNewsletter });
    go("privacy");
  };

  const fi = { // fieldInput style
    padding: "13px 16px", borderRadius: 14, border: "1.5px solid #C8DCEF",
    fontFamily: "Nunito, sans-serif", fontSize: 15, color: "#34414E",
    outline: "none", background: "#fff", boxSizing: "border-box",
    width: "100%", display: "block", transition: "border-color 0.15s",
  };
  const fiFocus = (e) => (e.target.style.borderColor = "#80A0FF");
  const fiBlur  = (e) => (e.target.style.borderColor = "#C8DCEF");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#EAF4FB", overflow: "hidden" }}>

      {/* Back button */}
      <div style={{ flexShrink: 0, padding: "14px 20px 0" }}>
        <button
          onClick={() => setStep("landing")}
          style={{ background: "#fff", border: "none", borderRadius: 999, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.10)" }}
        >
          <ChevronLeft size={18} color="#5A8EC8" />
        </button>
      </div>

      {/* Title */}
      <div style={{ flexShrink: 0, padding: "10px 22px 0" }}>
        <h2 style={{ fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 24, color: "#34414E", margin: 0 }}>
          {isSignup ? "Create your account" : "Welcome back"}
        </h2>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, color: "#7C8B98", margin: "4px 0 0" }}>
          {isSignup ? "Join Comi and understand your pet better." : "Sign in to continue."}
        </p>
      </div>

      {/* Form card */}
      <div style={{ flex: 1, margin: "14px 16px 16px", background: "#fff", borderRadius: 28, padding: "20px 20px 22px", boxShadow: "0 4px 24px rgba(90,142,200,0.09)", display: "flex", flexDirection: "column", overflowY: "auto" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {isSignup ? (
            <>
              <input placeholder="Full name" style={fi} value={formName} onChange={e => setFormName(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="Email" type="email" style={fi} value={formEmail} onChange={e => setFormEmail(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="Password" type="password" style={fi} value={formPassword} onChange={e => setFormPassword(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="Confirm password" type="password" style={fi} value={formConfirmPw} onChange={e => setFormConfirmPw(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="Phone number (optional)" type="tel" style={fi} value={formPhone} onChange={e => setFormPhone(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="City / location" style={fi} value={formCity} onChange={e => setFormCity(e.target.value)} onFocus={fiFocus} onBlur={fiBlur} />
              {/* Newsletter opt-in */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: "#EAF4FB", borderRadius: 14, border: `1.5px solid ${formNewsletter ? "#5A8EC8" : "#C8DCEF"}`, cursor: "pointer" }}>
                <div
                  onClick={() => setFormNewsletter(!formNewsletter)}
                  style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${formNewsletter ? "#5A8EC8" : "#80A0FF"}`, background: formNewsletter ? "#5A8EC8" : "transparent", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}
                >
                  {formNewsletter && <Check size={12} color="#fff" />}
                </div>
                <span style={{ fontFamily: "Nunito", fontSize: 13, color: "#34414E", lineHeight: 1.5, flex: 1 }}>
                  Send me Comi updates, pet wellness tips, and community news.
                </span>
              </label>
              {/* Terms */}
              <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", margin: "2px 0 0", lineHeight: 1.5, textAlign: "center" }}>
                By creating an account, you agree to Comi's privacy and consent terms.
              </p>
            </>
          ) : (
            <>
              <input placeholder="Email" type="email" style={fi} onFocus={fiFocus} onBlur={fiBlur} />
              <input placeholder="Password" type="password" style={fi} onFocus={fiFocus} onBlur={fiBlur} />
            </>
          )}
        </div>

        <button
          onClick={isSignup ? handleCreateAccount : () => go("home")}
          onMouseDown={press} onMouseUp={release} onMouseLeave={release}
          style={{ width: "100%", padding: "16px", borderRadius: 999, border: "none", background: "linear-gradient(135deg, #5AAED4 0%, #3D88BE 100%)", color: "#fff", fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 17, cursor: "pointer", boxShadow: "0 6px 20px rgba(61,136,190,0.30)", marginBottom: 14, transition: "transform 0.08s ease" }}
        >
          {isSignup ? "Create account" : "Log in"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#E8EFF5" }} />
          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: 12, color: "#A8B8C8", flexShrink: 0 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#E8EFF5" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #DDEAF6", background: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "#34414E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "transform 0.08s ease" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button onMouseDown={press} onMouseUp={release} onMouseLeave={release} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, border: "1.5px solid #DDEAF6", background: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "#34414E", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "transform 0.08s ease" }}>
            <svg viewBox="0 0 814 1000" width="16" height="16" fill="#34414E" style={{ flexShrink: 0 }}>
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.7-57.5-155.4-128.6C46.9 727.5 0 620 0 516.8 0 223.1 190.3 68.6 375.7 68.6c92.3 0 169.1 60.8 226.1 60.8 57 0 147.9-63.2 225.7-63.2 28.7 0 102.7 4.5 155.5 53.8zM543.3 49c-55.6 23.8-100.9 86.8-100.9 152.6 0 8.3 1.3 16.6 2.6 23.2 4.5.6 11.6 1.3 18.6 1.3 49.3 0 99.3-28.7 133.5-83.5 22.5-35.7 36.5-82.1 36.5-125.3 0-7-1.3-14-1.9-17.3-4.5.6-12.1 1.9-18.6 2.6C579 3.2 563.7 27.5 543.3 49z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
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
        <div style={{ fontSize: 52, lineHeight: 1 }}>🔒</div>
        <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "8px 0 0" }}>
          A quick note about how Comi works
        </p>
      </div>

      <Card>
        {[
          ["🐾", "Comi stores your pet's profile and wellness check-ins to help you notice patterns over time."],
          ["💬", "Comi offers friendly everyday guidance — not medical advice."],
          ["🏥", "For any health concerns, please contact your vet. Your vet knows your pet best!"],
          ["🔧", "This is a prototype. Please don't enter real sensitive personal information."],
        ].map(([icon, text], i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${theme.line}` : "none" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
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
              Meet {pet.name || "your pet"}'s Comi mascot ✨
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

      {/* ── Mascot + headline ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 24px 4px",
      }}>
        <img
          src={getMascotMoodImage(pet, todayMood?.key)}
          alt={pet.name}
          style={{ width: 280, height: 280, objectFit: "contain" }}
        />
        <h1 style={{
          fontFamily: "Quicksand, sans-serif", fontWeight: 700, fontSize: 26,
          color: "#fff", textAlign: "center", margin: "14px 0 0", lineHeight: 1.24,
        }}>
          {todayMood
            ? `${pet.name} is feeling ${todayMood.label.toLowerCase()} today!`
            : `How is ${pet.name} feeling today?`}
        </h1>
        {todayMood?.intensity && (
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.72)", margin: "6px 0 0" }}>
            Mood strength: {todayMood.intensity}/10
          </p>
        )}
      </div>

      {/* ── Quick-access feature chips ── */}
      <div style={{ flexShrink: 0, padding: "0 14px 10px", display: "flex", gap: 7, overflowX: "auto" }}>
        {[
          { label: "AI Insights", screen: "ai" },
          { label: "Behaviour",   screen: "behavior" },
          { label: "Wellness",    screen: "insights" },
          { label: "Reminders",   screen: "reminders" },
          { label: "Explore",     screen: "explore" },
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

      {/* ── Mood chips or update button ── */}
      {todayMood ? (
        <div style={{ flexShrink: 0, padding: "0 22px 20px" }}>
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
            Update today's mood
          </button>
        </div>
      ) : (
        <div style={{ flexShrink: 0, padding: "0 12px 20px", display: "flex", gap: 6 }}>
          {MOOD_ICONS.map(({ key, label, src }) => (
            <button
              key={key}
              onClick={() => go("mood")}
              onMouseDown={press} onMouseUp={release} onMouseLeave={release}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.32)",
                borderRadius: 20, padding: "12px 2px 10px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                transition: "transform 0.08s ease",
              }}
            >
              <img src={src} alt={label} style={{ width: 52, height: 52, objectFit: "contain" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 11, color: "#fff" }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
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
function MoodScreen({ go, pet, saveMood }) {
  const [picked,        setPicked]        = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(5);
  const [note,          setNote]          = useState("");

  const moodEntry  = MOODS.find((m) => m.key === picked);
  const isNegative = moodEntry?.category === "negative";

  const handleSave = () => {
    if (!picked) return;
    saveMood({ ...moodEntry, intensity: moodIntensity, note, savedAt: new Date().toISOString() });
    go("home");
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
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
              <Moon size={12} color={theme.ink} strokeWidth={2.5} />
              <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink, opacity: 0.65 }}>Sleep last night</span>
            </div>
            <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 24, color: theme.ink, margin: 0 }}>
              {sleepHours ? `${sleepHours}h` : <span style={{ fontSize: 18, opacity: 0.35 }}>—</span>}
            </p>
          </div>
          <div style={{ background: "#E8E4F7", borderRadius: 18, padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 5 }}>
              <Heart size={12} color={theme.ink} strokeWidth={2.5} />
              <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink, opacity: 0.65 }}>Mood strength</span>
            </div>
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

// 5b. Mood Calendar Screen
function MoodCalendarScreen({ go, pet }) {
  const today       = new Date();
  const [viewDate,  setViewDate]  = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selDay,    setSelDay]    = useState(null);
  const [rangeTab,  setRangeTab]  = useState("Month");

  const history = getPetMoodHistory(pet);

  // also include today's mood
  const fullHistory = (() => {
    const todayStr = today.toISOString().split("T")[0];
    if (!pet.todayMood) return history;
    const already  = history.find(h => h.date === todayStr);
    if (already) return history;
    return [...history, { ...pet.todayMood, date: todayStr }];
  })();

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const daysInMonth   = new Date(year, month + 1, 0).getDate();
  const firstDayOfWk  = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dateStr = (d) => `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const moodFor = (d) => fullHistory.find(h => h.date === dateStr(d)) || null;

  // cells = leading blanks + day numbers
  const cells = [...Array(firstDayOfWk).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const selMood = selDay ? moodFor(selDay) : null;

  // insight data for current month
  const monthEntries = fullHistory.filter(h => {
    const d = new Date(h.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const mostCommonMood = (() => {
    if (!monthEntries.length) return null;
    const counts = {};
    monthEntries.forEach(h => { counts[h.key] = (counts[h.key] || 0) + 1; });
    const topKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return MOODS.find(m => m.key === topKey);
  })();

  const lowSleepDays = 2; // illustrative

  // for week view: show only current week's days
  const todayWeekStart = new Date(today); todayWeekStart.setDate(today.getDate() - today.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(todayWeekStart); d.setDate(todayWeekStart.getDate() + i);
    return d;
  });

  return (
    <div style={{ background: theme.mist, minHeight: "100%", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: "16px 22px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => go("home")} style={{ background: "#fff", border: "none", borderRadius: 999, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.12)", flexShrink: 0 }}>
            <ChevronLeft size={16} color={theme.ocean} />
          </button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <h2 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: theme.ink, margin: 0 }}>Mood Calendar</h2>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>{pet.name}</p>
          </div>
          <button onClick={() => go("mood")} style={{ background: "#fff", border: "none", borderRadius: 12, padding: "6px 12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(90,142,200,0.12)" }}>
            <span style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean }}>Check-in</span>
          </button>
        </div>
      </div>

      {/* Week / Month tabs */}
      <div style={{ display: "flex", gap: 8, padding: "0 22px 12px" }}>
        {["Week","Month"].map(t => (
          <button key={t} onClick={() => setRangeTab(t)} style={{
            padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
            background: rangeTab === t ? theme.ocean : "#fff",
            color: rangeTab === t ? "#fff" : theme.slate,
            fontFamily: "Quicksand", fontWeight: 700, fontSize: 13,
            boxShadow: rangeTab === t ? "0 4px 12px rgba(90,142,200,0.28)" : "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.1s ease",
          }}>{t}</button>
        ))}
      </div>

      {rangeTab === "Month" ? (
        /* ── MONTH CALENDAR ── */
        <div style={{ margin: "0 14px" }}>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <button onClick={prevMonth} style={{ background: "#fff", border: "none", borderRadius: 999, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(90,142,200,0.12)" }}>
              <ChevronLeft size={16} color={theme.ocean} />
            </button>
            <h3 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>{monthName}</h3>
            <button onClick={nextMonth} style={{ background: "#fff", border: "none", borderRadius: 999, width: 32, height: 32, display: "grid", placeItems: "center", cursor: "pointer", boxShadow: "0 1px 6px rgba(90,142,200,0.12)" }}>
              <ChevronLeft size={16} color={theme.ocean} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>

          {/* Calendar grid */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "14px 10px", boxShadow: "0 4px 20px rgba(90,142,200,0.10)" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.slate, padding: "0 0 4px" }}>{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "3px" }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const mood     = moodFor(day);
                const isToday  = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSel    = day === selDay;
                return (
                  <button key={i}
                    onClick={() => setSelDay(day === selDay ? null : day)}
                    style={{
                      background: mood ? mood.color : "#F4F8FC",
                      borderRadius: 12,
                      border: isSel ? `2.5px solid ${theme.ocean}` : isToday ? `2px solid ${theme.sky}` : "2px solid transparent",
                      padding: "5px 2px 4px",
                      cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
                      boxShadow: isSel ? "0 2px 10px rgba(90,142,200,0.22)" : "none",
                      transition: "all 0.1s ease",
                    }}
                  >
                    {mood
                      ? <img src={getMascotMoodImage(pet, mood.key)} alt={mood.label} style={{ width: 34, height: 34, objectFit: "contain" }} />
                      : <div style={{ width: 34, height: 34, display: "grid", placeItems: "center" }}><span style={{ fontSize: 9, color: "#C8D8E8" }}>—</span></div>
                    }
                    <span style={{ fontFamily: "Nunito", fontSize: 9.5, fontWeight: isToday ? 800 : 500, color: mood ? theme.ink : theme.slate }}>{day}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── WEEK VIEW ── */
        <div style={{ margin: "0 14px" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "14px 10px", boxShadow: "0 4px 20px rgba(90,142,200,0.10)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {weekDates.map((wd, i) => {
                const dStr  = wd.toISOString().split("T")[0];
                const mood  = fullHistory.find(h => h.date === dStr) || null;
                const isTdy = wd.toDateString() === today.toDateString();
                const isSel = selDay && wd.getDate() === selDay && wd.getMonth() === month;
                return (
                  <button key={i}
                    onClick={() => { setViewDate(new Date(wd.getFullYear(), wd.getMonth(), 1)); setSelDay(isSel ? null : wd.getDate()); }}
                    style={{
                      background: mood ? mood.color : "#F4F8FC",
                      borderRadius: 14, border: isSel ? `2.5px solid ${theme.ocean}` : isTdy ? `2px solid ${theme.sky}` : "2px solid transparent",
                      padding: "8px 3px 6px", cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    }}
                  >
                    <span style={{ fontFamily: "Nunito", fontSize: 10, color: theme.slate }}>
                      {["S","M","T","W","T","F","S"][wd.getDay()]}
                    </span>
                    {mood
                      ? <img src={getMascotMoodImage(pet, mood.key)} alt={mood.label} style={{ width: 40, height: 40, objectFit: "contain" }} />
                      : <div style={{ width: 40, height: 40, display: "grid", placeItems: "center" }}><span style={{ fontSize: 10, color: "#C8D8E8" }}>—</span></div>
                    }
                    <span style={{ fontFamily: "Nunito", fontWeight: isTdy ? 800 : 500, fontSize: 11, color: mood ? theme.ink : theme.slate }}>{wd.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Day detail sheet */}
      {selDay && (
        <div style={{ margin: "12px 14px 0", background: selMood?.color || "#fff", borderRadius: 22, padding: "16px 18px", boxShadow: "0 4px 16px rgba(90,142,200,0.10)", border: `1.5px solid #80A0FF` }}>
          <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 2px" }}>
            {new Date(dateStr(selDay) + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {selMood ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
              <img src={getMascotMoodImage(pet, selMood.key)} alt={selMood.label} style={{ width: 60, height: 60, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 18, color: theme.ink, margin: 0 }}>{selMood.label}</p>
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.ink, margin: "2px 0 0", opacity: 0.7 }}>
                  Strength {selMood.intensity}/10{selMood.note ? ` · "${selMood.note}"` : ""}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "8px 0 0" }}>No check-in yet for this day.</p>
          )}
        </div>
      )}

      {/* Monthly Mood Summary card */}
      {mostCommonMood && (
        <div style={{ margin: "12px 14px 0", background: mostCommonMood.color, borderRadius: 22, padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 11, color: theme.ink, opacity: 0.65, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {rangeTab === "Week" ? "Weekly" : "Monthly"} Mood Summary
            </p>
            <h3 style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 26, color: theme.ink, margin: "0 0 4px" }}>{mostCommonMood.label}</h3>
            <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.ink, opacity: 0.7, margin: 0, lineHeight: 1.4 }}>
              {pet.name} felt {mostCommonMood.label.toLowerCase()} most this {rangeTab === "Week" ? "week" : "month"}. Keep up the good vibes!
            </p>
          </div>
          <img src={getMascotMoodImage(pet, mostCommonMood.key)} alt={mostCommonMood.label} style={{ width: 72, height: 72, objectFit: "contain", flexShrink: 0 }} />
        </div>
      )}

      {/* 3 insight cards */}
      <div style={{ margin: "12px 14px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "12px 10px", border: `1.5px solid #80A0FF`, textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Mood</p>
          <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ink, margin: 0, lineHeight: 1.4 }}>
            {mostCommonMood ? `${pet.name} felt ${mostCommonMood.label.toLowerCase()} most this ${rangeTab.toLowerCase()}.` : "Log moods to see insights."}
          </p>
        </div>
        <div style={{ background: "#FDE9D5", borderRadius: 18, padding: "12px 10px", textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sleep</p>
          <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ink, margin: 0, lineHeight: 1.4 }}>
            Sleep was lower on {lowSleepDays} days this {rangeTab.toLowerCase()}.
          </p>
        </div>
        <div style={{ background: "#E8E4F7", borderRadius: 18, padding: "12px 10px", textAlign: "center" }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: theme.slate, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Behaviour</p>
          <p style={{ fontFamily: "Nunito", fontSize: 11, color: theme.ink, margin: 0, lineHeight: 1.4 }}>
            Worried behaviour appeared after longer alone time.
          </p>
        </div>
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

      {/* ── Camera section: promo when not connected, data card when connected ── */}
      {!pet.connectedCamera?.connected ? (
        /* Not connected — invite user to link a camera */
        <div style={{
          borderRadius: theme.radius, padding: 16, marginBottom: 12,
          border: `2px dashed #80A0FF`, background: "#fff",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
            <div style={{ background: theme.mist, borderRadius: 12, padding: 8, flexShrink: 0 }}>
              <Camera size={18} color={theme.ocean} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: theme.ink, margin: "0 0 4px" }}>
                Link Home Camera
              </p>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: 0, lineHeight: 1.5 }}>
                Connect a home pet camera to help Comi estimate naps, resting time, and movement during the day.
              </p>
            </div>
          </div>
          <button
            onClick={() => go("camera_setup")}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 999, border: "none",
              background: theme.ocean, fontFamily: "Quicksand", fontWeight: 700,
              fontSize: 15, color: "#fff", cursor: "pointer",
            }}
          >
            Link camera
          </button>
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "10px 0 0", lineHeight: 1.5 }}>
            Camera tracking is optional. This prototype uses simulated activity events and does not store real video.
          </p>
        </div>
      ) : (() => {
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
        Comi helps you notice patterns. It does not replace your vet. 💙
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
                  💬 {todayMood.note}
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
            💬 {sleepData.note}
          </p>
        ) : null}
      </Card>

      <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
        Comi helps you notice patterns. It does not replace your vet. 💙
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
    text: `Hi! I'm Comi 🐾 Ask me anything about ${pet.name}'s food, mood, sleep, or behaviour. Tap a question below or type your own!`,
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
          text: `I'm not fully sure about that yet, but I'm always learning! For health concerns, please contact your vet. You can also try asking about a specific food, mood, or behaviour. 💙`,
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
  { id: 1, name: "Raw Food Diet Recipes", desc: "Share and discover raw feeding recipes for dogs.", members: 1243, emoji: "🥩", joined: false },
  { id: 2, name: "French Bulldog Meetups", desc: "Monthly meetups and events for Frenchie owners.", members: 876, emoji: "🐾", joined: false },
  { id: 3, name: "Small Dog Owners", desc: "Tips, tricks, and community for small breed owners.", members: 2104, emoji: "🐕", joined: false },
  { id: 4, name: "Dog Events Vancouver", desc: "Local dog events, walks, and pet-friendly spots.", members: 659, emoji: "🌲", joined: false },
  { id: 5, name: "Puppy Training Tips", desc: "Positive reinforcement training for puppies of all breeds.", members: 3241, emoji: "🎓", joined: false },
  { id: 6, name: "Dog-Friendly Cafés", desc: "Find and share dog-friendly cafés, restaurants, and patios.", members: 891, emoji: "☕", joined: false },
  { id: 7, name: "Sleep & Behaviour Help", desc: "Community support for dogs with sleep or anxiety issues.", members: 512, emoji: "😴", joined: false },
  { id: 8, name: "Groomer Recommendations", desc: "Find and share trusted groomers near you.", members: 734, emoji: "✂️", joined: false },
];

const SUGGESTED_FRIENDS = [
  { id: 1, who: "Mia & Luna", breed: "Poodle", emoji: "🐩" },
  { id: 2, who: "Sam & Biscuit", breed: "Labrador", emoji: "🐶" },
  { id: 3, who: "Ari & Mochi", breed: "Shiba Inu", emoji: "🦊" },
  { id: 4, who: "Jess & Cooper", breed: "Golden Retriever", emoji: "🌟" },
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
  const [commentPhotos, setCommentPhotos] = useState({});
  const [packFriends,   setPackFriends]   = useState({});
  const [groups,        setGroups]        = useState(COMMUNITY_GROUPS);
  const [qrOpen,        setQrOpen]        = useState(false);

  const TABS = ["For You", "Friends", "Groups", "Events", "Photos", "Tips"];

  const like = (id) => setPosts(ps => ps.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));

  const addComment = (id) => {
    const text = (commentInputs[id] || "").trim();
    const photo = commentPhotos[id] || null;
    if (!text && !photo) return;
    setPosts(ps => ps.map(p => p.id === id ? { ...p, comments: [...p.comments, { who: "You", text, photo }] } : p));
    setCommentInputs(ci => ({ ...ci, [id]: "" }));
    setCommentPhotos(cp => ({ ...cp, [id]: null }));
  };

  const submitPost = () => {
    if (!askText.trim() && !askPhoto) return;
    setPosts(ps => [{ id: Date.now(), who: "You", petName: pet.name, text: askText, photo: askPhoto, likes: 0, tag: askTag, emoji: pet.emoji || "🐶", comments: [] }, ...ps]);
    setAskText(""); setAskPhoto(null); setAskOpen(false);
  };

  const toggleGroup = (id) => setGroups(gs => gs.map(g => g.id === id ? { ...g, joined: !g.joined } : g));
  const togglePack  = (id) => setPackFriends(pf => ({ ...pf, [id]: !pf[id] }));

  const handlePostPhoto = (e) => { const f = e.target.files?.[0]; if (f) setAskPhoto(URL.createObjectURL(f)); };
  const handleCommentPhoto = (id, e) => { const f = e.target.files?.[0]; if (f) setCommentPhotos(cp => ({ ...cp, [id]: URL.createObjectURL(f) })); };

  const HEALTH_WORDS = ["vet","sick","health","hurt","injury","wound","bleed","limp","pain","vomit","diarr","seiz","not eating"];
  const isHealthPost = (text) => HEALTH_WORDS.some(kw => (text || "").toLowerCase().includes(kw));

  const q = searchQ.toLowerCase();
  const filteredPosts = (tab === "For You" ? posts : tab === "Events" ? posts.filter(p => p.tag === "Event") : tab === "Photos" ? posts.filter(p => p.photo) : tab === "Tips" ? posts.filter(p => p.tag === "Tip") : posts)
    .filter(p => !q || p.who?.toLowerCase().includes(q) || p.text?.toLowerCase().includes(q) || p.tag?.toLowerCase().includes(q));

  const filteredGroups = groups.filter(g => !q || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q));
  const filteredFriends = SUGGESTED_FRIENDS.filter(f => !q || f.who.toLowerCase().includes(q) || f.breed.toLowerCase().includes(q));

  const photoPickerLabel = { flex: 1, display: "block", padding: "10px 0", borderRadius: 12, border: `1.5px solid #80A0FF`, background: "#EAF4FB", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: "#5A8EC8", textAlign: "center", cursor: "pointer" };

  const PostCard = ({ p }) => {
    const ts = TAG_STYLES[p.tag] || { bg: "#EAF4FB", text: "#5A8EC8" };
    const isOpen = commentOpenId === p.id;
    const inPack = !!packFriends[p.id];
    return (
      <Card key={p.id} style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <CommunityAvatar post={p} userPhoto={petPhoto} size={38} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#34414E", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.who}</span>
            {p.petName && <span style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98" }}>{p.petName}</span>}
          </div>
          <span style={{ fontFamily: "Nunito", fontSize: 11, fontWeight: 700, color: ts.text, background: ts.bg, padding: "3px 10px", borderRadius: 999, flexShrink: 0 }}>{p.tag}</span>
        </div>
        {p.text && <p style={{ fontFamily: "Nunito", fontSize: 14.5, color: "#34414E", margin: "0 0 10px", lineHeight: 1.5 }}>{p.text}</p>}
        {p.photo && <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 12 }}><img src={p.photo} alt="post" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} /></div>}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => like(p.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: "#FFB5A7", fontFamily: "Nunito", fontWeight: 700, fontSize: 13 }}>
            <Heart size={15} fill="#FFB5A7" color="#FFB5A7" /> {p.likes}
          </button>
          <button onClick={() => setCommentOpenId(isOpen ? null : p.id)} style={{ background: "none", border: `1.5px solid ${isOpen ? "#5A8EC8" : "#80A0FF"}`, borderRadius: 999, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, color: isOpen ? "#5A8EC8" : "#7C8B98", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, padding: "5px 12px" }}>
            <MessageCircle size={14} /> {p.comments.length}
          </button>
          <button onClick={() => togglePack(p.id)} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, padding: "5px 12px", borderRadius: 999, cursor: "pointer", border: `1.5px solid ${inPack ? "#5A8EC8" : "#80A0FF"}`, background: inPack ? "#5A8EC8" : "#fff", color: inPack ? "#fff" : "#7C8B98" }}>
            {inPack ? <><Check size={13} /> Pack friend</> : <><UserPlus size={13} /> Add to Pack</>}
          </button>
        </div>
        {isOpen && (
          <div style={{ marginTop: 12, borderTop: `1px solid #E6EEF5`, paddingTop: 12 }}>
            {isHealthPost(p.text) && (
              <div style={{ background: "#FFE08A", borderRadius: 12, padding: "8px 12px", marginBottom: 10, display: "flex", gap: 8 }}>
                <span>⚕️</span>
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#34414E", margin: 0, lineHeight: 1.5 }}>If this involves a health concern, please contact your vet. Community advice is not medical advice.</p>
              </div>
            )}
            {p.comments.map((c, i) => (
              <div key={i} style={{ background: "#EAF4FB", borderRadius: 12, padding: "8px 12px", marginBottom: 6 }}>
                <span style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 12, color: "#5A8EC8" }}>{c.who}</span>
                {c.text && <p style={{ fontFamily: "Nunito", fontSize: 13, color: "#34414E", margin: "2px 0 0" }}>{c.text}</p>}
                {c.photo && <img src={c.photo} alt="reply" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 10, marginTop: 6 }} />}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input value={commentInputs[p.id] || ""} onChange={e => setCommentInputs(ci => ({ ...ci, [p.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addComment(p.id)} placeholder="Write a comment…" style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: `2px solid #80A0FF`, fontFamily: "Nunito", fontSize: 13, outline: "none", color: "#34414E" }} />
              <button onClick={() => addComment(p.id)} style={{ background: "#5A8EC8", border: "none", borderRadius: "50%", width: 38, height: 38, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                <Send size={15} color="#fff" />
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ paddingBottom: 30 }}>
      {/* Header */}
      <div style={{ padding: "16px 22px 0" }}>
        <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 20, color: "#34414E", margin: "0 0 12px" }}>The Comi Pack 🐾</p>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <Search size={16} color="#7C8B98" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            placeholder="Search friends, groups, posts, events…"
            style={{ width: "100%", padding: "11px 14px 11px 38px", borderRadius: 999, border: `2px solid ${searchFocus ? "#5A8EC8" : "#80A0FF"}`, fontFamily: "Nunito", fontSize: 14, color: "#34414E", outline: "none", background: "#fff", boxSizing: "border-box" }}
          />
          {searchQ && <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "grid", placeItems: "center" }}><X size={16} color="#7C8B98" /></button>}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, overflowX: "auto", borderBottom: `2px solid #E6EEF5` }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{ padding: "8px 14px", border: "none", background: "none", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: tab === t ? "#5A8EC8" : "#7C8B98", cursor: "pointer", whiteSpace: "nowrap", borderBottom: `2px solid ${tab === t ? "#5A8EC8" : "transparent"}`, marginBottom: -2 }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 22px" }}>

        {/* Ask the Pack button — For You and Photos tabs */}
        {(tab === "For You" || tab === "Photos") && (
          <button
            onClick={() => setAskOpen(true)}
            style={{ width: "100%", padding: "12px 18px", borderRadius: 999, border: "2px solid #80A0FF", background: "#EAF4FB", fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: "#5A8EC8", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}
          >
            <Plus size={17} /> Share with the Pack
          </button>
        )}

        {/* FRIENDS TAB */}
        {tab === "Friends" && (
          <div>
            <SectionTitle>Suggested friends</SectionTitle>
            {filteredFriends.map(f => (
              <Card key={f.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EAF4FB", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 22 }}>{f.emoji}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#34414E", margin: 0 }}>{f.who}</p>
                  <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", margin: 0 }}>{f.breed}</p>
                </div>
                <button
                  onClick={() => togglePack(f.id)}
                  style={{ padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${packFriends[f.id] ? "#5A8EC8" : "#80A0FF"}`, background: packFriends[f.id] ? "#5A8EC8" : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: packFriends[f.id] ? "#fff" : "#7C8B98", cursor: "pointer" }}
                >
                  {packFriends[f.id] ? "In Pack ✓" : "Add to Pack"}
                </button>
              </Card>
            ))}
            {filteredFriends.length === 0 && (
              <Card style={{ textAlign: "center" }}><p style={{ fontFamily: "Nunito", fontSize: 14, color: "#7C8B98", margin: 0 }}>No results for "{searchQ}"</p></Card>
            )}
          </div>
        )}

        {/* GROUPS TAB */}
        {tab === "Groups" && (
          <div>
            <SectionTitle>Discover groups</SectionTitle>
            {filteredGroups.map(g => (
              <Card key={g.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EAF4FB", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 22 }}>{g.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 14, color: "#34414E", margin: "0 0 3px" }}>{g.name}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", margin: "0 0 8px", lineHeight: 1.4 }}>{g.desc}</p>
                    <p style={{ fontFamily: "Nunito", fontSize: 11, color: "#7C8B98", margin: 0 }}>{g.members.toLocaleString()} members</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleGroup(g.id)}
                  style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 999, border: `2px solid ${g.joined ? "#5A8EC8" : "#80A0FF"}`, background: g.joined ? "#5A8EC8" : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: g.joined ? "#fff" : "#5A8EC8", cursor: "pointer" }}
                >
                  {g.joined ? "✓ Joined" : "Join group"}
                </button>
              </Card>
            ))}
            {filteredGroups.length === 0 && (
              <Card style={{ textAlign: "center" }}><p style={{ fontFamily: "Nunito", fontSize: 14, color: "#7C8B98", margin: 0 }}>No groups match "{searchQ}"</p></Card>
            )}
          </div>
        )}

        {/* POST FEED (For You, Events, Photos, Tips) */}
        {tab !== "Friends" && tab !== "Groups" && (
          <>
            {filteredPosts.length === 0 ? (
              <Card style={{ textAlign: "center", marginBottom: 12 }}><p style={{ fontFamily: "Nunito", fontSize: 14, color: "#7C8B98", margin: 0 }}>{searchQ ? `No results for "${searchQ}"` : "Nothing here yet — be the first to post!"}</p></Card>
            ) : (
              filteredPosts.map(p => <PostCard key={p.id} p={p} />)
            )}
          </>
        )}

        {/* QR Dog Tag */}
        {tab === "For You" && !searchQ && (
          <div style={{ background: "linear-gradient(135deg,#D6C7F0 0%,#EAF4FB 100%)", borderRadius: 24, padding: 18, marginTop: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 10, flexShrink: 0 }}><QrCode size={22} color="#5A8EC8" /></div>
              <div>
                <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 15, color: "#34414E", margin: "0 0 4px" }}>Comi QR Dog Tag ✨</p>
                <p style={{ fontFamily: "Nunito", fontSize: 13, color: "#7C8B98", margin: 0, lineHeight: 1.5 }}>Premium members get a QR tag so other pet owners can scan and add your pet to their Pack.</p>
              </div>
            </div>
            <Button onClick={() => setQrOpen(true)} variant="soft" style={{ fontSize: 13, padding: "10px 16px" }}>Preview public pet profile</Button>
          </div>
        )}

        <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 12, color: "#7C8B98", marginTop: 8, lineHeight: 1.6 }}>
          Community advice is not medical advice. Contact a vet for health concerns. 💙<br />Be kind — we're all learning 🐾
        </p>
      </div>

      {/* Post composer modal */}
      {askOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setAskOpen(false)}>
          <div style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "22px 22px 36px", width: "100%", maxWidth: 390 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 17, color: "#34414E", margin: 0 }}>Share with the Pack 🐾</p>
              <button onClick={() => { setAskOpen(false); setAskPhoto(null); }} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#7C8B98" /></button>
            </div>
            {/* Post type chips */}
            <div style={{ display: "flex", gap: 7, marginBottom: 12, flexWrap: "wrap" }}>
              {["Moment","Question","Tip","Event","Photo"].map(t => (
                <button key={t} onClick={() => setAskTag(t)} style={{ padding: "6px 12px", borderRadius: 999, border: `2px solid ${askTag === t ? "#5A8EC8" : "#80A0FF"}`, background: askTag === t ? "#EAF4FB" : "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: askTag === t ? "#5A8EC8" : "#7C8B98", cursor: "pointer" }}>
                  {t}
                </button>
              ))}
            </div>
            <textarea value={askText} onChange={e => setAskText(e.target.value)} placeholder="What would you like to share?" style={{ width: "100%", padding: "12px 14px", borderRadius: 16, border: `2px solid #80A0FF`, fontFamily: "Nunito", fontSize: 14, color: "#34414E", outline: "none", resize: "none", height: 80, boxSizing: "border-box", marginBottom: 10 }} />
            {askPhoto ? (
              <div style={{ position: "relative", marginBottom: 10 }}>
                <img src={askPhoto} alt="preview" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 14, display: "block" }} />
                <button onClick={() => setAskPhoto(null)} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "grid", placeItems: "center", cursor: "pointer" }}><X size={13} color="#fff" /></button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <label style={photoPickerLabel}>📷 Take photo<input type="file" accept="image/*" capture="environment" onChange={handlePostPhoto} style={{ display: "none" }} /></label>
                <label style={photoPickerLabel}>🖼️ Choose photo<input type="file" accept="image/*" onChange={handlePostPhoto} style={{ display: "none" }} /></label>
              </div>
            )}
            <Button onClick={submitPost} disabled={!askText.trim() && !askPhoto}>Post to the Pack</Button>
          </div>
        </div>
      )}
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
    ? (coords ? "📍 Your location" : `📍 ${currentLoc}`)
    : "Near Burnaby";

  return (
    <div style={{ padding: 22, paddingBottom: 30 }}>
      <TopBar title="Explore together" />

      {/* ── Location permission card ── */}
      {locStatus === "prompt" && (
        <div style={{ background: theme.mist, borderRadius: theme.radius, padding: 16, marginBottom: 14, border: `2px solid ${theme.sky}`, boxShadow: theme.shadow }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>📍</span>
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
        <div style={{ background: theme.mist, borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📡</span>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: 0 }}>Finding your location…</p>
        </div>
      )}

      {/* ── Location denied ── */}
      {locStatus === "denied" && (
        <div style={{ background: "#FFF4F3", borderRadius: 14, padding: "12px 16px", marginBottom: 14, border: `2px solid ${theme.coral}` }}>
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.ink, margin: "0 0 8px", lineHeight: 1.5 }}>
            📍 <b>Location permission was not allowed.</b> You can search manually instead.
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
        <div style={{ background: theme.mint, borderRadius: 14, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>✅</span>
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
                      🐾 {p.petNote}
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
        📍 Location is used only to show nearby places. Your coordinates are never stored or shared.
      </p>
    </div>
  );
}

// 12. Profile / Settings — shows pet photo, age, weight, and edit button
function ProfileScreen({ go, pet, petPhoto, goToEditSetup, onAddPet }) {
  const [notif,  setNotif]  = useState(true);
  const [weekly, setWeekly] = useState(true);
  const ageDisplay = calcAge(pet.birthday);
  return (
    <div style={{ padding: 22 }}>
      <TopBar title="Profile" />
      <Card style={{ textAlign: "center", marginBottom: 18 }}>
        <PetAvatar pet={pet} petPhoto={petPhoto} size={84} style={{ margin: "0 auto 10px" }} />
        <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 20, color: theme.ink, margin: 0 }}>{pet.name}</p>
        {pet.breed  && <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "3px 0 0" }}>{pet.breed}</p>}
        {ageDisplay && <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "2px 0 0" }}>Age: {ageDisplay}</p>}
        {pet.weight && (
          <p style={{ fontFamily: "Nunito", fontSize: 14, color: theme.slate, margin: "2px 0 6px" }}>
            Weight: {pet.weight} {pet.weightUnit || "lb"}
          </p>
        )}
        {pet.personality.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
            {pet.personality.map((t) => (
              <span key={t} style={{ background: theme.mist, color: theme.slate, fontFamily: "Nunito", fontWeight: 600, fontSize: 12, padding: "3px 10px", borderRadius: 999, border: `1px solid #80A0FF` }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Comi mascot display */}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.line}` }}>
          <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.slate, margin: "0 0 8px" }}>Comi mascot</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <img src={getMascotImage(pet)} alt="mascot" style={{ width: 56, height: 56, objectFit: "contain" }} />
            <div style={{ textAlign: "left" }}>
              {pet.mascot?.breed ? (
                <>
                  <p style={{ fontFamily: "Quicksand", fontWeight: 700, fontSize: 13, color: theme.ink, margin: 0 }}>{pet.mascot.breed}</p>
                  <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "2px 0 0" }}>
                    {[pet.mascot.color, pet.mascot.markings, pet.mascot.pose].filter(Boolean).join(" · ")}
                  </p>
                </>
              ) : (
                <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: 0 }}>Default Comi mascot</p>
              )}
              <button
                onClick={goToEditSetup || (() => go("setup"))}
                style={{ background: "none", border: "none", padding: 0, fontFamily: "Nunito", fontWeight: 700, fontSize: 12, color: theme.ocean, cursor: "pointer", marginTop: 4 }}
              >
                Customize mascot →
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Button variant="soft" onClick={goToEditSetup || (() => go("setup"))} style={{ fontSize: 14, padding: "10px 18px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Pencil size={15} /> Edit pet profile
            </span>
          </Button>
        </div>
      </Card>

      <SectionTitle>Wellness preferences</SectionTitle>
      <Card style={{ marginBottom: 18 }}>
        <Row icon={Bell}     label="Reminder notifications">   <Toggle on={notif}  onClick={() => setNotif(!notif)} /></Row>
        <Divider />
        <Row icon={Activity} label="Weekly wellness summary">  <Toggle on={weekly} onClick={() => setWeekly(!weekly)} /></Row>
      </Card>

      <SectionTitle>Connected devices</SectionTitle>
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: theme.mist, borderRadius: 12, padding: 8, flexShrink: 0 }}>
            <Camera size={18} color={theme.ocean} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "Nunito", fontWeight: 700, fontSize: 15, color: theme.ink, margin: 0 }}>
              Home pet camera
            </p>
            <p style={{ fontFamily: "Nunito", fontSize: 13, margin: "2px 0 0",
              color: pet.connectedCamera?.connected ? "#2E7D5E" : theme.slate }}>
              {pet.connectedCamera?.connected
                ? `Connected · ${pet.connectedCamera.room}`
                : "Not connected"}
            </p>
          </div>
          <button
            onClick={() => go("camera_setup")}
            style={{
              background: theme.mist, border: "none", borderRadius: 12,
              padding: "8px 14px", fontFamily: "Nunito", fontWeight: 700,
              fontSize: 13, color: theme.ocean, cursor: "pointer", flexShrink: 0,
            }}
          >
            {pet.connectedCamera?.connected ? "Manage" : "Connect"}
          </button>
        </div>
        {pet.connectedCamera?.connected && (
          <>
            <Divider />
            <div style={{ paddingTop: 8 }}>
              <p style={{ fontFamily: "Nunito", fontSize: 13, color: theme.slate, margin: "0 0 6px" }}>
                Rest zones: {pet.connectedCamera.restZones.join(", ")}
              </p>
              <button onClick={() => go("camera_events")} style={{
                background: "none", border: "none", color: theme.ocean,
                fontFamily: "Nunito", fontWeight: 700, fontSize: 13,
                cursor: "pointer", padding: 0,
              }}>
                View activity log →
              </button>
            </div>
          </>
        )}
        <p style={{ fontFamily: "Nunito", fontSize: 12, color: theme.slate, margin: "10px 0 0", lineHeight: 1.5 }}>
          Camera tracking is optional. Comi only uses activity events, not real video.
        </p>
      </Card>

      <SectionTitle>App</SectionTitle>
      <Card>
        <div style={{ cursor: "pointer" }} onClick={() => go("reminders")}>
          <Row icon={Bell}    label="Care & Calendar"><ChevronRight size={18} color={theme.slate} /></Row>
        </div>
        <Divider />
        <Row icon={User}    label="Edit pet profile"><ChevronRight size={18} color={theme.slate} /></Row>
        <Divider />
        <Row icon={Shield}  label="Privacy & data"><ChevronRight size={18} color={theme.slate} /></Row>
        <Divider />
        <Row icon={Settings}label="Settings"><ChevronRight size={18} color={theme.slate} /></Row>
      </Card>
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <button
          onClick={onAddPet}
          style={{ width: "100%", padding: "14px 18px", borderRadius: 999, border: "2px dashed #80A0FF", background: "#fff", fontFamily: "Nunito", fontWeight: 700, fontSize: 14, color: "#5A8EC8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <Plus size={17} /> Add another pet
        </button>
      </div>
      <p style={{ textAlign: "center", fontFamily: "Nunito", fontSize: 12, color: theme.slate, marginTop: 12 }}>Comi · a friendly pet wellness companion 🐾</p>
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
              ["🎥", "Comi uses camera activity only to estimate pet routines like resting, sleeping, and movement."],
              ["🚫", "This prototype does not store real video or transmit footage anywhere."],
              ["🔔", "Camera tracking is optional. You can disconnect at any time."],
              ["🐾", "Comi gives friendly everyday guidance — not medical or veterinary advice."],
            ].map(([icon, text], i, arr) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < arr.length - 1 ? `1px solid ${theme.line}` : "none" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
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
    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 6px 14px", background: "#fff", borderTop: `1px solid ${theme.line}`, flexShrink: 0 }}>
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

export default function App() {
  const [screen, setScreen] = useState("welcome");

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
      go(setupFrom === "profile" ? "profile" : "home");
    };

  const setupOnBack = addingPet
    ? () => { setAddingPet(false); setSetupDraft(null); setSetupDraftPhoto(null); go("home"); }
    : () => go(setupFrom);

  const go = (s) => setScreen(s);
  const TAB_SCREENS = ["home", "insights", "mood_calendar", "community", "explore", "profile"];
  const showNav = TAB_SCREENS.includes(screen);

  const render = () => {
    const sp = selectedPet;
    const photo = petPhotos[selectedPetId] || null;
    switch (screen) {
      case "welcome":   return <Welcome go={go} />;
      case "auth":      return <Auth go={go} onSignup={setUserData} />;
      case "privacy":   return <PrivacyScreen go={go} />;
      case "setup":     return <Setup go={go} pet={setupPet} setPet={setupSetPet} petPhoto={setupPhoto} setPetPhoto={setupSetPhoto} onSave={setupOnSave} onBack={setupOnBack} isAddingPet={addingPet} />;
      case "home":      return <HomeScreen go={go} pet={sp} todayMood={sp.todayMood} reminders={selectedReminders} petPhoto={photo} onOpenPetSwitcher={() => setShowPetSwitcher(true)} />;
      case "mood":          return <MoodScreen go={go} pet={sp} saveMood={saveMood} />;
      case "mood_calendar": return <MoodCalendarScreen go={go} pet={sp} />;
      case "behavior":  return <BehaviorScreen go={go} pet={sp} sleepData={sp.sleepData} saveSleep={saveSleep} onUpdateCamEvents={updateCamEvents} />;
      case "insights":   return <MoodCalendarScreen go={go} pet={sp} />;
      case "wellness_old": return <InsightsScreen go={go} pet={sp} sleepData={sp.sleepData} todayMood={sp.todayMood} />;
      case "ai":        return <AiScreen go={go} pet={sp} aiHistory={selectedAiHistory} setAiHistory={setSelectedAiHistory} />;
      case "reminders": return <CalendarScreen go={go} reminders={selectedReminders} setReminders={setSelectedReminders} calendarNotes={calendarNotes} setCalendarNotes={setCalendarNotes} pet={selectedPet} pets={pets} />;
      case "community": return <CommunityScreen posts={posts} setPosts={setPosts} pet={sp} petPhoto={photo} />;
      case "explore":       return <ExploreScreen pet={sp} />;
      case "camera_setup":  return <CameraSetupScreen go={go} pets={pets} selectedPetId={selectedPetId} onSave={saveCamera} />;
      case "camera_events": return <CameraEventsScreen go={go} pet={sp} onUpdateEvents={updateCamEvents} />;
      case "profile":       return <ProfileScreen go={go} pet={sp} petPhoto={photo} goToEditSetup={goToEditSetup} onAddPet={handleAddNewPet} />;
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
      <div style={{ width: 390, maxWidth: "100%", height: 800, maxHeight: "92vh", background: screen === "welcome" ? "linear-gradient(170deg, #B8D8EC 0%, #93C5E0 38%, #5A8EC8 100%)" : theme.mist, borderRadius: 40, overflow: "hidden", boxShadow: "0 24px 60px rgba(90,142,200,0.25)", display: "flex", flexDirection: "column", border: "10px solid #fff", position: "relative" }}>
        {/* faux status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 22px 4px", fontFamily: "Quicksand", fontSize: 12, fontWeight: 700, color: screen === "welcome" ? "#fff" : theme.ink, flexShrink: 0, background: "transparent" }}>
          <span>9:41</span>
          <span style={{ display: "flex", gap: 4, alignItems: "center" }}><PawPrint size={14} color={theme.ocean} /> Comi</span>
        </div>
        {/* scrollable screen content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
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
