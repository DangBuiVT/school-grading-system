import { periodSchedule } from "@/lib/schedule-config";

export function getDetailedPeriodInfo(currentTime: Date) {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  const shift = hours < 12 ? "morning" : "afternoon";
  const schedule = periodSchedule[shift];

  const current = schedule.find(
    (p) => timeString >= p.start && timeString <= p.end,
  );
  const nextPeriods = schedule.filter((p) => p.start > timeString).slice(0, 2);
  const next = nextPeriods[0];

  let countdownLabel = "";
  if (next) {
    // Calculate minutes until next class starts
    const [nextH, nextM] = next.start.split(":").map(Number);
    const nextDate = new Date(currentTime);
    nextDate.setHours(nextH, nextM, 0);

    const diffMins = Math.round(
      (nextDate.getTime() - currentTime.getTime()) / 60000,
    );
    if (diffMins >= 0 && diffMins <= 60) {
      countdownLabel = `In ${diffMins}m`;
    }
  }

  return {
    shift,
    currentPeriodInfo: current, // Now returns { period: 1, start: "07:30", ... }
    nextPeriodInfo: next,
    nextPeriodInfos: nextPeriods,
    countdownLabel,
  };
}

export function getVNDayOfWeek(date: Date) {
  const day = date.getDay();
  // JS: 0=Sun, 1=Mon... -> VN: 2=Mon, 3=Tue... 8=Sun
  return day === 0 ? 8 : day + 1;
}
