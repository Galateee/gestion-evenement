/**
 * Client HTTP pour communiquer avec l'event-service
 * Récupère les détails d'un événement (capacité, places disponibles)
 * Gère les erreurs de communication inter-services
 */
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

export interface EventDetails {
  id: string;
  capacity: number;
  availableSeats: number;
}

@Injectable()
export class EventClient {
  private readonly logger = new Logger(EventClient.name);

  async getEventDetails(eventId: string): Promise<EventDetails> {
    try {
      const eventServiceUrl =
        process.env.EVENT_SERVICE_URL || 'http://event-service:3001';
      const url = `${eventServiceUrl}/events/${eventId}`;

      this.logger.debug(`Fetching event from: ${url}`);
      const response = await axios.get<any>(url);

      this.logger.debug(`Event response: ${JSON.stringify(response.data)}`);

      return {
        id: response.data.id,
        capacity: response.data.capacity,
        availableSeats: response.data.availableSeats,
      };
    } catch (error: unknown) {
      const err = error as AxiosError;
      const statusCode = err?.response?.status;
      const data = err?.response?.data;
      const message = `Status: ${statusCode}, Data: ${JSON.stringify(data)}, Message: ${err?.message}`;

      this.logger.error(`Event client error: ${message}`);
      throw new HttpException(
        `Failed to fetch event details: ${message}`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getAvailableSeats(eventId: string): Promise<number> {
    const event = await this.getEventDetails(eventId);
    return event.availableSeats;
  }
}
