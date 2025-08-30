
import React from "react";
import { WebTitle } from "../Navbar";
import { Button } from "../ui/button";
import Link from "next/link";
import HeroImage from "../HeroImage";

const HeroPage = () => {
  return (
    <section className="mt-18 h-[70vh] md:h-[calc(100vh-4.5rem)]">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div className="flex justify-center md:justify-between items-center h-full">
          <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
            <div className="text-2xl md:text-4xl font-semibold">
              <span>Welcome to</span>
              <WebTitle className="text-7xl md:text-8xl" />
            </div>

            <p className="text-md md:text-xl text-muted-foreground font-mono max-w-xl">
              Protect your home with smart RFID-based access control. Manage
              members, track entry logs, and stay secure — all in one place.
            </p>

            <div className="flex gap-4">
              <Link href={"/get-started"}>
                <Button className="text-foreground font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link href={"/about"}>
                <Button variant={"outline"}>
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <HeroImage/>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
