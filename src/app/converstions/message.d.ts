import { MessageReceipt } from './message-receipt';

export interface Message {
  uid: string;
  conversationUid: string;
  contents: string;
  senderUid: string;
  received?: MessageReceipt[];
  sentAt?: string;
}
