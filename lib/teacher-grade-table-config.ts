export interface HeaderConfig {
  label: string;
  weight: number; // Hệ số điểm (0 cho các cột không tính điểm như tên, STT)
}

export const headerNamesForLongPeriodsSubjects: HeaderConfig[] = [
  { label: "No.", weight: 0 },
  { label: "Last and Middle Name", weight: 0 },
  { label: "First Name", weight: 0 },
  { label: "Bonus", weight: 0 },
  { label: "Frequent #1", weight: 1 },
  { label: "Frequent #2", weight: 1 },
  { label: "Frequent #3", weight: 1 },
  { label: "Mid-term", weight: 2 },
  { label: "End-of-term", weight: 3 },
  { label: "Average", weight: 0 }, // Cột kết quả
];

export const headerNamesForMediumPeriodsSubjects: HeaderConfig[] = [
  { label: "No.", weight: 0 },
  { label: "Last and Middle Name", weight: 0 },
  { label: "First Name", weight: 0 },
  { label: "Bonus", weight: 0 },
  { label: "Frequent #1", weight: 1 },
  { label: "Frequent #2", weight: 1 },
  { label: "Mid-term", weight: 2 },
  { label: "End-of-term", weight: 3 },
  { label: "Average", weight: 0 },
];

export const headerNamesForShortPeriodsSubjects: HeaderConfig[] = [
  { label: "No.", weight: 0 },
  { label: "Last and Middle Name", weight: 0 },
  { label: "First Name", weight: 0 },
  { label: "Bonus", weight: 0 },
  { label: "Frequent #1", weight: 1 },
  { label: "Mid-term", weight: 2 },
  { label: "End-of-term", weight: 3 },
  { label: "Average", weight: 0 },
];

export const studentHeaderList = [
  "Subject",
  "Bonus",
  "Frequent #1",
  "Frequent #2",
  "Frequent #3",
  "Mid-term",
  "End-of-term",
  "Average",
];

export const subjectList = [
  "Mathematics",
  "Literature",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Civic Education",
  "English",
  "Physical Education",
  "Art",
  "Music",
];

export const subjectClassification: Record<
  string,
  "long" | "medium" | "short"
> = {
  Mathematics: "long",
  Literature: "long",
  Physics: "medium",
  Chemistry: "medium",
  Biology: "medium",
  History: "medium",
  Geography: "medium",
  "Civic Education": "medium",
  English: "long",
  "Physical Education": "short",
  Art: "short",
  Music: "short",
  // Add more subjects as needed
};
