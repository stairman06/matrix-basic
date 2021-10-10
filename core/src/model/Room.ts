import { SendEventResponse } from 'matrix-types/client/rooms/pagination';
import {
  MatrixEvent,
  MatrixStateEvent,
  StateEventMap,
  StateEventType,
} from 'matrix-types/events';
import { MatrixClient } from '..';
import { RoomTimeline } from './RoomTimeline';
import { User } from './User';

export class Room {
  client: MatrixClient;
  id: string;
  state: MatrixStateEvent[] = [];
  accountData: MatrixEvent[] = [];
  timeline: RoomTimeline = new RoomTimeline(this);

  constructor(client: MatrixClient, id: string) {
    this.client = client;
    this.id = id;
  }

  findStateEvent<T extends StateEventType>(
    type: T,
    key: string = ''
  ): StateEventMap[T] | undefined {
    return this.state.find(
      (event) => event.type === type && event.state_key === key
    ) as unknown as StateEventMap[T];
  }

  getStateEvents<T extends StateEventType>(type: T): StateEventMap[T][] {
    return this.state.filter(
      (event) => event.type === type
    ) as unknown as StateEventMap[T][];
  }

  setState(events: MatrixStateEvent[]) {
    this.state = events;
  }

  updateState(events: MatrixStateEvent[]) {
    events.forEach((event) => {
      const existing = this.state.findIndex(
        (ev) => ev.type === event.type && ev.state_key === event.state_key
      );
      if (existing !== -1) {
        this.state[existing] = event;
      } else {
        this.state.push(event);
      }
    });
  }

  setAccountData(events: MatrixEvent[]) {
    this.accountData = events;
  }

  getMembers(): User[] {
    return this.getStateEvents('m.room.member').map((event) => {
      let user = this.client.store.users.getUser(event.state_key);
      if (!user) {
        user = new User(event.state_key);
      }

      if (event.content.displayname)
        user.setDisplayName(event.content.displayname);
      if (event.content.avatar_url) user.setAvatarUrl(event.content.avatar_url);

      this.client.store.users.storeUser(user);

      return user;
    });
  }

  async sendEvent(
    event: MatrixEvent,
    txnId: string = this.client.generateTransactionId()
  ): Promise<{
    eventId: string;
    txnId: string;
  }> {
    const resp: SendEventResponse = await this.client.http.request(
      'PUT',
      `/rooms/${this.id}/send/${event.type}/${txnId}`,
      event.content
    );
    return {
      eventId: resp.event_id,
      txnId,
    };
  }

  get name(): string | undefined {
    return this.findStateEvent('m.room.name')?.content?.name;
  }
}
