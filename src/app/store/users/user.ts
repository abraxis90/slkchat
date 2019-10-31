// TODO: refactor firebase function to use proper User Type
export interface FirebaseUser {
  email: string;
  displayName: string;
  photoURL: string;
}

export class User {

  constructor(public uid: string,
              public email?: string,
              public fullName?: string,
              public avatarURL?: string) {
  }

}
