import type React from "react";
import { TravellingFooter } from "./traveling/_components/TravellingFooter";
import { TravelingNavbar } from "./traveling/_components/TravelingNavbar";

export default function GetStartedFreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full">
      <TravelingNavbar />
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
      <TravellingFooter />
    </div>
  );
}
