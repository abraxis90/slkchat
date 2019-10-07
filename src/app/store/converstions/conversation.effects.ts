import { Injectable } from '@angular/core';

import { Actions } from '@ngrx/effects';
import { ConversationDispatcherService } from './conversation-dispatcher.service';
import { UserDispatcherService } from '../users/user-dispatcher.service';

@Injectable()
export class ConversationEffects {

  constructor(private actions$: Actions,
              private userDispatcher: UserDispatcherService,
              private conversationDispatcher: ConversationDispatcherService) {
  }
}
