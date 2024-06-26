import Image from "next/image";
import { Inter } from "next/font/google";
import { Statistics } from "@/components/statistics";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Statistics />
    </main>
  );
}
