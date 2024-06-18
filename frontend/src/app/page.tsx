// /pages/index.js
import Head from "next/head";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
// import Testimonials from "./components/Testimonials";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Landing Page</title>
        <meta
          name="description"
          content="Landing page built with Next.js and ShadCN"
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <Features />
        {/* <Testimonials /> */}
      </main>
      <Footer />
    </div>
  );
}
