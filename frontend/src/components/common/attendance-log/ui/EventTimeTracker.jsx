import React from "react";
import dayjs from "dayjs";

const EventTimeTracker = ({ timeIn }) => {
  const start = dayjs(timeIn).format("hA"); 

  return (
    <div className="px-2.5 py-1.5 mr-1 mb-1.5 rounded-md bg-green-500 text-white inline-block">
      <span className='text-md'>{start}</span>
    </div>
  );
};

export default EventTimeTracker;
