import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { Message } from './message';


export const MessageAdapter: EntityAdapter<Message> =
  createEntityAdapter<Message>({
    selectId: (message: Message) => message.uid
  });
