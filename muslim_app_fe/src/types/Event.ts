export interface IslamicEvent {
  id: number;
  name: string;
  description?: string;
  dateHijri: string;
  estimatedGregorian?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  success: boolean;
  data: IslamicEvent[];
  message?: string;
}
