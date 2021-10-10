import { MatrixClient } from '..';
import { SyncResponse } from 'matrix-types/client/sync';
import { Room } from '../model/Room';
import { OnRoomEvent } from '../event/OnRoomEvent';

export class SyncHandler {
  private client: MatrixClient;

  constructor(client: MatrixClient) {
    this.client = client;
  }

  private requestSync(batch?: string): Promise<SyncResponse> {
    return this.client.http.request(
      'GET',
      `/sync?timeout=20000${batch ? `&since=${batch}` : ''}`
    );
  }

  syncRooms(response: SyncResponse) {
    if (!response.rooms) return;

    const rooms = response.rooms;

    if (rooms.join) {
      const joined = rooms.join;
      Object.keys(joined).forEach((id: string) => {
        const data = joined[id];
        let room = this.client.store.rooms.getRoom(id);
        if (!room) room = new Room(this.client, id);

        if (data.state?.events) {
          room.updateState(data.state.events);
        }

        if (data.account_data?.events) {
          room.setAccountData(data.account_data.events);
        }

        if (data.timeline) {
          if (data.timeline.events) {
            data.timeline.events.forEach((event) => {
              this.client.dispatchEvent(
                new OnRoomEvent(
                  event,
                  room!,
                  // TODO don't force!
                  this.client.store.users.getUser(event.sender)!
                )
              );
            });
            room.timeline.updateEvents(data.timeline.events);
          }

          if (data.timeline.limited && data.timeline.prev_batch) {
            room.timeline.setPrevBatch(data.timeline.prev_batch);
          }
        }

        this.client.store.rooms.storeRoom(room);
      });
    }
  }

  async sync(batch?: string) {
    const resp = await this.requestSync(batch);

    this.syncRooms(resp);

    await this.sync(resp.next_batch);
  }

  startSyncing() {
    this.sync();
  }
}
