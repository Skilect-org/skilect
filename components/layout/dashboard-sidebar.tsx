"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/assessment", label: "Assessment", icon: "📝" },
  { href: "/roadmaps", label: "Roadmaps", icon: "🗺️" },
  { href: "/tasks", label: "Tasks", icon: "✅" },
  { href: "/interview", label: "Interview", icon: "🎙️" },
  { href: "/resume", label: "Resume", icon: "📄" },
  { href: "/progress", label: "Progress", icon: "📈" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-foreground/10 bg-background lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        {/* Brand */}
        <Link
          href="/"
          className="mb-4 flex items-center gap-2 px-3 py-2"
        >
          <Image
            src="/logo/skilect-logo.png"
            alt="Skilect Logo"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <span className="text-base">⚙️</span>
          Settings
        </Link>
      </div>
    </aside>
  );
}
