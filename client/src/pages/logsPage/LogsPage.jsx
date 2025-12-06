// src/pages/logs/LogsPage.jsx
import React, { useEffect, useState } from "react";
import { FileClock, PlayCircle } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "../../data/api";
import LogItem from "./LogItem";
import LogsFilters from "./LogsFilters";

const LogsPage = () => {
  // 🔢 حالات الفلترة والصفحات
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [type, setType] = useState(""); // رقم النوع أو ""
  const [searchKey, setSearchKey] = useState(""); // مثلا "UserId"
  const [searchQuery, setSearchQuery] = useState(""); // نص البحث
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState(""); // yyyy-mm-dd

  // 📦 الداتا
  const [logs, setLogs] = useState([]);
  const [count, setCount] = useState(0);
  const [metadata, setMetadata] = useState({
    searchBy: [],
    pagination: { pageIndex: 1, totalPages: 1, totalRecords: 0 },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errPage, setErrPage] = useState(false);

  const pagination = metadata?.pagination || {
    pageIndex: 1,
    totalPages: 1,
    totalRecords: 0,
  };

  // 📥 تحميل السجلات من الـ API
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        setErrPage(false);

        const res = await api.get("/api/Logs/GetAll", {
          params: {
            PageIndex: page,
            PageSize: pageSize,
            Type: type ? Number(type) : null,
            SearchKey: searchKey || null,
            SearchQuery: searchQuery || null,
            StartDate: startDate || null,
            EndDate: endDate || null,
          },
        });
        console.log(res);
        const data = res.data?.data;

        if (!data || !Array.isArray(data.logs)) {
          setLogs([]);
          setCount(0);
          setMetadata({
            searchBy: [],
            pagination: { pageIndex: 1, totalPages: 1, totalRecords: 0 },
          });
          return;
        }

        setLogs(data.logs);
        setCount(
          data.totalCount ??
            data.metadata?.pagination?.totalRecords ??
            data.logs.length
        );
        setMetadata({
          searchBy: data.metadata?.searchBy || [],
          pagination: data.metadata?.pagination || {
            pageIndex: page,
            totalPages: 1,
            totalRecords:
              data.totalCount ??
              data.metadata?.pagination?.totalRecords ??
              data.logs.length,
          },
        });
      } catch (err) {
        console.error("Error fetching logs:", err);
        toast.error("حدث خطأ أثناء تحميل السجلات", { rtl: true });
        setErrPage(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [page, pageSize, type, searchKey, searchQuery, startDate, endDate]);

  // 🔁 إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setPage(1);
    setPageSize(10);
    setType("");
    setSearchKey("");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  // 📄 التحكم في الصفحات
  const handleFirst = () => setPage(1);

  const handlePrev = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleNext = () =>
    setPage((prev) => (prev < (pagination.totalPages || 1) ? prev + 1 : prev));

  return (
    <div className="container py-4" dir="rtl">
      {/* العنوان الرئيسي */}
      <div className="mb-4">
        <h2 className="mb-1">سجل العمليات</h2>
        <p className="text-muted mb-0">
          عرض وتحليل جميع سجلات النظام (تسجيل دخول، تعديل صلاحيات، أخطاء، وغير
          ذلك).
        </p>
      </div>

      {/* كروت المعلومات العلوية */}
      <div className="row g-3 mb-4">
        {/* كارت معلومات / فيديو أو توضيح */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div className="ms-3">
                <PlayCircle size={32} />
              </div>
              <div>
                <h5 className="card-title mb-1">طريقة استخدام سجل العمليات</h5>
                <p className="card-text small text-muted mb-2">
                  يمكنك استخدام الفلاتر للبحث حسب التاريخ أو نوع العملية أو
                  معرّف المستخدم لمراجعة سجل النظام بدقة.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* كارت عدد السجلات */}
        <div className="col-12 col-lg-6">
          <div className="card h-100 text-white bg-warning border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title mb-1">إجمالي السجلات</h5>
                <p className="card-text small mb-2">
                  إجمالي عدد العمليات المسجلة في النظام.
                </p>
                <h3 className="mb-0">{count ?? 0}</h3>
              </div>
              <div style={{ opacity: 0.8 }}>
                <FileClock size={42} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الجزء الرئيسي: الفلاتر + السجلات */}
      <div className="card shadow-sm">
        <div className="card-body">
          {/* الفلاتر */}
          <LogsFilters
            searchBy={metadata.searchBy || []}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            type={type}
            onTypeChange={setType}
            searchKey={searchKey}
            onSearchKeyChange={setSearchKey}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onResetFilters={handleResetFilters}
          />

          <hr />

          {/* قائمة السجلات */}
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary mb-2" />
              <div className="text-muted small">جاري تحميل السجلات...</div>
            </div>
          ) : errPage ? (
            <div className="text-center py-4">
              <h6 className="mb-1 text-danger">حدث خطأ</h6>
              <p className="text-muted mb-0">
                تعذّر تحميل السجلات، حاول مرة أخرى لاحقًا.
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-4">
              <h6 className="mb-1">لا توجد سجلات</h6>
              <p className="text-muted mb-0">
                لم يتم العثور على أي سجلات مطابقة لمعايير البحث الحالية.
              </p>
            </div>
          ) : (
            <div className="mt-3">
              {logs.map((log) => (
                <LogItem key={log.id} logData={log} />
              ))}
            </div>
          )}

          {/* الصفحات */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-2">
            <div className="text-muted small">
              صفحة {pagination.pageIndex || 1} من {pagination.totalPages || 1} —
              إجمالي السجلات: {pagination.totalRecords || 0}
            </div>

            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${
                    (pagination.pageIndex || 1) === 1 ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handleFirst}>
                    الأولى
                  </button>
                </li>
                <li
                  className={`page-item ${
                    (pagination.pageIndex || 1) === 1 ? "disabled" : ""
                  }`}
                >
                  <button className="page-link" onClick={handlePrev}>
                    السابقة
                  </button>
                </li>

                <li className="page-item disabled">
                  <span className="page-link">
                    {pagination.pageIndex || 1} / {pagination.totalPages || 1}
                  </span>
                </li>

                <li
                  className={`page-item ${
                    (pagination.pageIndex || 1) === (pagination.totalPages || 1)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button className="page-link" onClick={handleNext}>
                    التالية
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
