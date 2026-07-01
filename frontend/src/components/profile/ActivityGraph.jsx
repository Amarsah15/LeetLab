import React, { useState } from "react";
import { Info, ChevronDown, Check, Calendar } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const getISTDateString = (dateInput) => {
  const date = new Date(dateInput);
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

const getColor = (count) => {
  if (count === 0) return "bg-base-content/10";
  if (count === 1) return "bg-[#0e4429]"; // Dark green
  if (count === 2) return "bg-[#006d32]"; // Mid green
  if (count === 3) return "bg-[#26a641]"; // Bright green
  return "bg-[#39d353]"; // Very bright green
};

const ActivityGraph = ({ submissions }) => {
  const { authUser } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState("Current");
  const [hoveredDay, setHoveredDay] = useState(null); // { date, count, x, y }

  // Filter submissions by selected year
  const filteredSubmissions = submissions.filter((sub) => {
    if (selectedYear === "Current") {
      const oneYearAgo = new Date();
      oneYearAgo.setUTCDate(oneYearAgo.getUTCDate() - 365);
      return new Date(sub.createdAt) >= oneYearAgo;
    } else {
      const year = parseInt(selectedYear);
      const subYear = new Date(sub.createdAt).getUTCFullYear();
      return subYear === year;
    }
  });

  const yearDateCount = transformSubmissions(filteredSubmissions);
  const activeDays = Object.keys(yearDateCount).length;

  const calculateMaxStreak = (dateCount) => {
    const dates = Object.keys(dateCount).sort();
    if (dates.length === 0) return 0;

    let max = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.round(
        Math.abs((curr - prev) / (1000 * 60 * 60 * 24)),
      );
      if (diffDays === 1) {
        current++;
      } else {
        max = Math.max(max, current);
        current = 1;
      }
    }
    return Math.max(max, current);
  };

  // If "Current" is selected, show their all-time max streak OR the calculated one from the past year.
  // Wait, if they are viewing the current year, let's just use the dynamically calculated streak so it matches the visible graph!
  const displayMaxStreak =
    selectedYear === "Current"
      ? Math.max(authUser?.maxStreak || 0, calculateMaxStreak(yearDateCount))
      : calculateMaxStreak(yearDateCount);

  // Generate the list of months to render (using UTC)
  const monthsList = [];
  if (selectedYear === "Current") {
    const today = new Date();
    const currentUTCMonth = today.getUTCMonth();
    const currentUTCYear = today.getUTCFullYear();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(currentUTCYear, currentUTCMonth - i, 1));
      monthsList.push({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth(),
      });
    }
  } else {
    const year = parseInt(selectedYear);
    for (let m = 0; m < 12; m++) {
      monthsList.push({
        year: year,
        month: m,
      });
    }
  }

  function transformSubmissions(submissions) {
    const dateCount = {};
    submissions.forEach((sub) => {
      const date = getISTDateString(sub.createdAt);
      dateCount[date] = (dateCount[date] || 0) + 1;
    });
    return dateCount;
  }

  function generateMonthGrid(year, monthIndex, dateCount) {
    const monthStart = new Date(Date.UTC(year, monthIndex, 1));
    const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 0));

    const gridStart = new Date(monthStart);
    gridStart.setUTCDate(monthStart.getUTCDate() - monthStart.getUTCDay());

    const gridEnd = new Date(monthEnd);
    gridEnd.setUTCDate(monthEnd.getUTCDate() + (6 - monthEnd.getUTCDay()));

    const weeks = [];
    let currentWeek = [];

    for (
      let d = new Date(gridStart);
      d <= gridEnd;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      const yearStr = d.getUTCFullYear();
      const monthStr = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dayStr = String(d.getUTCDate()).padStart(2, "0");
      const dateStr = `${yearStr}-${monthStr}-${dayStr}`;

      const count = dateCount[dateStr] || 0;
      const inMonth =
        d.getUTCFullYear() === year && d.getUTCMonth() === monthIndex;

      // Filter out future days in Current view based on IST today
      const todayISTStr = getISTDateString(new Date());
      const [tYear, tMonth, tDay] = todayISTStr.split("-").map(Number);
      const todayUTC = new Date(Date.UTC(tYear, tMonth - 1, tDay));
      const isFuture = d > todayUTC;

      currentWeek.push({
        date: dateStr,
        count: inMonth && !isFuture ? count : 0,
        inMonth: inMonth,
        isFuture: isFuture,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title block matching stats section style */}
      <h2 className="text-lg font-bold text-base-content/70 mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" />
        Yearly Activity
      </h2>

      <div className="bg-base-200 border border-base-content/10 rounded-2xl p-6 relative overflow-visible shadow-xl glass-card">
        <div className="w-full relative overflow-visible">
          {/* Header Section Inside Card */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-medium text-base-content/70 flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-base-content">
                  {filteredSubmissions.length}
                </span>
                submissions in{" "}
                {selectedYear === "Current"
                  ? "the past one year"
                  : selectedYear}
                <Info className="w-4 h-4 text-base-content/40 ml-1 cursor-pointer hover:text-base-content" />
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-base-content/50">
              <span>
                Total active days:{" "}
                <span className="font-bold text-base-content/80 ml-1">
                  {activeDays}
                </span>
              </span>
              <span>
                Max streak:{" "}
                <span className="font-bold text-base-content/80 ml-1">
                  {displayMaxStreak}
                </span>
              </span>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-xs btn-ghost bg-base-200/50 border-base-content/10 px-3 py-1 font-semibold rounded-md text-base-content/70"
                >
                  {selectedYear}{" "}
                  <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-30 menu p-1.5 shadow-xl bg-base-200 rounded-box w-28 mt-1 border border-base-content/5 text-xs"
                >
                  <li>
                    <a
                      className={
                        selectedYear === "Current"
                          ? "bg-base-content/5 cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => {
                        setSelectedYear("Current");
                        document.activeElement?.blur();
                      }}
                    >
                      Current{" "}
                      {selectedYear === "Current" && (
                        <Check className="w-3.5 h-3.5 ml-auto text-primary" />
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        selectedYear === "2025"
                          ? "bg-base-content/5 cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => {
                        setSelectedYear("2025");
                        document.activeElement?.blur();
                      }}
                    >
                      2025{" "}
                      {selectedYear === "2025" && (
                        <Check className="w-3.5 h-3.5 ml-auto text-primary" />
                      )}
                    </a>
                  </li>
                  <li>
                    <a
                      className={
                        selectedYear === "2024"
                          ? "bg-base-content/5 cursor-pointer"
                          : "cursor-pointer"
                      }
                      onClick={() => {
                        setSelectedYear("2024");
                        document.activeElement?.blur();
                      }}
                    >
                      2024{" "}
                      {selectedYear === "2024" && (
                        <Check className="w-3.5 h-3.5 ml-auto text-primary" />
                      )}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Graph Container with scrollbar hidden visually */}
          <div className="graph-container relative overflow-x-auto no-scrollbar pb-1 pt-6">
            <div className="flex gap-[6px] min-w-max">
              {monthsList.map(({ year, month }) => {
                const monthWeeks = generateMonthGrid(
                  year,
                  month,
                  yearDateCount,
                );
                const monthName = new Date(
                  Date.UTC(year, month, 1),
                ).toLocaleString("default", {
                  month: "short",
                  timeZone: "UTC",
                });

                return (
                  <div
                    key={`${year}-${month}`}
                    className="flex flex-col items-center gap-2"
                  >
                    {/* Month Grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                      {monthWeeks.map((week, wIdx) =>
                        week.map((day, dIdx) => (
                          <div
                            key={`${wIdx}-${dIdx}`}
                            className={`w-3.5 h-3.5 rounded-[2px] transition-all duration-200 ${
                              day.inMonth
                                ? `${getColor(day.count)} ${day.isFuture ? "opacity-50 cursor-default" : "cursor-pointer hover:ring-1 hover:ring-base-content/50"}`
                                : "opacity-0 pointer-events-none"
                            }`}
                            onMouseEnter={(e) => {
                              if (!day.inMonth || day.isFuture) return;
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const parentRect = e.currentTarget
                                .closest(".glass-card")
                                .getBoundingClientRect();
                              setHoveredDay({
                                date: day.date,
                                count: day.count,
                                x: rect.left - parentRect.left + rect.width / 2,
                                y: rect.top - parentRect.top - 50,
                              });
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                          ></div>
                        )),
                      )}
                    </div>
                    {/* Center Month Label */}
                    <span className="text-[11px] text-base-content/50 font-medium select-none">
                      {monthName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium Floating Tooltip - Positioned relative to .glass-card */}
        {hoveredDay && (
          <div
            className="absolute z-40 bg-neutral text-neutral-content text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl border border-base-content/10 pointer-events-none transform -translate-x-1/2 flex flex-col items-center gap-0.5 whitespace-nowrap font-medium transition-all duration-100"
            style={{ left: hoveredDay.x, top: hoveredDay.y }}
          >
            <span>
              <span className="font-bold">{hoveredDay.count}</span> submission
              {hoveredDay.count !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] opacity-60">
              {new Date(hoveredDay.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
              })}
            </span>
            {/* Tooltip Arrow */}
            <div className="w-1.5 h-1.5 bg-neutral border-r border-b border-base-content/10 rotate-45 absolute -bottom-[3.5px] left-1/2 -translate-x-1/2"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityGraph;
