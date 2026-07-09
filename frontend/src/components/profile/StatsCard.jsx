import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Brain, Crown } from "lucide-react";

const StatsCard = ({ stats }) => {
  const statItems = [
    {
      label: "Total Solved",
      value: stats.totalSolved,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      glowColor: "shadow-primary/5",
    },
    {
      label: "Easy",
      value: stats.easy,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      glowColor: "shadow-emerald-500/5",
    },
    {
      label: "Medium",
      value: stats.medium,
      icon: Brain,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      glowColor: "shadow-amber-500/5",
    },
    {
      label: "Hard",
      value: stats.hard,
      icon: Crown,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      glowColor: "shadow-rose-500/5",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-base-content/70 mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-primary" />
        Statistics
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`bg-gradient-to-br from-[#16142c] to-[#0d0c1b] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-lg ${item.glowColor}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
            <motion.p
              className={`text-3xl font-extrabold ${item.color}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1 + 0.2,
                type: "spring",
                stiffness: 200,
              }}
            >
              {item.value}
            </motion.p>
            <p className="text-xs text-base-content/40 font-medium mt-1">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsCard;
