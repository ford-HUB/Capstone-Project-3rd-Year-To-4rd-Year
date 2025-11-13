import React from "react";
import dayjs from "dayjs";

const LastUpdated = ({ eventDetails }) => {
  if (!eventDetails || eventDetails.length === 0) return null;

  // find the most recent event (latest start)
  const lastEvent = eventDetails.reduce((latest, current) => {
    const currentStart = current.eventDetails?.event_started || current.eventDetails?.event_time;
    const latestStart = latest?.eventDetails?.event_started || latest?.eventDetails?.event_time;

    if (!latestStart) return current;
    if (!currentStart) return latest;

    return dayjs(currentStart).isAfter(dayjs(latestStart)) ? current : latest;
  }, null);

  const lastUpdated = lastEvent?.eventDetails?.event_started || lastEvent?.eventDetails?.event_time;

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm text-gray-600">
        Last updated:{" "}
        <span className="font-medium">
          {lastUpdated ? dayjs(lastUpdated).format("h:mm A") : "N/A"}
        </span>
      </div>
    </div>
  );
};

export default LastUpdated;
