"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 select-none">
          <Image
            src="/logo/skilect-logo.png"
            alt="Skilect Logo"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* ── Center: Nav links (desktop) ── */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right: Actions (desktop) ── */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:bg-blue-800 shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* ── Hamburger (mobile) ── */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="relative z-50 flex md:hidden h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <div className="flex w-5 flex-col items-center gap-[5px]">
            <span
              className={`block h-[2px] w-full rounded-full bg-gray-700 transition-all duration-300 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-full rounded-full bg-gray-700 transition-all duration-300 ${
                mobileOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-full rounded-full bg-gray-700 transition-all duration-300 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Mobile menu panel ── */}
      <div
        className={`fixed inset-x-0 top-0 z-40 flex flex-col bg-white pt-20 pb-8 px-6 shadow-2xl transition-all duration-300 ease-out md:hidden ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-2">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Login
          </Link>

          <Link
            href="/register"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
