import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hls from "hls.js";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const HLS_SOURCE = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const email = "ayushiamitagrawal@gmail.com";
const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
const linkedInUrl = "https://www.linkedin.com/in/ayushi-agrawal/";
const githubUrl = "https://github.com/ayushivagrawal";

const roles = ["Python Developer", "AI Engineer", "Financial Systems Builder", "Production Debugger"];

const workItems = [
  {
    title: "Annuity Rules Engine Recovery",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    problem:
      "Inherited a state-specific annuity risk application with no original engineers, no POC, and no knowledge base for critical rule logic.",
    result:
      "Improved approval accuracy by 24%, reduced vulnerabilities from 40% to 10%, raised coverage from 0% to 80%+, and sped up advisor processing by 25%+.",
    span: "md:col-span-7",
    ratio: "aspect-[1.18/1]",
  },
  {
    title: "AI Code Agent",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80",
    problem:
      "Developers lose time manually reading unfamiliar Python repositories before they can answer architecture, bug, review, or documentation questions.",
    result:
      "Built a deployed agentic AI prototype using FastAPI, Streamlit, GitHub API, ChromaDB, LangGraph, LangSmith, guardrails, logging, and GitHub Actions.",
    span: "md:col-span-5",
    ratio: "aspect-[0.88/1]",
  },
  {
    title: "Vendor Data Dashboard Pipeline",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    problem:
      "Raw annuity vendor files in S3 were not cleaned, query-ready, or structured for dashboard creation.",
    result:
      "Processed 60-70 files across four annuity types, built 5+ Glue Crawlers, modeled Athena data, and created 30+ QuickSight datasets.",
    span: "md:col-span-5",
    ratio: "aspect-[0.92/1]",
  },
  {
    title: "Production Observability Playbook",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    problem:
      "Repeated failures were hard to diagnose because logs, rule flow, duplicate code paths, and tests did not tell the same story.",
    result:
      "Reframed debugging around traceability, documentation, test depth, and maintainable production behavior.",
    span: "md:col-span-7",
    ratio: "aspect-[1.2/1]",
  },
];

const journalEntries = [
  {
    title: "What production failures taught me about readable software",
    date: "May 2026",
    read: "4 min",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Designing AI code agents with retrieval, guardrails, and traces",
    date: "Apr 2026",
    read: "6 min",
    image: "https://images.unsplash.com/photo-1675557009875-436f71457475?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Turning vendor files into analysis-ready financial dashboards",
    date: "Mar 2026",
    read: "5 min",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Why secure systems need test coverage people can trust",
    date: "Feb 2026",
    read: "3 min",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=500&q=80",
  },
];

const explorationItems = [
  {
    title: "Trace maps",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80",
    rotate: "-rotate-3",
  },
  {
    title: "Rule flow studies",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=700&q=80",
    rotate: "rotate-2",
  },
  {
    title: "Agent memory",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=700&q=80",
    rotate: "rotate-3",
  },
  {
    title: "Data contracts",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=700&q=80",
    rotate: "-rotate-2",
  },
  {
    title: "Coverage plans",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80",
    rotate: "rotate-1",
  },
  {
    title: "Dashboard systems",
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=700&q=80",
    rotate: "-rotate-3",
  },
];

function useHlsVideo(videoRef: React.RefObject<HTMLVideoElement>, flip = false) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SOURCE;
    }

    video.play().catch(() => undefined);

    return () => {
      hls?.destroy();
    };
  }, [videoRef, flip]);
}

