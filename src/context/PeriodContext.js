import { useWeb5 } from '@/context/Web5Context';
import PeriodTracker from '@/lib/dwn/period-tracker';
import { createContext, useContext, useState, useEffect } from 'react';
import { calculatePeriodDays } from "@/lib/utils";

const PeriodsContext = createContext();

export const PeriodsProvider = ({ children }) => {
  const { web5, userDid } = useWeb5();
  const [periods, setPeriods] = useState({});
  const [periodTracker, setPeriodTracker] = useState(null);


  useEffect(() => {
    const initialize = async () => {
      if (web5 && userDid) {
        let tracker = await PeriodTracker(web5, userDid);
        setPeriodTracker(tracker);
      }
    }
    
    initialize();
  }, [web5, userDid]);

  useEffect(() => {
    const fetchPeriods = async (periodTracker) => {
      const fetchedPeriods = await periodTracker.fetchAllPeriodEntries();
      setPeriods(fetchedPeriods);
    };

    if (periodTracker) {      
      fetchPeriods(periodTracker);
    }
  }, [periodTracker]);

  function findMostRecentPeriod() {
    const periodObjects = [...Object.values(periods)];
    if (periodObjects.length === 0) return null;
    if (periodObjects.length === 1) return periodObjects[0];
    let mostRecentPeriod = periodObjects[0];
    for (let period of periodObjects) {
      if (new Date(period.startDate).getTime() > new Date(mostRecentPeriod.startDate).getTime()) {
        mostRecentPeriod = period;
      }
    }
    return mostRecentPeriod;
  }

  function findCurrentPeriod() {
    const mostRecentPeriod = findMostRecentPeriod();
    return !mostRecentPeriod?.endDate ? mostRecentPeriod : null; 
  }

  function periodForDate(date) {
    if (!date) return null;
    const compareTime = date.getTime();
    return Object.values(periods).find(period => {
      const startDate = stringToDate(period.startDate);
      const endDate = stringToDate(period.endDate);
      return startDate.getTime() <= compareTime && endDate.getTime() >= compareTime
    });
  }

  function addOrUpdatePeriod({localStartDate, localEndDate, flowTypes, periodId}) {
    const days = calculatePeriodDays(localStartDate, localEndDate || new Date());
    setPeriods((prevPeriods) => ({
      ...prevPeriods,
      [periodId]: {
        ...prevPeriods[periodId],
        id: periodId,
        startDate: localStartDate,
        endDate: localEndDate,
        dailyEntries: days.map(date => ({
          date: date,
          flowType: flowTypes[date] || null,
        })),
      }
    }));
  }

  return (
    <PeriodsContext.Provider value={{ periods, findCurrentPeriod, periodForDate, addOrUpdatePeriod }}>
      {children}
    </PeriodsContext.Provider>
  );
};

export const usePeriods = () => {
  return useContext(PeriodsContext);
};

