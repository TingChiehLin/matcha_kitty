import Card from "@/components/Card/Card";
import Link from "next/link";

import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
});

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-y-20 row-start-2  sm:items-start">
        <div className="text-center mx-auto">
          <h1
            className={`${playfair.className} text-6xl md:text-8xl leading-[1] antialiased`}
          >
            <span className="relative inline-block whitespace-nowrap">
              <span className="italic bg-gradient-to-r from-purple-400 via-purple-700 to-purple-950 bg-clip-text text-transparent pr-2">
                CommunityConnector
              </span>
              <span
                aria-hidden
                className="absolute inset-0 italic text-transparent pointer-events-none"
                style={{ WebkitTextStroke: "0.7px #0b2e17" }}
              >
                CommunityConnector
              </span>
            </span>
          </h1>

          <p className="mt-8 text-2xl text-zinc-600">
            Connecting generations in our cities of the future
          </p>
          <Link href={"/about"}>
            <button
              type="button"
              className="rounded-md bg-purple-600 
                       px-3.5 py-2.5 text-sm font-semibold 
                      shadow-xs inset-ring
                       inset-ring-gray-300 
                       hover:bg-purple-700
                       text-white
                       cursor-pointer
                       mt-8
                       transition-colors duration-300
                   "
            >
              Read More
            </button>
          </Link>
        </div>
        <div className="flex gap-x-40 mx-auto">
          <Card
            title="Be a connector"
            description="Join a community of caring individuals making a difference in elders’ lives."
            href={"/login"}
            img={"/imgs/volunteer.jpg"}
          />
          <Card
            title="Search for Connectors"
            description="Find the suitable Connectors based on their skillsets and availability."
            href={"/service"}
            img={"/imgs/service.jpg"}
          />
        </div>
      </main>
    </div>
  );
}
