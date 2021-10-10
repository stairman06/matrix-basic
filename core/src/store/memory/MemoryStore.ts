import { Room } from '../../model/Room';
import { User } from '../../model/User';
import { ClientStore, RoomsStore, UserStore } from '../stores';

class MemoryRoomStore implements RoomsStore {
  private rooms: Room[] = [];

  storeRoom(room: Room) {
    const existing = this.rooms.findIndex((fRoom) => fRoom.id === room.id);

    if (existing !== -1) {
      this.rooms[existing] = room;
    } else {
      this.rooms.push(room);
    }
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.find((room) => room.id === id);
  }
}

class MemoryUserStore implements UserStore {
  private users: User[] = [];

  storeUser(user: User) {
    const existing = this.users.findIndex((fUser) => fUser.id === user.id);

    if (existing !== -1) {
      this.users[existing] = user;
    } else {
      this.users.push(user);
    }
  }

  getUsers(): User[] {
    return this.users;
  }

  getUser(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}

export class MemoryStore implements ClientStore {
  rooms: MemoryRoomStore = new MemoryRoomStore();
  users: MemoryUserStore = new MemoryUserStore();
}
