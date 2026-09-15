export type Page = "home" | "about" | "events" | "event-detail" | "team" | "projects" | "project-detail" | "gallery" | "archive" | "contact"

export type NavigateFn = (page: Page, params?: Record<string, string>) => void

/* ── Team ─────────────────────────────────────────── */
export interface Member {
  id: string
  name: string
  designation: string
  category: "office-bearer" | "senior-core" | "junior-core" | "faculty"
  year?: string
  photo: string
  socials: {
    linkedin?: string
    github?: string
    instagram?: string
    portfolio?: string
    email?: string
  }
}

export const TEAM: Member[] = [
  {
    id: "Anika-Aggarwal",
    name: "Anika Aggarwal",
    designation: "Chairperson",
    category: "office-bearer",
    year: "B.Tech CSE '29",
    photo: "photo-1507003211169-0a1dd7228f2d",
    socials: { linkedin: "https://www.linkedin.com/in/anika-agarwal-28088537a", github: "#", instagram: "https://www.instagram.com/_being_.uzzz" },
  },
  {
    id: "Sarthak-Sharma",
    name: "Sarthak Sharma",
    designation: "Vice President",
    category: "office-bearer",
    year: "B.Tech CSE '29",
    photo: "photo-1494790108377-be9c29b29330",
    socials: { linkedin: "https://www.linkedin.com/in/sarthak-sharma-62655737b", github: "#", instagram: "https://www.instagram.com/sarthak.exe" },
  },
  {
    id: "Kshitij-Dubey",
    name: "Kshitij Dubey",
    designation: "General Secretary",
    category: "office-bearer",
    year: "B.Tech CSE '29",
    photo: "photo-1500648767791-00dcc994a43e",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "Nishant",
    name: "Nishant",
    designation: "Chief Strategist",
    category: "senior-core",
    year: "B.Tech CSE '29",
    photo: "photo-1500648767791-00dcc994a43e",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "tanay-prasad",
    name: "Tanay Prasad",
    designation: "Tech Head",
    category: "senior-core",
    year: "B.Tech CSE '29",
    photo: "photo-1472099645785-5658abf4ff4e",
    socials: { linkedin: "https://www.linkedin.com/in/tanay-prasad26", github: "https://github.com/TanayP26", instagram: "https://www.instagram.com/TanayP26" },
  },
  {
    id: "sneha-joshi",
    name: "Sneha Joshi",
    designation: "Events Head",
    category: "senior-core",
    year: "B.Tech CSE '27",
    photo: "photo-1438761681033-6461ffad8d80",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    id: "aditya-kumar",
    name: "Aditya Kumar",
    designation: "Design Lead",
    category: "senior-core",
    year: "B.Tech CSDS '27",
    photo: "photo-1568602471122-7832951cc4c5",
    socials: { linkedin: "#", github: "#", portfolio: "#" },
  },
  {
    id: "kavya-nair",
    name: "Kavya Nair",
    designation: "AI/ML Lead",
    category: "senior-core",
    year: "B.Tech AI '26",
    photo: "photo-1531746020798-e6953c6e8e04",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "rohan-singh",
    name: "Rohan Singh",
    designation: "Mobile Lead",
    category: "senior-core",
    year: "B.Tech CSE '27",
    photo: "photo-1570295999919-56ceb5ecca61",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "ishaan-verma",
    name: "Ishaan Verma",
    designation: "Web Lead",
    category: "senior-core",
    year: "B.Tech CSE '27",
    photo: "photo-1522075469751-3a6694fb2f61",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "meera-pillai",
    name: "Meera Pillai",
    designation: "Community Manager",
    category: "senior-core",
    year: "B.Tech CSE '27",
    photo: "photo-1544723795-3fb6469f5b39",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    id: "aarav-patel",
    name: "Aarav Patel",
    designation: "Junior Developer",
    category: "junior-core",
    year: "B.Tech CSE '28",
    photo: "photo-1519085360753-af0119f7cbe7",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "diya-kapoor",
    name: "Diya Kapoor",
    designation: "Junior Designer",
    category: "junior-core",
    year: "B.Tech CSDS '28",
    photo: "photo-1546961342-ea5f62d5a27b",
    socials: { linkedin: "#", instagram: "#" },
  },
  {
    id: "vihaan-shah",
    name: "Vihaan Shah",
    designation: "Junior Developer",
    category: "junior-core",
    year: "B.Tech CSE '28",
    photo: "photo-1502767089517-b874be4d7f4b",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "ananya-rao",
    name: "Ananya Rao",
    designation: "Junior AI Engineer",
    category: "junior-core",
    year: "B.Tech AI '28",
    photo: "photo-1580489944761-15a19d654956",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "krish-mehta",
    name: "Krish Mehta",
    designation: "Junior Developer",
    category: "junior-core",
    year: "B.Tech CSE '28",
    photo: "photo-1506794778202-cad84cf45f1d",
    socials: { linkedin: "#", github: "#" },
  },
  {
    id: "nikhil-bose",
    name: "Nikhil Bose",
    designation: "Junior Mobile Dev",
    category: "junior-core",
    year: "B.Tech CSE '28",
    photo: "photo-1492562080023-ab3db95bfbce",
    socials: { github: "#" },
  },
  {
    id: "dr-vinay-kumar",
    name: "Dr. Vinay Kumar",
    designation: "Faculty Advisor",
    category: "faculty",
    year: "School of Computer Science",
    photo: "photo-1560250097-0b93528c311a",
    socials: { email: "mailto:vinay.kumar@bennett.edu.in" },
  },
  {
    id: "dr-seema-yadav",
    name: "Dr. Seema Yadav",
    designation: "Faculty Co-advisor",
    category: "faculty",
    year: "School of Computer Science",
    photo: "photo-1573496359142-b8d87734a5a2",
    socials: { email: "mailto:seema.yadav@bennett.edu.in" },
  },
]

