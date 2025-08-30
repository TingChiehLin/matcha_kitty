import React from "react";
import Image from "next/image";
import Link from "next/link";

import Volunteer from "../../public/imgs/volunteer.jpg";

interface CardProps {
  title: string;
  description: string;
  href: string;
  img?: string;
}

const Card = ({ title, description, href, img }: CardProps) => {
  return (
    <Link href={href}>
      <div
        className="group flex flex-col items-center w-72 
                cursor-pointer 
                rounded-2xl 
                "
      >
        <div className="relative">
          <Image
            className="w-72 h-72 rounded-full object-cover 
                     transition duration-300 group-hover:brightness-110 group-hover:contrast-105"
            src={img || Volunteer}
            alt="profile-image"
            width={288}
            height={288}
            sizes="100vw"
          />
          <div className="absolute inset-0 rounded-full ring-0 ring-purple-400/40 group-hover:ring-4 transition-all duration-300" />
        </div>

        <span
          className="mt-6 mb-2 text-2xl font-semibold text-zinc-800 
                       group-hover:text-purple-600 transition-colors duration-300"
        >
          {title}
        </span>
        <span className="text-center text-zinc-700 group-hover:text-zinc-900 transition-colors duration-300">
          {description}
        </span>
      </div>
    </Link>
  );
};

export default Card;
