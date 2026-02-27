/**
 * COURT SESSION — Basketball Workout Tracker
 * Single-file React app. No backend. localStorage only.
 *
 * HOW TO RUN LOCALLY:
 * 1. npm create vite@latest court-session -- --template react-ts
 * 2. Replace src/App.tsx with this file
 * 3. npm install && npm run dev
 */
import { useState, useEffect, useRef, useCallback } from "react";
// ─────────────────────────────────────────────
// STYLES (injected into <head> at runtime)
// ─────────────────────────────────────────────
const STYLES = `
 @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
 *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 :root {
 --orange: #FF6B1A;
 --orange-dim: #c4501200;
 --gold: #FFBE0B;
 --bg: #0D0D0F;
 --surface: #161618;
 --surface2: #1E1E21;
 --surface3: #26262A;
 --border: #2E2E33;
 --text: #F0EEE8;
 --muted: #7A7A85;
 --green: #22C55E;
 --red: #EF4444;
 --radius: 12px;
 --transition: 0.18s ease;
 }
 html, body, #root { height: 100%; }
 body {
 font-family: 'DM Sans', sans-serif;
 background: var(--bg);
 color: var(--text);
 font-size: 15px;
 line-height: 1.5;
 -webkit-font-smoothing: antialiased;
 }
 /* ── LAYOUT ── */
 .app { display: flex; flex-direction: column; min-height: 100dvh; }
 .top-bar {
 display: flex;
 align-items: center;
 justify-content: space-between;
 padding: 0 16px;
 height: 56px;
 background: var(--surface);
 border-bottom: 1px solid var(--border);
 position: sticky;
 top: 0;
 z-index: 100;
 }
 .logo {
 font-family: 'Bebas Neue', sans-serif;
 font-size: 1.55rem;
 letter-spacing: 2px;
 color: var(--orange);
 display: flex;
 align-items: center;
 gap: 8px;
 }
 .logo span { color: var(--text); }
 .nav {
 display: flex;
 background: var(--surface2);
 border-top: 1px solid var(--border);
 position: sticky;
 bottom: 0;
 z-index: 100;
 }
 .nav-btn {
 flex: 1;
 display: flex;
 flex-direction: column;
 align-items: center;
 gap: 3px;
 padding: 10px 4px 12px;
 background: none;
 border: none;
 color: var(--muted);
 font-family: 'DM Sans', sans-serif;
 font-size: 10px;
 font-weight: 500;
 cursor: pointer;
 transition: color var(--transition);
 letter-spacing: .3px;
 text-transform: uppercase;
 }
 .nav-btn svg { width: 20px; height: 20px; }
 .nav-btn.active { color: var(--orange); }
 .page { flex: 1; overflow-y: auto; padding: 16px; max-width: 680px; width: 100%; margin: 0 auto; }
 /* ── SECTION HEADERS ── */
 .section-title {
 font-family: 'Bebas Neue', sans-serif;
 font-size: 1.7rem;
 letter-spacing: 2px;
 color: var(--text);
 margin-bottom: 16px;
 }
 .section-subtitle {
 font-size: 11px;
 font-weight: 600;
 letter-spacing: 1.5px;
 text-transform: uppercase;
 color: var(--muted);
 margin-bottom: 10px;
 }
 /* ── CARDS ── */
 .card {
 background: var(--surface);
 border: 1px solid var(--border);
 border-radius: var(--radius);
 padding: 14px;
 margin-bottom: 10px;
 }
 .card-header {
 display: flex;
 align-items: center;
 justify-content: space-between;
 gap: 8px;
 }
 .card-title { font-weight: 600; font-size: 15px; }
 .card-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
 /* ── BUTTONS ── */
 .btn {
 display: inline-flex;
 align-items: center;
 gap: 6px;
 padding: 9px 18px;
 border-radius: 8px;
 border: none;
 font-family: 'DM Sans', sans-serif;
 font-size: 13px;
 font-weight: 600;
 cursor: pointer;
 transition: opacity var(--transition), transform var(--transition);
 white-space: nowrap;
 }
 .btn:active { transform: scale(.97); }
 .btn:disabled { opacity: .45; cursor: not-allowed; }
 .btn-primary { background: var(--orange); color: #fff; }
 .btn-primary:hover:not(:disabled) { opacity: .88; }
 .btn-secondary { background: var(--surface3); color: var(--text); }
 .btn-secondary:hover:not(:disabled) { background: var(--border); }
 .btn-danger { background: #3a1212; color: var(--red); }
 .btn-danger:hover:not(:disabled) { background: #4d1414; }
 .btn-ghost { background: transparent; color: var(--muted); padding: 6px 8px; font-size: 13px; }
 .btn-ghost:hover { color: var(--text); }
 .btn-icon { padding: 7px; border-radius: 7px; }
 .btn-green { background: var(--green); color: #fff; }
 .btn-red { background: var(--red); color: #fff; }
 .btn-sm { padding: 6px 12px; font-size: 12px; }
 .btn-lg { padding: 14px 28px; font-size: 16px; }
 .btn-full { width: 100%; justify-content: center; }
 /* ── INPUTS ── */
 .input, .select, .textarea {
 width: 100%;
 background: var(--surface2);
 border: 1px solid var(--border);
 border-radius: 8px;
 color: var(--text);
 font-family: 'DM Sans', sans-serif;
 font-size: 14px;
 padding: 10px 12px;
 outline: none;
 transition: border-color var(--transition);
 }
 .input:focus, .select:focus, .textarea:focus { border-color: var(--orange); }
 .select option { background: var(--surface2); }
 .input-row { display: flex; gap: 8px; align-items: flex-end; }
 .field { margin-bottom: 12px; }
 .label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 5px; letter-spacing: .5px; text-transform: uppercase; }
 /* ── TAGS / BADGES ── */
 .badge {
 display: inline-block;
 padding: 2px 8px;
 border-radius: 50px;
 font-size: 11px;
 font-weight: 600;
 letter-spacing: .3px;
 }
 .badge-orange { background: rgba(255,107,26,.15); color: var(--orange); }
 .badge-gold { background: rgba(255,190,11,.12); color: var(--gold); }
 .badge-green { background: rgba(34,197,94,.12); color: var(--green); }
 .badge-muted { background: var(--surface3); color: var(--muted); }
 /* ── DIVIDER ── */
 .divider { height: 1px; background: var(--border); margin: 14px 0; }
 /* ── MODAL ── */
 .modal-overlay {
 position: fixed; inset: 0; background: rgba(0,0,0,.75);
 display: flex; align-items: flex-end; justify-content: center;
 z-index: 200; padding: 0;
 animation: fadeIn .15s ease;
 }
 .modal {
 background: var(--surface);
 border-radius: 18px 18px 0 0;
 border: 1px solid var(--border);
 width: 100%;
 max-width: 680px;
 max-height: 90dvh;
 overflow-y: auto;
 padding: 20px 18px 32px;
 animation: slideUp .2s ease;
 }
 .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.4rem; letter-spacing: 1.5px; margin-bottom: 16px; }
 .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
 @keyframes slideUp { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
 /* ── RUNNER ── */
 .runner-wrap {
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 24px 16px;
 gap: 20px;
 }
 .runner-drill-name {
 font-family: 'Bebas Neue', sans-serif;
 font-size: 2.4rem;
 letter-spacing: 2px;
 text-align: center;
 }
 .timer-ring {
 position: relative;
 width: 180px;
 height: 180px;
 }
 .timer-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
 .timer-ring .ring-bg { fill: none; stroke: var(--surface3); stroke-width: 8; }
 .timer-ring .ring-fg { fill: none; stroke: var(--orange); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset .5s linear; }
 .timer-center {
 position: absolute; inset: 0;
 display: flex; flex-direction: column; align-items: center; justify-content: center;
 }
 .timer-seconds {
 font-family: 'Bebas Neue', sans-serif;
 font-size: 3.2rem;
 color: var(--orange);
 line-height: 1;
 }
 .timer-label { font-size: 11px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
 .shot-btns { display: flex; gap: 14px; width: 100%; }
 .shot-btn {
 flex: 1;
 padding: 22px;
 border-radius: 14px;
 border: none;
 font-family: 'Bebas Neue', sans-serif;
 font-size: 1.5rem;
 letter-spacing: 1.5px;
 cursor: pointer;
 transition: transform var(--transition), opacity var(--transition);
 }
 .shot-btn:active { transform: scale(.96); }
 .shot-btn-made { background: var(--green); color: #fff; }
 .shot-btn-missed { background: var(--red); color: #fff; }
 .drill-stats {
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 gap: 8px;
 width: 100%;
 }
 .stat-box {
 background: var(--surface);
 border: 1px solid var(--border);
 border-radius: 10px;
 padding: 10px;
 text-align: center;
 }
 .stat-box-val { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--orange); }
 .stat-box-lbl { font-size: 10px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
 .drill-progress { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
 .drill-dot {
 width: 10px; height: 10px;
 border-radius: 50%;
 background: var(--surface3);
 }
 .drill-dot.done { background: var(--orange); }
 .drill-dot.current { background: var(--gold); }
 /* ── STATS ── */
 .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
 .stat-card {
 background: var(--surface);
 border: 1px solid var(--border);
 border-radius: 10px;
 padding: 14px;
 text-align: center;
 }
 .stat-card-val { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: var(--orange); line-height: 1; }
 .stat-card-lbl { font-size: 11px; color: var(--muted); margin-top: 3px; letter-spacing: .5px; }
 .bar-chart { display: flex; flex-direction: column; gap: 10px; }
 .bar-row { display: flex; flex-direction: column; gap: 4px; }
 .bar-label { font-size: 12px; color: var(--text); font-weight: 500; display: flex; justify-content: space-between; }
 .bar-track { height: 8px; background: var(--surface3); border-radius: 99px; overflow: hidden; }
 .bar-fill { height: 100%; background: var(--orange); border-radius: 99px; transition: width .5s ease; }
 .table { width: 100%; border-collapse: collapse; font-size: 13px; }
 .table th { text-align: left; padding: 6px 8px; color: var(--muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid var(--border); }
 .table td { padding: 8px 8px; border-bottom: 1px solid var(--border); }
 .table tr:last-child td { border-bottom: none; }
 /* ── SUMMARY ── */
 .summary-header {
 text-align: center;
 padding: 24px 0 16px;
 }
 .summary-emoji { font-size: 3rem; }
 .summary-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2px; margin-top: 8px; }
 .summary-pct { font-size: 4rem; font-family: 'Bebas Neue', sans-serif; color: var(--orange); letter-spacing: 2px; }
 /* ── EMPTY STATE ── */
 .empty { text-align: center; padding: 48px 24px; color: var(--muted); }
 .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
 .empty p { font-size: 14px; }
 /* ── REP DONE ── */
 .rep-complete-btn {
 width: 100%;
 padding: 26px;
 background: var(--surface3);
 border: 2px dashed var(--border);
 border-radius: 14px;
 font-family: 'Bebas Neue', sans-serif;
 font-size: 1.2rem;
 letter-spacing: 1.5px;
 color: var(--gold);
 cursor: pointer;
 transition: background var(--transition), border-color var(--transition);
 }
 .rep-complete-btn:hover { background: var(--surface2); border-color: var(--gold); }
 /* ── TABS (sub) ── */
 .tab-row { display: flex; gap: 4px; background: var(--surface2); border-radius: 10px; padding: 4px; margin-bottom: 16px; }
 .tab-pill {
 flex: 1; text-align: center; padding: 7px 6px;
 border-radius: 8px; border: none;
 font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
 color: var(--muted); cursor: pointer; background: transparent;
 transition: background var(--transition), color var(--transition);
 }
 .tab-pill.active { background: var(--surface); color: var(--text); }
 .mt-8 { margin-top: 8px; }
 .mt-16 { margin-top: 16px; }
 .mb-0 { margin-bottom: 0; }
 .flex { display: flex; }
 .flex-col { flex-direction: column; }
 .gap-8 { gap: 8px; }
 .items-center { align-items: center; }
 .justify-between { justify-content: space-between; }
 .w-full { width: 100%; }
`;
// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Subcategory {
  id: string;
  name: string;
  goal?: number;
}
interface Category {
  id: string;
  name: string;
  goal?: number;
  subcategories: Subcategory[];
}
type DrillType = "exercise" | "break";
type DrillMode = "time" | "makes" | "attempts";
interface Drill {
  id: string;
  name: string;
  type: DrillType;
  mode: DrillMode;
  duration: number;
  reps: number;
  catId: string;
  subId: string;
}
interface Workout {
  id: string;
  name: string;
  drills: Drill[];
}
interface DrillStat {
  makes: number;
  attempts: number;
  timeSpent: number;
}
interface SessionDrill {
  drillId: string;
  drillName: string;
  catId?: string;
  subId?: string;
  makes: number;
  attempts: number;
  timeSpent: number;
}
interface Session {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string;
  totalTime: number;
  drills: SessionDrill[];
}
// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
const uid = (): string => Math.random().toString(36).slice(2, 10);
const fmt = (secs: number): string => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};
const pct = (makes: number, attempts: number): string =>
  attempts === 0 ? "—" : `${Math.round((makes / attempts) * 100)}%`;
