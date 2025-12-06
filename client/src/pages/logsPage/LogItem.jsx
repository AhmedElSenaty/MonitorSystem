// src/pages/logs/LogItem.jsx
import React, { useState } from "react";

import "./logs.css";

const LogItem = ({ logData }) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => {
    setCollapsed((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div
      className={`mb-3`}
      onClick={handleToggle}
      aria-expanded={!collapsed}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      dir="rtl"
    >
      <div className="d-flex align-items-start">
        <div className="me-3 log-card-icon"></div>

        <div className="flex-grow-1">
          <h5 className="fw-bold mb-2">
            [{logData.id}] {logData.action}
          </h5>

          <div className="small text-dark">
            {logData.userID && (
              <p className="mb-1">
                <span className="fw-bold">معرّف المستخدم:</span>{" "}
                {logData.userID}
              </p>
            )}

            {logData.userName && (
              <p className="mb-1">
                <span className="fw-bold">اسم المستخدم:</span>{" "}
                {logData.userName}
              </p>
            )}

            <p className="mb-1">
              <span className="fw-bold">عنوان IP:</span>{" "}
              {logData.ipAddress || "-"}
            </p>

            <p className="mb-2">
              <span className="fw-bold">التاريخ والوقت:</span>{" "}
              {new Date(logData.timeStamp).toLocaleString()}
            </p>

            <div>
              <p className="fw-bold mb-1">نص الرسالة:</p>

              {!collapsed && (
                <pre className="log-card-message">{logData.message || "-"}</pre>
              )}

              {collapsed && (
                <p className="text-primary fw-semibold fst-italic mb-0">
                  (اضغط لعرض تفاصيل الرسالة)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogItem;
