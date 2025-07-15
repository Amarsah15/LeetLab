import React from "react";
import {
  Database,
  Layers,
  GitBranch,
  Zap,
  Brain,
  Target,
  Hash,
  Shuffle,
} from "lucide-react";

const topics = [
  {
    icon: Database,
    title: "Arrays & Strings",
    description:
      "Master the fundamentals with dynamic arrays, string manipulation, and pattern matching.",
    problemCount: 45,
    color: "from-blue-500 to-cyan-500",
    difficulty: "Beginner",
    emoji: "📊",
    completionRate: 85,
  },
  {
    icon: Layers,
    title: "Stacks & Queues",
    description:
      "Understand LIFO/FIFO operations with real-world applications and advanced implementations.",
    problemCount: 32,
    color: "from-green-500 to-emerald-500",
    difficulty: "Beginner",
    emoji: "📚",
    completionRate: 78,
  },
  {
    icon: GitBranch,
    title: "Trees & Graphs",
    description:
      "Explore hierarchical structures, traversals, and complex graph algorithms.",
    problemCount: 58,
    color: "from-purple-500 to-pink-500",
    difficulty: "Intermediate",
    emoji: "🌳",
    completionRate: 65,
  },
  {
    icon: Zap,
    title: "Dynamic Programming",
    description:
      "Solve optimization problems with memoization, tabulation, and state transitions.",
    problemCount: 41,
    color: "from-orange-500 to-red-500",
    difficulty: "Advanced",
    emoji: "⚡",
    completionRate: 45,
  },
  {
    icon: Brain,
    title: "Backtracking",
    description:
      "Master recursive problem-solving with constraint satisfaction and pruning.",
    problemCount: 28,
    color: "from-indigo-500 to-purple-500",
    difficulty: "Intermediate",
    emoji: "🧩",
    completionRate: 58,
  },
  {
    icon: Target,
    title: "Greedy Algorithms",
    description:
      "Learn optimal decision-making strategies for scheduling and optimization.",
    problemCount: 35,
    color: "from-cyan-500 to-blue-500",
    difficulty: "Intermediate",
    emoji: "🎯",
    completionRate: 72,
  },
  {
    icon: Hash,
    title: "Hashing & Maps",
    description:
      "Efficient data retrieval with hash tables, collision handling, and applications.",
    problemCount: 29,
    color: "from-pink-500 to-rose-500",
    difficulty: "Beginner",
    emoji: "#️⃣",
    completionRate: 81,
  },
  {
    icon: Shuffle,
    title: "Sorting & Searching",
    description:
      "Master comparison-based and non-comparison sorting with binary search variants.",
    problemCount: 38,
    color: "from-yellow-500 to-orange-500",
    difficulty: "Intermediate",
    emoji: "🔍",
    completionRate: 69,
  },
];

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TopicsSection = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-purple-900/20 to-black overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <span className="text-2xl mr-2">🎓</span>
            <span className="text-white/90 font-medium">Learn By Topic</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Master Every{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Concept
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Structured learning paths designed by industry experts. Build strong
            foundations one topic at a time.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {topics.map((topic, index) => {
            const slug = topic.title.toLowerCase().replace(/\s+/g, "-");
            return (
              <a key={index} href={`#`} className="group relative">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden relative">
                  {/* Glowing Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${topic.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Progress Ring */}
                  <div className="absolute top-6 right-6">
                    <div className="relative w-12 h-12">
                      <svg
                        className="w-12 h-12 transform -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="2"
                        />
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray={`${topic.completionRate}, 100`}
                          className="transition-all duration-1000 group-hover:stroke-dasharray-100"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {topic.completionRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${topic.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <span className="text-2xl">{topic.emoji}</span>
                      </div>
                    </div>

                    {/* Title & Difficulty */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors duration-300">
                        {topic.title}
                      </h3>
                    </div>

                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          difficultyColors[topic.difficulty]
                        }`}
                      >
                        {topic.difficulty}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 leading-relaxed text-sm mb-6 group-hover:text-white/80 transition-colors duration-300">
                      {topic.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/50">
                        {topic.problemCount} problems
                      </span>
                      <span className="text-pink-400 text-sm font-medium group-hover:text-pink-300 transition-colors duration-300">
                        Start Learning →
                      </span>
                    </div>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute top-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" />
                </div>
              </a>
            );
          })}
        </div>

        {/* View All Topics Button */}
        <div className="text-center mt-16">
          <a href="/#" className="group relative inline-block">
            <button className="relative px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center">
                <span>Explore All Topics</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  🚀
                </span>
              </div>
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};
export default TopicsSection;
