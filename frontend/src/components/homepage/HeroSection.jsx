import React, { useEffect, useRef, useState } from "react";
import { Play, Sparkles, Zap, Code2 } from "lucide-react";

const HeroSection = () => {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? "#ec4899" : "#8b5cf6",
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.vx += dx * 0.00001;
          particle.vy += dy * 0.00001;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist2 < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = "#ec4899";
              ctx.globalAlpha = 0.1;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePosition]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Animated Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-900/20 to-black/40 z-10" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob z-10" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 z-10" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-purple-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Floating Badge */}
            <div className="group inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 cursor-pointer">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
              <span className="text-sm text-white/90 font-medium">
                ✨ Built to Practice. Shaped by Challenge.
              </span>
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />
            </div>

            {/* Main Heading with Animated Text */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black leading-none">
                <span className="block text-white drop-shadow-2xl">Master</span>
                <span className="block bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  Algorithms
                </span>
                <span className="block text-white drop-shadow-2xl">Like a</span>
                <span className="block bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                  Pro 🚀
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-white/80 max-w-lg leading-relaxed font-light">
                Join the next generation of developers mastering{" "}
                <span className="text-pink-400 font-semibold">
                  data structures
                </span>{" "}
                and{" "}
                <span className="text-purple-400 font-semibold">
                  algorithms
                </span>{" "}
                through interactive challenges.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/signup">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2" />
                    Start Your Journey
                    <Sparkles className="w-4 h-4 ml-2 animate-spin" />
                  </div>
                </button>
              </a>
              <a href="/problems">
                <button className="group px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-center">
                    <Code2 className="w-5 h-5 mr-2" />
                    Explore Problems
                  </div>
                </button>
              </a>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { number: "10K+", label: "Developers", icon: "👨‍💻" },
                { number: "500+", label: "Problems", icon: "🧩" },
                { number: "95%", label: "Success Rate", icon: "🎯" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group text-center p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Code Editor */}
          <div className="relative">
            <div className="group relative transform rotate-3d hover:rotate-0 transition-all duration-700">
              {/* Glowing Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

              {/* Main Editor */}
              <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse animation-delay-200" />
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse animation-delay-400" />
                    </div>
                    <span className="text-white/80 font-medium">
                      AlgoPookie Studio
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-xs text-white/60">Live Coding</span>
                  </div>
                </div>

                {/* Code Content */}
                <div className="p-6 font-mono text-sm leading-relaxed">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">1</span>
                      <span className="text-purple-400">function</span>
                      <span className="text-blue-400 ml-2">twoSum</span>
                      <span className="text-yellow-400">(nums, target)</span>
                      <span className="text-pink-400 ml-2">{`{`}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">2</span>
                      <span className="text-gray-400 ml-4">
                        // ✨ Your magical solution here
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">3</span>
                      <span className="text-purple-400 ml-4">const</span>
                      <span className="text-blue-400 ml-2">map</span>
                      <span className="text-white ml-2">=</span>
                      <span className="text-green-400 ml-2">new Map()</span>
                      <span className="text-white">;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">4</span>
                      <span className="text-purple-400 ml-4">for</span>
                      <span className="text-yellow-400 ml-2">
                        (let i = 0; i {"<"} nums.length; i++)
                      </span>
                      <span className="text-pink-400 ml-2">{`{`}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">5</span>
                      <span className="text-purple-400 ml-8">const</span>
                      <span className="text-blue-400 ml-2">complement</span>
                      <span className="text-white ml-2">=</span>
                      <span className="text-blue-400 ml-2">target</span>
                      <span className="text-white ml-2">-</span>
                      <span className="text-blue-400 ml-2">nums[i]</span>
                      <span className="text-white">;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">6</span>
                      <span className="text-purple-400 ml-8">if</span>
                      <span className="text-yellow-400 ml-2">
                        (map.has(complement))
                      </span>
                      <span className="text-pink-400 ml-2">{`{`}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">7</span>
                      <span className="text-pink-400 ml-12">return</span>
                      <span className="text-yellow-400 ml-2">
                        [map.get(complement), i]
                      </span>
                      <span className="text-white">;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">8</span>
                      <span className="text-pink-400 ml-8">{`}`}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">9</span>
                      <span className="text-blue-400 ml-8">map.set</span>
                      <span className="text-yellow-400">(nums[i], i)</span>
                      <span className="text-white">;</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">10</span>
                      <span className="text-pink-400 ml-4">{`}`}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-8">11</span>
                      <span className="text-pink-400">{`}`}</span>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs font-medium">
                          ✓ All tests passed
                        </span>
                      </div>
                      <span className="text-white/60 text-xs">
                        Runtime: 68ms
                      </span>
                      <span className="text-white/60 text-xs">
                        Memory: 42.1 MB
                      </span>
                    </div>
                    <span className="text-white/60 text-xs">JavaScript</span>
                  </div>
                </div>
              </div>

              {/* Floating Success Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                🎉 Solved!
              </div>

              {/* Floating Performance Badge */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                ⚡ O(n) time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
