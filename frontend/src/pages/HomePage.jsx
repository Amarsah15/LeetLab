import React from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content overflow-hidden">
      {/* ============ NAVBAR ============ */}
      <nav className="glass-navbar w-full flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-3 sticky top-0 z-50">
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
      <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full bg-primary/20 blur-[80px] sm:blur-[120px] animate-mesh" />
          <div className="absolute bottom-1/4 right-1/4 w-[220px] sm:w-[400px] h-[220px] sm:h-[400px] rounded-full bg-secondary/15 blur-[80px] sm:blur-[120px] animate-mesh delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[300px] h-[180px] sm:h-[300px] rounded-full bg-accent/10 blur-[60px] sm:blur-[100px] animate-mesh delay-1500" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            custom={0}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Coding Platform
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            <span className="text-base-content">Practice. Learn.</span>
            <br />
            <span className="gradient-text animate-text-shimmer bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto]">
              Grow.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-base sm:text-lg md:text-xl text-base-content/50 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
          >
            Master coding interviews with a powerful practice platform. Solve
            problems, get{" "}
            <span className="text-primary font-semibold">AI-powered hints</span>
            , and track your progress in real-time.
          </motion.p>

          {/* Stats badges */}
          <motion.div
            variants={fadeInUp}
            custom={3}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10"
          >
            <AnimatedStat number="50+" label="Problems" />
            <AnimatedStat number="10+" label="Users" />
            <AnimatedStat number="AI" label="Powered" />
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeInUp}
            custom={4}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/signup">
              <motion.button
                className="btn-gradient btn btn-lg text-base px-8 gap-2 btn-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-base-content/20" />
        </motion.div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-base-content">
            Everything you need to
            <span className="gradient-text"> level up</span>
          </h2>
          <p className="text-base-content/50 text-base sm:text-lg font-medium">
            A comprehensive toolkit designed for developers who are serious
            about improving
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Code className="w-6 h-6" />}
            title="Code & Submit"
            desc="Solve coding challenges with instant feedback and comprehensive test cases to validate your solutions."
            gradient="from-violet-500 to-purple-600"
            delay={0}
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Track Progress"
            desc="Monitor your solved problems, performance stats, and improvement over time with detailed analytics."
            gradient="from-emerald-500 to-teal-600"
            delay={1}
          />
          <FeatureCard
            icon={<Languages className="w-6 h-6" />}
            title="Multi-Language"
            desc="Code in Python, JavaScript, and Java with full syntax highlighting and language-specific support."
            gradient="from-amber-500 to-orange-600"
            delay={2}
          />
          <FeatureCard
            icon={<Brain className="w-6 h-6" />}
            title="AI Assistant"
            desc="Get intelligent hints, complexity analysis, and improvement suggestions powered by Google Gemini."
            gradient="from-pink-500 to-rose-600"
            delay={3}
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Smart Playlists"
            desc="Organize problems into custom playlists for focused and structured practice sessions."
            gradient="from-cyan-500 to-blue-600"
            delay={4}
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Real-time Judge"
            desc="Execute your code against multiple test cases with instant runtime and memory analysis."
            gradient="from-indigo-500 to-violet-600"
            delay={5}
          />
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="w-full py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        {/* BG gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-base-content">
              Ready to level up your
              <span className="gradient-text"> coding skills?</span>
            </h2>
            <p className="text-base sm:text-lg text-base-content/50 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
              Join developers who are already sharpening their skills. Start
              solving problems, track your progress, and achieve your goals.
            </p>
            <Link to="/signup">
              <motion.button
                className="btn-gradient btn btn-lg text-base px-10 gap-2 btn-glow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="w-5 h-5" />
                Start Your Journey
              </motion.button>
            </Link>
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
              { num: "50+", label: "Coding Problems" },
              { num: "10+", label: "Active Users" },
              { num: "50+", label: "Solutions" },
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
      <footer className="w-full border-t border-base-content/5 mt-auto">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 sm:gap-16 mb-8 max-w-6xl mx-auto">
            {/* Brand */}
            <div className="max-w-xs">
              <Link to="/" className="flex items-center gap-2.5 mb-3">
                <img
                  src="/leetlab.svg"
                  className="h-7 w-7"
                  alt="LeetLab Logo"
                />
                <span className="text-xl font-bold gradient-text">LeetLab</span>
              </Link>
              <p className="text-sm text-base-content/40 leading-relaxed">
                Your ultimate platform for mastering coding interviews and
                improving problem-solving skills.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-12 sm:gap-16">
              <FooterColumn
                title="Quick Links"
                links={[
                  { label: "Problems", href: "/problems" },
                  { label: "Leaderboard", href: "/leaderboard" },
                  { label: "Playlists", href: "/playlists" },
                ]}
              />
              <FooterColumn
                title="Resources"
                links={[
                  "Explore Topics",
                  "Interview Prep",
                  "Study Plans",
                  "Code Library",
                ]}
              />
              <FooterColumn
                title="Company"
                links={[
                  "About Us",
                  "Contact",
                  "Privacy Policy",
                  "Terms of Service",
                ]}
              />
            </div>
          </div>

          <div className="gradient-divider my-8 max-w-6xl mx-auto" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
            <p className="text-xs text-base-content/30 order-2 md:order-1">
              Built with <span className="text-red-400">❤️</span> by{" "}
              <span className="font-semibold text-primary/70">
                Amarnath Kumar
              </span>
            </p>
            <p className="text-xs text-base-content/30 order-1 md:order-2">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold gradient-text">LeetLab</span>. All
              rights reserved.
            </p>
            <div className="flex gap-2 order-3">
              {[
                {
                  href: "https://amar-portfolio-psi.vercel.app/",
                  icon: <Briefcase className="w-3.5 h-3.5" />,
                },
                {
                  href: "https://github.com/Amarsah15",
                  icon: <Github className="w-3.5 h-3.5" />,
                },
                {
                  href: "https://linkedin.com/in/Amarnath15",
                  icon: <Linkedin className="w-3.5 h-3.5" />,
                },
                {
                  href: "https://instagram.com/_amar_sah_",
                  icon: <Instagram className="w-3.5 h-3.5" />,
                },
              ].map(({ href, icon }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-base-content/5 hover:bg-primary/10 flex items-center justify-center text-base-content/30 hover:text-primary transition-all"
                  whileHover={{ scale: 1.1 }}
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
      {/* Icon */}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>

      <h3 className="text-lg font-bold mb-2 text-base-content group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-base-content/50 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function AnimatedStat({ number, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl sm:text-3xl font-bold gradient-text">
        {number}
      </span>
      <span className="text-xs text-base-content/40 font-medium mt-0.5">
        {label}
      </span>
    </div>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold text-sm text-base-content/70 mb-3">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-base-content/30">
        {links.map((link, i) => {
          const isObject = typeof link === "object";
          const label = isObject ? link.label : link;
          const href = isObject ? link.href : "#";

          return (
            <li key={i}>
              {href.startsWith("/") ? (
                <Link
                  to={href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {label}
                </Link>
              ) : (
                <a
                  href={href}
                  className="hover:text-primary transition-colors duration-200"
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
