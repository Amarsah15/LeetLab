import User from "../models/user.model.js";
import Submission from "../models/submission.model.js";

const getISTDateString = (date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const dateParts = {};
  parts.forEach((p) => {
    if (p.type !== "literal") {
      dateParts[p.type] = p.value;
    }
  });
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
};

export const syncUserStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const userSubmissions = await Submission.find({ userId })
      .select("createdAt")
      .lean();
    const dates = [
      ...new Set(
        userSubmissions.map((s) => getISTDateString(s.createdAt)),
      ),
    ].sort();

    let currentStreak = 0;
    let maxStreak = user.maxStreak || 0;

    if (dates.length > 0) {
      const todayStr = getISTDateString(new Date());

      let tempStreak = 1;
      let streaks = [1];

      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round(
          Math.abs((curr - prev) / (1000 * 60 * 60 * 24)),
        );

        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          streaks.push(tempStreak);
          tempStreak = 1;
        }
      }
      streaks.push(tempStreak);

      const calculatedMax = Math.max(...streaks);
      maxStreak = Math.max(maxStreak, calculatedMax);

      const lastDateStr = dates[dates.length - 1];
      const lastDate = new Date(lastDateStr);
      const todayDate = new Date(todayStr);
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDaysToToday = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDaysToToday === 0 || diffDaysToToday === 1) {
        currentStreak = tempStreak;
      } else {
        currentStreak = 0;
      }
    } else {
      currentStreak = 0;
    }

    user.currentStreak = currentStreak;
    user.maxStreak = maxStreak;
    await user.save();
    return user;
  } catch (error) {
    console.error("Error in syncUserStreak:", error);
    return null;
  }
};
