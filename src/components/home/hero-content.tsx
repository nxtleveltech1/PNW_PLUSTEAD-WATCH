"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroContent() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center md:px-10 lg:px-16"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <motion.div
        variants={fadeUp}
        className="absolute left-1/2 top-14 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl"
        aria-hidden
      />
      <motion.div
        variants={fadeUp}
        className="relative mb-6 h-40 w-[340px] md:mb-8 md:h-56 md:w-[520px] lg:mb-10 lg:h-64 lg:w-[620px]"
      >
        <Image
          src="/images/full%20logo.jpg"
          alt="Plumstead Neighbourhood Watch full logo"
          fill
          className="object-contain drop-shadow-[0_10px_36px_rgba(0,0,0,0.48)]"
          sizes="(max-width: 768px) 340px, (max-width: 1024px) 520px, 620px"
          priority
        />
      </motion.div>
      <motion.h1
        variants={fadeUp}
        className="max-w-4xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
        style={{ textShadow: "0 4px 24px rgba(0,0,0,0.42)" }}
      >
        Be the eyes and ears of the area.
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-4 font-display text-xl font-bold tracking-wide text-amber-300 md:text-2xl"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.48)" }}
      >
        Together, we can fight CRIME.
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.34)" }}
      >
        Stay connected to verified local incident updates, rapid response channels, and coordinated
        neighbourhood safety actions.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-5 flex flex-wrap justify-center gap-2">
        <span className="stat-chip">Control room 24/7</span>
        <span className="stat-chip">80+ active patrollers</span>
        <span className="stat-chip">Founded 2007</span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4"
      >
        <Button
          asChild
          size="lg"
          className="min-w-[210px] bg-primary px-8 py-6 text-base font-semibold shadow-[0_10px_34px_rgba(25,65,156,0.45)] hover:bg-primary/92"
        >
          <Link href="/register">Register as a member</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="min-w-[210px] border-2 border-white/90 bg-white/15 px-8 py-6 text-base font-semibold text-white backdrop-blur-md hover:bg-white/24"
        >
          <Link href="/register/guest">Register as a guest</Link>
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-4 flex gap-3 sm:gap-4">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="min-w-[148px] border-white/60 bg-transparent px-6 py-6 font-medium text-white hover:border-white hover:bg-white/10"
        >
          <Link href="/find">Find zone</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="min-w-[148px] border-white/60 bg-transparent px-6 py-6 font-medium text-white hover:border-white hover:bg-white/10"
        >
          <Link href="/donate">Donate</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
