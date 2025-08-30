import Card from "@/components/Card/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-y-24 row-start-2  sm:items-start">
        <div className="text-center mx-auto">
          <h1 className="text-6xl text-zinc-800 font-bold">
            Community Connector
          </h1>
          <p className="mt-6 text-2xl text-zinc-500">
            Bring everyone together, Find ways to help and grow with your
            community.
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
        <div className="flex gap-x-24 mx-auto">
          <Card
            title="Be a connector"
            description="Join a community of caring individuals making a difference in elders’ lives."
            href={"/form"}
            img={"/imgs/volunteer.jpg"}
          />
          <Card
            title="Service opportunities"
            description="Find ways to help and grow with your community."
            href={"/service"}
            img={"/imgs/service.jpg"}
          />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
