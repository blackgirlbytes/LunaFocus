import { useState } from "react";
import { DynamicDialog } from "@/components/modal";

export const PeriodDialog = ({ dialogTitle, period, onClose }) => {
  const [localStartDate, setLocalStartDate] = useState((period?.startDate));
  const [localEndDate, setLocalEndDate] = useState(period?.endDate);

  const handleStartDateChange = (e) => {
    setLocalStartDate(e.target.value);
  };
  const handleEndDateChange = (e) => {
    setLocalEndDate(e.target.value);
  };

  const handleClose = () => {
    onClose(localStartDate, localEndDate);
  };

  const dialogContent = (
    <div>
      <h2 className="text-lg">When did your period start and end?</h2>
      <label htmlFor="start">Started: </label>
      <input type="date" id="start" name="start" value={localStartDate} onChange={handleStartDateChange} />
      <br />
      <label htmlFor="end">Ended: </label>
      <input type="date" id="end" name="end" value={localEndDate} onChange={handleEndDateChange} />
    </div>
  );

  return (<DynamicDialog title={dialogTitle} dialogContent={dialogContent} onClose={handleClose} />);
}
