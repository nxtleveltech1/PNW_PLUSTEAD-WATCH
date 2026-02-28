"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { HandHelping, Shield, DollarSign } from "lucide-react";

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

function HeroMainSlide() {
  return (
    <motion.div
      className="flex h-full min-h-[90vh] w-full flex-col items-center justify-center px-6 py-20 text-center md:px-10 lg:px-16"
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
          variant="outline"
          className="min-w-[148px] border-white/60 bg-transparent px-6 py-6 font-medium text-white hover:border-white hover:bg-white/10"
        >
          <Link href="/donate">Donate</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function CameraProjectSlide() {
  return (
    <div className="relative flex h-full min-h-[90vh] w-full flex-col items-center justify-center px-6 py-20 text-center md:px-10 lg:px-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/95" aria-hidden />
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8">
        <h2
          className="font-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl lg:text-4xl"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}
        >
          Neighborhood Watch Security Camera Project
        </h2>
        <p
          className="font-display text-lg font-bold uppercase tracking-wider text-amber-300 md:text-xl"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
        >
          &gt;&gt; Join · Support · Donate &lt;&lt;
        </p>

        <div className="grid w-full grid-cols-1 gap-6 border-t border-b border-white/20 py-8 md:grid-cols-3 md:gap-0">
          <div className="flex flex-col items-center gap-4 px-6 md:border-x md:border-white/20">
            <HandHelping className="h-12 w-12 text-white" />
            <h3 className="font-display text-xl font-bold uppercase text-white">Join</h3>
            <p className="text-sm leading-relaxed text-white/90">
              Volunteer to monitor our neighborhood
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-2 text-white">
              <Link href="/register">Get involved</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 px-6 md:border-r md:border-white/20">
            <Shield className="h-12 w-12 text-white" />
            <h3 className="font-display text-xl font-bold uppercase text-white">Support</h3>
            <p className="text-sm leading-relaxed text-white/90">
              Grow our security camera network
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-2 text-white">
              <Link href="/register">Support us</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-4 px-6">
            <DollarSign className="h-12 w-12 text-amber-400" />
            <h3 className="font-display text-xl font-bold uppercase text-white">Donate</h3>
            <p className="text-sm leading-relaxed text-white/90">
              Fund new safety cameras for our streets
            </p>
            <Button asChild size="lg" className="mt-2 bg-primary">
              <Link href="/donate">Donate now</Link>
            </Button>
          </div>
        </div>

        <p
          className="font-display text-lg font-bold uppercase tracking-wider text-white md:text-xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
          Together we keep our home safe
        </p>
      </div>
    </div>
  );
}

export function HeroContent() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="absolute inset-0">
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
        className="h-full w-full"
      >
        <CarouselContent className="ml-0 h-full">
          <CarouselItem className="pl-0">
            <HeroMainSlide />
          </CarouselItem>
          <CarouselItem className="pl-0">
            <CameraProjectSlide />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-4 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
        <CarouselNext className="right-4 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
