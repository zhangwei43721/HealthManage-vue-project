// Define SportInfo type based on backend API docs
export interface SportInfo {
  id: number // 运动信息 ID (主键, 自增)
  sportType: string // 运动类型 (例如 "跑步")
  suitableTime: string // 适宜时长 (描述)
  suitableHeartRate: string // 适宜心率范围 (描述)
  suitableFrequency: string // 适宜频率 (描述)
  recommendedSpeed: string // 建议速度/强度 (描述)
}

// Define Detail type based on backend API docs
export interface Detail {
  id: number // 运动详情 ID (主键, 自增)
  sportType: string // 运动类型 (外键, 关联 SportInfo)
  disease: string // 适宜/禁忌疾病 (描述)
  method: string // 具体方法/技巧 (描述)
  notes: string // 注意事项 (描述)
}
