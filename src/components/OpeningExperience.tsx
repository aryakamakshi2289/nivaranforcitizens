import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { NivaranMark } from "@/components/NivaranMark";
import { AmbientBlue } from "@/components/LifecycleFlow";
import { cn } from "@/lib/utils";
import { useNivaran, type Role } from "@/lib/nivaran-store";

type Phase = "intro" | "role" | "leaving" | "done";

const SESSION_KEY = "nivaran-opening-seen";

/**
 * Opening brand sequence followed by role selection. Client-only overlay so the
 * static markup never flashes it; shown once per browser session.
 */
export function OpeningExperience() {
  const navigate = useNavigate();
  const { setRole } = useNivaran();
  const [phase, setPhase] = useState<Phase>("done");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    setPhase("intro");
    const timer = setTimeout(() => setPhase("role"), 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "intro" || phase === "role") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    return;
  }, [phase]);

  function choose(role: Role) {
    setRole(role);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("leaving");
    setTimeout(() => {
      setPhase("done");
      navigate({ to: role === "authority" ? "/authority" : "/report" });
    }, 460);
  }

  if (phase === "done") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Nivaran"
      className={cn(
        "fixed inset-0 z-[100] isolate grid place-items-center overflow-hidden bg-navy-deep px-6",
        phase === "leaving" && "intro-leave",
      )}
    >
      <AmbientBlue />

      {/* flowing trail that carries the whole composition */}
      <svg
        viewBox="0 0 600 200"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-56 w-full -translate-y-1/2 opacity-50"
      >
        <path
          d="M-20 150 C 120 150, 160 60, 300 60 S 480 110, 620 70"
          fill="none"
          stroke="#3b6ea8"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ ["--intro-delay" as string]: "260ms" }}
          className="intro-trail"
        />
      </svg>

      <div className="relative w-full max-w-xl text-center">
        {phase !== "role" ? (
          <div className="flex flex-col items-center">
            <NivaranMark animated className="intro-mark size-20 sm:size-24" />
            <h1
              style={{ ["--intro-delay" as string]: "620ms" }}
              className="intro-step mt-6 font-display text-4xl font-extrabold tracking-[0.16em] text-primary sm:text-5xl"
            >
              NIVARAN
            </h1>
            <p
              style={{ ["--intro-delay" as string]: "1100ms" }}
              className="intro-step mt-3 text-sm text-secondary/85 sm:text-base"
            >
              For what needs to change.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-3 flex flex-col items-center duration-700">
            <NivaranMark className="size-11" />
            <h2 className="mt-5 font-display text-2xl font-extrabold text-primary sm:text-3xl">
              Welcome to Nivaran
            </h2>
            <p className="mt-2 text-sm text-secondary/85">How will you be using Nivaran?</p>

            <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    role: "citizen" as Role,
                    title: "I'm a Citizen",
                    body: "Report and track civic issues",
                  },
                  {
                    role: "authority" as Role,
                    title: "I'm an Authority",
                    body: "Manage, prioritize and resolve civic issues",
                  },
                ]
              ).map((option, i) => (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => choose(option.role)}
                  style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                  className="card-surface card-lift p-5 text-left transition duration-300 hover:border-accent/60"
                >
                  <span className="block font-display text-lg font-bold text-primary">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-sm text-secondary/85">{option.body}</span>
                  <span className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent">
                    Continue
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Prototype — no sign-in or password needed. You can switch pages at any time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
