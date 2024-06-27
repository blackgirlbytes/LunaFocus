import { CalendarPage } from "@/components/calendarpage";
import { StatsPage } from "@/components/statspage";
import { UsernameDisplay } from "@/components/username-display";

export default function Calendar() {
  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <UsernameDisplay />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <StatsPage />
      </div>
      <CalendarPage />
    </main>
  );
}
