import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AMaterialModule } from './a-material.module';
import { AppStoreModule } from './app-store.module';
import { AuthenticationPageComponent } from './pages/authentication/authentication.page';
import { ConversationsPageComponent } from './pages/conversations/conversations.page';
import { ContactListComponent } from './reusables/contact-list/contact-list.component';
import { environment } from '../environments/environment';
import { ToolbarComponent } from './reusables/toolbar/toolbar.component';
import { ConversationListItemComponent } from './reusables/conversation-list-item/conversation-list-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ConversationPageComponent } from './pages/conversation/conversation.page';
import { ChatInputComponent } from './pages/conversation/components/chat-input/chat-input.component';
import { FormsModule } from '@angular/forms';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationPageComponent,
    ConversationsPageComponent,
    ConversationPageComponent,
    ContactListComponent,
    ToolbarComponent,
    ConversationListItemComponent,
    ChatInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AMaterialModule,
    AppStoreModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
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
