"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Map,
  ListChecks,
  FileText,
  Mic,
  TrendingUp,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */

const mainNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/roadmaps", label: "Roadmaps", icon: Map },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/interview", label: "Interview", icon: Mic },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

const accountNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/*  Sidebar content (shared between desktop & mobile)                  */
/* ------------------------------------------------------------------ */

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  const firstName = user?.firstName ?? "User";
  const avatarUrl = user?.imageUrl;

  /* Placement readiness score — hardcoded for now; swap for real data */
  const readinessScore = 82;

  return (
    <div className="flex h-full flex-col">
      {/* ── User card ────────────────────────────────────────────── */}
      <div className="mx-4 mt-5 mb-2">
        <div
          className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50/80 to-white p-4 transition-shadow hover:shadow-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={firstName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 ring-2 ring-white">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name + score label */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {firstName}
              </p>
              <p className="text-xs text-gray-500">
                {readinessScore}% Placement Ready
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${readinessScore}%`,
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────── */}
      <div className="mx-5 my-2">
        <div className="h-px bg-gray-100" />
      </div>

      {/* ── Main nav ─────────────────────────────────────────────── */}
      <nav className="flex flex-1 flex-col px-3">
        <p className="mb-1 px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Main
        </p>

        <ul className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.75}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight
                      size={14}
                      className="text-blue-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Divider ────────────────────────────────────────────── */}
        <div className="mx-2 my-3">
          <div className="h-px bg-gray-100" />
        </div>

        {/* ── Account nav ────────────────────────────────────────── */}
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Account
        </p>

        <ul className="space-y-0.5">
          {accountNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2 : 1.75}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-500"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer branding ──────────────────────────────────────── */}
      <div className="border-t border-gray-100 px-5 py-4">
        <p className="text-[11px] text-gray-300">
          © {new Date().getFullYear()} Skilect
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile drawer toggle button                                        */
/* ------------------------------------------------------------------ */

export function MobileSidebarToggle() {
  return null; // handled internally via DashboardSidebar
}

/* ------------------------------------------------------------------ */
/*  Main sidebar export                                                */
/* ------------------------------------------------------------------ */

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* Close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Lock body scroll when mobile drawer is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* ── Mobile hamburger button ─────────────────────────────── */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur transition-all hover:bg-gray-50 hover:text-gray-900 hover:shadow-md active:scale-95 lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* ── Desktop sidebar (fixed) ─────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-gray-200/80 bg-white lg:block"
        style={{
          boxShadow: "1px 0 8px rgba(0,0,0,0.03)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop spacer — pushes main content right */}
      <div className="hidden w-[280px] shrink-0 lg:block" aria-hidden="true" />

      {/* ── Mobile overlay + drawer ─────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-gray-200/80 bg-white transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: mobileOpen ? "4px 0 24px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobile}
          className="absolute right-3 top-5 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={16} />
        </button>

        <SidebarContent onNavigate={closeMobile} />
      </aside>
    </>
  );
}
