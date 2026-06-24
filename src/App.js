import { useState, useEffect, useRef, useCallback } from "react";

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
      const res = await fetch("http://localhost:3001/api/chat", {
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

        const res2 = await fetch("http://localhost:3001/api/chat", {
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
}
