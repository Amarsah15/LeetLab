import React from "react";
import {
  Brain,
  Zap,
  Users,
  Target,
  MessageCircle,
  Trophy,
  Code,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Learning",
    description:
      "Get personalized hints and explanations powered by advanced AI that adapts to your learning style.",
    color: "from-purple-500 to-pink-500",
    emoji: "🧠",
  },
  {
    icon: Zap,
    title: "Lightning Fast Execution",
    description:
      "Execute code in milliseconds with our optimized cloud infrastructure and real-time feedback.",
    color: "from-yellow-400 to-orange-500",
    emoji: "⚡",
  },
  {
    icon: Users,
    title: "Global Community",
    description:
      "Connect with 10,000+ developers worldwide. Share solutions and learn from the best.",
    color: "from-blue-500 to-cyan-500",
    emoji: "🌍",
  },
  {
    icon: Target,
    title: "Skill-Based Matching",
    description:
      "Practice problems tailored to your skill level with our intelligent difficulty adjustment.",
    color: "from-green-500 to-emerald-500",
    emoji: "🎯",
  },
  {
    icon: MessageCircle,
    title: "Live Code Reviews",
    description:
      "Get instant feedback from AI and peer reviews to improve your coding style and efficiency.",
    color: "from-pink-500 to-rose-500",
    emoji: "💬",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    description:
      "Earn badges, climb leaderboards, and unlock achievements as you master new concepts.",
    color: "from-amber-500 to-yellow-500",
    emoji: "🏆",
  },
  {
    icon: Code,
    title: "Multi-Language Support",
    description:
      "Code in Python, JavaScript, Java, C++, Go, Rust, and more with syntax highlighting.",
    color: "from-indigo-500 to-purple-500",
    emoji: "💻",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track your progress with detailed analytics, performance metrics, and learning insights.",
    color: "from-cyan-500 to-blue-500",
    emoji: "📊",
  },
];

const FeatureShowcase = () => {
  return (
    <section className="relative py-32 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
            <span className="text-2xl mr-2">✨</span>
            <span className="text-white/90 font-medium">Powerful Features</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              AlgoPookie
            </span>
            ?
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Experience the future of algorithm learning with cutting-edge
            features designed for the next generation of developers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:rotate-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glowing Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center justify-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <span className="text-2xl">{feature.emoji}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-pink-400 text-sm font-medium">
                    Learn more →
                  </span>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeatureShowcase;
