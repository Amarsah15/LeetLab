import { Code, Terminal, FileCode, Braces, Hash, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const codeSnippets = [
    // Snippet 1: Two Sum (Syntax highlighted)
    (
      <span>
        <span className="text-purple-400">function</span> <span className="text-yellow-400 font-semibold">twoSum</span>(<span className="text-orange-400">nums</span>, <span className="text-orange-400">target</span>) &#123;{"\n"}
        {"  "}<span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> <span className="text-cyan-400">Map</span>();{"\n"}
        {"  "}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-cyan-400">0</span>; i &lt; nums.<span className="text-blue-400">length</span>; i++) &#123;{"\n"}
        {"    "}<span className="text-purple-400">const</span> comp = target - nums[i];{"\n"}
        {"    "}<span className="text-purple-400">if</span> (map.<span className="text-yellow-400">has</span>(comp)) &#123;{"\n"}
        {"      "}<span className="text-purple-400">return</span> [map.<span className="text-yellow-400">get</span>(comp), i];{"\n"}
        {"    "}&#125;{"\n"}
        {"    "}map.<span className="text-yellow-400">set</span>(nums[i], i);{"\n"}
        {"  "}&#125;{"\n"}
        {"  "}<span className="text-purple-400">return</span> [];{"\n"}
        &#125;
      </span>
    ),
    // Snippet 2: Reverse List (Syntax highlighted)
    (
      <span>
        <span className="text-purple-400">class</span> <span className="text-cyan-400">ListNode</span> &#123;{"\n"}
        {"  "}<span className="text-yellow-400">constructor</span>(<span className="text-orange-400">val</span> = <span className="text-cyan-400">0</span>, <span className="text-orange-400">next</span> = <span className="text-purple-400">null</span>) &#123;{"\n"}
        {"    "}<span className="text-purple-400">this</span>.val = val;{"\n"}
        {"    "}<span className="text-purple-400">this</span>.next = next;{"\n"}
        {"  "}&#125;{"\n"}
        &#125;{"\n\n"}
        <span className="text-purple-400">function</span> <span className="text-yellow-400 font-semibold">reverseList</span>(<span className="text-orange-400">head</span>) &#123;{"\n"}
        {"  "}<span className="text-purple-400">let</span> prev = <span className="text-purple-400">null</span>;{"\n"}
        {"  "}<span className="text-purple-400">let</span> current = head;{"\n"}
        {"  "}<span className="text-purple-400">while</span> (current) &#123;{"\n"}
        {"    "}<span className="text-purple-400">const</span> next = current.next;{"\n"}
        {"    "}current.next = prev;{"\n"}
        {"    "}prev = current;{"\n"}
        {"    "}current = next;{"\n"}
        {"  "}&#125;{"\n"}
        {"  "}<span className="text-purple-400">return</span> prev;{"\n"}
        &#125;
      </span>
    ),
    // Snippet 3: Valid Parentheses (Syntax highlighted)
    (
      <span>
        <span className="text-purple-400">function</span> <span className="text-yellow-400 font-semibold">isValid</span>(<span className="text-orange-400">s</span>) &#123;{"\n"}
        {"  "}<span className="text-purple-400">const</span> stack = [];{"\n"}
        {"  "}<span className="text-purple-400">const</span> map = &#123;{"\n"}
        {"    "}<span className="text-green-400">'('</span>: <span className="text-green-400">')'</span>,{"\n"}
        {"    "}<span className="text-green-400">'{'</span>: <span className="text-green-400">'}'</span>,{"\n"}
        {"    "}<span className="text-green-400">'['</span>: <span className="text-green-400">']'</span>{"\n"}
        {"  "}&#125;;{"\n\n"}
        {"  "}<span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-cyan-400">0</span>; i &lt; s.<span className="text-blue-400">length</span>; i++) &#123;{"\n"}
        {"    "}<span className="text-purple-400">if</span> (s[i] <span className="text-purple-400">in</span> map) &#123;{"\n"}
        {"      "}stack.<span className="text-yellow-400">push</span>(s[i]);{"\n"}
        {"    "}&#125; <span className="text-purple-400">else</span> &#123;{"\n"}
        {"      "}<span className="text-purple-400">const</span> last = stack.<span className="text-yellow-400">pop</span>();{"\n"}
        {"      "}<span className="text-purple-400">if</span> (map[last] !== s[i]) <span className="text-purple-400">return</span> <span className="text-purple-400">false</span>;{"\n"}
        {"    "}&#125;{"\n"}
        {"  "}&#125;{"\n"}
        {"  "}<span className="text-purple-400">return</span> stack.<span className="text-blue-400">length</span> === <span className="text-cyan-400">0</span>;{"\n"}
        &#125;
      </span>
    ),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  const floatingIcons = [
    { Icon: Braces, size: 28, top: "8%", left: "12%", delay: 0, color: "text-purple-500/30" },
    { Icon: FileCode, size: 32, top: "25%", left: "82%", delay: 0.5, color: "text-cyan-500/30" },
    { Icon: Terminal, size: 26, top: "65%", left: "15%", delay: 1, color: "text-indigo-500/30" },
    { Icon: Code, size: 34, top: "55%", left: "78%", delay: 1.5, color: "text-violet-500/30" },
    { Icon: Hash, size: 22, top: "85%", left: "45%", delay: 0.3, color: "text-purple-500/25" },
    { Icon: Database, size: 24, top: "12%", left: "65%", delay: 0.8, color: "text-cyan-500/25" },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0f]">
      {/* Symmetrical glowing background orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-900/25 rounded-full blur-3xl z-0 animate-pulse" />
      <div
        className="absolute bottom-10 left-10 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl z-0 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-950/20 rounded-full blur-3xl z-0" />

      {/* Matching dot grid texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.22]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Matching diagonal shimmer line */}
      <div
        className="absolute inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, rgba(124,58,237,0.8) 0px, rgba(124,58,237,0.8) 1px, transparent 0px, transparent 50%)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing floating icons */}
      {floatingIcons.map(({ Icon, size, top, left, delay, color }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color} filter drop-shadow-[0_0_8px_rgba(124,58,237,0.15)]`}
          style={{ top, left }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}

      <div className="z-10 w-full max-w-md flex flex-col items-center px-8">
        {/* Code editor mockup */}
        <motion.div
          className="w-full glass-card shadow-2xl mb-8 overflow-hidden border border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Editor header */}
          <div className="bg-base-content/5 px-4 py-2.5 flex items-center justify-between border-b border-base-content/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
            <div className="text-xs font-mono text-base-content/30 font-medium select-none">
              solution.js
            </div>
            <div className="w-12 h-2" /> {/* spacer */}
          </div>

          {/* Code content with crossfade */}
          <div className="p-5 font-mono text-xs sm:text-sm relative h-64 overflow-hidden bg-[#0d0d12]/60 select-none">
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeIndex}
                className="whitespace-pre-wrap leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {codeSnippets[activeIndex]}
              </motion.pre>
            </AnimatePresence>

            {/* Blinking cursor */}
            <div className="absolute bottom-4 right-4 w-1.5 h-4 bg-primary/60 animate-blink rounded-sm" />
          </div>
        </motion.div>

        {/* Brand Icon */}
        <motion.div
          className="flex items-center justify-center mb-5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)]">
            <Code className="w-6 h-6 text-primary" />
          </div>
        </motion.div>

        {/* Text content */}
        <motion.h2
          className="text-2xl font-bold mb-3 text-center text-base-content tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-base-content/40 text-center text-sm leading-relaxed max-w-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};

export default CodeBackground;
