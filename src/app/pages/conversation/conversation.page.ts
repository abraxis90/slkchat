import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversationDispatcherService } from '../../store/converstions/conversation-dispatcher.service';
import { FirebaseMessage, Message } from '../../store/converstions/message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import * as firebase from 'firebase';

const SCROLL_INTO_VIEW_OPTS: ScrollIntoViewOptions = { behavior: 'auto', block: 'start' };
const SCROLL_INTO_VIEW_TIMEOUT = 50;

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit, AfterViewInit {
  public messages$: Observable<Message[]>;
  private conversationUid: string;
  @ViewChild('messagesEnd', { static: true }) messageEnd: ElementRef;

  constructor(private route: ActivatedRoute,
              private conversationDispatcher: ConversationDispatcherService,
              private auth: AuthenticationService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.conversationUid = this.route.snapshot.paramMap.get('uid');
    this.messages$ = this.conversationDispatcher.loadCurrentMessageCollection(this.conversationUid);
  }

  ngAfterViewInit(): void {
    // TODO: scroll only when loaded
    this.scrollIntoView(this.messageEnd, undefined, 50);
  }

  handleMessageSubmitted(messageBody) {
    const firebaseMessage: FirebaseMessage = {
      conversationUid: this.conversationUid,
      body: messageBody,
      from: this.auth.state.value.uid,
      sentAt: firebase.firestore.Timestamp.fromDate(new Date())
    };
    this.conversationDispatcher.sendMessageToCurrentConversation(firebaseMessage)
      .then(() => {
        this.scrollIntoView(this.messageEnd);
      });
  }

  private scrollIntoView(element: ElementRef, scrollOpts?: ScrollIntoViewOptions, timeout?: number): void {
    setTimeout(() => element.nativeElement.scrollIntoView(scrollOpts || SCROLL_INTO_VIEW_OPTS), timeout || SCROLL_INTO_VIEW_TIMEOUT);
  }


}