// ─────────────────────────────────────────────
// LOCAL STORAGE HOOK
// ─────────────────────────────────────────────
function useLS<T>(
  key: string,
  init: T
): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : init;
    } catch {
      return init;
    }
  });
  const save = useCallback(
    (v: T | ((prev: T) => T)) => {
      const next = typeof v === "function" ? (v as (prev: T) => T)(val) : v;
      setVal(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key, val]
  );
  return [val, save];
}
// ─────────────────────────────────────────────
// TEXT-TO-SPEECH
// ─────────────────────────────────────────────
function speak(text: string): void {
  if (!window.speechSynthesis) return;
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 1.05;
  utt.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utt);
}
// ─────────────────────────────────────────────
// ICONS (inline SVG)
// ─────────────────────────────────────────────
const Icon = {
  Cat: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  ),
  Workout: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4v16M18 4v16M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3" />
    </svg>
  ),
  Run: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="1.5" />
      <path d="M10 21l1.5-4.5 2 1.5 2-5M8 9l4-2 4 2-1 3H9z" />
    </svg>
  ),
  Stats: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  Plus: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Pencil: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.232 5.232l3.536 3.536M9 11l-4 4v4h4l4-4-4-4zM14 6l4 4" />
    </svg>
  ),
  Trash: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
  Chevron: ({ dir = "right" }: { dir?: "right" | "left" | "up" | "down" }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform:
          dir === "down"
            ? "rotate(90deg)"
            : dir === "up"
            ? "rotate(-90deg)"
            : dir === "left"
            ? "rotate(180deg)"
            : "none",
      }}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  ),
  Ball: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c0 4.5-3 8-3 9s3 4.5 3 9M12 3c0 4.5 3 8 3 9s-3 4.5-3 9M3.5 9h17M3.5 15h17" />
    </svg>
  ),
};
// ─────────────────────────────────────────────
// CATEGORY PAGE
// ─────────────────────────────────────────────
type ModalType = "addCat" | "editCat" | "addSub" | "editSub";
interface CategoryModal {
  type: ModalType;
  name: string;
  goal: number;
  catId?: string;
  subId?: string;
}
interface CategoryPageProps {
  categories: Category[];
  setCategories: (v: Category[] | ((prev: Category[]) => Category[])) => void;
}
function CategoryPage({ categories, setCategories }: CategoryPageProps) {
  const [modal, setModal] = useState<CategoryModal | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, true]))
  );
  const openAddCat = () => setModal({ type: "addCat", name: "", goal: 50 });
  const openEditCat = (cat: Category) =>
    setModal({
      type: "editCat",
      catId: cat.id,
      name: cat.name,
      goal: cat.goal ?? 50,
    });
  const openAddSub = (catId: string) =>
    setModal({ type: "addSub", catId, name: "", goal: 50 });
  const openEditSub = (catId: string, sub: Subcategory) =>
    setModal({
      type: "editSub",
      catId,
      subId: sub.id,
      name: sub.name,
      goal: sub.goal ?? 50,
    });
  const toggleExpand = (id: string) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const confirmModal = () => {
    if (!modal) return;
    if (modal.type === "addCat") {
      if (!modal.name.trim()) return;
      const newId = uid();
      setCategories((p) => [
        ...p,
        {
          id: newId,
          name: modal.name.trim(),
          goal: modal.goal ?? 50,
          subcategories: [],
        },
      ]);
      setExpanded((p) => ({ ...p, [newId]: true }));
    } else if (modal.type === "editCat") {
      if (!modal.name.trim()) return;
      setCategories((p) =>
        p.map((c) =>
          c.id === modal.catId
            ? { ...c, name: modal.name.trim(), goal: modal.goal ?? 50 }
            : c
        )
      );
    } else if (modal.type === "addSub") {
      if (!modal.name.trim()) return;
      setCategories((p) =>
        p.map((c) =>
          c.id === modal.catId
            ? {
                ...c,
                subcategories: [
                  ...c.subcategories,
                  {
                    id: uid(),
                    name: modal.name.trim(),
                    goal: modal.goal ?? 50,
                  },
                ],
              }
            : c
        )
      );
    } else if (modal.type === "editSub") {
      if (!modal.name.trim()) return;
      setCategories((p) =>
        p.map((c) =>
          c.id === modal.catId
            ? {
                ...c,
                subcategories: c.subcategories.map((s) =>
                  s.id === modal.subId
                    ? { ...s, name: modal.name.trim(), goal: modal.goal ?? 50 }
                    : s
                ),
              }
            : c
        )
      );
    }
    setModal(null);
  };
  const deleteCat = (id: string) => {
    setCategories((p) => p.filter((c) => c.id !== id));
  };
  const deleteSub = (catId: string, subId: string) => {
    setCategories((p) =>
      p.map((c) =>
        c.id === catId
          ? {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== subId),
            }
          : c
      )
    );
  };
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          Categories
        </h1>
        <button className="btn btn-primary btn-sm" onClick={openAddCat}>
          <Icon.Plus /> Add
        </button>
      </div>
      {categories.length === 0 && (
        <div className="empty">
          <div className="empty-icon"> </div>
          <p>No categories yet. Add your first shot category.</p>
        </div>
      )}
      {categories.map((cat) => (
        <div key={cat.id} className="card mb-0" style={{ marginBottom: 10 }}>
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                className="btn btn-ghost btn-icon"
                style={{ padding: 4 }}
                onClick={() => toggleExpand(cat.id)}
              >
                <Icon.Chevron dir={expanded[cat.id] ? "down" : "right"} />
              </button>
              <div>
                <div className="card-title">{cat.name}</div>
                <div className="card-meta">
                  {cat.subcategories.length} subcategories · Goal:{" "}
                  {cat.goal ?? 50}%
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openEditCat(cat)}
              >
                <Icon.Pencil /> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteCat(cat.id)}
              >
                <Icon.Trash /> Delete
              </button>
            </div>
          </div>
          {expanded[cat.id] && (
            <>
              <div className="divider" />
              <div style={{ paddingLeft: 4 }}>
                <div className="section-subtitle">Subcategories</div>
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500 }}>
                      {sub.name}
                    </span>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>
                        Goal: {sub.goal ?? 50}%
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditSub(cat.id, sub)}
                      >
                        <Icon.Pencil /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteSub(cat.id, sub.id)}
                      >
                        <Icon.Trash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {cat.subcategories.length === 0 && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--muted)",
                      marginBottom: 8,
                    }}
                  >
                    No subcategories.
                  </p>
                )}
                <button
                  className="btn btn-secondary btn-sm mt-8"
                  onClick={() => openAddSub(cat.id)}
                >
                  <Icon.Plus /> Add Subcategory
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      {/* Modal */}
      {modal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-title">
              {modal.type === "addCat" && "New Category"}
              {modal.type === "editCat" && "Edit Category"}
              {modal.type === "addSub" && "New Subcategory"}
              {modal.type === "editSub" && "Edit Subcategory"}
            </div>
            <div className="field">
              <label className="label">Name</label>
              <input
                className="input"
                autoFocus
                value={modal.name}
                onChange={(e) =>
                  setModal((p) => (p ? { ...p, name: e.target.value } : p))
                }
                onKeyDown={(e) => e.key === "Enter" && confirmModal()}
                placeholder="e.g. Corner Left"
              />
            </div>
            <div className="field">
              <label className="label">Goal % — {modal.goal ?? 50}%</label>
              <input
                className="input"
                type="range"
                min="1"
                max="100"
                value={modal.goal ?? 50}
                onChange={(e) =>
                  setModal((p) =>
                    p ? { ...p, goal: Number(e.target.value) } : p
                  )
                }
                style={{ padding: "6px 0", cursor: "pointer" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginTop: 2,
                }}
              >
                <span>1%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setModal(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmModal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────
// WORKOUT PAGE
// ─────────────────────────────────────────────
interface WorkoutPageProps {
  workouts: Workout[];
  setWorkouts: (v: Workout[] | ((prev: Workout[]) => Workout[])) => void;
  categories: Category[];
}
function WorkoutPage({ workouts, setWorkouts, categories }: WorkoutPageProps) {
  const [editing, setEditing] = useState<Workout | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const startNew = () => setEditing({ id: "", name: "", drills: [] });
  const editExisting = (w: Workout) =>
    setEditing(JSON.parse(JSON.stringify(w)) as Workout);
  const deleteWorkout = (id: string) => {
    setWorkouts((p) => p.filter((w) => w.id !== id));
    setConfirmDeleteId(null);
  };
  const saveWorkout = () => {
    if (!editing || !editing.name.trim()) return;
    const workout: Workout = {
      ...editing,
      id: editing.id || uid(),
      name: editing.name.trim(),
    };
    setWorkouts((p) =>
      editing.id
        ? p.map((w) => (w.id === editing.id ? workout : w))
        : [...p, workout]
    );
    setEditing(null);
  };
  if (editing) {
    return (
      <WorkoutEditor
        editing={editing}
        setEditing={setEditing}
        categories={categories}
        onSave={saveWorkout}
        onCancel={() => setEditing(null)}
      />
    );
  }
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          Workouts
        </h1>
        <button className="btn btn-primary btn-sm" onClick={startNew}>
          <Icon.Plus /> New
        </button>
      </div>
      {workouts.length === 0 && (
        <div className="empty">
          <div className="empty-icon"> </div>
          <p>No workouts yet. Build your first session.</p>
        </div>
      )}
      {workouts.map((w) => (
        <div key={w.id} className="card">
          <div className="card-header">
            <div>
              <div className="card-title">{w.name}</div>
              <div className="card-meta">
                {w.drills.length} drills ·{" "}
                {fmt(w.drills.reduce((a, d) => a + (d.duration || 0), 0))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => editExisting(w)}
              >
                <Icon.Pencil /> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => setConfirmDeleteId(w.id)}
              >
                <Icon.Trash /> Delete
              </button>
            </div>
          </div>
          {confirmDeleteId === w.id && (
            <div
              style={{
                marginTop: 10,
                padding: "10px",
                background: "var(--surface2)",
                borderRadius: 8,
                border: "1px solid var(--red)",
              }}
            >
              <p style={{ fontSize: 13, marginBottom: 8 }}>
                Delete "{w.name}"? This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteWorkout(w.id)}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          )}
          <div
            style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}
          >
            {w.drills.map((d) => (
              <span key={d.id} className="badge badge-muted">
                {d.name} · {d.duration ? `${d.duration}s` : `${d.reps} reps`}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
// ─────────────────────────────────────────────
// WORKOUT EDITOR
// ─────────────────────────────────────────────
interface DrillModal {
  id: string | null;
  name: string;
  type: DrillType;
  mode: DrillMode;
  duration: number;
  reps: number;
  catId: string;
  subId: string;
}
interface WorkoutEditorProps {
  editing: Workout;
  setEditing: (v: Workout | ((prev: Workout | null) => Workout | null)) => void;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}
function WorkoutEditor({
  editing,
  setEditing,
  categories,
  onSave,
  onCancel,
}: WorkoutEditorProps) {
  const [drillModal, setDrillModal] = useState<DrillModal | null>(null);
  const openNewDrill = () =>
    setDrillModal({
      id: null,
      name: "",
      type: "exercise",
      mode: "time",
      duration: 60,
      reps: 10,
      catId: "",
      subId: "",
    });
  const editDrill = (d: Drill) => setDrillModal({ ...d });
  const saveDrill = () => {
    if (!drillModal || !drillModal.name.trim()) return;
    const drill: Drill = {
      ...drillModal,
      id: drillModal.id || uid(),
      name: drillModal.name.trim(),
    };
    setEditing((p) => {
      if (!p) return p;
      return {
        ...p,
        drills: drillModal.id
          ? p.drills.map((d) => (d.id === drillModal.id ? drill : d))
          : [...p.drills, drill],
      };
    });
    setDrillModal(null);
  };
  const deleteDrill = (id: string) =>
    setEditing((p) =>
      p ? { ...p, drills: p.drills.filter((d) => d.id !== id) } : p
    );
  const selectedCatSubs = drillModal
    ? categories.find((c) => c.id === drillModal.catId)?.subcategories ?? []
    : [];
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <button className="btn btn-ghost btn-icon" onClick={onCancel}>
          <Icon.Chevron dir="left" />
        </button>
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          {editing.id ? "Edit Workout" : "New Workout"}
        </h1>
      </div>
      <div className="field">
        <label className="label">Workout Name</label>
        <input
          className="input"
          value={editing.name}
          onChange={(e) =>
            setEditing((p) => (p ? { ...p, name: e.target.value } : p))
          }
          placeholder="e.g. Morning Shooting"
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div className="section-subtitle" style={{ marginBottom: 0 }}>
          Drills
        </div>
        <button className="btn btn-secondary btn-sm" onClick={openNewDrill}>
          <Icon.Plus /> Add Drill
        </button>
      </div>
      {editing.drills.length === 0 && (
        <div className="empty" style={{ padding: "28px 0" }}>
          <p>Add drills to this workout.</p>
        </div>
      )}
      {editing.drills.map((d) => {
        const cat = categories.find((c) => c.id === d.catId);
        const sub = cat?.subcategories.find((s) => s.id === d.subId);
        const isBreak = d.type === "break";
        return (
          <div key={d.id} className="card">
            <div className="card-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="card-title">{d.name}</div>
                  <span
                    className={`badge ${
                      isBreak ? "badge-gold" : "badge-orange"
                    }`}
                  >
                    {isBreak ? "Break" : "Exercise"}
                  </span>
                </div>
                <div className="card-meta">
                  {isBreak
                    ? `${d.duration}s rest`
                    : `${
                        d.mode === "time"
                          ? `${d.duration}s`
                          : d.mode === "makes"
                          ? `${d.reps} makes`
                          : `${d.reps} attempts`
                      }${cat ? ` · ${cat.name}` : ""}${
                        sub ? ` › ${sub.name}` : ""
                      }`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => editDrill(d)}
                >
                  <Icon.Pencil /> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteDrill(d.id)}
                >
                  <Icon.Trash /> Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1 }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 2 }}
          onClick={onSave}
          disabled={!editing.name.trim()}
        >
          Save Workout
        </button>
      </div>
      {!editing.name.trim() && (
        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          Enter a workout name to save.
        </p>
      )}
      {/* Drill Modal */}
      {drillModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setDrillModal(null)}
        >
          <div className="modal">
            <div className="modal-title">
              {drillModal.id ? "Edit Drill" : "New Drill"}
            </div>
            <div className="field">
              <label className="label">Drill Name</label>
              <input
                className="input"
                value={drillModal.name}
                onChange={(e) =>
                  setDrillModal((p) => (p ? { ...p, name: e.target.value } : p))
                }
                placeholder="e.g. Corner 3s"
              />
            </div>
            <div className="field">
              <label className="label">Type</label>
              <div className="tab-row">
                <button
                  className={`tab-pill ${
                    drillModal.type !== "break" ? "active" : ""
                  }`}
                  onClick={() =>
                    setDrillModal((p) => (p ? { ...p, type: "exercise" } : p))
                  }
                >
                  Exercise
                </button>
                <button
                  className={`tab-pill ${
                    drillModal.type === "break" ? "active" : ""
                  }`}
                  onClick={() =>
                    setDrillModal((p) => (p ? { ...p, type: "break" } : p))
                  }
                >
                  Break
                </button>
              </div>
            </div>
            {drillModal.type !== "break" && (
              <>
                <div className="field">
                  <label className="label">Mode</label>
                  <div className="tab-row">
                    <button
                      className={`tab-pill ${
                        drillModal.mode === "time" ? "active" : ""
                      }`}
                      onClick={() =>
                        setDrillModal((p) => (p ? { ...p, mode: "time" } : p))
                      }
                    >
                      Timed
                    </button>
                    <button
                      className={`tab-pill ${
                        drillModal.mode === "makes" ? "active" : ""
                      }`}
                      onClick={() =>
                        setDrillModal((p) => (p ? { ...p, mode: "makes" } : p))
                      }
                    >
                      Makes
                    </button>
                    <button
                      className={`tab-pill ${
                        drillModal.mode === "attempts" ? "active" : ""
                      }`}
                      onClick={() =>
                        setDrillModal((p) =>
                          p ? { ...p, mode: "attempts" } : p
                        )
                      }
                    >
                      Attempts
                    </button>
                  </div>
                </div>
                {drillModal.mode === "time" ? (
                  <div className="field">
                    <label className="label">Duration (seconds)</label>
                    <input
                      className="input"
                      type="number"
                      min="5"
                      max="3600"
                      value={drillModal.duration}
                      onChange={(e) =>
                        setDrillModal((p) =>
                          p ? { ...p, duration: Number(e.target.value) } : p
                        )
                      }
                    />
                  </div>
                ) : drillModal.mode === "makes" ? (
                  <div className="field">
                    <label className="label">Makes Target</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="999"
                      value={drillModal.reps}
                      onChange={(e) =>
                        setDrillModal((p) =>
                          p ? { ...p, reps: Number(e.target.value) } : p
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="field">
                    <label className="label">Attempts Target</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      max="999"
                      value={drillModal.reps}
                      onChange={(e) =>
                        setDrillModal((p) =>
                          p ? { ...p, reps: Number(e.target.value) } : p
                        )
                      }
                    />
                  </div>
                )}
                <div className="field">
                  <label className="label">Category (optional)</label>
                  <select
                    className="select"
                    value={drillModal.catId}
                    onChange={(e) =>
                      setDrillModal((p) =>
                        p ? { ...p, catId: e.target.value, subId: "" } : p
                      )
                    }
                  >
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCatSubs.length > 0 && (
                  <div className="field">
                    <label className="label">Subcategory (optional)</label>
                    <select
                      className="select"
                      value={drillModal.subId}
                      onChange={(e) =>
                        setDrillModal((p) =>
                          p ? { ...p, subId: e.target.value } : p
                        )
                      }
                    >
                      <option value="">— None —</option>
                      {selectedCatSubs.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
            {drillModal.type === "break" && (
              <div className="field">
                <label className="label">Break Duration (seconds)</label>
                <input
                  className="input"
                  type="number"
                  min="5"
                  max="3600"
                  value={drillModal.duration}
                  onChange={(e) =>
                    setDrillModal((p) =>
                      p ? { ...p, duration: Number(e.target.value) } : p
                    )
                  }
                />
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setDrillModal(null)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveDrill}>
                Save Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────
// RUN WORKOUT PAGE
// ─────────────────────────────────────────────
type RunPhase = "select" | "running" | "summary";
interface RunPageProps {
  workouts: Workout[];
  categories: Category[];
  onSessionSaved: (session: Session) => void;
}
function RunPage({ workouts, categories, onSessionSaved }: RunPageProps) {
  const [phase, setPhase] = useState<RunPhase>("select");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [drillIdx, setDrillIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const [drillStats, setDrillStats] = useState<DrillStat[]>([]);
  const [totalElapsed, setTotalElapsed] = useState<number>(0);
  const [lastBreakIdx, setLastBreakIdx] = useState<number>(-1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const drillStartRef = useRef<number>(0);
  const warnedRef = useRef<boolean>(false);
  const isTimedDrill = (d: Drill): boolean =>
    d.type === "break" || d.mode === "time";
  const currentDrill = selectedWorkout?.drills[drillIdx];
  const currentStat: DrillStat = drillStats[drillIdx] ?? {
    makes: 0,
    attempts: 0,
    timeSpent: 0,
  };
  const getCatInfo = (drill: Drill): { catName: string; subName: string } => {
    const cat = categories.find((c) => c.id === drill.catId);
    const sub = cat?.subcategories.find((s) => s.id === drill.subId);
    return { catName: cat?.name ?? "", subName: sub?.name ?? "" };
  };
  const startWorkout = (w: Workout) => {
    setSelectedWorkout(w);
    setDrillIdx(0);
    setDrillStats(
      w.drills.map(() => ({ makes: 0, attempts: 0, timeSpent: 0 }))
    );
    setTotalElapsed(0);
    setLastBreakIdx(-1);
    warnedRef.current = false;
    setPhase("running");
  };
  useEffect(() => {
    if (phase !== "running" || !selectedWorkout) return;
    const drill = selectedWorkout.drills[drillIdx];
    if (!drill) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    drillStartRef.current = Date.now();
    warnedRef.current = false;
    setPaused(false);
    if (drill.type === "break") {
      speak(`${drill.name}. Take a rest.`);
    } else {
      const { catName, subName } = getCatInfo(drill);
      const phrase = [drill.name, catName, subName].filter(Boolean).join(", ");
      speak(phrase);
    }
    if (isTimedDrill(drill)) {
      setTimeLeft(drill.duration);
    }
  }, [drillIdx, phase]);
  useEffect(() => {
    if (
      phase !== "running" ||
      !currentDrill ||
      !isTimedDrill(currentDrill) ||
      paused
    ) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          recordDrillTime();
          advanceDrill();
          return 0;
        }
        if (t === 31 && !warnedRef.current) {
          warnedRef.current = true;
          speak("30 seconds remaining");
        }
        return t - 1;
      });
      setTotalElapsed((p) => p + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, drillIdx, paused, currentDrill]);
  const recordDrillTime = () => {
    const elapsed = Math.round((Date.now() - drillStartRef.current) / 1000);
    setDrillStats((p) => {
      const arr = [...p];
      arr[drillIdx] = { ...arr[drillIdx], timeSpent: elapsed };
      return arr;
    });
  };
  const advanceDrill = () => {
    if (!selectedWorkout) return;
    if (selectedWorkout.drills[drillIdx]?.type === "break") {
      setLastBreakIdx(drillIdx);
    }
    const nextIdx = drillIdx + 1;
    if (nextIdx >= selectedWorkout.drills.length) {
      speak("Workout complete. Great work!");
      setPhase("summary");
    } else {
      speak("Next drill");
      setDrillIdx(nextIdx);
    }
  };
  const recordShot = (made: boolean) => {
    setDrillStats((p) => {
      const arr = [...p];
      const cur = arr[drillIdx];
      const newMakes = cur.makes + (made ? 1 : 0);
      const newAttempts = cur.attempts + 1;
      arr[drillIdx] = { ...cur, attempts: newAttempts, makes: newMakes };
      const drill = selectedWorkout?.drills[drillIdx];
      if (drill?.mode === "makes" && newMakes >= drill.reps) {
        setTimeout(() => {
          recordDrillTime();
          advanceDrill();
        }, 300);
      } else if (drill?.mode === "attempts" && newAttempts >= drill.reps) {
        setTimeout(() => {
          recordDrillTime();
          advanceDrill();
        }, 300);
      }
      return arr;
    });
  };
  const skipDrill = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    recordDrillTime();
    advanceDrill();
  };
  const saveSession = () => {
    if (!selectedWorkout) return;
    const session: Session = {
      id: uid(),
      workoutId: selectedWorkout.id,
      workoutName: selectedWorkout.name,
      date: new Date().toISOString(),
      totalTime: totalElapsed,
      drills: selectedWorkout.drills.map((drill, i) => ({
        drillId: drill.id,
        drillName: drill.name,
        catId: drill.catId,
        subId: drill.subId,
        makes: drillStats[i]?.makes ?? 0,
        attempts: drillStats[i]?.attempts ?? 0,
        timeSpent: drillStats[i]?.timeSpent ?? 0,
      })),
    };
    onSessionSaved(session);
    setPhase("select");
    setSelectedWorkout(null);
  };
  // ── SELECT PHASE ──
  if (phase === "select") {
    return (
      <div className="page">
        <h1 className="section-title">Run Workout</h1>
        {workouts.length === 0 && (
          <div className="empty">
            <div className="empty-icon"> </div>
            <p>No workouts saved. Create one first.</p>
          </div>
        )}
        {workouts.map((w) => (
          <div key={w.id} className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{w.name}</div>
                <div className="card-meta">{w.drills.length} drills</div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => startWorkout(w)}
              >
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // ── RUNNING PHASE ──
  if (phase === "running" && currentDrill && selectedWorkout) {
    const isBreak = currentDrill.type === "break";
    const isTimed = isTimedDrill(currentDrill);
    const circumference = 2 * Math.PI * 80;
    const progress = isTimed ? timeLeft / (currentDrill.duration || 1) : 0;
    const dashOffset = circumference * (1 - progress);
    const { catName, subName } = getCatInfo(currentDrill);
    const exerciseWindowIndices = selectedWorkout.drills
      .map((d, i) => ({ d, i }))
      .filter(
        ({ d, i }) => i > lastBreakIdx && i < drillIdx && d.type !== "break"
      )
      .map(({ i }) => i);
    const adjustBreakStat = (
      i: number,
      field: "makes" | "attempts",
      delta: number
    ) => {
      setDrillStats((prev) => {
        const arr = [...prev];
        const cur = { ...arr[i] };
        if (field === "makes") {
          cur.makes = Math.max(0, Math.min(cur.makes + delta, cur.attempts));
        } else {
          const next = Math.max(0, cur.attempts + delta);
          cur.attempts = next;
          if (cur.makes > next) cur.makes = next;
        }
        arr[i] = cur;
        return arr;
      });
    };
    return (
      <div className="runner-wrap">
        {/* Progress dots */}
        <div className="drill-progress">
          {selectedWorkout.drills.map((d, i) => (
            <div
              key={i}
              className={`drill-dot ${
                i < drillIdx ? "done" : i === drillIdx ? "current" : ""
              }`}
              style={
                d.type === "break"
                  ? {
                      background:
                        i < drillIdx
                          ? "var(--gold)"
                          : i === drillIdx
                          ? "var(--gold)"
                          : undefined,
                      opacity: i === drillIdx ? 1 : undefined,
                    }
                  : {}
              }
            />
          ))}
        </div>
        {/* Drill name + badges */}
        <div style={{ textAlign: "center" }}>
          <div className="runner-drill-name">{currentDrill.name}</div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              marginTop: 6,
              flexWrap: "wrap",
            }}
          >
            {isBreak ? (
              <span className="badge badge-gold">Break</span>
            ) : (
              <>
                {catName && (
                  <span className="badge badge-orange">{catName}</span>
                )}
                {subName && <span className="badge badge-gold">{subName}</span>}
              </>
            )}
            <span className="badge badge-muted">
              {drillIdx + 1} / {selectedWorkout.drills.length}
            </span>
          </div>
        </div>
        {/* Timer */}
        {isTimed && (
          <div className="timer-ring">
            <svg viewBox="0 0 180 180">
              <circle className="ring-bg" cx="90" cy="90" r="80" />
              <circle
                className="ring-fg"
                cx="90"
                cy="90"
                r="80"
                style={{ stroke: isBreak ? "var(--gold)" : "var(--orange)" }}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="timer-center">
              <div
                className="timer-seconds"
                style={{ color: isBreak ? "var(--gold)" : "var(--orange)" }}
              >
                {fmt(timeLeft)}
              </div>
              <div className="timer-label">
                {paused ? "Paused" : isBreak ? "Rest" : "Remaining"}
              </div>
            </div>
          </div>
        )}
        {/* Makes/Attempts progress hint */}
        {!isBreak && !isTimed && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              {currentDrill.mode === "makes"
                ? `Target: ${currentStat.makes} / ${currentDrill.reps} makes`
                : `Target: ${currentStat.attempts} / ${currentDrill.reps} attempts`}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              Auto-advances when target is reached
            </div>
          </div>
        )}
        {/* BREAK: per-exercise shot editor */}
        {isBreak && (
          <div style={{ width: "100%", overflowY: "auto" }}>
            {exerciseWindowIndices.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: 13,
                }}
              >
                No exercises before this break to review.
              </p>
            ) : (
              <>
                <div
                  className="section-subtitle"
                  style={{ textAlign: "center", marginBottom: 10 }}
                >
                  Adjust shots from this set
                </div>
                {exerciseWindowIndices.map((i) => {
                  const d = selectedWorkout.drills[i];
                  const s = drillStats[i] ?? {
                    makes: 0,
                    attempts: 0,
                    timeSpent: 0,
                  };
                  const drillPct = pct(s.makes, s.attempts);
                  return (
                    <div
                      key={d.id}
                      className="card"
                      style={{ marginBottom: 8 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <div className="card-title" style={{ fontSize: 14 }}>
                          {d.name}
                        </div>
                        <span
                          className={`badge ${
                            s.attempts === 0
                              ? "badge-muted"
                              : parseFloat(drillPct) >= 50
                              ? "badge-green"
                              : "badge-orange"
                          }`}
                        >
                          {drillPct}
                        </span>
                      </div>
                      {/* Makes row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            width: 70,
                          }}
                        >
                          Makes
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: "4px 12px",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                            onClick={() => adjustBreakStat(i, "makes", -1)}
                            disabled={s.makes === 0}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              minWidth: 28,
                              textAlign: "center",
                              color: "var(--green)",
                            }}
                          >
                            {s.makes}
                          </span>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: "4px 12px",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                            onClick={() => adjustBreakStat(i, "makes", 1)}
                            disabled={s.makes >= s.attempts}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {/* Attempts row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "var(--muted)",
                            width: 70,
                          }}
                        >
                          Attempts
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: "4px 12px",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                            onClick={() => adjustBreakStat(i, "attempts", -1)}
                            disabled={s.attempts === 0}
                          >
                            −
                          </button>
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              minWidth: 28,
                              textAlign: "center",
                            }}
                          >
                            {s.attempts}
                          </span>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: "4px 12px",
                              fontSize: 16,
                              fontWeight: 700,
                            }}
                            onClick={() => adjustBreakStat(i, "attempts", 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
        {/* EXERCISE: Made / Missed */}
        {!isBreak && (
          <>
            <div className="shot-btns">
              <button
                className="shot-btn shot-btn-made"
                onClick={() => recordShot(true)}
              >
                MADE
              </button>
              <button
                className="shot-btn shot-btn-missed"
                onClick={() => recordShot(false)}
              >
                MISS
              </button>
            </div>
            <div className="drill-stats">
              <div className="stat-box">
                <div className="stat-box-val">{currentStat.makes}</div>
                <div className="stat-box-lbl">Makes</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val">{currentStat.attempts}</div>
                <div className="stat-box-lbl">Attempts</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val">
                  {pct(currentStat.makes, currentStat.attempts)}
                </div>
                <div className="stat-box-lbl">%</div>
              </div>
            </div>
          </>
        )}
        {/* Controls */}
        <div style={{ display: "flex", gap: 8, width: "100%" }}>
          {isTimed && (
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? "▶ Resume" : " Pause"}
            </button>
          )}
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={skipDrill}
          >
            Skip →
          </button>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          Total elapsed: {fmt(totalElapsed)}
        </div>
      </div>
    );
  }
  // ── SUMMARY PHASE ──
  if (phase === "summary" && selectedWorkout) {
    const totalAttempts = drillStats.reduce(
      (a, s, i) =>
        selectedWorkout.drills[i]?.type === "break" ? a : a + s.attempts,
      0
    );
    const totalMakes = drillStats.reduce(
      (a, s, i) =>
        selectedWorkout.drills[i]?.type === "break" ? a : a + s.makes,
      0
    );
    const shootingPct = pct(totalMakes, totalAttempts);
    const adjustStat = (
      i: number,
      field: "makes" | "attempts",
      delta: number
    ) => {
      setDrillStats((prev) => {
        const arr = [...prev];
        const cur = { ...arr[i] };
        if (field === "makes") {
          cur.makes = Math.max(0, Math.min(cur.makes + delta, cur.attempts));
        } else {
          const next = Math.max(0, cur.attempts + delta);
          cur.attempts = next;
          if (cur.makes > next) cur.makes = next;
        }
        arr[i] = cur;
        return arr;
      });
    };
    return (
      <div className="page">
        <div className="summary-header">
          <div className="summary-emoji"> </div>
          <div className="summary-title">Workout Complete!</div>
          <div className="summary-pct">{shootingPct}</div>
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            Shooting Percentage
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-val">{fmt(totalElapsed)}</div>
            <div className="stat-card-lbl">Total Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-val">{totalMakes}</div>
            <div className="stat-card-lbl">Makes</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-val">{totalAttempts}</div>
            <div className="stat-card-lbl">Attempts</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-val">{selectedWorkout.drills.length}</div>
            <div className="stat-card-lbl">Drills</div>
          </div>
        </div>
        <div className="section-subtitle mt-16">Drill Breakdown</div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
          Adjust makes and attempts for any drill before saving.
        </p>
        {selectedWorkout.drills.map((d, i) => {
          if (d.type === "break") return null;
          const s = drillStats[i] ?? { makes: 0, attempts: 0, timeSpent: 0 };
          const drillPct = pct(s.makes, s.attempts);
          return (
            <div key={d.id} className="card" style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div className="card-title">{d.name}</div>
                <span
                  className={`badge ${
                    s.attempts === 0
                      ? "badge-muted"
                      : parseFloat(drillPct) >= 50
                      ? "badge-green"
                      : "badge-orange"
                  }`}
                >
                  {drillPct}
                </span>
              </div>
              {/* Makes row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{ fontSize: 13, color: "var(--muted)", width: 70 }}
                >
                  Makes
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 12px",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                    onClick={() => adjustStat(i, "makes", -1)}
                    disabled={s.makes === 0}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      minWidth: 28,
                      textAlign: "center",
                      color: "var(--green)",
                    }}
                  >
                    {s.makes}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 12px",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                    onClick={() => adjustStat(i, "makes", 1)}
                    disabled={s.makes >= s.attempts}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Attempts row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ fontSize: 13, color: "var(--muted)", width: 70 }}
                >
                  Attempts
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 12px",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                    onClick={() => adjustStat(i, "attempts", -1)}
                    disabled={s.attempts === 0}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      minWidth: 28,
                      textAlign: "center",
                    }}
                  >
                    {s.attempts}
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{
                      padding: "4px 12px",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                    onClick={() => adjustStat(i, "attempts", 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button
          className="btn btn-primary btn-full btn-lg mt-16"
          onClick={saveSession}
        >
          Save Session
        </button>
        <button
          className="btn btn-ghost btn-full mt-8"
          onClick={() => setPhase("select")}
          style={{ marginTop: 8 }}
        >
          Discard & Exit
        </button>
      </div>
    );
  }
  return null;
}
// ─────────────────────────────────────────────
// GOAL COLOR HELPERS
// diff = actualPct - goal
// >= 10 → green
// 0–9 → yellow
// -5–-1 → orange
// < -5 → red
// ─────────────────────────────────────────────
function goalBadgeStyle(
  actualPct: number | null,
  goal: number
): React.CSSProperties {
  if (actualPct === null)
    return { background: "var(--surface3)", color: "var(--muted)" };
  const diff = actualPct - goal;
  if (diff >= 10)
    return { background: "rgba(34,197,94,.18)", color: "var(--green)" };
  if (diff >= 0)
    return { background: "rgba(250,204,21,.15)", color: "#FACC15" };
  if (diff >= -5)
    return { background: "rgba(255,107,26,.15)", color: "var(--orange)" };
  return { background: "rgba(239,68,68,.15)", color: "var(--red)" };
}
function goalBarColor(actualPct: number | null, goal: number): string {
  if (actualPct === null) return "var(--muted)";
  const diff = actualPct - goal;
  if (diff >= 10) return "var(--green)";
  if (diff >= 0) return "#FACC15";
  if (diff >= -5) return "var(--orange)";
  return "var(--red)";
}
// ─────────────────────────────────────────────
// STATS PAGE
// ─────────────────────────────────────────────
interface CategoryStat extends Category {
  makes: number;
  attempts: number;
}
interface SubcategoryStat extends Subcategory {
  catName: string;
  makes: number;
  attempts: number;
}
type StatsTab = "global" | "category" | "sub";
interface StatsPageProps {
  sessions: Session[];
  setSessions: (v: Session[] | ((prev: Session[]) => Session[])) => void;
  categories: Category[];
}
function StatsPage({ sessions, setSessions, categories }: StatsPageProps) {
  const [tab, setTab] = useState<StatsTab>("global");
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const resetHistory = () => {
    setSessions([]);
    setConfirmReset(false);
  };
  const globalStats = (() => {
    let workouts = sessions.length;
    let time = 0,
      attempts = 0,
      makes = 0;
    sessions.forEach((s) => {
      time += s.totalTime ?? 0;
      s.drills.forEach((d) => {
        attempts += d.attempts;
        makes += d.makes;
      });
    });
    return { workouts, time, attempts, makes };
  })();
  const catStats: CategoryStat[] = (() => {
    const map: Record<string, { makes: number; attempts: number }> = {};
    sessions.forEach((s) => {
      s.drills.forEach((d) => {
        if (!d.catId) return;
        if (!map[d.catId]) map[d.catId] = { makes: 0, attempts: 0 };
        map[d.catId].makes += d.makes;
        map[d.catId].attempts += d.attempts;
      });
    });
    return categories
      .map((c) => ({ ...c, ...(map[c.id] ?? { makes: 0, attempts: 0 }) }))
      .filter((c) => c.attempts > 0)
      .sort((a, b) => b.attempts - a.attempts);
  })();
  const subStats: SubcategoryStat[] = (() => {
    const map: Record<
      string,
      { makes: number; attempts: number; catId: string }
    > = {};
    sessions.forEach((s) => {
      s.drills.forEach((d) => {
        if (!d.subId) return;
        if (!map[d.subId])
          map[d.subId] = { makes: 0, attempts: 0, catId: d.catId ?? "" };
        map[d.subId].makes += d.makes;
        map[d.subId].attempts += d.attempts;
      });
    });
    const result: SubcategoryStat[] = [];
    categories.forEach((c) => {
      c.subcategories.forEach((s) => {
        if (map[s.id]) {
          result.push({
            ...s,
            catName: c.name,
            goal: s.goal ?? 50,
            ...map[s.id],
          });
        }
      });
    });
    return result.sort((a, b) => b.attempts - a.attempts);
  })();
  const maxAttempts = Math.max(...catStats.map((c) => c.attempts), 1);
  const maxSubAttempts = Math.max(...subStats.map((s) => s.attempts), 1);
  const TABS: { id: StatsTab; label: string }[] = [
    { id: "global", label: "Global" },
    { id: "category", label: "Category" },
    { id: "sub", label: "Subcategory" },
  ];
  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 className="section-title" style={{ marginBottom: 0 }}>
          Stats
        </h1>
        {sessions.length > 0 && !confirmReset && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setConfirmReset(true)}
          >
            <Icon.Trash /> Reset History
          </button>
        )}
      </div>
      {confirmReset && (
        <div
          className="card"
          style={{ marginBottom: 16, borderColor: "var(--red)" }}
        >
          <p style={{ fontSize: 14, marginBottom: 12 }}>
            Delete all workout history? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger btn-sm" onClick={resetHistory}>
              Yes, delete everything
            </button>
          </div>
        </div>
      )}
      <div className="tab-row" style={{ marginBottom: 16 }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-pill ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "global" && (
        <>
          {sessions.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"> </div>
              <p>No sessions yet. Complete a workout to see stats.</p>
            </div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-val">{globalStats.workouts}</div>
                  <div className="stat-card-lbl">Workouts</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-val">{fmt(globalStats.time)}</div>
                  <div className="stat-card-lbl">Time Trained</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-val">{globalStats.attempts}</div>
                  <div className="stat-card-lbl">Total Shots</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-val">
                    {pct(globalStats.makes, globalStats.attempts)}
                  </div>
                  <div className="stat-card-lbl">Overall %</div>
                </div>
              </div>
              <div className="section-subtitle mt-16">Recent Sessions</div>
              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Workout</th>
                      <th>Date</th>
                      <th>Makes</th>
                      <th>Att</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...sessions]
                      .reverse()
                      .slice(0, 10)
                      .map((s) => {
                        const att = s.drills.reduce(
                          (a, d) => a + d.attempts,
                          0
                        );
                        const mk = s.drills.reduce((a, d) => a + d.makes, 0);
                        return (
                          <tr key={s.id}>
                            <td>{s.workoutName}</td>
                            <td style={{ color: "var(--muted)" }}>
                              {new Date(s.date).toLocaleDateString()}
                            </td>
                            <td>{mk}</td>
                            <td>{att}</td>
                            <td>{pct(mk, att)}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
      {tab === "category" && (
        <>
          {catStats.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"> </div>
              <p>No category data yet. Tag your drills with categories.</p>
            </div>
          ) : (
            <>
              <div className="section-subtitle">Attempts by Category</div>
              <div className="card">
                <div className="bar-chart">
                  {catStats.map((c) => {
                    const actualPct =
                      c.attempts > 0
                        ? Math.round((c.makes / c.attempts) * 100)
                        : null;
                    const goal = c.goal ?? 50;
                    return (
                      <div key={c.id} className="bar-row">
                        <div className="bar-label">
                          <span>{c.name}</span>
                          <span style={{ color: "var(--muted)" }}>
                            {c.attempts} attempts
                          </span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${(c.attempts / maxAttempts) * 100}%`,
                              background: goalBarColor(actualPct, goal),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="section-subtitle mt-16">Category Table</div>
              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Makes</th>
                      <th>Att</th>
                      <th>Goal</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catStats.map((c) => {
                      const actualPct =
                        c.attempts > 0
                          ? Math.round((c.makes / c.attempts) * 100)
                          : null;
                      const goal = c.goal ?? 50;
                      const badgeStyle = goalBadgeStyle(actualPct, goal);
                      return (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.makes}</td>
                          <td>{c.attempts}</td>
                          <td style={{ color: "var(--muted)" }}>{goal}%</td>
                          <td>
                            <span className="badge" style={badgeStyle}>
                              {actualPct !== null ? `${actualPct}%` : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
      {tab === "sub" && (
        <>
          {subStats.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"> </div>
              <p>No subcategory data yet.</p>
            </div>
          ) : (
            <>
              <div className="section-subtitle">Attempts by Subcategory</div>
              <div className="card">
                <div className="bar-chart">
                  {subStats.map((s) => {
                    const actualPct =
                      s.attempts > 0
                        ? Math.round((s.makes / s.attempts) * 100)
                        : null;
                    const goal = s.goal ?? 50;
                    return (
                      <div key={s.id} className="bar-row">
                        <div className="bar-label">
                          <span>
                            {s.name}{" "}
                            <span
                              style={{
                                color: "var(--muted)",
                                fontWeight: 400,
                                fontSize: 11,
                              }}
                            >
                              {s.catName}
                            </span>
                          </span>
                          <span style={{ color: "var(--muted)" }}>
                            {s.attempts} attempts
                          </span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${(s.attempts / maxSubAttempts) * 100}%`,
                              background: goalBarColor(actualPct, goal),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="section-subtitle mt-16">Subcategory Table</div>
              <div className="card" style={{ overflowX: "auto" }}>
                <table className="table" style={{ minWidth: 480 }}>
                  <thead>
                    <tr>
                      <th>Subcategory</th>
                      <th>Category</th>
                      <th>Makes</th>
                      <th>Att</th>
                      <th>Goal</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subStats.map((s) => {
                      const actualPct =
                        s.attempts > 0
                          ? Math.round((s.makes / s.attempts) * 100)
                          : null;
                      const goal = s.goal ?? 50;
                      const badgeStyle = goalBadgeStyle(actualPct, goal);
                      return (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td style={{ color: "var(--muted)", fontSize: 12 }}>
                            {s.catName}
                          </td>
                          <td>{s.makes}</td>
                          <td>{s.attempts}</td>
                          <td style={{ color: "var(--muted)" }}>{goal}%</td>
                          <td>
                            <span className="badge" style={badgeStyle}>
                              {actualPct !== null ? `${actualPct}%` : "—"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-3pt",
    name: "3PT",
    subcategories: [
      { id: "sub-cl", name: "Corner Left" },
      { id: "sub-cr", name: "Corner Right" },
      { id: "sub-wl", name: "Wing Left" },
      { id: "sub-wr", name: "Wing Right" },
      { id: "sub-tok", name: "Top of Key" },
    ],
  },
  {
    id: "cat-mid",
    name: "Midrange",
    subcategories: [
      { id: "sub-bl", name: "Baseline Left" },
      { id: "sub-br", name: "Baseline Right" },
      { id: "sub-elbow", name: "Elbow" },
    ],
  },
  { id: "cat-ft", name: "Free Throws", subcategories: [] },
  {
    id: "cat-fin",
    name: "Finishing",
    subcategories: [
      { id: "sub-layup", name: "Layups" },
      { id: "sub-floater", name: "Floaters" },
    ],
  },
];
type TabId = "categories" | "workouts" | "run" | "stats";
interface TabDef {
  id: TabId;
  label: string;
  Icon: () => JSX.Element;
}
export default function App() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
  const [tab, setTab] = useState<TabId>("run");
  const [categories, setCategories] = useLS<Category[]>(
    "cs-categories",
    DEFAULT_CATEGORIES
  );
  const [workouts, setWorkouts] = useLS<Workout[]>("cs-workouts", []);
  const [sessions, setSessions] = useLS<Session[]>("cs-sessions", []);
  const addSession = (session: Session) => {
    setSessions((p) => [...p, session]);
  };
  const TABS: TabDef[] = [
    { id: "categories", label: "Categories", Icon: Icon.Cat },
    { id: "workouts", label: "Workouts", Icon: Icon.Workout },
    { id: "run", label: "Run", Icon: Icon.Run },
    { id: "stats", label: "Stats", Icon: Icon.Stats },
  ];
  return (
    <div className="app">
      <header className="top-bar">
        <div className="logo">
          <span>Court</span>Session
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </div>
      </header>
      {tab === "categories" && (
        <CategoryPage categories={categories} setCategories={setCategories} />
      )}
      {tab === "workouts" && (
        <WorkoutPage
          workouts={workouts}
          setWorkouts={setWorkouts}
          categories={categories}
        />
      )}
      {tab === "run" && (
        <RunPage
          workouts={workouts}
          categories={categories}
          onSessionSaved={addSession}
        />
      )}
      {tab === "stats" && (
        <StatsPage
          sessions={sessions}
          setSessions={setSessions}
          categories={categories}
        />
      )}
      <nav className="nav">
        {TABS.map(({ id, label, Icon: Ic }) => (
          <button
            key={id}
            className={`nav-btn ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
          >
            <Ic />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
