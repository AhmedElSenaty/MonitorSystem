import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import {
  faSquare as faSquareRegular,
  faSquareCheck as faSquareCheckRegular,
} from "@fortawesome/free-regular-svg-icons";

const FacultiesTable = ({
  faculties,
  isEmployee,
  isAdmin,
  isSuperAdmin,
  hasEmpId,
  checkedFaculties,
  onToggleCheck,
  onExportFaculty,
  onDeleteFaculty,
}) => {
  // 🔽 or 🔼 الاتجاه الافتراضي: من الأكبر للأصغر
  const [employeesSortDir, setEmployeesSortDir] = useState("desc"); // 'asc' | 'desc'

  const sortedFaculties = useMemo(() => {
    if (!faculties || faculties.length === 0) return [];

    const getCount = (f) => f.totalEmployees ?? f.TotalEmployees ?? 0;

    const sorted = [...faculties].sort((a, b) => {
      const aCount = getCount(a);
      const bCount = getCount(b);

      if (employeesSortDir === "asc") {
        return aCount - bCount;
      }
      // desc
      return bCount - aCount;
    });

    return sorted;
  }, [faculties, employeesSortDir]);

  const toggleEmployeesSort = () => {
    setEmployeesSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const renderSortArrow = () =>
    employeesSortDir === "asc" ? (
      <span className="ms-1">▲</span>
    ) : (
      <span className="ms-1">▼</span>
    );

  return (
    <div className="table-responsive">
      <table
        className="table table-hover text-end align-middle table-striped"
        style={{ minWidth: "750px" }}
      >
        <thead className="table-secondary">
          <tr>
            <th style={{ width: "10%" }}>رقم مسلسل</th>

            <th style={{ width: "45%" }} className="text-break">
              الكلية
            </th>

            <th
              style={{ width: "25%", cursor: "pointer" }}
              className="text-center"
              onClick={toggleEmployeesSort}
              title="ترتيب حسب عدد المراقبين"
            >
              عدد المراقبين
              {renderSortArrow()}
            </th>

            <th style={{ width: "20%" }} className="text-center">
              تحكم
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedFaculties && sortedFaculties.length > 0 ? (
            sortedFaculties.map((faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.id}</td>

                <td className="text-break">{faculty.name}</td>

                <td className="text-center">
                  {faculty.totalEmployees ?? faculty.TotalEmployees ?? 0}
                </td>

                <td className="text-center fs-5">
                  {(isSuperAdmin || isAdmin) && !hasEmpId && (
                    <button
                      type="button"
                      className="btn btn-outline-success mx-1"
                      onClick={() => onExportFaculty(faculty)}
                      title="تصدير الكلية"
                    >
                      <FontAwesomeIcon icon={faFileExcel} />
                    </button>
                  )}

                  {hasEmpId && (
                    <button
                      type="button"
                      className="btn btn-outline-primary mx-2"
                      onClick={() =>
                        (isAdmin || isSuperAdmin) && onToggleCheck(faculty.id)
                      }
                    >
                      <FontAwesomeIcon
                        icon={
                          checkedFaculties.includes(faculty.id)
                            ? faSquareCheckRegular
                            : faSquareRegular
                        }
                      />
                    </button>
                  )}

                  {isSuperAdmin && !hasEmpId && (
                    <button
                      type="button"
                      className="btn btn-outline-danger mx-1"
                      onClick={() => onDeleteFaculty(faculty.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-3">
                لا يوجد كليات
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FacultiesTable;
