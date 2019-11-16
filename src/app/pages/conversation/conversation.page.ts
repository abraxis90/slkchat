import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { concat, Observable, Subscription } from 'rxjs';
import { FirebaseMessage, Message } from '../../store/messages/message';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { firestore } from 'firebase/app';
import { Store } from '@ngrx/store';
import { ConversationMessageAdd } from '../../store/converstions/conversation.actions';
import { selectConversationMessages } from '../../store/converstions/conversation.selector';
import { debounceTime, first, map, throttleTime } from 'rxjs/operators';

const SCROLL_INTO_VIEW_OPTS: ScrollIntoViewOptions = { behavior: 'auto', block: 'start' };
const SCROLL_INTO_VIEW_TIMEOUT = 50;

interface MessageChanges {
  isFirstMessageBatch: boolean;
  isFromOtherUser: boolean;
}

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit, AfterViewInit, OnDestroy {
  public messages$: Observable<Message[]>;
  public messageChanges$: Observable<MessageChanges>;
  public chatVisible = false;
  private conversationUid: string;
  private subscriptions: Subscription[] = [];

  @ViewChild('conversationPage', { static: true }) conversationPage: ElementRef;
  @ViewChild('messageList', { static: true }) messageList: ElementRef;
  @ViewChild('messagesEnd', { static: true }) messageEnd: ElementRef;

  constructor(private route: ActivatedRoute,
              private auth: AuthenticationService,
              private renderer: Renderer2,
              private store: Store<{ messages: Message[] }>) {}

  ngOnInit(): void {
    // TODO: add virtual scroll
    this.conversationUid = this.route.snapshot.paramMap.get('uid');
    this.messages$ = this.store.select(selectConversationMessages(), this.conversationUid);
    const firstMessageBatch$ = this.messages$.pipe(
      debounceTime(200),
      map(_ => {
        return {
          isFirstMessageBatch: true,
          isFromOtherUser: true
        } as MessageChanges;
      }),
      first()
    );
    const nextMessages$ = this.messages$.pipe(
      throttleTime(200),
      map((messages: Message[]) => {
        return {
          isFirstMessageBatch: false,
          isFromOtherUser: messages[messages.length - 1] ? messages[messages.length - 1].from !== this.auth.state.value.uid : false
        } as MessageChanges;
      })
    );
    this.messageChanges$ = concat(firstMessageBatch$, nextMessages$);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.messageChanges$.subscribe((messageChanges: MessageChanges) => {
        if (messageChanges.isFirstMessageBatch) {
          this.chatVisible = true;
        }
        this.handleMessageReceived(messageChanges);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /* region API */

  handleMessageSend(messageBody): void {
    const firebaseMessage: FirebaseMessage = {
      conversationUid: this.conversationUid,
      body: messageBody,
      from: this.auth.state.value.uid,
      sentAt: firestore.Timestamp.fromDate(new Date())
    };
    this.store.dispatch(new ConversationMessageAdd(firebaseMessage));
  }

  private handleMessageReceived(messageChanges: MessageChanges): void {
    if (messageChanges.isFirstMessageBatch || !messageChanges.isFromOtherUser) {
      this.scrollIntoView(this.messageEnd);
    } else {
      if (this.messageList.nativeElement.offsetHeight - this.conversationPage.nativeElement.scrollTop < 1000) {
        this.scrollIntoView(this.messageEnd);
      } else {
        // experimental vibrate; remove if inconvenient
        window.navigator.vibrate(200);
      }
    }
  }

  private scrollIntoView(element: ElementRef, scrollOpts?: ScrollIntoViewOptions, timeout?: number): void {
    setTimeout(() => element.nativeElement.scrollIntoView(scrollOpts || SCROLL_INTO_VIEW_OPTS), timeout || SCROLL_INTO_VIEW_TIMEOUT);
  }

  /* endregion */


}