function VideoBackground({ flipped = false, heavy = false }: { flipped?: boolean; heavy?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useHlsVideo(videoRef, flipped);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        className={`absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover ${
          flipped ? "scale-y-[-1]" : ""
        }`}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className={`absolute inset-0 ${heavy ? "bg-black/60" : "bg-black/20"}`} />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const words = ["Design", "Create", "Inspire"];
  const word = words[Math.min(words.length - 1, Math.floor(count / 34))];

  useEffect(() => {
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - started) / 2700, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(onComplete, 400);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="absolute left-6 top-6 text-xs uppercase tracking-[0.3em] text-muted md:left-10 md:top-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Portfolio
      </motion.div>
      <div className="absolute inset-0 grid place-items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={word}
            className="font-display text-4xl italic text-text-primary/80 md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {word}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-8 right-6 font-display text-6xl tabular-nums text-text-primary md:bottom-10 md:right-10 md:text-8xl lg:text-9xl">
        {String(count).padStart(3, "0")}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-stroke/50">
        <div
          className="accent-gradient h-full origin-left"
          style={{
            transform: `scaleX(${count / 100})`,
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const links = [
    ["Home", "hero"],
    ["Work", "work"],
    ["Resume", "resume"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
      <nav
        className={`inline-flex items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
        aria-label="Primary navigation"
      >
        <button
          className="group grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(90deg,#89AACC_0%,#4E85BF_100%)] p-[2px] transition-transform hover:scale-110 hover:bg-[linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]"
          onClick={() => scrollTo("hero")}
          aria-label="Ayushi Agrawal home"
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-bg font-display text-[13px] italic text-text-primary">
            AA
          </span>
        </button>
        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        {links.map(([label, id]) =>
          id === "resume" ? (
            <a
              key={id}
              href="/Ayushi_Agrawal_Resume.docx"
              download
              className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
            >
              {label}
            </a>
          ) : (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-full px-3 py-1.5 text-xs text-muted transition hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
            >
              {label}
            </button>
          ),
        )}
        <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
        <a
          className="gradient-border group relative rounded-full p-[2px] text-xs text-text-primary sm:text-sm"
          href={emailUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span className="flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2">
            Say hi <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ ease: "power3.out" })
        .fromTo(".name-reveal", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, delay: 0.1 })
        .fromTo(
          ".blur-in",
          { opacity: 0, filter: "blur(10px)", y: 20 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
          "-=0.6",
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="relative grid min-h-screen place-items-center overflow-hidden px-6 py-32 text-center">
      <VideoBackground />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-muted">Collection '26</div>
        <h1 className="name-reveal mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary md:text-8xl lg:text-9xl">
          Ayushi Agrawal
        </h1>
        <p className="blur-in mb-5 text-lg text-text-primary/90 md:text-2xl">
          A{" "}
          <span key={roleIndex} className="inline-block animate-role-fade-in font-display italic text-text-primary">
            {roles[roleIndex]}
          </span>{" "}
          based in the USA.
        </p>
        <p className="blur-in mx-auto mb-12 max-w-xl text-sm leading-7 text-muted md:text-base">
          I build financial applications and AI tools that help teams understand what went wrong, improve what is
          fragile, and ship production systems with fewer failures.
        </p>
        <div className="blur-in inline-flex flex-wrap justify-center gap-4">
          <a className="button-solid" href="#work">
            See Works
          </a>
          <a className="button-outline" href={emailUrl} target="_blank" rel="noreferrer">
            Reach out <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">Scroll</div>
        <div className="relative mx-auto h-10 w-px overflow-hidden bg-stroke">
          <div className="absolute left-0 top-0 h-5 w-px animate-scroll-down bg-text-primary" />
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  italic,
  subtext,
  action,
}: {
  eyebrow: string;
  title: string;
  italic: string;
  subtext: string;
  action?: string;
}) {
  return (
    <motion.div
      className="mb-10 flex flex-col justify-between gap-6 md:mb-12 md:flex-row md:items-end"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div>
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-8 bg-stroke" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</span>
        </div>
        <h2 className="font-body text-4xl font-semibold leading-none tracking-tight text-text-primary md:text-6xl">
          {title} <em className="font-display font-normal italic">{italic}</em>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted md:text-base">{subtext}</p>
      </div>
      {action && (
        <a className="gradient-border hidden rounded-full p-[2px] md:inline-flex" href="#contact">
          <span className="inline-flex items-center gap-2 rounded-full bg-bg px-5 py-3 text-sm text-text-primary">
            {action} <ArrowRight className="h-4 w-4" />
          </span>
        </a>
      )}
    </motion.div>
  );
}

function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          title="Featured"
          italic="projects"
          subtext="Production debugging, AI engineering, and data foundations from concept to launch."
          action="View all work"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {workItems.map((item) => (
            <motion.article
              key={item.title}
              className={`group relative overflow-hidden rounded-3xl border border-stroke bg-surface ${item.ratio} ${item.span}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <img
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                src={item.image}
                alt=""
              />
              <div className="halftone absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/60">Problem</p>
                <h3 className="mb-3 max-w-lg text-2xl font-semibold leading-tight text-white md:text-3xl">{item.title}</h3>
                <p className="max-w-2xl text-sm leading-6 text-white/72">{item.problem}</p>
              </div>
              <div className="absolute inset-0 grid place-items-center bg-bg/70 opacity-0 backdrop-blur-lg transition duration-300 group-hover:opacity-100">
                <div className="gradient-border rounded-full p-[2px]">
                  <div className="max-w-[88vw] rounded-full bg-white px-5 py-3 text-center text-sm text-bg md:px-7">
                    <span>View - </span>
                    <span className="font-display italic">{item.title}</span>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs text-white/80 backdrop-blur">
                {item.result.split(",")[0]}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          title="Recent"
          italic="thoughts"
          subtext="Notes on production behavior, agentic AI, data pipelines, and building systems the next engineer can understand."
          action="View all"
        />
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <motion.article
              key={entry.title}
              className="group flex items-center gap-4 rounded-[40px] border border-stroke bg-surface/30 p-4 transition hover:bg-surface sm:rounded-full sm:pr-7 md:gap-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              viewport={{ once: true }}
            >
              <img className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24" src={entry.image} alt="" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium leading-snug text-text-primary md:text-xl">{entry.title}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-muted">
                  <span>{entry.date}</span>
                  <span>{entry.read}</span>
                </div>
              </div>
              <ArrowUpRight className="hidden h-5 w-5 text-muted transition group-hover:text-text-primary sm:block" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProfileBand() {
  return (
    <section className="bg-bg py-16 md:py-24" aria-labelledby="profile-title">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 md:grid-cols-[0.82fr_1.18fr] md:px-10 lg:px-16">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-stroke bg-surface"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <img
            className="aspect-[0.86/1] h-full w-full object-cover object-center"
            src="/ayushi-headshot.png"
            alt="Ayushi Agrawal"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/65 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 backdrop-blur">
            USA based
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="mb-4 flex items-center gap-4">
            <span className="h-px w-8 bg-stroke" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">Point of View</span>
          </div>
          <h2 id="profile-title" className="font-body text-4xl font-semibold leading-none tracking-tight text-text-primary md:text-6xl">
            Systems should be <em className="font-display font-normal italic">traceable</em>
          </h2>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            I do not see software engineering as just writing code. I think about every application in terms of whether
            the next engineer can understand it, trace it, secure it, and change it without breaking something else.
          </p>
          <p className="mt-6 border-l-2 border-[#89AACC] pl-5 text-lg font-semibold leading-8 text-text-primary md:text-2xl">
            Good software is readable, documented, tested, observable, and strong enough for production.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Explorations() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<(typeof explorationItems)[number] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !contentRef.current) return;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.to(leftRef.current, {
        y: -260,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(rightRef.current, {
        y: 260,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const columns = useMemo(
    () => [explorationItems.filter((_, index) => index % 2 === 0), explorationItems.filter((_, index) => index % 2 === 1)],
    [],
  );

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] overflow-hidden bg-bg">
      <div ref={contentRef} className="relative z-10 grid h-screen place-items-center px-6 text-center">
        <div>
          <div className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Explorations</div>
          <h2 className="font-body text-5xl font-semibold leading-none tracking-tight text-text-primary md:text-7xl">
            Visual <em className="font-display font-normal italic">playground</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted md:text-base">
            Interface studies for traceability, retrieval workflows, dashboard thinking, and production system maps.
          </p>
          <a className="button-outline mt-8" href={emailUrl} target="_blank" rel="noreferrer">
            Talk through a system <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 top-0 z-20 mx-auto grid max-w-[1400px] grid-cols-2 gap-12 px-6 py-[42vh] md:gap-40 md:px-16">
        <div ref={leftRef} className="flex flex-col items-end gap-24">
          {columns[0].map((item) => (
            <ExplorationCard key={item.title} item={item} onClick={() => setLightbox(item)} />
          ))}
        </div>
        <div ref={rightRef} className="mt-40 flex flex-col gap-24">
          {columns[1].map((item) => (
            <ExplorationCard key={item.title} item={item} onClick={() => setLightbox(item)} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightbox && (
          <motion.button
            className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/80 p-6 backdrop-blur"
            onClick={() => setLightbox(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close image preview"
          >
            <motion.img
              className="max-h-[82vh] max-w-[92vw] rounded-3xl object-contain"
              src={lightbox.image}
              alt={lightbox.title}
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

function ExplorationCard({ item, onClick }: { item: (typeof explorationItems)[number]; onClick: () => void }) {
  return (
    <button
      className={`group relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-black/40 ${item.rotate}`}
      onClick={onClick}
    >
      <img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={item.image} alt={item.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-80" />
      <span className="absolute bottom-5 left-5 text-left text-sm font-medium text-white">{item.title}</span>
    </button>
  );
}

function Stats() {
  const stats = [
    ["3+", "Years Experience"],
    ["95+", "Projects Done"],
    ["200%", "Satisfied Clients"],
  ];

  return (
    <section id="resume" className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-px overflow-hidden rounded-3xl border border-stroke bg-stroke px-0 md:grid-cols-3">
        {stats.map(([value, label]) => (
          <div key={label} className="bg-surface px-8 py-12 text-center md:py-16">
            <div className="mb-3 bg-[linear-gradient(90deg,#f5f5f5,#89AACC)] bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
              {value}
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-[1200px] px-6 text-center">
        <a className="button-outline" href="/Ayushi_Agrawal_Resume.docx" download>
          Download resume <Download className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function ContactFooter() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20">
      <VideoBackground flipped heavy />
      <div className="relative z-10">
        <div className="mb-12 overflow-hidden whitespace-nowrap">
          <div ref={marqueeRef} className="inline-flex font-display text-7xl italic text-white/10 md:text-9xl">
            {Array.from({ length: 20 }, (_, index) => (
              <span key={index} className="pr-8">
                BUILDING THE FUTURE -
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-5 text-xs uppercase tracking-[0.3em] text-muted">Let's Talk</div>
          <h2 className="font-body text-5xl font-semibold leading-none tracking-tight text-text-primary md:text-7xl">
            Build software that holds up.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted md:text-base">
            Want to talk about production-ready software, financial systems, or AI engineering tools?
          </p>
          <a className="gradient-border mt-9 inline-flex rounded-full p-[2px]" href={emailUrl} target="_blank" rel="noreferrer">
            <span className="inline-flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-sm font-semibold text-bg">
              Email Ayushi <Mail className="h-4 w-4" />
            </span>
          </a>
          <div className="mt-4 text-sm text-muted">{email}</div>
        </div>
        <div className="mx-auto mt-16 flex max-w-[1200px] flex-col items-center justify-between gap-5 px-6 text-sm text-muted md:flex-row md:px-10 lg:px-16">
          <div className="flex items-center gap-4">
            <a className="inline-flex items-center gap-1 transition hover:text-text-primary" href={linkedInUrl} target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a className="inline-flex items-center gap-1 transition hover:text-text-primary" href={githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
            <span>Available for projects</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SelectedWorks />
      <Journal />
      <ProfileBand />
      <Explorations />
      <Stats />
      <ContactFooter />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <HomePage />
            </motion.main>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}</AnimatePresence>
      <AnimatedRoutes />
      <a
        className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 place-items-center rounded-full border border-white/10 bg-surface text-muted backdrop-blur transition hover:text-text-primary md:grid"
        href="#hero"
        aria-label="Back to top"
      >
        <ArrowDown className="h-4 w-4 rotate-180" />
      </a>
    </>
  );
}
