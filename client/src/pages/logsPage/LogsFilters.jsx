// src/pages/logs/LogsFilters.jsx
import React from "react";

const LogsFilters = ({
  searchBy,
  pageSize,
  onPageSizeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  type,
  onTypeChange,
  searchKey,
  onSearchKeyChange,
  searchQuery,
  onSearchQueryChange,
  onResetFilters,
}) => {
  const pageSizeOptions = [10, 20, 30, 40, 50];

  const logTypeOptions = [
    { value: "", label: "كل الأنواع" },
    { value: 1, label: "إنشاء" },
    { value: 2, label: "تحديث" },
    { value: 3, label: "حذف" },
    { value: 4, label: "خطأ" },
  ];

  const searchByLabels = {
    UserId: "معرّف المستخدم",
    UserID: "معرّف المستخدم",
    IPAddress: "عنوان IP",
    IpAddress: "عنوان IP",
  };

  const searchByOptions =
    searchBy && Array.isArray(searchBy)
      ? searchBy.map((item) => ({
          value: item,
          label: searchByLabels[item] || item,
        }))
      : [];

  return (
    <div className="w-100 mb-3">
      <div className="row g-3 align-items-end">
        {/* حجم الصفحة */}
        <div className="col-6 col-md-2">
          <label className="form-label">عدد السجلات في الصفحة</label>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* من تاريخ */}
        <div className="col-6 col-md-2">
          <label className="form-label">من تاريخ</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        {/* إلى تاريخ */}
        <div className="col-6 col-md-2">
          <label className="form-label">إلى تاريخ</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>

        {/* نوع اللوج */}
        <div className="col-6 col-md-2">
          <label className="form-label">نوع العملية</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {logTypeOptions.map((opt) => (
              <option key={opt.value ?? "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* البحث حسب */}
        <div className="col-6 col-md-2">
          <label className="form-label">البحث حسب</label>
          <select
            className="form-select"
            value={searchKey}
            onChange={(e) => onSearchKeyChange(e.target.value)}
          >
            <option value="">كل الحقول</option>
            {searchByOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* نص البحث */}
        <div className="col-12 col-md-2">
          <label className="form-label">بحث</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="اكتب نص البحث..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="إعادة تعيين الفلاتر"
              onClick={onResetFilters}
            >
              إعادة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsFilters;
