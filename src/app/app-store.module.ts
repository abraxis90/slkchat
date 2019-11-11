import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';


import { conversationReducer } from './store/converstions/conversation.reducer';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ConversationEffects } from './store/converstions/conversation.effects';
import { userReducer } from './store/users/user.reducer';
import { UserEffects } from './store/users/user.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({
      user: userReducer,
      conversation: conversationReducer
    }),
    EffectsModule.forRoot([
      UserEffects,
      ConversationEffects
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production } as StoreDevtoolsOptions),
  ],
  exports: [StoreModule, StoreDevtoolsModule]
})
export class AppStoreModule {
}
