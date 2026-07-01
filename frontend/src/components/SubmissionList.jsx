import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  // Helper function to calculate average memory usage

  const calculateAverageMemory = (memoryData) => {
    const parsed = safeParse(memoryData);

    if (!parsed || !Array.isArray(parsed)) {
      return 0;
    } // <- this prevents .map on null

    const memoryArray = parsed.map((m) => parseFloat(m.split(" ")[0]));

    if (memoryArray.length === 0) return 0;

    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    const parsed = safeParse(timeData);

    if (!parsed || !Array.isArray(parsed)) {
      return 0;
    }

    const timeArray = parsed.map((t) => {
      const value = parseFloat(t.split(" ")[0]);
      return value;
    });

    if (timeArray.length === 0) return 0;

    const total = timeArray.reduce((acc, curr) => acc + curr, 0);
    return total / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission._id}
            className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow rounded-lg"
          >
            <div className="card-body p-4 select-text">
              <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
                {/* Left Section: Status and Language */}
                <div className="flex items-center gap-2.5">
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-1.5 text-success">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-bold text-sm">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-error">
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold text-sm">
                        {submission.status}
                      </span>
                    </div>
                  )}
                  <div className="badge badge-sm badge-neutral font-semibold">
                    {submission.language}
                  </div>
                </div>

                {/* Right Section: Runtime, Memory, and Date */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/75">
                  <div
                    className="flex items-center gap-1"
                    title="Average Runtime"
                  >
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    title="Average Memory"
                  >
                    <Memory className="w-3.5 h-3.5 text-primary" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                  <div
                    className="flex items-center gap-1"
                    title="Submission Date"
                  >
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {new Date(submission.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
