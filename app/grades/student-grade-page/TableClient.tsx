"use client";

import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  headerNamesForLongPeriodsSubjects,
  subjectList,
  studentHeaderList,
} from "@/lib/teacher-grade-table-config";

interface CompositeGradeProps {
  compositeGrades: {
    average: number;
    subjects: {
      id: string;
      subject_name: string;
    };
    bonus: number | null;
    frequent_1: number | null;
    frequent_2: number | null;
    frequent_3: number | null;
    mid_term: number | null;
    end_term: number | null;
    semesters: {
      id: number;
      semester_name: string;
    };
  }[];
}

export default function TableClient({ compositeGrades }: CompositeGradeProps) {
  const tableData = compositeGrades;
  console.log("Received composite grades data in TableClient:", tableData);

  const headerList = studentHeaderList;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-montserrat">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Bảng hiển thị */}
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-light-orange/30">
                <tr>
                  {headerList.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-xs font-semibold uppercase text-secondary border-b"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary">
                {tableData.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-secondary font-bold">
                      {grade.subjects.subject_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.bonus !== null ? grade.bonus : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.frequent_1 !== null ? grade.frequent_1 : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.frequent_2 !== null ? grade.frequent_2 : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.frequent_3 !== null ? grade.frequent_3 : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.mid_term !== null ? grade.mid_term : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {grade.end_term !== null ? grade.end_term : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-secondary">
                      {grade.average !== null
                        ? grade.average.toFixed(2)
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
