import { CalendarPage } from "@/components/calendarpage";
import { StatsPage } from "@/components/statspage";

export default function Calendar() {
  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <StatsPage />
      </div>
      <CalendarPage />
    </main>
  );
}
