import { Component, Input } from '@angular/core';
import { Conversation, ConversationWithUsers } from '../../../store/converstions/conversation';

@Component({
  selector: 'app-conversation-list-item',
  templateUrl: './conversation-list-item.component.html',
  styleUrls: ['./conversation-list-item.component.scss']
})
export class ConversationListItemComponent {

  @Input() conversation: ConversationWithUsers;

  constructor() { }

}
