import React from "react";
import dayjs from "dayjs";

const EventPeriod = ({ events }) => {
  if (!events || events.length === 0) return null;

  // find earliest event
  const firstEvent = events.reduce((earliest, current) => {
    const currentStart = current.eventDetails?.event_started || current.eventDetails?.event_time;
    const earliestStart = earliest?.eventDetails?.event_started || earliest?.eventDetails?.event_time;

    if (!earliestStart) return current; // if earliest is empty
    if (!currentStart) return earliest; // if current has no start

    return dayjs(currentStart).isBefore(dayjs(earliestStart)) ? current : earliest;
  }, null);

  const start = firstEvent?.eventDetails?.event_started || firstEvent?.eventDetails?.event_time;
  const end = firstEvent?.eventDetails?.event_ended || null;

  const formatEventPeriod = () => {
    if (!start) return "N/A";
    
    const startDate = dayjs(start);
    const startFormatted = `${startDate.format("MMM D")}, ${startDate.format("h:mm A")}`;
    
    if (!end) return startFormatted;
    
    const endDate = dayjs(end);
    const endFormatted = `${endDate.format("MMM D")}, ${endDate.format("h:mm A")}`;
    
    return `${startFormatted} - ${endFormatted}`;
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-sm text-gray-600">
        <span>Event Period: </span>
        <span className="font-medium">
          {formatEventPeriod()}
        </span>
      </div>
    </div>
  );
};

export default EventPeriod;
