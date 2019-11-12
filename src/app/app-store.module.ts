import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';


import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './store/users/user.reducer';
import { UserEffects } from './store/users/user.effects';
import { conversationReducer } from './store/converstions/conversation.reducer';
import { ConversationEffects } from './store/converstions/conversation.effects';
import { environment } from '../environments/environment';

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
