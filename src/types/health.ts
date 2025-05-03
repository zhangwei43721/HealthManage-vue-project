// Define Body type based on backend API docs
export interface Body {
  id: number // 体征记录 ID (主键, 自增)
  name: string // 用户姓名
  age: number // 年龄
  gender: string // 性别
  height: number // 身高 (cm)
  weight: number // 体重 (kg)
  bloodSugar: number // 血糖 (mmol/L)
  bloodPressure: string // 血压 (例如 "120/80")
  bloodLipid: string // 血脂 (例如 "正常")
  heartRate: number // 静息心率 (次/分钟)
  vision: number // 视力 (例如 50 代表 5.0)
  sleepDuration: number // 睡眠时长 (小时)
  sleepQuality: string // 睡眠质量 (例如 "良好")
  smoking: boolean // 是否吸烟
  drinking: boolean // 是否饮酒
  exercise: boolean // 是否规律运动
  foodTypes: string // 主要食物类型 (描述)
  waterConsumption: number // 日均饮水量 (L)
}

// Define BodyNotes type if needed for user-specific logs
// export interface BodyNotes extends Body {
//   notesid: number; // 本记录 ID (主键, 自增)
//   Date: Date; // 记录日期
//   // id field in BodyNotes refers to user ID, maybe rename for clarity?
//   userId: number; // Assuming 'id' in BodyNotes is userId
// }
