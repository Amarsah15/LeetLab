import React from "react";

const getColor = (count) => {
  if (count === 0) return "bg-base-300";
  if (count === 1) return "bg-green-200";
  if (count === 2) return "bg-green-400";
  if (count >= 3) return "bg-green-600";
};

const ActivityGraph = ({ submissions }) => {
  const dateCount = transformSubmissions(submissions);
  const weeks = generateLeetCodeGridData(dateCount);

  function transformSubmissions(submissions) {
    const dateCount = {};
    submissions.forEach((sub) => {
      const date = sub.createdAt.split("T")[0];
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
    return dateCount;
  }

  function generateLeetCodeGridData(dateCount) {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 364);

    const weeks = [];
    let currentWeek = [];

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const count = dateCount[dateStr] || 0;

      currentWeek.push({ date: dateStr, count });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }

  const monthLabels = weeks.map((week) => {
    const firstDay = new Date(week[0].date);
    return firstDay.getDate() <= 7
      ? firstDay.toLocaleString("default", { month: "short" })
      : "";
  });

  return (
    <div className="p-4 bg-base-200">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">Yearly Activity</h2>
        </div>

        {/* Grid: 7 rows (days), 52 cols (weeks) */}
        <div className="grid grid-rows-7 grid-flow-col gap-[4px]">
          {weeks.map((week, wIdx) =>
            week.map((day, dIdx) => (
              <div
                key={`${wIdx}-${dIdx}`}
                className={`tooltip w-[12px] h-[12px] rounded ${getColor(
                  day.count
                )}`}
                data-tip={`${day.date}: ${day.count} problem${
                  day.count !== 1 ? "s" : ""
                }`}
              ></div>
            ))
          )}
        </div>

        {/* Month Labels */}
        <div className="flex gap-[4px] mt-2 text-xs text-base-content">
          {monthLabels.map((label, idx) => (
            <div key={idx} className="w-[12px] text-center">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityGraph;
