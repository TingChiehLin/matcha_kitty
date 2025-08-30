'use client';
import React, { useEffect, useMemo, useReducer, useState } from 'react';



type ActivityKey =
  | 'chat'
  | 'read'
  | 'walk'
  | 'chess'
  | 'videoCall'
  | 'meal'
  | 'music'
  | 'puzzle';



type Language = 'en' | 'zh' | 'any';

interface SafetyPrefs {
  language: Language;
  pair: boolean; // paired visit
  verifiedOnly: boolean;
  place: 'ward' | 'lounge' | 'garden';
}

interface TimePrefs {
  quick: 'now' | 'today-pm' | 'tomorrow-am' | null;
  startAfter: string; // 'HH:MM'
  endBefore: string; // 'HH:MM'
  duration: number; // minutes
}

interface State {
  step: 1 | 2 | 3 | 4;
  activities: ActivityKey[];
  time: TimePrefs;
  safety: SafetyPrefs;
  hospital: string;
  ward: string;
  // selection
  selectedIds: string[]; // 1 or 2
}

type Action =
  | { type: 'SET_STEP'; step: State['step'] }
  | { type: 'TOGGLE_ACTIVITY'; key: ActivityKey }
  | { type: 'SET_TIME'; partial: Partial<TimePrefs> }
  | { type: 'SET_SAFETY'; partial: Partial<SafetyPrefs> }
  | { type: 'SET_LOCATION'; hospital?: string; ward?: string }
  | { type: 'TOGGLE_SELECT'; id: string }
  | { type: 'RESET_SELECTION' };

const initialState: State = {
  step: 1,
  activities: [],
  time: {
    quick: null,
    startAfter: '14:00',
    endBefore: '16:00',
    duration: 30,
  },
  safety: {
    language: 'any',
    pair: false,
    verifiedOnly: true,
    place: 'lounge',
  },
  hospital: 'RPA (Demo)',
  ward: 'E3',
  selectedIds: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'TOGGLE_ACTIVITY': {
      const exists = state.activities.includes(action.key);
      const activities = exists
        ? state.activities.filter((k) => k !== action.key)
        : [...state.activities, action.key];
      return { ...state, activities };
    }
    case 'SET_TIME':
      return { ...state, time: { ...state.time, ...action.partial } };
    case 'SET_SAFETY':
      return { ...state, safety: { ...state.safety, ...action.partial } };
    case 'SET_LOCATION':
      return {
        ...state,
        hospital: action.hospital ?? state.hospital,
        ward: action.ward ?? state.ward,
      };
    case 'TOGGLE_SELECT': {
      const selected = new Set(state.selectedIds);
      if (selected.has(action.id)) selected.delete(action.id);
      else {
        if (state.safety.pair) {
          if (selected.size >= 2) {
            // replace the first one selected (FIFO)
            const first = state.selectedIds[0];
            selected.delete(first);
          }
          selected.add(action.id);
        } else {
          selected.clear();
          selected.add(action.id);
        }
      }
      return { ...state, selectedIds: Array.from(selected) };
    }
    case 'RESET_SELECTION':
      return { ...state, selectedIds: [] };
  }
}

// —— Accessibility helpers ——
function useSpeech() {
  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    try {
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; // switch to 'zh-CN' if needed
      synth.speak(u);
    } catch {
      // no-op in browsers without TTS
    }
  };
  const stop = () => {
    if (typeof window === 'undefined') return;
    try {
      window.speechSynthesis?.cancel();
    } catch {}
  };
  return { speak, stop };
}

