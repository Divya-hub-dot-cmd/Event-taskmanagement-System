import React from "react";

const groupByDate = (logs) => {
  return logs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toDateString();
    acc[date] = acc[date] || [];
    acc[date].push(log);
    return acc;
  }, {});
};

const ActivityTimeline = ({ logs = [] }) => {
  if (!logs.length) {
    return <p className="text-gray-400 text-sm">No activity yet</p>;
  }

  const grouped = groupByDate(logs);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs font-semibold text-gray-500 mb-2">{date}</p>

          <div className="space-y-1">
            {items.map((log) => (
              <div
                key={log.logId}
                className="text-sm bg-gray-50 border rounded px-3 py-2"
              >
                <strong>{log.role}</strong>: {log.action}
                {log.details && (
                  <span className="text-gray-500"> — {log.details}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