import flutterAway2Image from "../imports/flutter2.JPG"
import midTermMochaImage from "../imports/midtermmocha.JPG"
import mobileNextImage from "../imports/mobilenext2025.jpg"
import roundTableConferenceImage from "../imports/rtc.JPG"

const flutterAway3Image = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#070a1a"/>
      <stop offset="35%" stop-color="#120d2b"/>
      <stop offset="72%" stop-color="#1b1038"/>
      <stop offset="100%" stop-color="#090d1f"/>
    </linearGradient>
    <radialGradient id="glow1" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ffe866" stop-opacity="0.9"/>
      <stop offset="28%" stop-color="#ffb347" stop-opacity="0.7"/>
      <stop offset="60%" stop-color="#9b5cff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0b1024" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="phone" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#1a1d34"/>
      <stop offset="100%" stop-color="#10172d"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#glow1)"/>

  <g opacity="0.54">
    <path d="M0 570C180 500 220 620 380 610C520 600 610 470 770 500C950 530 1040 690 1190 640C1320 600 1430 540 1600 560V900H0Z" fill="#2a1d4b"/>
    <path d="M0 710C170 680 290 760 450 740C600 720 660 620 822 635C1060 655 1240 820 1600 750V900H0Z" fill="#120d27"/>
  </g>

  <g transform="translate(960 130)">
    <rect x="0" y="0" width="420" height="610" rx="44" fill="url(#phone)" stroke="rgba(255,255,255,0.12)"/>
    <rect x="46" y="54" width="328" height="500" rx="24" fill="#0d1325" stroke="rgba(168,130,255,0.25)"/>
    <rect x="78" y="98" width="264" height="44" rx="14" fill="#101b38"/>
    <circle cx="110" cy="120" r="8" fill="#8b5cf6"/>
    <circle cx="154" cy="120" r="8" fill="#22d3ee"/>
    <circle cx="198" cy="120" r="8" fill="#fbbf24"/>
    <rect x="82" y="176" width="150" height="150" rx="26" fill="#6d34ff"/>
    <rect x="248" y="176" width="84" height="150" rx="20" fill="#111827" stroke="rgba(255,255,255,0.12)"/>
    <path d="M90 350H304" stroke="#7c3aed" stroke-width="12" stroke-linecap="round"/>
    <path d="M90 392H286" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
    <path d="M90 430H256" stroke="#94a3b8" stroke-width="10" stroke-linecap="round" opacity="0.5"/>
    <circle cx="120" cy="230" r="30" fill="#f5d76b" opacity="0.95"/>
    <path d="M108 236V202C108 178 128 158 152 158C170 158 185 170 191 186L214 232H108Z" fill="#fff3b0" opacity="0.75"/>
    <rect x="98" y="480" width="220" height="18" rx="9" fill="#1f2a46"/>
  </g>

  <g opacity="0.9">
    <path d="M206 730C298 610 420 560 530 625C640 690 696 704 815 646C914 598 986 520 1119 526C1246 531 1369 611 1464 696L1542 900H117L150 770L206 730Z" fill="#f5c94d" opacity="0.18"/>
    <path d="M180 748C268 612 421 560 537 630C663 705 715 714 845 646C945 594 1037 527 1172 540C1315 553 1397 627 1490 710L1560 900H140L180 748Z" fill="#d6a43b" opacity="0.14"/>
  </g>

  <g opacity="0.6">
    <path d="M70 220C160 140 240 95 336 111C440 128 510 178 560 262" stroke="#8b5cf6" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M90 410C210 316 298 280 396 318C498 355 552 414 660 438" stroke="#22d3ee" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M104 552C208 598 270 620 432 576C520 552 588 504 710 458" stroke="#fbbf24" stroke-width="9" fill="none" stroke-linecap="round"/>
  </g>
