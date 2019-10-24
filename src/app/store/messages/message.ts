import { MessageReceipt } from './message-receipt';
import * as firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export const MESSAGES_PATH = 'MESSAGES';

export interface FirebaseMessage {
  conversationUid: string;
  body: string;
  from: string;
  sentAt: Timestamp;
}

export class Message {

  constructor(public uid: string,
              public conversationUid: string,
              public body: string,
              public from: string,
              public received?: MessageReceipt[],
              public sentAt?: Timestamp) {
  }
}
