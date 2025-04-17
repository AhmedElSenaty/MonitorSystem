import React, { useState, useRef } from "react";

const PersonalInfoPortal = () => {
  const originalData = {
    name: "هنا",
    address: "القاهرة الجديدة",
    degree: "61",
    job: "مصيدة",
  };
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({ ...originalData });

  const fileInputs = {
    personal: useRef(),
    degree: useRef(),
    idFront: useRef(),
    idBack: useRef(),
  };
  const [files, setFiles] = useState({
    personal: null,
    degree: null,
    idFront: null,
    idBack: null,
  });

  const handleChange = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const handleFile = (type, file) =>
    setFiles((prev) => ({ ...prev, [type]: file }));

  const startEdit = () => setIsEditing(true);
  const saveEdit = () => setIsEditing(false);
  const cancelEdit = () => {
    setData({ ...originalData });
    setIsEditing(false);
  };

  const requests = [
    { id: 4, status: "تم القبول", notes: "لا يوجد ملاحظات" },
    { id: 3, status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
    { id: 2, status: "تم الرفض", notes: "الصورة غير واضحة" },
    { id: 1, status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
  ];
  const statusClass = (s) =>
    s === "تم القبول"
      ? "text-success"
      : s === "تحت المراجعة"
      ? "text-warning"
      : "text-danger";

  return (
    <div
      dir="rtl"
      className="container-fluid p-0"
      style={{ backgroundColor: "#EBEFF5" }}
    >
      <div className="container py-4 w-100">

        {/* Personal Data Table */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-lg-12">
        {/* Personal Data Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>البيانات الشخصية</h2>
          {!isEditing ? (
            <button className="btn btn-primary px-5" onClick={startEdit}>
              تعديل
            </button>
          ) : (
            <div className="d-flex">
              <button className="btn btn-success me-1 mx-2 px-3" onClick={saveEdit}>
                حفظ
              </button>
              <button className="btn btn-secondary mx-2 px-3" onClick={cancelEdit}>
                إلغاء
              </button>
            </div>
          )}
        </div>
            <div className="bg-white rounded shadow-lg">
              <table
                className="table mb-0 w-100"
                style={{ borderRadius: "8px", overflow: "hidden" }}
              >
                <tbody>
                  <tr>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">الرقم المسلسل</td>
                    <td className="text-center">100001</td>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">الرقم القومي</td>
                    <td className="text-center">30303060104694</td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">الاسم</td>
                    <td className="text-center">
                      {isEditing ? (
                        <input
                          className="form-control text-center"
                          value={data.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                      ) : (
                        <span>{data.name}</span>
                      )}
                    </td>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">العنوان</td>
                    <td className="text-center">
                      {isEditing ? (
                        <input
                          className="form-control text-center"
                          value={data.address}
                          onChange={(e) =>
                            handleChange("address", e.target.value)
                          }
                        />
                      ) : (
                        <span>{data.address}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">العمر</td>
                    <td className="text-center">61</td>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">المؤهل</td>
                    <td className="text-center">
                      {isEditing ? (
                        <input
                          className="form-control text-center"
                          value={data.degree}
                          onChange={(e) =>
                            handleChange("degree", e.target.value)
                          }
                        />
                      ) : (
                        <span>{data.degree}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">النوع</td>
                    <td className="text-center">أنثى</td>
                    <td style={{backgroundColor: "#ECECF1"}} className=" text-center">الوظيفة</td>
                    <td className="text-center">
                      {isEditing ? (
                        <input
                          className="form-control text-center"
                          value={data.job}
                          onChange={(e) => handleChange("job", e.target.value)}
                        />
                      ) : (
                        <span>{data.job}</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        <h4 className="mb-3">المرفقات</h4>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 mb-5 justify-content-center">
          {[
            { type: "degree", label: "صورة المؤهل" },
            { type: "personal", label: "صورة الشخصية" },
            { type: "idFront", label: "صورة البطاقة وجه" },
            { type: "idBack", label: "صورة البطاقة ظهر" },
          ].map(({ type, label }) => (
            <div key={type} className="col d-flex justify-content-center">
              <div
                className="card shadow-sm p-3 text-center"
                style={{ width: "100%" }}
              >
                <div className="fw-bold mb-2">{label}</div>
                <div
                  className="mx-auto mb-2"
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundColor: files[type] ? "transparent" : "#EFF1F5",
                    border: "1px dashed #CFB53B",
                    borderRadius: "8px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => fileInputs[type].current.click()}
                >
                  {files[type] ? (
                    <img
                      src={URL.createObjectURL(files[type])}
                      alt={label}
                      className="img-fluid"
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                    <i
                      className="bi bi-card-image text-secondary"
                      style={{ fontSize: "2.5rem", lineHeight: "150px" }}
                    ></i>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputs[type]}
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(type, e.target.files[0])}
                  />
                </div>
                <button
                  className="btn"
                  style={{
                    border: "1px solid #CFB53B",
                    color: "#CFB53B",
                    borderRadius: "5px",
                    width: "100%",
                  }}
                  onClick={() => fileInputs[type].current.click()}
                >
                  تعديل
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Requests Section */}
        <h4 className="mb-3">الطلبات</h4>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-12">
            <table className="table table-bordered text-center mb-0 w-100 shadow-sm">
              <thead className="bg-light">
                <tr>
                  <th>الترتيب</th>
                  <th>الحالة</th>
                  <th>ملاحظات</th>
                  <th>تحكم</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="align-middle">
                    <td>{r.id}</td>
                    <td className={statusClass(r.status)}>{r.status}</td>
                    <td>{r.notes}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm">
                        عرض كافيه
                      </button>
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
};

export default PersonalInfoPortal;

// ==============

// import React, { useState, useRef } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const PersonalInfoPortal = () => {
//   const originalData = {
//     name: "هنا",
//     address: "القاهرة الجديدة",
//     degree: "61",
//     job: "مصيدة",
//   };
//   const [isEditing, setIsEditing] = useState(false);
//   const [data, setData] = useState({ ...originalData });

//   const fileInputs = {
//     personal: useRef(),
//     degree: useRef(),
//     idFront: useRef(),
//     idBack: useRef(),
//   };
//   const [files, setFiles] = useState({
//     personal: null,
//     degree: null,
//     idFront: null,
//     idBack: null,
//   });

//   const handleChange = (field, value) =>
//     setData((prev) => ({ ...prev, [field]: value }));
//   const handleFile = (type, file) =>
//     setFiles((prev) => ({ ...prev, [type]: file }));

//   const startEdit = () => setIsEditing(true);
//   const saveEdit = () => setIsEditing(false);
//   const cancelEdit = () => {
//     setData({ ...originalData });
//     setIsEditing(false);
//   };

//   const requests = [
//     { id: 4, status: "تم القبول", notes: "لا يوجد ملاحظات" },
//     { id: 3, status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
//     { id: 2, status: "تم الرفض", notes: "الصورة غير واضحة" },
//     { id: 1, status: "تحت المراجعة", notes: "لا يوجد ملاحظات" },
//   ];
//   const statusClass = (s) =>
//     s === "تم القبول"
//       ? "text-success"
//       : s === "تحت المراجعة"
//       ? "text-warning"
//       : "text-danger";

//   return (
//     <div
//       dir="rtl"
//       className="container-fluid p-0"
//       style={{ backgroundColor: "#EBEFF5" }}
//     >

//       {/* Content */}
//       <div className="container py-4">
//         {/* Personal Data Section */}
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h2>البيانات الشخصية</h2>
//           {!isEditing ? (
//             <button className="btn btn-primary" onClick={startEdit}>
//               تعديل
//             </button>
//           ) : (
//             <div className="d-flex">
//               <button className="btn btn-success me-2" onClick={saveEdit}>
//                 حفظ
//               </button>
//               <button className="btn btn-secondary" onClick={cancelEdit}>
//                 إلغاء
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="row justify-content-center mb-5">
//           <div className="col-12 col-lg-10">
//             <div className="bg-white rounded shadow-sm p-0">
//               <table
//                 className="table mb-0"
//                 style={{ borderRadius: "8px", overflow: "hidden" }}
//               >
//                 <tbody>
//                   <tr>
//                     <td className="bg-light text-center">الرقم المسلسل</td>
//                     <td className="text-center">100001</td>
//                     <td className="bg-light text-center">الرقم القومي</td>
//                     <td className="text-center">30303060104694</td>
//                   </tr>
//                   <tr>
//                     <td className="bg-light text-center">الاسم</td>
//                     <td className="text-center">
//                       {isEditing ? (
//                         <input
//                           className="form-control text-center"
//                           value={data.name}
//                           onChange={(e) => handleChange("name", e.target.value)}
//                         />
//                       ) : (
//                         <span>{data.name}</span>
//                       )}
//                     </td>
//                     <td className="bg-light text-center">العنوان</td>
//                     <td className="text-center">
//                       {isEditing ? (
//                         <input
//                           className="form-control text-center"
//                           value={data.address}
//                           onChange={(e) =>
//                             handleChange("address", e.target.value)
//                           }
//                         />
//                       ) : (
//                         <span>{data.address}</span>
//                       )}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="bg-light text-center">العمر</td>
//                     <td className="text-center">61</td>
//                     <td className="bg-light text-center">المؤهل</td>
//                     <td className="text-center">
//                       {isEditing ? (
//                         <input
//                           className="form-control text-center"
//                           value={data.degree}
//                           onChange={(e) =>
//                             handleChange("degree", e.target.value)
//                           }
//                         />
//                       ) : (
//                         <span>{data.degree}</span>
//                       )}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="bg-light text-center">النوع</td>
//                     <td className="text-center">أنثى</td>
//                     <td className="bg-light text-center">الوظيفة</td>
//                     <td className="text-center">
//                       {isEditing ? (
//                         <input
//                           className="form-control text-center"
//                           value={data.job}
//                           onChange={(e) => handleChange("job", e.target.value)}
//                         />
//                       ) : (
//                         <span>{data.job}</span>
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Attachments Section */}
//         <h4 className="mb-3">المرفقات</h4>
//         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5 justify-content-center">
//           {[
//             { type: "degree", label: "صورة المؤهل" },
//             { type: "personal", label: "صورة الشخصية" },
//             { type: "idFront", label: "صورة البطاقة وجه" },
//             { type: "idBack", label: "صورة البطاقة ظهر" },
//           ].map(({ type, label }) => (
//             <div key={type} className="col d-flex justify-content-center">
//               <div
//                 className="card shadow-sm p-3 text-center"
//                 style={{ width: "100%" }}
//               >
//                 <div className="fw-bold mb-2">{label}</div>
//                 <div
//                   className="mx-auto mb-2"
//                   style={{
//                     width: "100%",
//                     height: "150px",
//                     border: "2px dashed #ced4da",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     position: "relative",
//                   }}
//                   onClick={() => fileInputs[type].current.click()}
//                 >
//                   {files[type] ? (
//                     <img
//                       src={URL.createObjectURL(files[type])}
//                       alt={label}
//                       className="img-fluid"
//                       style={{ maxHeight: "100%", maxWidth: "100%" }}
//                     />
//                   ) : (
//                     <i
//                       className="bi bi-card-image text-secondary"
//                       style={{ fontSize: "2.5rem", lineHeight: "150px" }}
//                     ></i>
//                   )}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputs[type]}
//                     style={{ display: "none" }}
//                     onChange={(e) => handleFile(type, e.target.files[0])}
//                   />
//                 </div>
//                 <button
//                   className="btn"
//                   style={{
//                     border: "1px solid #CFB53B",
//                     color: "#CFB53B",
//                     borderRadius: "5px",
//                     width: "100%",
//                   }}
//                   onClick={() => fileInputs[type].current.click()}
//                 >
//                   تعديل
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Requests Section */}
//         <h4 className="mb-3">الطلبات</h4>
//         <div className="row justify-content-center">
//           <div className="col-12 col-lg-10">
//             <table className="table table-bordered text-center mb-0">
//               <thead className="bg-white">
//                 <tr>
//                   <th>الترتيب</th>
//                   <th>الحالة</th>
//                   <th>ملاحظات</th>
//                   <th>تحكم</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {requests.map((r) => (
//                   <tr key={r.id} className="align-middle">
//                     <td>{r.id}</td>
//                     <td className={statusClass(r.status)}>{r.status}</td>
//                     <td>{r.notes}</td>
//                     <td>
//                       <button className="btn btn-outline-primary btn-sm">
//                         عرض كافيه
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PersonalInfoPortal;
