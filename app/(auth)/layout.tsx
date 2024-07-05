import type { Metadata } from "next";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
    <main className = "relative h-screen w-full">
      <div className = "absolute size-full">
        <Image 
          src = "/images/bg-img.jpg"
          alt = "background"
          fill
          className = "w-full h-auto"
        />
      </div>
        {children}
    </main>
  );
}
