import { SyncRoomEvent, SyncStateEvent } from 'matrix-types/client/sync';
import { MatrixEvent } from 'matrix-types/events';
import { RoomPaginationResponse } from 'matrix-types/client/rooms/pagination';
import { Room } from './Room';

type AllEvents = SyncRoomEvent | SyncStateEvent;

export class RoomTimeline {
  private room: Room;
  events: AllEvents[] = [];
  prevBatch: string | undefined;
  constructor(room: Room) {
    this.room = room;
  }

  async backfill(amount: number = 10) {
    const req: RoomPaginationResponse = await this.room.client.http.request(
      'GET',
      `/rooms/${this.room.id}/messages?dir=b&limit=${amount}&from=${this.prevBatch}`
    );

    req.chunk.reverse();
    this.events.unshift(...req.chunk);

    this.prevBatch = req.end;
  }

  updateEvents(events: AllEvents[]) {
    this.events = events;
  }

  setPrevBatch(prevBatch: string) {
    this.prevBatch = prevBatch;
  }
}
