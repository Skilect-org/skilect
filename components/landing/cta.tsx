export default function CTA() {
  return (
    <section className="bg-[#f8f9fc] pb-24 px-6">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-indigo-50/50 py-20 text-center border border-indigo-100/50 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to start your journey?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-500">
          Join thousands of candidates who have optimized their interview prep and accelerated their careers.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:bg-blue-800"
          >
            Get Started For Free
          </a>
        </div>
      </div>
    </section>
  );
}