</svg>
`)}`

/* ── Events ─────────────────────────────────────────── */
export interface ClubEvent {
  id: string
  title: string
  date: string
  dateShort: string
  venue: string
  description: string
  fullDescription?: string
  image: string
  status: "upcoming" | "past"
  category: string
  highlights?: string[]
  registrationLink?: string
}

export const EVENTS: ClubEvent[] = [
  {
    id: "flutter-away-3",
    title: "Flutter Away 3.0",
    date: "Coming Soon",
    dateShort: "Coming Soon",
    venue: "Bennett University",
    description:
      "Mobilon’s next-generation Flutter challenge designed to ignite hands-on app-building energy among students and turn ideas into real mobile experiences.",
    fullDescription:
      "Flutter Away 3.0 is the next iteration of Mobilon’s signature Flutter experience — a hands-on journey where students come together to design, build, and ship creative app ideas through guided mentorship, live problem solving, and collaborative prototyping.",
    image: flutterAway3Image,
    status: "upcoming",
    category: "Flutter",
    highlights: [
      "Hands-on Flutter building challenge",
      "Creative mobile product ideation",
      "Mentorship from senior club members",
      "A collaborative build experience for student developers",
    ],
    registrationLink: "#",
  },
  {
    id: "mid-term-mocha",
    title: "Mid Term Mocha",
    date: "2025",
    dateShort: "2025",
    venue: "Bennett University",
    description:
      "A mentorship initiative created to help first-year students prepare for their mid-term examinations through focused guidance and subject support from senior Mobilon members.",
    fullDescription:
      "Mid Term Mocha is a special mentorship initiative organized by Mobilon, specifically designed to help first-year students prepare thoroughly for their mid-term examinations. In this focused teaching and review session, senior members of Mobilon guide their juniors through critical core subjects, ensuring they can approach their exams with confidence and strong foundational knowledge.",
    image: midTermMochaImage,
    status: "past",
    category: "Mentorship",
    highlights: [
      "Focused exam preparation support",
      "Senior-led mentoring for first-years",
      "Academic confidence building",
    ],
  },
  {
    id: "mobile-next",
    title: "Mobile Next",
    date: "2025",
    dateShort: "2025",
    venue: "Bennett University",
    description:
      "A project showcase where delegates delivered inspiring speeches on app development and students explored vibrant stalls showcasing breakthrough ideas and new technologies.",
    fullDescription:
      "At Bennett University, Mobilon proudly hosted an exciting project showcase where delegates delivered inspiring speeches on app development. Enthusiastic attendees explored vibrant stalls, discovering innovative student projects that highlight the future of technology.",
    image: mobileNextImage,
    status: "past",
    category: "Showcase",
    highlights: [
      "Student project showcase",
      "App development inspiration",
      "Innovation-focused campus event",
    ],
  },
  {
    id: "round-table-conference",
    title: "Round Table Conference",
    date: "2025",
    dateShort: "2025",
    venue: "Bennett University",
    description:
      "An inter-club concept event focused on mobile app ideas, where participants pitched new and unique app concepts with strong future potential.",
    fullDescription:
      "Mobilon’s Round Table Conference (RTC) was an inter-club event designed to spark students' interest in developing innovative mobile app ideas. It was a concept-based event where participants presented new and unique app ideas that have the potential to be implemented in the future.",
    image: roundTableConferenceImage,
    status: "past",
    category: "Conference",
    highlights: [
      "Inter-club concept sharing",
      "Innovative mobile app ideation",
      "Future-ready idea pitching",
    ],
  },
  {
    id: "flutter-away-2",
    title: "Flutter Away 2.0",
    date: "2025",
    dateShort: "2025",
    venue: "Bennett University",
    description:
      "A successful Flutter challenge where teams designed and built practical formula apps, combining fun, learning, and hands-on creation for junior developers.",
    fullDescription:
      "Mobilon’s Flutter Away 2.0 was a hit, igniting the passion for app technologies among junior students. The star of the show was the interactive challenge where teams successfully designed and developed a practical ‘formula app.’ This event was packed with fun, focused learning, and hands-on creation, proving a huge success in launching the next generation of talented app developers.",
    image: flutterAway2Image,
    status: "past",
    category: "Flutter",
    highlights: [
      "Interactive Flutter challenge",
      "Formula app build task",
      "Hands-on creation and learning",
    ],
  },
]

