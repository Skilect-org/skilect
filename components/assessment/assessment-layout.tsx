import Link from "next/link";
import Image from "next/image";

interface AssessmentLayoutProps {
  children: React.ReactNode;
}

export function AssessmentLayout({ children }: AssessmentLayoutProps) {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-white to-[#f8f9fc]">
      {/* Background from landing page */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f8f9fc] -z-10" />

      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 select-none">
            <Image
              src="/logo/brand-logo.png"
              alt="Skilect Logo"
              width={200}
              height={70}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          <span className="text-xs font-medium text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
            Skill Assessment
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
