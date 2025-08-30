import Image from "next/image";
import Link from "next/link";

const faqs = [
  {
    title: "What is CommunityConnector?",
    description:
      "CommunityConnector matches older adults in hospitals and care organisations with verified university students for light help and companionship, like cooking lessons, planting, and tech help.",
  },
  {
    title: "Who can sign up as a helper?",
    description:
      "Current university students who pass our verification (student ID + profile checks). Their reputation grows through post-visit ratings and reviews.",
  },
  {
    title: "How do you keep everyone safe?",
    description:
      "We use identity checks for students, in-app messaging, visit scheduling, and post-visit reviews. You can also share visit details with family members.",
  },
  {
    title: "What services are available?",
    description:
      "Services such as cooking, planting/gardening, light household help, basic tech assistance, and friendly visits. You can request varies of skills in the app.",
  },
  {
    title: "How does booking work?",
    description:
      "Browse nearby students, pick a service, choose a time, and confirm. We share contact details after booking so you can chat on a third-party platform.",
  },
  {
    title: "Is there a cost?",
    description:
      "There will be no extra cost for all the service. The services provided by the connectors are all volunterily based.",
  },
  {
    title: "How do you ensure safety for both sides?",
    description:
      "The Connectors are all strictly screening by the admin to ensure the older adult's safety. For the Connectors' safety, there's always a supervisor provide by the caring organisation/hospital who supervise during the lesson/service.",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Image
        className="w-full h-96 object-cover rounded-lg                  "
        src={"/imgs/reading_service.jpg"}
        alt="profile-image"
        width={"1024"}
        height={"480"}
        sizes="100vw"
      />
      <h1 className="text-4xl font-bold mt-8">About us</h1>

      <p className="mt-4 text-zinc-600 leading-relaxed">
        Here is CommunityConnector! This is a platform that connects the
        connecting older adults in hospitals and care organisations with the
        verified university students that provide varies services such as
        cooking, planting and more different kind of skills.
      </p>

      <section className="mt-8 space-y-3 text-zinc-600">
        <h2 className="text-xl font-semibold"> What the platform provides:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <span className="font-semibold">Verified Helpers:</span> Conectors
            are current university students, verified via student ID and profile
            checks
          </li>
          <li>
            <span className="font-semibold">Free, Volunteer Services:</span> No
            fees for all the services. Connectors volunteer their time
          </li>
          <li>
            <span className="font-semibold">Easy Booking:</span> Pick a service,
            choose a time and select your Connectors
          </li>
          <li>
            <span className="font-semibold">Safety and Trust:</span> Clear
            guidelines, structured screening, and transparent profiles
          </li>
        </ul>
      </section>

      <section
        className="mt-12 text-zinc-700 font-bold"
        aria-label="Frequently Asked Questions"
      >
        <h2 className="text-2xl md:text-3xl font-semibold">
          Frequently Asked Questions
        </h2>

        <div className="mt-6 space-y-4 text-zinc-600">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-lg p-4">
              <summary className="cursor-pointer list-none font-medium text-zinc-900">
                {faq.title}
              </summary>
              <div className="mt-2 leading-relaxed text-zinc-500">
                {faq.description}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Link
          href="/"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg px-5 py-4 text-sm font-medium
          bg-purple-600 text-white
          hover:bg-purple-700 transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2 
          "
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
