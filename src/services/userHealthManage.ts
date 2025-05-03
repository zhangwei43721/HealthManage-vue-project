import api from './api'
import type { BodyData } from '@/types/health' // Assuming types exist, renamed from Body

interface ListParams {
  name?: string
  id?: number // Assuming this is userId
  pageNo: number
  pageSize: number
}

interface ListResponse {
  total: number
  rows: BodyData[]
}

export default {
  // Admin functions for managing ANY user's body data
  getAllBodyList(params: ListParams) {
    return api.get<ListResponse>('/user/getBodyList', { params })
  },
  getBodyById(id: number) {
    // Assuming this id is the body record id
    return api.get<BodyData>(`/user/getBodyById/${id}`)
  },
  updateBody(data: BodyData) {
    // id must exist for update
    return api.put<any>('/user/updateBody', data)
  },
  deleteBodyById(id: number) {
    // Assuming this id is the body record id
    return api.delete<any>(`/user/deleteBodyById/${id}`)
  },
  // Note: Add BodyNotes functionality if needed by the admin page
  // addBodyNotes(data: BodyNotes) {
  //   return api.post<any>('/user/BodyInformationNotes', data);
  // }
  // getUserBodyNotesLog(userId: number) {
  //   return api.get<BodyNotes[]>(`/user/getBodyNotes/${userId}`);
  // }
}

// Define BodyData type if not already defined in @/types/health
/*
export interface BodyData {
  id: number; // Record ID
  name: string; // User name
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bloodSugar?: number;
  bloodPressure?: string;
  bloodLipid?: string;
  heartRate?: number;
  vision?: number;
  sleepDuration?: number;
  sleepQuality?: string;
  smoking?: boolean;
  drinking?: boolean;
  exercise?: boolean;
  foodTypes?: string;
  waterConsumption?: number;
  // Might include userId if relevant for display or linking
  userId?: number;
}

// Define BodyNotes if needed
export interface BodyNotes extends BodyData {
    notesid: number; // Primary key for the note itself
    Date: string; // Or Date type
}
*/
