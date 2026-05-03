"use client";

import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import {
  headerNamesForLongPeriodsSubjects,
  headerNamesForMediumPeriodsSubjects,
  headerNamesForShortPeriodsSubjects,
  subjectClassification,
} from "@/lib/teacher-grade-table-config";

interface TableData {
  id: number;
  name: string;
  data: string[][];
}

interface TableProps {
  combinedProps: {
    classes: {
      classId: string | null;
      className: string | null;
    };
    subjects: {
      subjectId: string | null;
      subjectName: string | null;
    };
  }[];
}

export default function TableClient({ combinedProps }: TableProps) {
  const [activeTableIdx, setActiveTableIdx] = useState(0);

  // 1. State lưu trữ toàn bộ dữ liệu của các bảng để có thể chỉnh sửa
  const [tables, setTables] = useState(() =>
    combinedProps.map((item, tableIdx) => {
      const classification =
        subjectClassification[item.subjects.subjectName || ""] || "medium";
      let currentHeaders;
      if (classification === "long")
        currentHeaders = headerNamesForLongPeriodsSubjects;
      else if (classification === "medium")
        currentHeaders = headerNamesForMediumPeriodsSubjects;
      else currentHeaders = headerNamesForShortPeriodsSubjects;

      return {
        id: tableIdx,
        name: `${item.classes.className} - ${item.subjects.subjectName}`,
        headers: currentHeaders,
        // Tạo mảng 2 chiều rỗng hoặc chứa dữ liệu mặc định (length - 1 vì trừ cột STT)
        data: Array.from({ length: 40 }, () =>
          Array.from({ length: currentHeaders.length - 1 }, () => ""),
        ),
      };
    }),
  );

  // 2. Hàm xử lý thay đổi giá trị ô input
  const handleInputChange = (
    tableIdx: number,
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    const newTables = [...tables];
    newTables[tableIdx].data[rowIndex][colIndex] = value;
    setTables(newTables);
  };

  const activeTable = tables[activeTableIdx];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-montserrat text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* --- Tab Navigation --- */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-wrap gap-2">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => setActiveTableIdx(table.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTableIdx === table.id
                    ? "bg-[var(--primary-color)] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- Form / Table Container --- */}
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  {activeTable.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200 bg-gray-100 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTable.data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Cột Số thứ tự (Không cho sửa) */}
                    <td className="px-4 py-2 text-sm font-bold text-[var(--secondary-color)] bg-gray-50/50 w-12 text-center border-r">
                      {rowIndex + 1}
                    </td>

                    {/* Các ô nhập liệu */}
                    {row.map((cellValue, colIndex) => (
                      <td key={colIndex} className="p-0 border-r border-b">
                        <input
                          type="text"
                          value={cellValue}
                          onChange={(e) =>
                            handleInputChange(
                              activeTableIdx,
                              rowIndex,
                              colIndex,
                              e.target.value,
                            )
                          }
                          className="w-full px-4 py-2 text-sm text-gray-700 focus:outline-none focus:bg-[var(--primary-color)]/50 focus:ring-1 focus:ring-inset focus:ring-orange-400 transition-all bg-transparent"
                          placeholder="..."
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Footer với nút Lưu --- */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Editing:{" "}
            <span className="font-semibold text-gray-600">
              {activeTable.name}
            </span>
          </div>
          <button
            onClick={() => console.log("Data to save:", tables)}
            className="px-6 py-2 bg-[var(--secondary-color)] text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-sm transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
