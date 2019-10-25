import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatDispatcherService } from '../../store/chat-dispatcher.service';
import { FirebaseMessage, Message } from '../../store/messages/message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import * as firebase from 'firebase';
import { Store } from '@ngrx/store';
import { MessageActionTypes, MessageAdd } from '../../store/messages/message.actions';
import { selectAllMessages, selectMessagesLoading } from '../../store/messages/message.selector';

const SCROLL_INTO_VIEW_OPTS: ScrollIntoViewOptions = { behavior: 'auto', block: 'start' };
const SCROLL_INTO_VIEW_TIMEOUT = 50;

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit, AfterViewInit, OnDestroy {
  public messages$: Observable<Message[]> = this.store.select(selectAllMessages);
  public messagesLoading$: Observable<boolean> = this.store.select(selectMessagesLoading);
  private conversationUid: string;
  private messageFromOtherUserSubscription: Subscription;

  @ViewChild('messagesEnd', { static: true }) messageEnd: ElementRef;

  constructor(private route: ActivatedRoute,
              private chatDispatcher: ChatDispatcherService,
              private auth: AuthenticationService,
              private store: Store<{ messages: Message[] }>) {
  }

  ngOnInit(): void {
    this.conversationUid = this.route.snapshot.paramMap.get('uid');
    // TODO why not use constructor?
    this.store.dispatch({ type: MessageActionTypes.MessagesLoad, payload: this.conversationUid });
    this.messageFromOtherUserSubscription = this.chatDispatcher.messageFromOtherUser$
      .subscribe(isFromOtherUser => {
        this.handleMessageReceived(isFromOtherUser);
      });
  }

  ngAfterViewInit(): void {
    this.messagesLoading$.subscribe((loading: boolean) => {
      if (!loading) {
        this.scrollIntoView(this.messageEnd, undefined, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.messageFromOtherUserSubscription.unsubscribe();
  }

  /* region API */

  handleMessageSend(messageBody): void {
    const firebaseMessage: FirebaseMessage = {
      conversationUid: this.conversationUid,
      body: messageBody,
      from: this.auth.state.value.uid,
      sentAt: firebase.firestore.Timestamp.fromDate(new Date())
    };
    this.store.dispatch(new MessageAdd(firebaseMessage));
  }

  private handleMessageReceived(isFromOtherUser: boolean): void {
    if (!isFromOtherUser) {
      this.scrollIntoView(this.messageEnd);
    } else {
      //  decide whether to scroll based on scroll position
    }
  }

  private scrollIntoView(element: ElementRef, scrollOpts?: ScrollIntoViewOptions, timeout?: number): void {
    setTimeout(() => element.nativeElement.scrollIntoView(scrollOpts || SCROLL_INTO_VIEW_OPTS), timeout || SCROLL_INTO_VIEW_TIMEOUT);
  }

  /* endregion */


}
