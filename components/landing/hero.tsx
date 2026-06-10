import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f8f9fc] -z-10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">
          {/* Left Content */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Turn Skill Gaps Into{" "}
              <span className="text-blue-600">Job Offers</span>
            </h1>

            <p className="text-lg leading-relaxed text-gray-600 sm:text-xl">
              The AI-powered placement preparation platform that tracks your
              readiness, curates personalized roadmaps, and guides you definitively
              to your dream career.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/assessment"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
              >
                Start Your Assessment
              </a>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                  />
                </svg>
                Watch Demo
              </a>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
            {/* Dashboard Mockup wrapper */}
            <div className="relative rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden transform lg:scale-105 xl:scale-110 origin-left">
              {/* Fake Browser Header */}
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                <div className="h-3 w-3 rounded-full bg-gray-300"></div>
              </div>
              {/* Image Content */}
              <div className="p-1 bg-[#1c222b]">
                <Image
                  src="/images/landing/landing-dashboard.png"
                  alt="Skilect Dashboard Preview"
                  width={1200}
                  height={800}
                  priority
                  className="h-auto w-full rounded-b-xl opacity-90 mix-blend-lighten"
                />
              </div>
            </div>
            
            {/* Soft decorative glow behind the image */}
            <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-gradient-to-tr from-blue-100/50 to-purple-100/50 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