/* ── Projects ────────────────────────────────────────── */
export interface Project {
  id: string
  name: string
  tagline: string
  description?: string
  problem?: string
  solution?: string
  impact?: string
  techStack: string[]
  year: string
  contributors: string[]
  category: "Mobile" | "AI" | "Web" | "Backend" | "Design" | "Research"
  image: string
  featured: boolean
  github?: string
  demo?: string
  awards?: string[]
}

export const PROJECTS: Project[] = [
  {
    id: "samvad",
    name: "Samvad",
    tagline: "Yet to be released",
    description:
      "Samvad is a conversational AI platform built specifically for Bennett University students — it answers campus queries, surfaces announcements, connects students with opportunities, and routes support requests intelligently.",
    problem:
      "Information at university is scattered across portals, WhatsApp groups, notice boards, and faculty emails. Students waste hours finding simple answers.",
    solution:
      "A unified, intelligent assistant that understands natural language queries about academic schedules, club events, faculty, library, food, and more — trained on campus-specific data.",
    impact:
      "2,400+ active users in semester 1. 87% query resolution rate. Adopted by 3 university departments.",
    techStack: ["Flutter", "FastAPI", "LangChain", "Supabase", "OpenAI"],
    year: "2026",
    contributors: ["Tanay Prasad", "Rohan Singh", "Kavya Nair", "Aarav Patel"],
    category: "AI",
    image: "photo-1677442135703-1787eea5ce01",
    featured: true,
    github: "#",
    demo: "#",
    awards: ["Best AI Project — Mobile Next 3.0"],
  },
  {
    id: "trackit",
    name: "TrackIt",
    tagline: "Yet to be released",
    description:
      "A mobile-first GPA tracker and study planner with an AI model that predicts semester performance based on attendance, assignment completion, and study habits.",
    problem:
      "Students struggle to understand the impact of their day-to-day habits on final grades until it is too late.",
    solution:
      "TrackIt ingests course data and personal study logs to surface weekly performance insights and early warning indicators.",
    impact:
      "1,100 downloads in first month. Featured in Bennett University's tech bulletin.",
    techStack: [
      "React Native",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "TensorFlow Lite",
    ],
    year: "2026",
    contributors: ["Rohan Singh", "Ishaan Verma", "Vihaan Shah"],
    category: "Mobile",
    image: "photo-1512941937669-90a1b58e7e9c",
    featured: true,
    github: "#",
    demo: "#",
  },
  {
    id: "campusai",
    name: "CampusAI",
    tagline: "Yet to be released",
    description:
      "CampusAI lets students upload course PDFs and lecture notes, then ask questions, generate practice tests, and receive concise explanations — all grounded in their own material.",
    techStack: ["Next.js", "Python", "LlamaIndex", "Pinecone", "Vercel"],
    year: "2026",
    contributors: ["Kavya Nair", "Ananya Rao", "Aditya Kumar"],
    category: "AI",
    image: "photo-1551650975-87deedd944c3",
    featured: false,
    github: "#",
  },
  {
    id: "blueprint",
    name: "BluePrint",
    tagline: "Yet to be released",
    description:
      "A lightweight web tool for sharing design mockups, leaving timestamped feedback, and managing design iterations — built specifically for academic project workflows.",
    techStack: ["React", "TypeScript", "Supabase", "Figma API"],
    year: "2026",
    contributors: ["Aditya Kumar", "Diya Kapoor", "Meera Pillai"],
    category: "Design",
    image: "photo-1581291518857-4e27b48ff24e",
    featured: false,
    github: "#",
    demo: "#",
  },
  {
    id: "eventflow",
    name: "EventFlow",
    tagline: "Yet to be released",
    description:
      "EventFlow handles registrations, check-in, team formation, judging, and results — all in a single platform used to run Mobilon's own events.",
    techStack: ["Flutter", "Firebase", "TypeScript", "Node.js"],
    year: "2026",
    contributors: ["Sneha Joshi", "Ishaan Verma", "Krish Mehta", "Nikhil Bose"],
    category: "Mobile",
    image: "photo-1559136555-9303baea8ebd",
    featured: false,
    github: "#",
  },
]