// —— Mock data & matching ——
interface Candidate {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  policeCheck: boolean;
  agedCareTraining: boolean;
  languages: Language[];
  gender: 'male' | 'female';
  skills: ActivityKey[];
  wardAccess: string[]; 
  rating: number; 
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function overlapMinutes(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const s1 = timeToMinutes(aStart);
  const e1 = timeToMinutes(aEnd);
  const s2 = timeToMinutes(bStart);
  const e2 = timeToMinutes(bEnd);
  const s = Math.max(s1, s2);
  const e = Math.min(e1, e2);
  return Math.max(0, e - s);
}

function getWardVisitingWindow(ward: string): { start: string; end: string } {
  // Demo rules: E3 09:00–17:00, D2 10:00–18:00, default 09:00–17:00
  switch (ward) {
    case 'E3':
      return { start: '09:00', end: '17:00' };
    case 'D2':
      return { start: '10:00', end: '18:00' };
    default:
      return { start: '09:00', end: '17:00' };
  }
}

// —— UI atoms ——
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section className="mb-6">
    <h2 className="text-2xl font-bold mb-1">{title}</h2>
    {subtitle && <p className="text-neutral-600 mb-3">{subtitle}</p>}
    <div className="space-y-3">{children}</div>
  </section>
);

const Chip: React.FC<{
  label: string; icon?: string; selected?: boolean; onClick?: () => void; ariaLabel?: string;
}> = ({ label, icon, selected, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-pressed={!!selected}
    aria-label={ariaLabel || label}
    className={`flex items-center justify-center gap-2 rounded-2xl border text-lg px-4 py-4 min-h-[64px] focus:outline-none focus:ring-4 transition
      ${selected ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50'}
    `}
  >
    {icon && <span className="text-2xl" aria-hidden>{icon}</span>}
    <span className="font-semibold">{label}</span>
  </button>
);

const ToggleRow: React.FC<{
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}> = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between rounded-xl border bg-white p-4">
    <div>
      <div className="font-semibold">{label}</div>
      {desc && <div className="text-sm text-neutral-600">{desc}</div>}
    </div>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-16 h-9 rounded-full p-1 transition ${checked ? 'bg-emerald-600' : 'bg-neutral-300'}`}
    >
      <div className={`h-7 w-7 rounded-full bg-white transition ${checked ? 'translate-x-7' : ''}`}></div>
    </button>
  </div>
);

// —— Main Page Component ——
export default function SearchForConnectorPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<'base' | 'lg' | 'xl'>('lg');
  const [simplify, setSimplify] = useState(true);
  const { speak, stop } = useSpeech();
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingToken, setBookingToken] = useState<string | null>(null);

  // Validation: visiting hours
  const visiting = useMemo(() => getWardVisitingWindow(state.ward), [state.ward]);
  const outsideVisiting = useMemo(() => {
    const overlap = overlapMinutes(state.time.startAfter, state.time.endBefore, visiting.start, visiting.end);
    return overlap < state.time.duration;
  }, [state.time, visiting]);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates")
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(err => console.error("Failed to fetch candidates", err));
  }, []);


  const { results, pairs } = useMemo(() => {
    if (!candidates.length) return { results: [], pairs: [] };
    return computeMatches(state, candidates);
  }, [state, candidates]);

  function computeMatches(state: State, candidates: Candidate[]) {
    const {
      activities,
      safety: { language, verifiedOnly },
      ward,
      time: { startAfter, endBefore, duration },
    } = state;

    const visitingWindow = getWardVisitingWindow(ward);

    const results = candidates.filter((c) => {
      if (verifiedOnly && !c.verified) return false;
      if (!c.wardAccess?.includes(ward)) return false;

      if (language !== "any" && !c.languages?.includes(language)) return false;
      return true;
    }).map((c) => {
      const timeOverlap = overlapMinutes(
        startAfter,
        endBefore,
        visitingWindow.start,
        visitingWindow.end
      );
      const timeScore = Math.min(1, timeOverlap / duration);
      const actHit = activities.filter((a) => c.skills?.includes(a)).length;
      const actScore = activities.length ? actHit / activities.length : 0.5;
      const ratingScore = c.rating / 5;

      const score = 0.4 * timeScore + 0.35 * actScore + 0.25 * ratingScore;

      const why: string[] = [];
      if (timeScore >= 0.8) why.push("80%+ time overlap");
      else if (timeScore >= 0.5) why.push("Good time overlap");
      if (actHit > 0) why.push(`Activity match ${actHit}/${activities.length || 1}`);
      if (c.languages?.includes("zh")) why.push("Speaks Chinese");
      if (c.agedCareTraining) why.push("Aged-Care training");
      if (c.policeCheck) why.push("Police check");

      return { candidate: c, score, why };
    }).sort((a, b) => b.score - a.score);

    // Build pair suggestions
    const pairs: { ids: [string, string]; score: number; why: string }[] = [];
    for (let i = 0; i < Math.min(4, results.length); i++) {
      for (let j = i + 1; j < Math.min(6, results.length); j++) {
        const A = results[i];
        const B = results[j];
        const combinedSkills = new Set([
          ...(A.candidate.skills || []),
          ...(B.candidate.skills || [])
        ]);
        const cover = activities.filter((a) => combinedSkills.has(a)).length;
        const coverScore = activities.length ? cover / activities.length : 0.6;
        const avg = (A.score + B.score) / 2;
        const s = 0.6 * avg + 0.4 * coverScore;
        const why = `Safer • Activity coverage ${cover}/${activities.length || 1}`;
        pairs.push({ ids: [A.candidate.id, B.candidate.id], score: s, why });
      }
    }
    pairs.sort((a, b) => b.score - a.score);

    return { results, pairs: pairs.slice(0, 3) };
  }


  const containerTextClass = textScale === 'base' ? 'text-[17px]' : textScale === 'lg' ? 'text-[19px]' : 'text-[21px]';
  const containerClass = `${highContrast ? 'bg-white text-black' : 'bg-neutral-50 text-neutral-900'} ${containerTextClass}`;

  // Booking confirm
  const canBook = state.selectedIds.length > 0 && !outsideVisiting;
  function onBook() {
    const token = `QR-${Date.now().toString(36)}-${state.selectedIds.join('-')}`;
    setBookingToken(token);
    setShowConfirm(true);
  }

  const stepTitle = [
    'What would you like to do?',
    'When works for you?',
    'Comfort & Safety',
    'Matches',
  ][state.step - 1];

  return (
    <main className={containerClass}>
      {/* Top bar */}
      <div className={`sticky top-0 z-30 ${highContrast ? 'bg-yellow-200' : 'bg-white/90 backdrop-blur'} border-b`}>
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold">CommunityConnector</div>
            <div className="hidden md:block text-sm opacity-80">Search for Connector</div>
          </div>
          <div className="flex items-center gap-2">


          </div>
        </div>

      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Stepper */}
        <div className="mb-6">
          <ol className="flex items-center justify-between gap-2">
            {[1,2,3,4].map((s) => (
              <li key={s} className="flex-1">
                <button
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${state.step===s? (highContrast?'bg-yellow-300 border-black':'bg-emerald-50 border-emerald-500') : 'bg-white'}`}
                  onClick={() => dispatch({ type: 'SET_STEP', step: s as State['step'] })}
                >
                  {s===1 && '① Activities'}{s===2 && '② Time'}{s===3 && '③ Comfort'}{s===4 && '④ Matches'}
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* Step content */}
        {state.step === 1 && (
          <>
            <Section title="① What would you like to do?" subtitle="Pick 1–3 (multi-select)">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Chip label="Chat" icon="💬" selected={state.activities.includes('chat')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'chat' })} />
                <Chip label="Read" icon="📖" selected={state.activities.includes('read')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'read' })} />
                <Chip label="Walk" icon="🚶" selected={state.activities.includes('walk')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'walk' })} />
                <Chip label="Chess/Board games" icon="♟️" selected={state.activities.includes('chess')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'chess' })} />
                <Chip label="Video call family" icon="📞" selected={state.activities.includes('videoCall')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'videoCall' })} />
                <Chip label="Meal companion" icon="🍵" selected={state.activities.includes('meal')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'meal' })} />
                <Chip label="Music" icon="🎵" selected={state.activities.includes('music')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'music' })} />
                <Chip label="Puzzle/Crafts" icon="🧩" selected={state.activities.includes('puzzle')} onClick={() => dispatch({ type: 'TOGGLE_ACTIVITY', key: 'puzzle' })} />
              </div>
            </Section>

            <div className="flex justify-between">
              <div />
              <button className="rounded-2xl bg-emerald-600 text-white px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>Next → Time</button>
            </div>
          </>
        )}

        {state.step === 2 && (
          <>
            <Section title="② When works for you?" subtitle={`Ward ${state.ward} visiting hours ${visiting.start}–${visiting.end}`}>
              <div className="flex flex-wrap gap-2">
                <Chip label="Now (within 1h)" selected={state.time.quick==='now'} onClick={() => dispatch({ type: 'SET_TIME', partial: { quick: 'now' } })} />
                <Chip label="This afternoon" selected={state.time.quick==='today-pm'} onClick={() => dispatch({ type: 'SET_TIME', partial: { quick: 'today-pm', startAfter: '13:00', endBefore: '17:00' } })} />
                <Chip label="Tomorrow morning" selected={state.time.quick==='tomorrow-am'} onClick={() => dispatch({ type: 'SET_TIME', partial: { quick: 'tomorrow-am', startAfter: '09:00', endBefore: '12:00' } })} />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">Earliest start</label>
                  <input type="time" value={state.time.startAfter} onChange={(e)=>dispatch({ type: 'SET_TIME', partial: { startAfter: e.target.value } })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">Latest end</label>
                  <input type="time" value={state.time.endBefore} onChange={(e)=>dispatch({ type: 'SET_TIME', partial: { endBefore: e.target.value } })} className="w-full rounded-lg border px-3 py-2" />
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">Duration (minutes)</label>
                  <input type="range" min={15} max={60} step={15} value={state.time.duration} onChange={(e)=>dispatch({ type: 'SET_TIME', partial: { duration: Number(e.target.value) } })} className="w-full" />
                  <div className="mt-2 text-lg font-semibold">{state.time.duration} min</div>
                </div>
              </div>

              {outsideVisiting && (
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4">
                  <div className="font-semibold text-red-700">Outside visiting hours</div>
                  <div className="text-sm text-red-700">Please adjust to {visiting.start}–{visiting.end}, or shorten the duration.</div>
                </div>
              )}
            </Section>

            <div className="flex justify-between">
              <button className="rounded-2xl border px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>← Back</button>
              <button className="rounded-2xl bg-emerald-600 text-white px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}>Next → Comfort</button>
            </div>
          </>
        )}

        {state.step === 3 && (
          <>
            <Section title="③ Comfort & Safety" subtitle="We prioritise your safety and comfort. Choose paired visits, verified-only, and more.">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border bg-white p-4">
                  <div className="font-semibold mb-2">Language</div>
                  <div className="flex gap-2 flex-wrap">
                    <Chip label="Any" selected={state.safety.language==='any'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { language: 'any' } })} />
                    <Chip label="Chinese" selected={state.safety.language==='zh'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { language: 'zh' } })} />
                    <Chip label="English" selected={state.safety.language==='en'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { language: 'en' } })} />
                  </div>
                </div>



                <div className="sm:col-span-2">
                  <ToggleRow label="Paired visit (safer)" checked={state.safety.pair} onChange={(v)=>dispatch({ type: 'SET_SAFETY', partial: { pair: v } })} desc="Recommended for longer walks or higher-risk wards" />
                </div>

                <div className="sm:col-span-2">
                  <ToggleRow label="Show verified only (USYD + checks)" checked={state.safety.verifiedOnly} onChange={(v)=>dispatch({ type: 'SET_SAFETY', partial: { verifiedOnly: v } })} />
                </div>

                <div className="rounded-xl border bg-white p-4 sm:col-span-2">
                  <div className="font-semibold mb-2">Place</div>
                  <div className="flex gap-2 flex-wrap">
                    <Chip label="Public lounge (recommended)" selected={state.safety.place==='lounge'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { place: 'lounge' } })} />
                    <Chip label="Ward" selected={state.safety.place==='ward'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { place: 'ward' } })} />
                    <Chip label="Garden" selected={state.safety.place==='garden'} onClick={()=>dispatch({ type: 'SET_SAFETY', partial: { place: 'garden' } })} />
                  </div>
                </div>

                <div className={`rounded-xl border p-4 sm:col-span-2 ${highContrast ? 'bg-yellow-100' : 'bg-emerald-50'}`}>
                  <div className="font-semibold">Safety reminders</div>
                  <ul className="list-disc pl-5 text-sm">
                    <li>All visits must check in at the front desk and use QR codes to enter/exit.</li>
                    <li>This is a volunteer companionship service — no fees or gifts.</li>
                  </ul>
                </div>
              </div>
            </Section>

            <div className="flex justify-between">
              <button className="rounded-2xl border px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}>← Back</button>
              <button className="rounded-2xl bg-emerald-600 text-white px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}>See matches →</button>
            </div>
          </>
        )}

        {state.step === 4 && (
          <>
            <Section title="④ Matches" subtitle="Recommended by match score, with a ‘Why matched’ explanation.">
              {results.length === 0 && (
                <div className="rounded-xl border p-6 text-center bg-white">
                  No matches yet. You may submit a request and we’ll notify you later.
                </div>
              )}

              <div className="space-y-3">
                {results.map(({ candidate, score, why }) => (
                  <div key={candidate.id} className={`rounded-2xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${state.selectedIds.includes(candidate.id)?'ring-4 ring-emerald-300':''}`}>
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-extrabold">{candidate.initials}</div>
                      <div>
                        <div className="font-bold text-xl flex items-center gap-2">{candidate.name} <span className="text-sm font-normal text-neutral-600">★{candidate.rating.toFixed(1)}</span></div>
                        <div className="text-sm text-neutral-600 flex flex-wrap gap-2">

                          {candidate.agedCareTraining && <Badge>Aged-Care</Badge>}
                          {candidate.languages.includes('zh') && <Badge>Chinese</Badge>}
                          {candidate.languages.includes('en') && <Badge>English</Badge>}
                        </div>
                        <div className="mt-1 text-sm"><span className="font-semibold">Why matched:</span> {why.join(' · ')} (Score {Math.round(score*100)})</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="rounded-xl border px-4 py-2" onClick={()=>alert('View profile (demo)')}>View profile</button>
                      <button
                        className={`rounded-xl px-4 py-2 font-semibold ${state.selectedIds.includes(candidate.id) ? 'bg-neutral-800 text-white' : 'bg-emerald-600 text-white'}`}
                        onClick={()=>dispatch({ type:'TOGGLE_SELECT', id: candidate.id })}
                      >{state.selectedIds.includes(candidate.id) ? 'Selected' : 'APPLY'}</button>
                    </div>
                  </div>
                ))}
              </div>

              {state.safety.pair && pairs.length>0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">Suggested pairs (safer)</h3>
                  <div className="space-y-3">
                    {pairs.map((p, idx) => (
                      <div key={idx} className="rounded-2xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {p.ids.map((id)=>{
                            const c = candidates.find(x=>x.id===id)!;
                            return (
                              <div key={id} className="flex items-center gap-3 border rounded-xl px-3 py-2">
                                <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-extrabold">{c.initials}</div>
                                <div>
                                  <div className="font-semibold">{c.name}</div>
                                  <div className="text-xs text-neutral-600">★{c.rating.toFixed(1)} · {c.languages.includes('zh')?'Chinese':''} {c.languages.includes('en')?'English':''}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-neutral-700">{p.why}</div>
                          <button
                            className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold"
                            onClick={()=>{
                              dispatch({ type: 'RESET_SELECTION' });
                              p.ids.forEach((id)=>dispatch({ type: 'TOGGLE_SELECT', id }));
                            }}
                          >Choose this pair</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <div className="flex justify-between">
              <button className="rounded-2xl border px-6 py-3 text-lg" onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}>← Back</button>
              <div />
            </div>
          </>
        )}
      </div>



      {/* Booking confirm modal (simple) */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal>
          <div className="max-w-lg w-full rounded-2xl bg-white p-6">
            <div className="text-2xl font-extrabold mb-2">Booking confirmed</div>
            <p className="text-neutral-700 mb-4">Please show this QR token at the front desk for check-in and exit.</p>
            <div className="rounded-xl border p-4 text-center">
              <div className="text-sm text-neutral-600 mb-2">QR Token</div>
              <div className="font-mono text-lg break-all">{bookingToken}</div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-xl border px-4 py-2" onClick={()=>{ setShowConfirm(false); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Small badge atom
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-white">{children}</span>
);
