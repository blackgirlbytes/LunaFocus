import React, { useState, useEffect } from "react";
import { DynamicDialog } from "@/components/modal";
import { stringToDate, formatDate, calculatePeriodDays } from "@/lib/utils";

export const PeriodDialog = ({ dialogTitle, period, onClose }) => {
  const [localStartDate, setLocalStartDate] = useState(period?.startDate || "");
  const [localEndDate, setLocalEndDate] = useState(period?.endDate || "");
  const [flowTypes, setFlowTypes] = useState({});
  useEffect(() => {
    if (period && period.dailyEntries) {
      const initialFlowTypes = {};
      period.dailyEntries.forEach(entry => {
        initialFlowTypes[entry.date] = entry.flowType;
      });
      setFlowTypes(initialFlowTypes);
    }
  }, [period]);

  const handleStartDateChange = (e) => {
    setLocalStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setLocalEndDate(e.target.value);
  };

  const handleFlowTypeChange = (date, flowType) => {
    setFlowTypes(prevFlowTypes => ({
      ...prevFlowTypes,
      [date]: flowType,
    }));
  };

  const handleClose = () => {
    onClose({localStartDate, localEndDate, flowTypes});
  };

  const periodDays = localStartDate && localEndDate ? calculatePeriodDays(localStartDate, localEndDate) : [];

  const dialogContent = (
    <div>
      <h2 className="text-lg">When did your period start and end?</h2>
      <label htmlFor="start">Started: </label>
      <input type="date" id="start" name="start" value={localStartDate} onChange={handleStartDateChange} />
      <br />
      <label htmlFor="end">Ended: </label>
      <input type="date" id="end" name="end" value={localEndDate} onChange={handleEndDateChange} />
      <br />
      {periodDays.map(day => (
        <div key={day}>
          <label>{day} Flow Type: </label>
          <select value={flowTypes[day] || ""} onChange={(e) => handleFlowTypeChange(day, e.target.value)}>
            <option value="">Select</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>
      ))}
    </div>
  );
  return (<DynamicDialog title={dialogTitle} dialogContent={dialogContent} onClose={handleClose} />);
}