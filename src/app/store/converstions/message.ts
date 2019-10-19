import { MessageReceipt } from './message-receipt';


export class Message {

  constructor(public uid: string,
              public conversationUid: string,
              public body: string,
              public from: string,
              public received?: MessageReceipt[],
              sentAt?: string) {
  }
}
