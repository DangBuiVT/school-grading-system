export const headerNamesForLongPeriodsSubjects = [
  "No.",
  "Last and Middle Name",
  "First Name",
  "Bonus",
  "Frequent #1",
  "Frequent #2",
  "Frequent #3",
  "Mid-term",
  "End-of-term",
  "Average",
];

export const headerNamesForMediumPeriodsSubjects = [
  "No.",
  "Last and Middle Name",
  "First Name",
  "Bonus",
  "Frequent #1",
  "Frequent #2",
  "Mid-term",
  "End-of-term",
  "Average",
];

export const headerNamesForShortPeriodsSubjects = [
  "No.",
  "Last and Middle Name",
  "First Name",
  "Bonus",
  "Frequent #1",
  "Mid-term",
  "End-of-term",
  "Average",
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
