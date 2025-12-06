export const degreeMap = {
  // 1: "أمي",
  2: "دبلوم",
  3: "ثانوية عامة",
  4: "فوق المتوسط",
  5: "مؤهل عالي",
  6: "دراسات عليا",
};

export const employeeTypeMap = {
  // 1: "موظف في الجامعة",
  2: "موظف على المعاش في الجامعة",
  3: "موظف من الخارج",
};

export const mapStatusToCode = (status) => {
  switch (status) {
    case "تحت المراجعة":
      return 1;
    case "تم القبول":
      return 2;
    case "تم الرفض":
      return 3;
    default:
      return null;
  }
};
