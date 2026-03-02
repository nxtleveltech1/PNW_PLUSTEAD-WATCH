"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Autoplay from "embla-carousel-autoplay";
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
      className="flex h-full min-h-full w-full flex-col items-center justify-center px-5 py-6 text-center md:px-10 md:py-12 lg:px-16 lg:py-14"
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
        className="relative mb-4 aspect-[31/10] w-[min(58vw,620px)] sm:w-[min(70vw,620px)] md:mb-8 md:w-[min(84vw,620px)] lg:mb-10"
      >
        <Image
          src="/images/full%20logo.jpg"
          alt="Plumstead Neighbourhood Watch full logo"
          fill
          className="object-contain drop-shadow-[0_10px_36px_rgba(0,0,0,0.48)]"
          sizes="(max-width: 768px) 280px, (max-width: 1024px) 520px, 620px"
          priority
        />
      </motion.div>
      <motion.h1
        variants={fadeUp}
        className="max-w-4xl font-display text-[clamp(1.75rem,5.3vw,4.8rem)] font-bold tracking-tight text-white"
        style={{ textShadow: "0 4px 24px rgba(0,0,0,0.42)" }}
      >
        Be the eyes and ears of the area.
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-2 font-display text-[clamp(1rem,2.2vw,1.6rem)] font-bold tracking-wide text-amber-300 md:mt-4"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.48)" }}
      >
        Together, we can fight CRIME.
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="mx-auto mt-3 hidden max-w-3xl text-sm leading-relaxed text-white/90 sm:block md:mt-6 md:text-lg"
        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.34)" }}
      >
        Stay connected to verified local incident updates, rapid response channels, and coordinated
        neighbourhood safety actions.
      </motion.p>

      <motion.div variants={fadeUp} className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2 md:mt-5">
        <span className="stat-chip">Control room 24/7</span>
        <span className="stat-chip">80+ active patrollers</span>
        <span className="stat-chip">Founded 2007</span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 md:mt-10"
      >
        <Button
          asChild
          size="lg"
          className="btn-glow w-full bg-primary px-6 py-4 text-sm font-semibold shadow-[0_10px_34px_rgba(25,65,156,0.45)] hover:bg-primary/92 sm:w-auto sm:min-w-[210px] sm:px-8 sm:py-6 sm:text-base"
        >
          <Link href="/register">Register as a member</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full border-white/60 bg-transparent px-5 py-4 text-sm font-medium text-white hover:border-white hover:bg-white/10 sm:w-auto sm:min-w-[148px] sm:px-6 sm:py-6"
        >
          <Link href="/donate">Donate</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

function CameraProjectSlide() {
  return (
    <div className="relative flex h-full min-h-full w-full flex-col items-center justify-center px-5 py-6 text-center md:px-10 md:py-12 lg:px-16 lg:py-14">
      <Image
        src="/images/camera-project-bg.png"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-4 md:gap-6">
        <h2
          className="max-w-4xl text-balance font-display text-[clamp(1.5rem,4.6vw,3.75rem)] font-bold uppercase tracking-tight text-white"
          style={{ textShadow: "0 3px 20px rgba(0,0,0,0.7)" }}
        >
          Neighborhood Watch Security Camera Project
        </h2>
        <p
          className="font-display text-sm font-bold uppercase tracking-[0.14em] text-amber-300 md:text-lg"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          &raquo; Join · Support · Donate &laquo;
        </p>

        <div className="grid w-full grid-cols-3 gap-2 py-2 sm:gap-4 sm:py-4 md:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-xl border border-white/30 bg-black/25 px-3 py-4 backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-6">
            <HandHelping className="h-8 w-8 text-white drop-shadow-lg sm:h-12 sm:w-12" />
            <h3 className="font-display text-sm font-bold uppercase text-white sm:text-xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Join</h3>
            <p className="hidden text-sm font-medium leading-relaxed text-white/90 sm:block" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Volunteer to monitor our neighborhood
            </p>
            <Button asChild size="sm" className="mt-1 min-w-0 bg-white/20 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 sm:mt-2 sm:min-w-[140px] sm:text-sm">
              <Link href="/register">Get involved</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-white/30 bg-black/25 px-3 py-4 backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-6">
            <Shield className="h-8 w-8 text-white drop-shadow-lg sm:h-12 sm:w-12" />
            <h3 className="font-display text-sm font-bold uppercase text-white sm:text-xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Support</h3>
            <p className="hidden text-sm font-medium leading-relaxed text-white/90 sm:block" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Grow our security camera network
            </p>
            <Button asChild size="sm" className="mt-1 min-w-0 bg-white/20 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/30 sm:mt-2 sm:min-w-[140px] sm:text-sm">
              <Link href="/register">Support us</Link>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-xl border border-white/30 bg-black/25 px-3 py-4 backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-6">
            <DollarSign className="h-8 w-8 text-amber-400 drop-shadow-lg sm:h-12 sm:w-12" />
            <h3 className="font-display text-sm font-bold uppercase text-white sm:text-xl" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Donate</h3>
            <p className="hidden text-sm font-medium leading-relaxed text-white/90 sm:block" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              Fund new safety cameras for our streets
            </p>
            <Button asChild size="sm" className="mt-1 min-w-0 bg-primary text-xs font-semibold shadow-lg sm:mt-2 sm:min-w-[140px] sm:text-sm">
              <Link href="/donate">Donate now</Link>
            </Button>
          </div>
        </div>

        <p
          className="font-display text-base font-bold uppercase tracking-wider text-white md:text-xl"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
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
  const autoplayPlugin = React.useRef(
    Autoplay({
      delay: 6500,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      playOnInit: true,
    })
  );

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    autoplayPlugin.current.play();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="absolute inset-0">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[autoplayPlugin.current]}
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
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`flex min-h-[44px] min-w-[44px] items-center justify-center`}
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === current ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </Carousel>
    </div>
  );
}
