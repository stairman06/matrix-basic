import { MatrixEvent, MatrixEventType } from 'matrix-types/events';
import { Room } from '../model/Room';
import { User } from '../model/User';

export class OnRoomEvent extends Event {
  readonly event: MatrixEvent;
  readonly room: Room;
  readonly sender: User;

  constructor(event: MatrixEvent, room: Room, sender: User) {
    super('roomEvent');
    this.event = event;
    this.room = room;
    this.sender = sender;
  }
}
