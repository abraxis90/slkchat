import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';

import { conversationReducer } from './converstions/conversation.reducer';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot({
      conversation: conversationReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production } as StoreDevtoolsOptions),
  ],
  exports: [StoreModule, StoreDevtoolsModule]
})
export class AppStoreModule {
}
