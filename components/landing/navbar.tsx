"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn } = useUser();

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
    <header className="fixed inset-x-0 top-0 z-50 px-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ease-out ${
          scrolled
            ? "mt-3 rounded-2xl bg-white/80 backdrop-blur-xl py-2 px-8 shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "mt-0 rounded-none bg-transparent py-4 shadow-none"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 select-none">
          <Image
            src="/logo/brand-logo.png"
            alt="Skilect Logo"
            width={220}
            height={64}
            className={`w-auto object-contain transition-all duration-300 ease-out ${
              scrolled ? "h-9" : "h-[4.5rem]"
            }`}
            priority
          />
        </Link>

        {/* ── Center: Nav links (desktop) ── */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="relative px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 group"
              >
                {label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right: Actions (desktop) ── */}
        <div className="hidden md:flex items-center gap-4">
          {!isSignedIn ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 px-3 py-1.5"
              >
                Login
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.97]"
              >
                Get Started
              </Link>
            </>
          ) : (
            <UserButton />
          )}
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
          <div className="flex flex-col gap-2 px-4">
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  Login
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex w-full items-center justify-center">
                <UserButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
