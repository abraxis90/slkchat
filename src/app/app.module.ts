import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AMaterialModule } from './a-material.module';
import { AppStoreModule } from './app-store.module';

import { AuthenticationPageComponent } from './pages/authentication/authentication.page';
import { ConversationsPageComponent } from './pages/conversations/conversations.page';
import { ConversationPageComponent } from './pages/conversation/conversation.page';
import { ChatInputComponent } from './pages/conversation/components/chat-input/chat-input.component';
import { ChatBubbleComponent } from './pages/conversation/components/chat-bubble/chat-bubble.component';
import { ContactListComponent } from './reusables/components/contact-list/contact-list.component';
import { ToolbarComponent } from './reusables/components/toolbar/toolbar.component';
import { ConversationListItemComponent } from './reusables/components/conversation-list-item/conversation-list-item.component';
import { AutofocusDirective } from './reusables/directives/auto-focus.directive';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationPageComponent,
    ConversationsPageComponent,
    ConversationPageComponent,
    ContactListComponent,
    ToolbarComponent,
    ConversationListItemComponent,
    ChatInputComponent,
    ChatBubbleComponent,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AMaterialModule,
    AppStoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  entryComponents: [
    ContactListComponent
  ],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
