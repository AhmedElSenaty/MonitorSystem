const PersonalInfoTable = ({
  data,
  isEditing,
  isEmployee,
  degreeOptions,
  employeeTypeOptions,
  onChange,
  onStartEdit,
  onSave,
  onCancel,
  saving,
  canEdit,
}) => {
  const genderDisplay =
    data.gender === 1 ? "ذكر" : data.gender === 0 ? "أنثى" : data.gender;
  console.log("can edit ===> ", canEdit);

  // Select helpers
  const degreeLabel =
    degreeOptions.find((o) => o.value === data.degree)?.label || data.degree;
  const empTypeLabel =
    employeeTypeOptions.find((o) => o.value === data.employeeType)?.label ||
    data.employeeType;

  console.log("data from edit => ", empTypeLabel);

  return (
    <div className="row justify-content-center mb-5">
      <div className="col-12 col-lg-12">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>البيانات الشخصية</h2>
          {!isEditing && isEmployee ? (
            <button
              className="btn btn-primary px-5"
              onClick={onStartEdit}
              disabled={!canEdit}
            >
              تعديل
            </button>
          ) : isEmployee ? (
            <div className="d-flex">
              {!saving ? (
                <>
                  <button
                    className="btn btn-success me-1 mx-2 px-3"
                    onClick={onSave}
                  >
                    حفظ
                  </button>
                  <button
                    className="btn btn-danger mx-2 px-3"
                    onClick={onCancel}
                  >
                    إلغاء
                  </button>
                </>
              ) : (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Desktop */}
        <div className="d-none d-md-block rounded shadow-lg table-responsive">
          <table
            className="table mb-0"
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <tbody>
              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  الرقم المسلسل
                </td>
                <td className="text-center">{data.id}</td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  الرقم القومي
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.ssn}
                      onChange={(e) => onChange("ssn", e.target.value)}
                    />
                  ) : (
                    <span>{data.ssn}</span>
                  )}
                </td>
              </tr>

              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  الاسم
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.name}
                      onChange={(e) => onChange("name", e.target.value)}
                    />
                  ) : (
                    <span>{data.name}</span>
                  )}
                </td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  العنوان
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.address}
                      onChange={(e) => onChange("address", e.target.value)}
                    />
                  ) : (
                    <span>{data.address}</span>
                  )}
                </td>
              </tr>

              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  الهاتف
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.phone}
                      onChange={(e) => onChange("phone", e.target.value)}
                    />
                  ) : (
                    <span>{data.phone}</span>
                  )}
                </td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  المؤهل
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <select
                      className="form-control text-center"
                      value={data.degree}
                      onChange={(e) => onChange("degree", e.target.value)}
                    >
                      {degreeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{degreeLabel}</span>
                  )}
                </td>
              </tr>

              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  البريد الالكتروني
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.email}
                      onChange={(e) => onChange("email", e.target.value)}
                    />
                  ) : (
                    <span>{data.email}</span>
                  )}
                </td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  الوظيفة
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.job}
                      onChange={(e) => onChange("job", e.target.value)}
                    />
                  ) : (
                    <span>{data.job}</span>
                  )}
                </td>
              </tr>

              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  النوع
                </td>
                <td className="text-center">
                  <span>{genderDisplay}</span>
                </td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  تاريخ الميلاد
                </td>
                <td className="text-center">
                  <span>{data.DOB}</span>
                </td>
              </tr>

              <tr>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  نوع الموظف
                </td>
                <td className="text-center">
                  {isEditing ? (
                    <select
                      className="form-control text-center"
                      value={data.employeeType}
                      onChange={(e) => onChange("employeeType", e.target.value)}
                    >
                      {employeeTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>{empTypeLabel}</span>
                  )}
                </td>
                <td
                  className="text-center"
                  style={{ backgroundColor: "#cdcdcd" }}
                >
                  العمر
                </td>
                <td className="text-center">
                  <span>{data.age}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="d-block d-md-none rounded shadow-lg table-responsive">
          <table
            className="table mb-0"
            style={{ borderRadius: "8px", overflow: "hidden" }}
          >
            <tbody>
              {[
                ["الرقم المسلسل", data.id],
                [
                  "الرقم القومي",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.ssn}
                      onChange={(e) => onChange("ssn", e.target.value)}
                    />
                  ) : (
                    data.ssn
                  ),
                ],
                [
                  "الاسم",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.name}
                      onChange={(e) => onChange("name", e.target.value)}
                    />
                  ) : (
                    data.name
                  ),
                ],
                [
                  "العنوان",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.address}
                      onChange={(e) => onChange("address", e.target.value)}
                    />
                  ) : (
                    data.address
                  ),
                ],
                [
                  "الهاتف",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.phone}
                      onChange={(e) => onChange("phone", e.target.value)}
                    />
                  ) : (
                    data.phone
                  ),
                ],
                [
                  "المؤهل",
                  isEditing ? (
                    <select
                      className="form-control text-center"
                      value={data.degree}
                      onChange={(e) => onChange("degree", e.target.value)}
                    >
                      {degreeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    degreeLabel
                  ),
                ],
                [
                  "البريد الالكتروني",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.email}
                      onChange={(e) => onChange("email", e.target.value)}
                    />
                  ) : (
                    data.email
                  ),
                ],
                [
                  "الوظيفة",
                  isEditing ? (
                    <input
                      className="form-control text-center"
                      value={data.job}
                      onChange={(e) => onChange("job", e.target.value)}
                    />
                  ) : (
                    data.job
                  ),
                ],
                ["النوع", genderDisplay],
                ["تاريخ الميلاد", data.DOB],
                [
                  "نوع الموظف",
                  isEditing ? (
                    <select
                      className="form-control text-center"
                      value={data.employeeType}
                      onChange={(e) => onChange("employeeType", e.target.value)}
                    >
                      {employeeTypeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    empTypeLabel
                  ),
                ],
                ["العمر", data.age],
              ].map(([label, value], idx) => (
                <tr key={idx}>
                  <td
                    className="text-center"
                    style={{ backgroundColor: "#cdcdcd" }}
                  >
                    {label}
                  </td>
                  <td className="text-center">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTable;
