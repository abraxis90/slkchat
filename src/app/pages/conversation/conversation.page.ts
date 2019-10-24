import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatDispatcherService } from '../../store/chat-dispatcher.service';
import { FirebaseMessage, Message } from '../../store/messages/message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import * as firebase from 'firebase';
import { Store } from '@ngrx/store';
import { MessageActionTypes } from '../../store/messages/message.actions';
import { selectAllMessages, selectMessagesLoading } from '../../store/messages/message.selector';

const SCROLL_INTO_VIEW_OPTS: ScrollIntoViewOptions = { behavior: 'auto', block: 'start' };
const SCROLL_INTO_VIEW_TIMEOUT = 50;

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit, AfterViewInit {
  public messages$: Observable<Message[]> = this.store.select(selectAllMessages);
  public messagesLoading$: Observable<boolean> = this.store.select(selectMessagesLoading);
  private conversationUid: string;
  @ViewChild('messagesEnd', { static: true }) messageEnd: ElementRef;

  constructor(private route: ActivatedRoute,
              private conversationDispatcher: ChatDispatcherService,
              private auth: AuthenticationService,
              private store: Store<{ messages: Message[] }>) {
  }

  ngOnInit(): void {
    this.conversationUid = this.route.snapshot.paramMap.get('uid');
    // TODO why not use constructor?
    this.store.dispatch({ type: MessageActionTypes.MessagesLoad, payload: this.conversationUid });
  }

  ngAfterViewInit(): void {
    this.messagesLoading$.subscribe((loading: boolean) => {
      if (!loading) {
        this.scrollIntoView(this.messageEnd, undefined, 0);
      }
    });
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
