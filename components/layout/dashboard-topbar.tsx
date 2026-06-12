"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { Plus, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/*  Route-specific action buttons                                      */
/* ------------------------------------------------------------------ */

interface ActionButton {
  label: string;
  icon: React.ElementType;
  variant: "outline" | "filled";
}

const routeActions: Record<string, ActionButton[]> = {
  "/dashboard": [
    { label: "New Task", icon: Plus, variant: "outline" },
    { label: "Generate Roadmap", icon: Sparkles, variant: "filled" },
  ],
  "/tasks": [
    { label: "New Task", icon: Plus, variant: "outline" },
    { label: "Generate Roadmap", icon: Sparkles, variant: "filled" },
  ],
  "/roadmaps": [
    { label: "New Task", icon: Plus, variant: "outline" },
    { label: "Generate Roadmap", icon: Sparkles, variant: "filled" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function DashboardTopbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const firstName = user?.firstName ?? "there";
  const greeting = getGreeting();
  const actions = routeActions[pathname] ?? [];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-6 lg:px-8">
      {/* Left — Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          {greeting},{" "}
          <span className="text-blue-600">
            {firstName}
          </span>
        </h1>
      </div>

      {/* Right — Actions + Avatar */}
      <div className="flex items-center gap-3">
        {actions.map((action) => {
          const Icon = action.icon;

          if (action.variant === "outline") {
            return (
              <button
                key={action.label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-blue-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 active:scale-[0.98]"
              >
                <Icon size={14} strokeWidth={2} />
                {action.label}
              </button>
            );
          }

          return (
            <button
              key={action.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <Icon size={14} strokeWidth={2} />
              {action.label}
            </button>
          );
        })}

        {/* Clerk user avatar */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  );
}
