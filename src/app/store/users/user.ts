export interface FirebaseUser {
  email: string;
  fullName: string;
  avatarURL: string;
}

export class User implements FirebaseUser {

  constructor(public uid: string,
              public email: string,
              public fullName: string,
              public avatarURL: string) {
  }

}
