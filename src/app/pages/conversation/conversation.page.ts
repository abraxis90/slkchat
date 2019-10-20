import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversationDispatcherService } from '../../store/converstions/conversation-dispatcher.service';
import { FirebaseMessage, Message } from '../../store/converstions/message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit {
  public messages$: Observable<Message[]>;
  private conversationUid: string;

  constructor(private route: ActivatedRoute,
              private conversationDispatcher: ConversationDispatcherService,
              private auth: AuthenticationService) {
  }

  ngOnInit(): void {
    this.conversationUid = this.route.snapshot.paramMap.get('uid');
    this.messages$ = this.conversationDispatcher.loadCurrentMessageCollection(this.conversationUid);
  }

  handleMessageSubmitted(messageBody) {
    const firebaseMessage: FirebaseMessage = {
      conversationUid: this.conversationUid,
      body: messageBody,
      from: this.auth.state.value.uid,
      sentAt: firebase.firestore.Timestamp.fromDate(new Date())
    };
    this.conversationDispatcher.sendMessageToCurrentConversation(firebaseMessage);
  }


}
