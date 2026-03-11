import { Section } from "@/components/layout";

export default function CoursesHero() {
  return (
    <Section className="relative min-h-screen bg-[#111111] text-[var(--color-white)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554072675-66db59dba46f?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#2a2118]/65 via-black/20 to-black/45" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1450px] flex-col px-8 py-8 md:px-12 lg:px-16">
        <main className="flex flex-1 items-center justify-center ">
          <div className="max-w-3xl pb-16 pt-8">
            <p className="mb-5 text-[16px] font-semibold uppercase tracking-[0.04em] text-[var(--color-burnt-siena-base)] md:text-[19px]">
              Course Catalog
            </p>

            <h1 className="max-w-4xl text-6xl font-semibold tracking-[-0.04em] text-white md:text-7xl lg:text-[60px] lg:leading-[0.96]">
              Choose your path
            </h1>

            <p className="mt-8 max-w-4xl text-2xl leading-relaxed text-[var(--color-white)] md:text-[20px] md:leading-[1.45]">
              Language courses, integration guides, and cultural deep-dives. Start with a free trial
              or dive right in.
            </p>

            <div className="mt-12 max-w-[760px]">
              <div className="flex h-[43px] w-[560px] items-center rounded-[12px] border border-white/35 bg-black/15 px-6 backdrop-blur-[2px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-7 w-7 text-white/80"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  placeholder="Search courses, topics, or levels..."
                  className="ml-4 w-full bg-transparent text-[18px] text-[var(--color-white)] placeholder:text-white/65 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Section>
  );
}
