import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/tasks", label: "Tasks" },
  { href: "/interview", label: "Interview" },
  { href: "/resume", label: "Resume" },
  { href: "/progress", label: "Progress" },
];

export function DashboardNavbar() {
  return (
    <header className="border-b border-foreground/10">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/brand-logo.png"
            alt="Skilect Logo"
            width={200}
            height={70}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="text-sm text-foreground/60 hover:text-foreground"
          >
            Settings
          </Link>
          <UserButton />
        </div>
      </nav>
    </header>
  );
}
