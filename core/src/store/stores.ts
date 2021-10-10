import { Room } from '../model/Room';
import { User } from '../model/User';

export interface UserStore {
  storeUser(user: User): void;
  getUsers(): User[];
  getUser(id: string): User | undefined;
}

export interface RoomsStore {
  storeRoom(room: Room): void;
  getRooms(): Room[];
  getRoom(id: string): Room | undefined;
}

export interface ClientStore {
  rooms: RoomsStore;
  users: UserStore;
}
