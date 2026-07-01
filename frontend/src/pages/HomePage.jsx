import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Code,
  BarChart3,
  Languages,
  Sparkles,
  Zap,
  Brain,
  ArrowRight,
  ChevronDown,
  Briefcase,
  Github,
  Linkedin,
  Instagram,
  Terminal,
  CheckCircle2,
  Trophy,
  Flame,
  Star,
  Users,
  BookOpen,
  Cpu,
  Lock,
  Play,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f] text-base-content">
      {/* ============ NAVBAR ============ */}
      <nav className="glass-navbar w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-4 sticky top-0 z-50">
        <motion.div whileHover={{ scale: 1.03 }}>
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/leetlab.svg" className="h-7 w-7" alt="LeetLab Logo" />
            <span className="text-xl font-bold gradient-text">LeetLab</span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login">
            <motion.button
              className="btn btn-ghost btn-sm text-sm font-medium"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </Link>
          <Link to="/signup">
            <motion.button
              className="btn-gradient btn btn-sm text-sm px-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Orbs - z-0 so they render above the section bg */}
        <div className="absolute top-10 left-10 w-[520px] h-[520px] bg-purple-900/30 rounded-full blur-3xl z-0 animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-[460px] h-[460px] bg-cyan-900/25 rounded-full blur-3xl z-0 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] bg-violet-950/20 rounded-full blur-3xl z-0" />
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.18]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        {/* Diagonal hatch */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, rgba(124,58,237,0.8) 0px, rgba(124,58,237,0.8) 1px, transparent 0px, transparent 50%)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          className="max-w-5xl mx-auto relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} custom={0} className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI-Powered Coding Platform
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-base-content">Code Smarter.</span>
            <br />
            <span className="gradient-text animate-text-shimmer bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]">
              Grow Faster.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-base sm:text-lg md:text-xl text-base-content/50 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Practice real interview problems, get{" "}
            <span className="text-primary font-semibold">AI-powered hints</span>,
            track your streaks, and climb the leaderboard — all in one place.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            variants={fadeInUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Link to="/signup">
              <motion.button
                className="btn-gradient btn btn-lg text-base px-8 gap-2 btn-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-5 h-5" />
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="btn btn-outline btn-lg text-base px-8 gap-2 border-base-content/20 hover:border-primary/60 hover:bg-primary/5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Play className="w-4 h-4" />
                View Problems
              </motion.button>
            </Link>
          </motion.div>

          {/* Hero stats strip */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-wrap justify-center gap-8 sm:gap-16"
          >
            {[
              { icon: <BookOpen className="w-4 h-4" />, num: "100+", label: "Practice Problems" },
              { icon: <Flame className="w-4 h-4" />, num: "Daily", label: "Streak Tracker" },
              { icon: <Cpu className="w-4 h-4" />, num: "AI", label: "Smart Hints" },
              { icon: <Trophy className="w-4 h-4" />, num: "4", label: "Languages" },
            ].map(({ icon, num, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-primary mb-0.5">{icon}
                  <span className="text-2xl sm:text-3xl font-bold gradient-text">{num}</span>
                </div>
                <span className="text-xs text-base-content/40 font-medium">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-base-content/20" />
        </motion.div>
      </section>

      {/* ============ FLOATING TERMINAL PREVIEW ============ */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #060d14 100%)" }}>
        {/* Section transition glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        {/* Cyan orb accent */}
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-900/20 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/15 rounded-full blur-3xl z-0" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Terminal card */}
          <div className="glass-card overflow-hidden shadow-2xl border border-primary/10">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-base-content/5 border-b border-base-content/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-base-content/30">
                <Terminal className="w-3 h-3" />
                solution.js — LeetLab Editor
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-success/15 text-success border border-success/20">
                  ✓ ACCEPTED
                </span>
              </div>
            </div>

            {/* Code area */}
            <div className="p-5 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed">
              <div className="flex">
                <div className="select-none pr-5 text-base-content/20 text-right" style={{ minWidth: "2.5rem" }}>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="text-base-content/80 overflow-x-auto">
                  <span className="text-violet-400">function </span>
                  <span className="text-emerald-400">twoSum</span>
                  <span className="text-base-content/60">(nums, target) {"{"}</span>{"\n"}
                  {"  "}<span className="text-violet-400">const </span>
                  <span className="text-sky-400">map</span>
                  <span className="text-base-content/60"> = </span>
                  <span className="text-violet-400">new </span>
                  <span className="text-emerald-400">Map</span>
                  <span className="text-base-content/60">();</span>{"\n"}
                  {"  "}<span className="text-violet-400">for </span>
                  <span className="text-base-content/60">(</span>
                  <span className="text-violet-400">let </span>
                  <span className="text-sky-400">i</span>
                  <span className="text-base-content/60"> = 0; i {"<"} nums.length; i++) {"{"}</span>{"\n"}
                  {"    "}<span className="text-violet-400">const </span>
                  <span className="text-sky-400">comp</span>
                  <span className="text-base-content/60"> = target - nums[i];</span>{"\n"}
                  {"    "}<span className="text-violet-400">if </span>
                  <span className="text-base-content/60">(map.</span>
                  <span className="text-emerald-400">has</span>
                  <span className="text-base-content/60">(comp)) </span>
                  <span className="text-violet-400">return </span>
                  <span className="text-base-content/60">[map.</span>
                  <span className="text-emerald-400">get</span>
                  <span className="text-base-content/60">(comp), i];</span>{"\n"}
                  {"    "}
                  <span className="text-base-content/60">map.</span>
                  <span className="text-emerald-400">set</span>
                  <span className="text-base-content/60">(nums[i], i);</span>{"\n"}
                  {"  "}<span className="text-base-content/60">{"}"}</span>{"\n"}
                  <span className="text-base-content/60">{"}"}</span>{"\n\n"}
                  <span className="text-base-content/30">{"// Runtime: 72ms · Memory: 44MB"}</span>
                </pre>
              </div>
            </div>

            {/* Bottom status bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-base-content/3 border-t border-base-content/5 text-xs text-base-content/30">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                All test cases passed
              </span>
              <span>JavaScript · Judge0</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ FEATURES BENTO GRID ============ */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #060d14 0%, #0a0614 50%, #0a0a0f 100%)" }}>
        {/* Section glow line top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        {/* BG orbs - z-0 visible */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-900/20 blur-3xl z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-900/15 blur-3xl z-0" />
        {/* Dot texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.10]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto relative z-10"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Why LeetLab?
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything to{" "}
            <span className="gradient-text">level up</span>
          </h2>
          <p className="text-base-content/50 text-base sm:text-lg font-medium">
            A full-stack coding practice environment built for developers who mean business
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto auto-rows-fr relative z-10">
          {/* Large card */}
          <motion.div
            className="sm:col-span-2 glass-card glass-card-hover p-6 sm:p-8 group cursor-default flex flex-col sm:flex-row gap-6 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">AI Code Assistant</h3>
              <p className="text-sm text-base-content/50 leading-relaxed">
                Stuck on a problem? Get intelligent, context-aware hints, complexity analysis, and step-by-step improvement suggestions powered by Google Gemini — without spoiling the solution.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Hints", "Analysis", "Improvements"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <FeatureCard
            icon={<Code className="w-6 h-6" />}
            title="Code & Submit"
            desc="Solve challenges with instant feedback and comprehensive test cases."
            gradient="from-emerald-500 to-teal-600"
            delay={1}
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Track Progress"
            desc="Detailed analytics on your solved problems, streaks and performance over time."
            gradient="from-amber-500 to-orange-600"
            delay={2}
          />
          <FeatureCard
            icon={<Languages className="w-6 h-6" />}
            title="Multi-Language"
            desc="Code in Python, JavaScript and Java with full syntax highlighting."
            gradient="from-cyan-500 to-blue-600"
            delay={3}
          />

          {/* Wide bottom card */}
          <motion.div
            className="sm:col-span-2 lg:col-span-1 glass-card glass-card-hover p-6 sm:p-8 group cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">Real-time Judge</h3>
            <p className="text-sm text-base-content/50 leading-relaxed">
              Execute code against multiple test cases with instant runtime and memory feedback via Judge0.
            </p>
          </motion.div>

          <FeatureCard
            icon={<Trophy className="w-6 h-6" />}
            title="Leaderboard"
            desc="Compete with others and climb the ranks to show off your skills."
            gradient="from-yellow-500 to-amber-600"
            delay={4}
          />
          {/* Smart Playlists - Large card taking two spaces */}
          <motion.div
            className="sm:col-span-2 glass-card glass-card-hover p-6 sm:p-8 group cursor-default flex flex-col sm:flex-row gap-6 items-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-base-content group-hover:text-primary transition-colors">Smart Playlists</h3>
              <p className="text-sm text-base-content/50 leading-relaxed">
                Organize problems into custom, curated playlists for focused study sessions. Group challenges by pattern, company prep, or personal favorites to track completion progress.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Company Prep", "Focused Patterns", "Custom Tracks"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF / MARQUEE STRIP ============ */}
      <section className="w-full py-12 overflow-hidden relative" style={{ background: "linear-gradient(90deg, #0d0717 0%, #070d18 50%, #0d0717 100%)" }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, pass) =>
            [
              "✦ Practice smarter",
              "✦ AI-powered hints",
              "✦ Real interview problems",
              "✦ Track your growth",
              "✦ Multi-language support",
              "✦ Instant feedback",
              "✦ Compete on leaderboard",
              "✦ Build streaks",
            ].map((text, i) => (
              <span
                key={`${pass}-${i}`}
                className="text-sm font-semibold text-base-content/40 tracking-wide"
              >
                {text}
              </span>
            ))
          )}
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="w-full py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0a0f 0%, #07080f 50%, #0a0a0f 100%)" }}>
        {/* Glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        {/* Orbs - z-0 */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/25 blur-3xl animate-pulse z-0" />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/20 blur-3xl animate-pulse z-0"
          style={{ animationDelay: "2s" }}
        />
        {/* CTA dot texture */}
        <div
          className="absolute inset-0 z-0 opacity-[0.10]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(6,182,212,0.5) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 mb-6">
              <Flame className="w-3.5 h-3.5" />
              Join developers levelling up every day
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to ace your next{" "}
              <span className="gradient-text">coding interview?</span>
            </h2>
            <p className="text-base sm:text-lg text-base-content/50 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
              Start solving problems, build consistent streaks, and track your growth — completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/signup">
                <motion.button
                  className="btn-gradient btn btn-lg text-base px-10 gap-2 btn-glow"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Zap className="w-5 h-5" />
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {[
              { num: "100+", label: "Coding Problems" },
              { num: "Daily", label: "Streak Tracker" },
              { num: "Instant", label: "Code Run" },
              { num: "24/7", label: "AI Support" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">
                  {stat.num}
                </div>
                <div className="text-xs sm:text-sm text-base-content/40 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="w-full relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#050508] border-t border-purple-500/10 mt-auto select-none">
        {/* Ambient Glows */}
        <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-purple-900/15 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 pt-8 pb-3 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 sm:gap-16 mb-6 max-w-[90rem] mx-auto">
            {/* Brand */}
            <div className="max-w-sm">
              <Link to="/" className="flex items-center gap-2.5 h-8 mb-4 group">
                <img src="/leetlab.svg" className="h-8 w-8 group-hover:scale-105 transition-transform" alt="LeetLab Logo" />
                <span className="text-2xl font-bold gradient-text leading-none">LeetLab</span>
              </Link>
              <p className="text-sm sm:text-base text-base-content/50 leading-relaxed font-medium">
                Your ultimate platform for mastering coding interviews, leveling up your algorithms, and tracking your daily streak.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-12 sm:gap-20">
              <FooterColumn
                title="Explore Platform"
                links={[
                  { label: "Coding Problems", href: "/problems" },
                  { label: "Global Standings", href: "/leaderboard" },
                  { label: "Smart Playlists", href: "/playlists" },
                ]}
              />
              <FooterColumn
                title="User Workspace"
                links={[
                  { label: "My Profile", href: "/profile" },
                  { label: "Sign In", href: "/login" },
                  { label: "Create Account", href: "/signup" },
                  { label: "Reset Password", href: "/forgot-password" },
                ]}
              />
            </div>
          </div>

          {/* Glowing Gradient Divider */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent relative my-6 max-w-[90rem] mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-sm" />
          </div>

          <div className="flex flex-col md:flex-row justify-between md:items-end items-center gap-6 max-w-[90rem] mx-auto">
            <p className="text-lg text-base-content/40 order-2 md:order-1 font-medium">
              Built with <span className="text-rose-500 animate-pulse text-xl">❤️</span> by{" "}
              <span className="font-semibold text-primary/80 hover:text-primary transition-colors cursor-default">Amarnath Kumar</span>
            </p>
            <p className="text-lg text-base-content/40 order-1 md:order-2 font-medium">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold gradient-text">LeetLab</span>. All rights reserved.
            </p>
            <div className="flex gap-2.5 order-3">
              {[
                { href: "https://amar-portfolio-psi.vercel.app/", icon: <Briefcase className="w-4 h-4" /> },
                { href: "https://github.com/Amarsah15", icon: <Github className="w-4 h-4" /> },
                { href: "https://linkedin.com/in/Amarnath15", icon: <Linkedin className="w-4 h-4" /> },
                { href: "https://instagram.com/_amar_sah_", icon: <Instagram className="w-4 h-4" /> },
              ].map(({ href, icon }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-base-content/5 border border-base-content/5 hover:border-primary/30 flex items-center justify-center text-base-content/40 hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============ SUB-COMPONENTS ============ */

function FeatureCard({ icon, title, desc, gradient, delay }) {
  return (
    <motion.div
      className="glass-card glass-card-hover p-6 sm:p-8 group cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.08, duration: 0.5 }}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-base-content group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-base-content/50 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-bold text-sm sm:text-base tracking-wide text-base-content/85 h-8 flex items-center mb-4">{title}</h4>
      <ul className="space-y-3 text-sm sm:text-base text-base-content/45 font-medium">
        {links.map((link, i) => {
          const isObject = typeof link === "object";
          const label = isObject ? link.label : link;
          const href = isObject ? link.href : "#";
          return (
            <li key={i}>
              {href.startsWith("/") ? (
                <Link to={href} className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">{label}</Link>
              ) : (
                <a href={href} className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">{label}</a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
