import { MatrixEvent } from 'matrix-types/events';
import { OnRoomEvent } from '../event/OnRoomEvent';
import { Room } from '../model/Room';
import { User } from '../model/User';
import { MemoryStore } from '../store/memory/MemoryStore';
import { ClientStore } from '../store/stores';
import { HttpHandler } from './HttpHandler';
import { SyncHandler } from './SyncHandler';

interface MatrixClientEventMap {
  roomEvent: OnRoomEvent;
}

interface ClientEventTarget extends EventTarget {
  addEventListener<K extends keyof MatrixClientEventMap>(
    type: K,
    listener: (ev: MatrixClientEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
}

// Thanks very much to
// https://dev.to/43081j/strongly-typed-event-emitters-using-eventtarget-in-typescript-3658
// for this trick!
const TypedEventTarget = EventTarget as { new (): ClientEventTarget };

export class MatrixClient extends TypedEventTarget {
  private transactionCounter = 0;

  homeserver: string;
  http: HttpHandler = new HttpHandler(this);
  sync: SyncHandler = new SyncHandler(this);

  store: ClientStore;

  accessToken: string | undefined;

  constructor(homeserver: string, store: ClientStore = new MemoryStore()) {
    super();
    this.homeserver = homeserver;
    this.store = store;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  start() {
    this.sync.startSyncing();
  }

  getRoom(id: string): Room | undefined {
    return this.store.rooms.getRoom(id);
  }

  getUser(id: string): User | undefined {
    return this.store.users.getUser(id);
  }

  generateTransactionId(): string {
    return `!!.${new Date().getTime() + this.transactionCounter++}`;
  }
}
