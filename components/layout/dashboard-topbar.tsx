"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { useUser, UserButton } from "@clerk/nextjs";
import { Plus, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ------------------------------------------------------------------ */
/* Route-specific action buttons                                      */
/* ------------------------------------------------------------------ */

interface ActionButton {
  label: string;
  icon: React.ElementType;
  variant: "outline" | "filled";
  actionId?: string;
}

const routeActions: Record<string, ActionButton[]> = {
  "/dashboard": [
    { label: "New Task", icon: Plus, variant: "outline", actionId: "new-task" },
    { label: "Generate Roadmap", icon: Sparkles, variant: "filled", actionId: "generate-roadmap" },
  ],
  "/tasks": [
    { label: "New Task", icon: Plus, variant: "outline", actionId: "new-task" },
    { label: "Generate Tasks with AI", icon: Sparkles, variant: "filled", actionId: "generate-tasks" },
  ],
  "/roadmaps": [
    { label: "New Task", icon: Plus, variant: "outline", actionId: "new-task" },
    { label: "Generate Roadmap", icon: Sparkles, variant: "filled", actionId: "generate-roadmap" },
  ],
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function DashboardTopbar() {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Initialize the router
  const { user } = useUser();

  // Ensure this only runs on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const firstName = user?.firstName ?? "there";
  const greeting = getGreeting();
  const actions = routeActions[pathname] ?? [];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 pl-16 pr-6 lg:px-8">
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

          const handleActionClick = () => {
            if (action.actionId === "new-task") {
              if (pathname === "/tasks") {
                // If already on the tasks page, open the drawer
                window.dispatchEvent(new CustomEvent("open-new-task-drawer"));
              } else {
                // If anywhere else, redirect to the tasks page
                router.push("/tasks");
              }
            } else if (action.actionId === "generate-roadmap") {
              if (pathname === "/roadmaps") {
                // Optional: If you ever add a roadmap drawer, you can dispatch it here
                window.dispatchEvent(new CustomEvent("open-generate-roadmap"));
              } else {
                // Redirect to the roadmaps page
                router.push("/roadmaps");
              }
            } else {
              alert(`${action.label} is coming soon!`);
            }
          };

          if (action.variant === "outline") {
            return (
              <button
                key={action.label}
                type="button"
                onClick={handleActionClick}
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
              onClick={handleActionClick}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              <Icon size={14} strokeWidth={2} />
              {action.label}
            </button>
          );
        })}

        {/* Clerk user avatar with hydration fix */}
        {isMounted ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        ) : (
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        )}
      </div>
    </header>
  );
}