import { AxiosError } from 'axios';
import { axiosInstance } from './axiosInstance';
import { EventsResponse } from '../types/Event';

export const getAllEvents = async () => {
  try {
    const response = await axiosInstance.get<EventsResponse>('/events');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch events');
    }

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof AxiosError
        ? error.response?.data?.message
        : 'Error taking event data',
    );
  }
};

export const getUpcomingEvents = async () => {
  try {
    const response = await axiosInstance.get<EventsResponse>(
      '/events/upcoming',
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Failed to fetch upcoming events',
      );
    }

    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      error instanceof AxiosError
        ? error.response?.data?.message
        : 'Error taking upcoming event data',
    );
  }
};
