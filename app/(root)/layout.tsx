import LeftSidebar from "@/components/ui/LeftSidebar";
import RightSidebar from "@/components/ui/RightSidebar";
import type { Metadata } from "next";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className = "relative flex flex-col">
        <main className="relative flex bg-black-3">
           <LeftSidebar />
           <section className = "border-2 flex min-h-screen flex-1 flex-col px-4 sm:px-14">
            <div className = "mx-auto flex w-full max-w-full flex-col max-sm:px-4">
              <div>
                <Image />
                MovileNav
              </div>
              <div>
                Toaster (notification popups)
                {children}
              </div>
            </div>
           </section>
           
            <RightSidebar />
        </main>
    </div>
  );
}
