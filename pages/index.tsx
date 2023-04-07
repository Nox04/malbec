import { Inter } from "next/font/google";
import Form from "@/components/Form";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Malbec</title>
      </Head>
      <main className={`${inter.className} h-full`}>
        <Form />
      </main>
    </>
  );
}
