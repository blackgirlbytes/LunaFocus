import React from "react";
import moment from "moment"

export default function Period({ startDate, setStartDate }) {
  return <div>

    {!startDate && (
      <button className="btn btn-primary" onClick={() => setStartDate(moment())}>My period started</button>
    )}
    {startDate && (
      <div>
        <span>My current period started on: {startDate.toString()}</span><br/>
        <button className="btn btn-primary" onClick={() => setStartDate(null)}>My period ended</button>
      </div>
    )}
  </div>
}
