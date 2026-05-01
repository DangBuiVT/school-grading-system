import { periodSchedule } from "@/lib/schedule-config";

export function getPeriodFromTime(currentTime: Date) {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const shift = hours < 12 ? "morning" : "afternoon";
  const schedule = periodSchedule[shift];

  const current = schedule.find(
    (period) => timeString >= period.start && timeString < period.end,
  );

  const next = schedule.find((p) => p.start > timeString);

  return {
    shift,
    currentPeriodInfo: current,
    nextPeriodInfo: next,
    isBreak: !current && !!next,
  };
}

export function getVNDayOfWeek() {
  const day = new Date().getDay();
  // JS: 0=Sun, 1=Mon... -> VN: 2=Mon, 3=Tue... 8=Sun
  return day === 0 ? 8 : day + 1;
}