/* ── Gallery ─────────────────────────────────────────── */
export interface GalleryItem {
  id: string
  photo: string
  title: string
  date: string
  category: "Mobile Next" | "Workshops" | "Hackathons" | "Recruitment" | "Club Life"
  span?: "tall" | "wide" | "normal"
}

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    photo: mobileNextImage,
    title: "Mobile Next",
    date: "2025",
    category: "Mobile Next",
    span: "tall",
  },
  {
    id: "g2",
    photo: midTermMochaImage,
    title: "Mid Term Mocha",
    date: "2025",
    category: "Club Life",
    span: "normal",
  },
  {
    id: "g3",
    photo: roundTableConferenceImage,
    title: "Round Table Conference",
    date: "2025",
    category: "Club Life",
    span: "normal",
  },
  {
    id: "g4",
    photo: flutterAway2Image,
    title: "Flutter Away 2.0",
    date: "2025",
    category: "Workshops",
    span: "wide",
  },
]

/* ── Achievements ────────────────────────────────────── */
export interface AchievementYear {
  year: string
  items: { index: string; event: string; result: string; organizer?: string }[]
}

export const ACHIEVEMENTS: AchievementYear[] = [
  {
    year: "2025–26",
    items: [
      {
        index: "01",
        event: "Hack Helix",
        result: "First Place",
        organizer: "Helix, Thapar Institute of Engineering & Technology",
      },
      {
        index: "02",
        event: "CAD-a-thon",
        result: "First Place",
        organizer: "Thapar Institute of Engineering & Technology",
      },
      {
        index: "03",
        event: "Code Sprint",
        result: "Best Project Award",
        organizer: "Code Sprint community",
      },
      {
        index: "04",
        event: "InnoQuest",
        result: "Top 5 Finalist",
        organizer: "Innoquest Inc.",
      },
    ],
  },
  {
    year: "2024–25",
    items: [
      {
        index: "01",
        event: "Smart India Hackathon",
        result: "Runner-up",
        organizer: "Government of India",
      },
      {
        index: "02",
        event: "Mobile Next 3.0",
        result: "Best App Award",
        organizer: "Mobilon",
      },
      {
        index: "03",
        event: "HackBU",
        result: "First Place",
        organizer: "Bennett University",
      },
      {
        index: "04",
        event: "Design Week Challenge",
        result: "Second Place",
        organizer: "Adobe India",
      },
    ],
  },
  {
    year: "2023–24",
    items: [
      {
        index: "01",
        event: "App Fiesta",
        result: "First Place",
        organizer: "IIT Roorkee",
      },
      {
        index: "02",
        event: "National Hackathon",
        result: "Top 10",
        organizer: "MeitY",
      },
      { index: "03", event: "Mobile Next 2.0", result: "Best Innovation", organizer: "Mobilon" },
    ],
  },
]
