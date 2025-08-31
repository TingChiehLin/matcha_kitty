"use client";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { ACTIVITIES } from "../lib/activities";
import { testcandidates } from "../lib/candidates";

type ActivityKey =
  | "chat"
  | "read"
  | "walk"
  | "chess"
  | "videoCall"
  | "meal"
  | "music"
  | "puzzle"
  | "cooking"
  | "chat"
  | "cooking"
  | "gardening"
  | "transport"
  | "music"
  | "teaching";

type Language = "en" | "zh" | "any" | "es";

interface SafetyPrefs {
  language: Language;
  pair: boolean;
  verifiedOnly: boolean;
  place: "ward" | "lounge" | "garden";
}

interface TimePrefs {
  quick: "now" | "today-pm" | "tomorrow-am" | null;
  startAfter: string;
  endBefore: string;
  duration: number;
}

interface State {
  step: 1 | 2 | 3;
  activities: ActivityKey[];
  time: TimePrefs;
  safety: SafetyPrefs;
  hospital: string;
  ward: string;
  selectedIds: string[];
}

type Action =
  | { type: "SET_STEP"; step: State["step"] }
  | { type: "TOGGLE_ACTIVITY"; key: ActivityKey }
  | { type: "SET_TIME"; partial: Partial<TimePrefs> }
  | { type: "SET_SAFETY"; partial: Partial<SafetyPrefs> }
  | { type: "SET_LOCATION"; hospital?: string; ward?: string }
  | { type: "TOGGLE_SELECT"; id: string }
  | { type: "RESET_SELECTION" };

const initialState: State = {
  step: 1,
  activities: [],
  time: {
    quick: null,
    startAfter: "14:00",
    endBefore: "16:00",
    duration: 30,
  },
  safety: {
    language: "any",
    pair: false,
    verifiedOnly: true,
    place: "lounge",
  },
  hospital: "RPA (Demo)",
  ward: "E3",
  selectedIds: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "TOGGLE_ACTIVITY": {
      const exists = state.activities.includes(action.key);
      const activities = exists
        ? state.activities.filter((k) => k !== action.key)
        : [...state.activities, action.key];
      return { ...state, activities };
    }
    case "SET_TIME":
      return { ...state, time: { ...state.time, ...action.partial } };
    case "SET_SAFETY":
      return { ...state, safety: { ...state.safety, ...action.partial } };
    case "SET_LOCATION":
      return {
        ...state,
        hospital: action.hospital ?? state.hospital,
        ward: action.ward ?? state.ward,
      };
    case "TOGGLE_SELECT": {
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
    case "RESET_SELECTION":
      return { ...state, selectedIds: [] };
  }
}

function useSpeech() {
  const speak = (text: string) => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    try {
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      synth.speak(u);
    } catch {}
  };
  const stop = () => {
    if (typeof window === "undefined") return;
    try {
      window.speechSynthesis?.cancel();
    } catch {}
  };
  return { speak, stop };
}

export interface Candidate {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  policeCheck: boolean;
  agedCareTraining: boolean;
  languages: Language[];
  gender: "male" | "female";
  skills: ActivityKey[];
  wardAccess: string[];
  rating: number;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function overlapMinutes(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  const s1 = timeToMinutes(aStart);
  const e1 = timeToMinutes(aEnd);
  const s2 = timeToMinutes(bStart);
  const e2 = timeToMinutes(bEnd);
  const s = Math.max(s1, s2);
  const e = Math.min(e1, e2);
  return Math.max(0, e - s);
}

function getWardVisitingWindow(ward: string): { start: string; end: string } {
  switch (ward) {
    case "E3":
      return { start: "09:00", end: "17:00" };
    case "D2":
      return { start: "10:00", end: "18:00" };
    default:
      return { start: "09:00", end: "17:00" };
  }
}

const Section: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="mb-6">
    <h2 className="text-2xl font-bold mb-1">{title}</h2>
    {subtitle && <p className="text-neutral-600 mb-3">{subtitle}</p>}
    <div className="space-y-3">{children}</div>
  </section>
);

const Chip: React.FC<{
  label: string;
  icon?: string;
  selected?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ label, icon, selected, onClick, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-pressed={!!selected}
    aria-label={ariaLabel || label}
    className={`flex items-center justify-center gap-2 rounded-2xl border-2 text-lg px-4 py-4 min-h-[64px] focus:outline-none focus:ring-4 transition
      ${
        selected
          ? "bg-purple-600 text-white"
          : "bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50"
      }
    `}
  >
    {icon && (
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
    )}
    <span className="font-semibold">{label}</span>
  </button>
);

