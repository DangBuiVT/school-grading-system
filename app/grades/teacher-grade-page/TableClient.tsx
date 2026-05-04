"use client";

import { createClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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
    teacherId: string;
    classes: {
      classId: string | null;
      className: string | null;
      studentList: {
        studentId: string;
        studentLName: string;
        studentFName: string;
      }[];
    };
    subjects: {
      subjectId: string | null;
      subjectName: string | null;
    };
  }[];
}

export default function TableClient({ combinedProps }: TableProps) {
  const [activeTableIdx, setActiveTableIdx] = useState(0);

  // 1. Khởi tạo dữ liệu bảng với sinh viên đã được sắp xếp
  const [tables, setTables] = useState(() =>
    combinedProps.map((item, tableIdx) => {
      // Xác định bộ tiêu đề (Headers)
      const classification =
        subjectClassification[item.subjects.subjectName || ""] || "medium";
      let currentHeaders;
      if (classification === "long")
        currentHeaders = headerNamesForLongPeriodsSubjects;
      else if (classification === "medium")
        currentHeaders = headerNamesForMediumPeriodsSubjects;
      else currentHeaders = headerNamesForShortPeriodsSubjects;

      // SẮP XẾP SINH VIÊN THEO FNAME (Tên)
      const sortedStudents = [...item.classes.studentList].sort((a, b) =>
        a.studentFName.localeCompare(b.studentFName, "vi"),
      );

      // TẠO DỮ LIỆU DÒNG (40 dòng cố định)
      const rowCount = combinedProps.reduce((max, current) => {
        const studentCount = current.classes.studentList.length;
        return studentCount > max ? studentCount : max;
      }, 1);

      const colCount = currentHeaders.length - 1; // Trừ cột STT

      const tableData = Array.from({ length: rowCount }, (_, rowIndex) => {
        const student = sortedStudents[rowIndex];

        return Array.from({ length: colCount }, (_, colIndex) => {
          if (student) {
            if (colIndex === 0) return student.studentLName; // Cột 1: Họ và tên lót
            if (colIndex === 1) return student.studentFName; // Cột 2: Tên
          }
          return ""; // Các ô còn lại hoặc dòng không có sinh viên thì để trống
        });
      });

      return {
        id: tableIdx,
        name: `${item.classes.className} - ${item.subjects.subjectName}`,
        headers: currentHeaders,
        data: tableData,
      };
    }),
  );

  // 2. Hàm xử lý thay đổi input (giữ nguyên logic cũ)
  const handleInputChange = (
    tableIdx: number,
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    const newTables = [...tables];
    const currentTable = newTables[tableIdx];
    const currentRow = currentTable.data[rowIndex];
    const currentHeaders = currentTable.headers; // Lấy mảng Object {label, weight}

    // 1. Cập nhật giá trị ô vừa nhập
    currentRow[colIndex] = value;

    // 2. Tìm vị trí cột "Average"
    const avgColIndex =
      currentHeaders.findIndex((h) => h.label === "Average") - 1;
    // (Trừ 1 vì trong data không có cột No.)

    if (avgColIndex !== -1) {
      let totalScore = 0;
      let totalWeight = 0;
      const bonusScore = currentRow[2] ? parseFloat(currentRow[2]) : 0; // Cột Bonus (index 2)

      // Cộng điểm Bonus vào tổng điểm trước khi tính trung bình
      if (!isNaN(bonusScore)) {
        totalScore += bonusScore;
      }

      // 3. Chạy vòng lặp qua các ô trong hàng để tính điểm hệ số
      currentRow.forEach((cellValue, idx) => {
        // Bỏ qua cột Average và các cột Họ/Tên (thường idx 0, 1)
        if (idx !== avgColIndex && idx > 1) {
          // Lấy weight từ header tương ứng (idx + 1 để khớp với mảng header có No.)[cite: 1]
          const weight = currentHeaders[idx + 1]?.weight || 0;
          const score = parseFloat(cellValue);

          if (!isNaN(score) && weight > 0) {
            totalScore += score * weight;
            totalWeight += weight;
          }
        }
      });

      // 4. Gán kết quả vào cột Average
      if (totalWeight > 0) {
        currentRow[avgColIndex] = (totalScore / totalWeight).toFixed(2);
      } else {
        currentRow[avgColIndex] = "";
      }

      if (parseFloat(currentRow[avgColIndex]) > 10) {
        currentRow[avgColIndex] = "10.00"; // Giới hạn điểm tối đa là 10
      }
    }

    setTables(newTables);
  };

  const activeTable = tables[activeTableIdx];

  const supabase = createClient();

  // "grade" table columns: id, student_id, subject_id, bonus_score, frequent_score_1, frequent_score_2, frequent_score_3, mid_term_score, end_of_term_score

  const handleSave = async () => {
    const dataToSave = activeTable.data.map((row, index) => ({
      teacher_id: combinedProps[activeTableIdx].teacherId,
      class_id: combinedProps[activeTableIdx].classes.classId ?? "",
      subject_id: combinedProps[activeTableIdx].subjects.subjectId ?? "",
      student_id:
        combinedProps[activeTableIdx].classes.studentList[index]?.studentId,
      bonus: row[2] ? parseFloat(row[2]) : null, // Cột Bonus
      frequent_1: row[3] ? parseFloat(row[3]) : null, // Cột Frequent #1
      frequent_2: row[4] ? parseFloat(row[4]) : null, // Cột Frequent #2
      frequent_3: row[5] ? parseFloat(row[5]) : null, // Cột Frequent #3
      mid_term: row[row.length - 3] ? parseFloat(row[row.length - 3]) : null, // Cột Mid-term
      end_term: row[row.length - 2] ? parseFloat(row[row.length - 2]) : null, // Cột End-of-term
      semester_id: 2, // Mặc định học kỳ 2, có thể thay đổi tùy theo nhu cầu
      average: parseFloat(row[row.length - 1]), // Cột Average (giá trị đã được tính toán)
    }));

    const saveProcess = async () => {
      const { data, error } = await supabase.from("grades").upsert(dataToSave, {
        onConflict: "student_id, subject_id, semester_id",
      });

      if (error) throw error; // Phải throw lỗi để toast nhận diện trạng thái "error"
      return data;
    };

    toast.promise(saveProcess(), {
      loading: "Saving grades...",
      success: "Grades saved successfully!",
      error: "Failed to save grades.",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-montserrat">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Điều hướng Tabs */}
        <div className="p-4 border-b bg-gray-50/50 flex flex-wrap gap-2">
          {tables.map((table) => (
            <button
              key={table.id}
              onClick={() => setActiveTableIdx(table.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTableIdx === table.id
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-secondary hover:bg-light-orange/30"
              }`}
            >
              {table.name}
            </button>
          ))}
        </div>

        {/* Bảng hiển thị */}
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-light-orange/30">
                <tr>
                  {activeTable.headers.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-xs font-semibold uppercase text-secondary border-b"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTable.data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {/* Số thứ tự */}
                    <td className="px-4 py-2 text-sm font-bold text-[var(--secondary-color)] bg-gray-50/50 border-r w-12 text-center">
                      {rowIndex + 1}
                    </td>

                    {/* Các ô dữ liệu (đã có autofill Họ và Tên) */}
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
                          className={`w-full px-4 py-2 text-sm focus:outline-none focus:bg-orange-50 ${
                            colIndex < 2
                              ? "font-medium text-gray-900"
                              : "text-gray-600"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-light-orange/15 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Đang chỉnh sửa:{" "}
            <span className="font-semibold text-secondary">
              {activeTable.name}
            </span>
          </div>
          <button
            onClick={handleSave}
            className="cursor-pointer px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-[var(--secondary-color)] shadow-sm transition-colors"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
