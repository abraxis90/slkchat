import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversationDispatcherService } from '../../store/converstions/conversation-dispatcher.service';
import { Message } from '../../store/converstions/message';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversations-page',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPageComponent implements OnInit {
  public messages$: Observable<Message[]>;

  constructor(private route: ActivatedRoute,
              private conversationDispatcher: ConversationDispatcherService) {
  }

  ngOnInit(): void {
    const conversationUid = this.route.snapshot.paramMap.get('uid');
    this.messages$ = this.conversationDispatcher.loadCurrentMessageCollection(conversationUid);
  }


}