export default function SearchForConnectorPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<"base" | "lg" | "xl">("lg");
  const { speak, stop } = useSpeech();

  const visiting = useMemo(
    () => getWardVisitingWindow(state.ward),
    [state.ward]
  );
  const outsideVisiting = useMemo(() => {
    const overlap = overlapMinutes(
      state.time.startAfter,
      state.time.endBefore,
      visiting.start,
      visiting.end
    );
    return overlap < state.time.duration;
  }, [state.time, visiting]);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    fetch("http://localhost:5000/api/candidates")
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.error("Failed to fetch candidates", err));
  }, []);

  const { results, pairs } = useMemo(() => {
    if (!candidates.length) return { results: [], pairs: [] };

    let filteredCandidates = candidates;
    if (state.step === 1) {
      filteredCandidates = candidates.filter((c) =>
        c.skills?.some((skill) => state.activities.includes(skill))
      );
    }

    return computeMatches(state, filteredCandidates);
  }, [state.step, state.activities, candidates]);

  function computeMatches(state: State, candidates: Candidate[]) {
    const {
      activities,
      safety: { language, verifiedOnly },
      ward,
      time: { startAfter, endBefore, duration },
    } = state;

    const visitingWindow = getWardVisitingWindow(ward);

    const results = candidates
      .filter((c) => {
        if (verifiedOnly && !c.verified) return false;
        if (!c.wardAccess?.includes(ward)) return false;

        if (language !== "any" && !c.languages?.includes(language))
          return false;
        return true;
      })
      .map((c) => {
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
        if (actHit > 0)
          why.push(`Activity match ${actHit}/${activities.length || 1}`);
        if (c.languages?.includes("zh")) why.push("Speaks Chinese");
        if (c.agedCareTraining) why.push("Aged-Care training");
        if (c.policeCheck) why.push("Police check");

        return { candidate: c, score, why };
      })
      .sort((a, b) => b.score - a.score);

    // Build pair suggestions
    const pairs: { ids: [string, string]; score: number; why: string }[] = [];
    for (let i = 0; i < Math.min(4, results.length); i++) {
      for (let j = i + 1; j < Math.min(6, results.length); j++) {
        const A = results[i];
        const B = results[j];
        const combinedSkills = new Set([
          ...(A.candidate.skills || []),
          ...(B.candidate.skills || []),
        ]);
        const cover = activities.filter((a) => combinedSkills.has(a)).length;
        const coverScore = activities.length ? cover / activities.length : 0.6;
        const avg = (A.score + B.score) / 2;
        const s = 0.6 * avg + 0.4 * coverScore;
        const why = `Safer • Activity coverage ${cover}/${
          activities.length || 1
        }`;
        pairs.push({ ids: [A.candidate.id, B.candidate.id], score: s, why });
      }
    }
    pairs.sort((a, b) => b.score - a.score);

    return { results, pairs: pairs.slice(0, 3) };
  }

  const containerTextClass =
    textScale === "base"
      ? "text-[17px]"
      : textScale === "lg"
      ? "text-[19px]"
      : "text-[21px]";
  const containerClass = `${
    highContrast ? "bg-white text-black" : "bg-neutral-50 text-neutral-900"
  } ${containerTextClass}`;

  return (
    <main className={containerClass}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <ol className="flex items-center justify-between gap-2">
            {[1, 2, 3].map((s) => (
              <li key={s} className="flex-1">
                <button
                  className={`w-full border rounded-xl px-3 py-2 text-sm ${
                    state.step === s
                      ? highContrast
                        ? "bg-yellow-300 border-black"
                        : "bg-purple-50 border-purple-500"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    dispatch({ type: "SET_STEP", step: s as State["step"] })
                  }
                >
                  {s === 1 && "Activities"}
                  {s === 2 && "Time"}
                  {s === 3 && "Matches"}
                </button>
              </li>
            ))}
          </ol>
        </div>

        {state.step === 1 && (
          <>
            <Section
              title="What would you like to do?"
              subtitle="Pick 1–3 (multi-select)"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACTIVITIES.map(({ key, label, icon }) => (
                  <Chip
                    key={key}
                    label={label}
                    icon={icon}
                    selected={state.activities.includes(key as ActivityKey)}
                    onClick={() =>
                      dispatch({
                        type: "TOGGLE_ACTIVITY",
                        key: key as ActivityKey,
                      })
                    }
                  />
                ))}
              </div>
            </Section>

            <div className="flex justify-between">
              <div />
              <button
                className="rounded-2xl bg-purple-600 text-white px-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  state.activities.length < 1 || state.activities.length > 3
                }
                onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
              >
                Next → Time
              </button>
            </div>
          </>
        )}

        {state.step === 2 && (
          <>
            <Section
              title="When works for you?"
              subtitle={`Ward ${state.ward} visiting hours ${visiting.start}–${visiting.end}`}
            >
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="Now (within 1h)"
                  selected={state.time.quick === "now"}
                  onClick={() =>
                    dispatch({ type: "SET_TIME", partial: { quick: "now" } })
                  }
                />
                <Chip
                  label="This afternoon"
                  selected={state.time.quick === "today-pm"}
                  onClick={() =>
                    dispatch({
                      type: "SET_TIME",
                      partial: {
                        quick: "today-pm",
                        startAfter: "13:00",
                        endBefore: "17:00",
                      },
                    })
                  }
                />
                <Chip
                  label="Tomorrow morning"
                  selected={state.time.quick === "tomorrow-am"}
                  onClick={() =>
                    dispatch({
                      type: "SET_TIME",
                      partial: {
                        quick: "tomorrow-am",
                        startAfter: "09:00",
                        endBefore: "12:00",
                      },
                    })
                  }
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">Earliest start</label>
                  <input
                    type="time"
                    value={state.time.startAfter}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_TIME",
                        partial: { startAfter: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">Latest end</label>
                  <input
                    type="time"
                    value={state.time.endBefore}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_TIME",
                        partial: { endBefore: e.target.value },
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
                <div className="rounded-xl border bg-white p-4">
                  <label className="block text-sm mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={15}
                    value={state.time.duration}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_TIME",
                        partial: { duration: Number(e.target.value) },
                      })
                    }
                    className="w-full"
                  />
                  <div className="mt-2 text-lg font-semibold">
                    {state.time.duration} min
                  </div>
                </div>
              </div>

              {outsideVisiting && (
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4">
                  <div className="font-semibold text-red-700">
                    Outside visiting hours
                  </div>
                  <div className="text-sm text-red-700">
                    Please adjust to {visiting.start}–{visiting.end}, or shorten
                    the duration.
                  </div>
                </div>
              )}
            </Section>

            <div className="flex justify-between">
              <button
                className="rounded-2xl border px-6 py-3 text-lg"
                onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
              >
                ← Back
              </button>
              <button
                className="rounded-2xl bg-purple-600 text-white px-6 py-3 text-lg"
                onClick={() => dispatch({ type: "SET_STEP", step: 3 })}
              >
                Next → Comfort
              </button>
            </div>
          </>
        )}

        {state.step === 3 && (
          <>
            <Section
              title="Matches"
              subtitle="Recommended by match score, with a ‘Why matched’ explanation."
            >
              {results.length === 0 && (
                <div className="rounded-xl border p-6 text-center bg-white">
                  No matches yet. You may submit a request and we’ll notify you
                  later.
                </div>
              )}

              <div className="space-y-3">
                {results.map(({ candidate, score, why }) => (
                  <div
                    key={candidate.id}
                    className={`rounded-2xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                      state.selectedIds.includes(candidate.id)
                        ? "ring-4 ring-purple-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-extrabold">
                        {candidate.initials}
                      </div>
                      <div>
                        <div className="font-bold text-xl flex items-center gap-2">
                          {candidate.name}{" "}
                          <span className="text-sm font-normal text-neutral-600">
                            ★{candidate.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm text-neutral-600 flex flex-wrap gap-2">
                          {candidate.agedCareTraining && (
                            <Badge>Aged-Care</Badge>
                          )}
                          {candidate.languages.includes("zh") && (
                            <Badge>Chinese</Badge>
                          )}
                          {candidate.languages.includes("en") && (
                            <Badge>English</Badge>
                          )}
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-semibold">Why matched:</span>{" "}
                          {why.join(" · ")} (Score {Math.round(score * 100)})
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-xl border px-4 py-2"
                        onClick={() => alert("View profile (demo)")}
                      >
                        View profile
                      </button>
                      <button
                        className={`rounded-xl px-4 py-2 font-semibold ${
                          state.selectedIds.includes(candidate.id)
                            ? "bg-neutral-800 text-white"
                            : "bg-purple-600 text-white"
                        }`}
                        onClick={() =>
                          dispatch({ type: "TOGGLE_SELECT", id: candidate.id })
                        }
                      >
                        {state.selectedIds.includes(candidate.id)
                          ? "Selected"
                          : "APPLY"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {state.safety.pair && pairs.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-2">
                    Suggested pairs (safer)
                  </h3>
                  <div className="space-y-3">
                    {pairs.map((p, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {p.ids.map((id) => {
                            const c = candidates.find((x) => x.id === id)!;
                            return (
                              <div
                                key={id}
                                className="flex items-center gap-3 border rounded-xl px-3 py-2"
                              >
                                <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg font-extrabold">
                                  {c.initials}
                                </div>
                                <div>
                                  <div className="font-semibold">{c.name}</div>
                                  <div className="text-xs text-neutral-600">
                                    ★{c.rating.toFixed(1)} ·{" "}
                                    {c.languages.includes("zh")
                                      ? "Chinese"
                                      : ""}{" "}
                                    {c.languages.includes("en")
                                      ? "English"
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-neutral-700">
                            {p.why}
                          </div>
                          <button
                            className="rounded-xl bg-pruple-600 text-white px-4 py-2 font-semibold"
                            onClick={() => {
                              dispatch({ type: "RESET_SELECTION" });
                              p.ids.forEach((id) =>
                                dispatch({ type: "TOGGLE_SELECT", id })
                              );
                            }}
                          >
                            Choose this pair
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <div className="flex justify-between">
              <button
                className="rounded-2xl border px-6 py-3 text-lg"
                onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
              >
                ← Back
              </button>
              <div />
            </div>
          </>
        )}
      </div>
    </main>
  );
}

// Small badge atom
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-white">
    {children}
  </span>
);
