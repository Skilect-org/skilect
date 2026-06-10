const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineer I",
    initial: "A",
    quote:
      "Skilect's dynamic roadmap stripped away all the noise. I knew exactly what to study, and when, which dramatically reduced my anxiety and helped me land my dream role at a FAANG company.",
  },
  {
    name: "Sarah Jenkins",
    role: "Data Science Manager",
    initial: "S",
    quote:
      "The readiness score was a game-changer. It told me I was weak on system design, so the platform automatically adjusted my tasks to compensate before my final loop.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#f8f9fc] pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-16">
          Proven Results
        </h2>

        <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
          {testimonials.map(({ name, role, quote, initial }) => (
            <div
              key={name}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col justify-between"
            >
              <p className="text-base leading-relaxed text-gray-600 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  {initial}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{name}</p>
                  <p className="text-xs font-medium text-gray-500">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
