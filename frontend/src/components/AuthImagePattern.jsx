import { Code, Terminal, FileCode, Braces, Hash, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const codeSnippets = [
    `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }
  
  return stack.length === 0;
}`,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  const floatingIcons = [
    { Icon: Braces, size: 28, top: "8%", left: "12%", delay: 0 },
    { Icon: FileCode, size: 32, top: "25%", left: "82%", delay: 0.5 },
    { Icon: Terminal, size: 26, top: "65%", left: "15%", delay: 1 },
    { Icon: Code, size: 34, top: "55%", left: "78%", delay: 1.5 },
    { Icon: Hash, size: 22, top: "85%", left: "45%", delay: 0.3 },
    { Icon: Database, size: 24, top: "12%", left: "65%", delay: 0.8 },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center relative overflow-hidden bg-base-200">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/15 blur-[100px] animate-mesh" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px] animate-mesh delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full bg-accent/8 blur-[80px] animate-mesh delay-2000" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating code icons */}
      {floatingIcons.map(({ Icon, size, top, left, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-base-content/8"
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

      <div className="z-10 max-w-md flex flex-col items-center px-8">
        {/* Code editor mockup */}
        <motion.div
          className="w-full glass-card shadow-2xl mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Editor header */}
          <div className="bg-base-content/5 px-4 py-2.5 flex items-center border-b border-base-content/5">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-xs font-mono text-base-content/30 font-medium">
              solution.js
            </div>
          </div>

          {/* Code content with crossfade */}
          <div className="p-5 font-mono text-xs sm:text-sm relative h-64 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeIndex}
                className="whitespace-pre-wrap text-emerald-400/80"
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

        {/* Logo */}
        <motion.div
          className="flex items-center justify-center mb-5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-primary" />
          </div>
        </motion.div>

        {/* Text content */}
        <motion.h2
          className="text-2xl font-bold mb-3 text-center text-base-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-base-content/40 text-center text-sm leading-relaxed"
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
