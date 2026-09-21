export const SITE_NAME = "مساج منزلي برايفت | كابتن أحمد العلاوي";
export const CAPTAIN_NAME = "كابتن أحمد العلاوي";
export const SITE_TAGLINE = "راحة وخصوصية في بيتك";

export const SERVICES = [
  {
    id: "relaxation",
    title: "مساج استرخائي",
    body: "للراحة والتخلص من التوتر والإجهاد.",
  },
  {
    id: "swedish",
    title: "مساج سويدي",
    body: "مساج متوازن بضغط خفيف إلى متوسط.",
  },
  {
    id: "therapeutic",
    title: "مساج علاجي",
    body: "مناسب للشد والإجهاد العضلي.",
  },
  {
    id: "deep",
    title: "Deep Tissue",
    body: "ضغط أعمق لمن يفضل المساج القوي.",
  },
  {
    id: "thai",
    title: "مساج تايلاندي",
    body: "يعتمد على الضغط والتمدد والحركة.",
  },
  {
    id: "hijama",
    title: "الحجامة",
    body: "حجامة جافة ومنزلقة وإلكترونية وتشريطية حسب المناسب للجلسة.",
  },
] as const;

export const SESSION_TYPES = [...SERVICES.map((s) => s.title)] as const;

export const SESSION_FACTS = [
  { id: "home", text: "جلسات منزلية برايفت." },
  { id: "men", text: "للرجال فقط." },
  { id: "area", text: "الزيارات داخل مصر." },
  { id: "duration", text: "مدة الجلسة من ساعة إلى ساعة ونصف." },
  { id: "deposit", text: "الحجز بعربون مسبق." },
] as const;

export const BOOKING_NOTES = [
  "سعر الجلسة 1200 جنيه.",
  "الحجز يتم بعربون مسبق لتأكيد الموعد.",
  "قد تُضاف تكلفة مواصلات حسب المكان والمسافة.",
] as const;

export const SERVICE_HINT =
  "مش عارف تختار؟ اكتب احتياجك في الملاحظات وسيتم اختيار الأنسب لك.";
