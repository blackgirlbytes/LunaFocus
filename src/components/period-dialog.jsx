import { useState } from "react";
import { DynamicDialog } from "@/components/modal"

const formatDate = (date) => {
  if (!date) return '';
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
};

export const PeriodDialog = ({ dialogTitle, period, onClose }) => {
  const [localStartDate, setLocalStartDate] = useState(formatDate(period.startDate));
  const [localEndDate, setLocalEndDate] = useState(formatDate(period.endDate));

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
        <label htmlFor="start">Started: </label>
        <input type="date" id="start" name="start" value={localStartDate} onChange={handleStartDateChange} />
        <br/>
        <label htmlFor="end">Ended: </label>
        <input type="date" id="end" name="end" value={localEndDate} onChange={handleEndDateChange} />
      </div>
    );
  
  return (<DynamicDialog title={dialogTitle} dialogContent={dialogContent} onClose={handleClose} />);
}