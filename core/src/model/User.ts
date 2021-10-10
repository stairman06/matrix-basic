export class User {
  id: string;
  displayName: string | undefined;
  avatarUrl: string | undefined;
  constructor(id: string) {
    this.id = id;
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  setAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }
}
