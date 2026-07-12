import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fc] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link href="/" className="flex items-center gap-1.5 select-none mb-2">
            <Image
              src="/logo/brand-logo.png"
              alt="Skilect Logo"
              width={220}
              height={64}
              className="h-[4.5rem] w-auto object-contain"
            />
          </Link>
          <p className="text-[11px] text-gray-400">
            © 2026 Skilect AI. Empowering the next generation of professionals.
          </p>
        </div>

        {/* Right: Simple Links */}
        <ul className="flex items-center gap-6 text-xs font-medium text-gray-500">
          <li>
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-900 transition-colors">Contact Us</Link>
          </li>
          <li>
            <Link href="#" className="hover:text-gray-900 transition-colors">Press Kit</Link>
          </li>
        </ul>
        
      </div>
    </footer>
  );
}
