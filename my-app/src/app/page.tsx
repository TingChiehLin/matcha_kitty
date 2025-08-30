// src/app/page.tsx
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
});



export const metadata: Metadata = {
  title: "Introduction",
  description: "Core Values of the 'Community Connector' and Frequently Asked Questions of the 'Community Connector'.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
    <h1 className={`${playfair.className} text-6xl md:text-8xl leading-[1] antialiased`}>
    <span className="relative inline-block whitespace-nowrap">
    {/* fill (gradient) */}
    <span className="italic bg-gradient-to-r from-[#0f3d1c] via-[#228B22] to-[#145a32] bg-clip-text text-transparent pr-2">
      CommunityConnector
    </span>
    {/* outline underneath to prevent the 'R' from disappearing */}
    <span
      aria-hidden
      className="absolute inset-0 italic text-transparent pointer-events-none"
      style={{ WebkitTextStroke: "0.7px #0b2e17" }}
    >
      CommunityConnector
    </span>
  </span>
</h1>


       {/* Subtitle */} 
      <p className="mt-6 text-xl md:text-2xl font-bold leading-snug text-gray-800 dark:text-gray-100">
        Welcome to the <span className="text-[#228B22]">CommunityConnector</span> !
      </p>

      {/* Intro */} 
      <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
      Here is CommunityConnector! This is a platform that connects the connecting older adults in hospitals and care organisations with the verified university students that provide varies services such as cooking, planting and more different kind of skills. 
      </p>
      
      {/* Existing Section */} 
      <section className="mt-8 space-y-3 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold"> What the platform provides:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><span className="font-semibold">Verified Helpers:</span> Conectors are current university students, verified via student ID and profile checks</li>
          <li><span className="font-semibold">Free, Volunteer Services:</span> No fees for all the services. Connectors volunteer their time</li>
          <li><span className="font-semibold">Easy Booking:</span> Pick a service, choose a time and select your Connectors</li>
          <li><span className="font-semibold">Safety and Trust:</span> Clear guidelines, structured screening, and transparent profiles</li>
        </ul>
      </section>

      {/* FAQ */}
      <section
        className="mt-12 text-gray-700 dark:text-gray-300"
        aria-label="Frequently Asked Questions"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">Frequently Asked Questions</h2>

        <div className="mt-6 space-y-4">
          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              What is CommunityConnector?
            </summary>
            <div className="mt-2 leading-relaxed">
              CommunityConnector matches older adults in hospitals and care organisations with verified university students for
              light help and companionship, like cooking lessons, planting, and tech help.
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              Who can sign up as a helper?
            </summary>
            <div className="mt-2 leading-relaxed">
              Current university students who pass our verification (student ID + profile
              checks). Their reputation grows through post-visit ratings and reviews.
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              How do you keep everyone safe?
            </summary>
            <div className="mt-2 leading-relaxed">
              We use identity checks for students, in-app messaging, visit scheduling, and
              post-visit reviews. You can also share visit details with family members.
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              What services are available?
            </summary>
            <div className="mt-2 leading-relaxed">
              Services such as cooking, planting/gardening, light household help, basic tech assistance, and
              friendly visits. You can request varies of skills in the app.
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              How does booking work?
            </summary>
            <div className="mt-2 leading-relaxed">
              Browse nearby students, pick a service, choose a time, and confirm. We share contact details after booking so you can chat on a third-party platform.
            </div>
          </details>

          <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
              Is there a cost?
            </summary>
            <div className="mt-2 leading-relaxed">
              There will be no extra cost for all the service. The services provided by the connectors are all volunterily based. 
            </div>
          </details>


      <details className="group rounded-lg border border-gray-200 dark:border-white/15 p-4">
            <summary className="cursor-pointer list-none font-medium text-gray-900 dark:text-gray-100">
            How do you ensure safety for both sides?
            </summary>
            <div className="mt-2 leading-relaxed">
              The Connectors are all strictly screening by the admin to ensure the older adult's safety. For the Connectors' safety, there's always a supervisor provide by the caring organisation/hospital who supervise during the lesson/service.
            </div>
          </details>
          </div>
      </section>


      {/* Link */}
      <div className="mt-12">
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium
          bg-[#228B22] text-white border border-[#1e7e1e]
          hover:bg-[#1c6f1c] transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145a32]
          dark:bg-[#145a32] dark:hover:bg-[#0f3d1c] dark:border-[#0f3d1c]"
>
         Back to Homepage
        </a>
      </div>
    </main>
  );
}
            