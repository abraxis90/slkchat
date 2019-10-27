import { AfterContentInit, Component, Input } from '@angular/core';
import { Message } from '../../../../store/messages/message';
import { AuthenticationService } from '../../../../services/auth/authentication.service';


@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.scss']
})
export class ChatBubbleComponent implements AfterContentInit {
  @Input() message: Message;
  public isOwnUser: boolean;

  constructor(private auth: AuthenticationService) {
  }

  ngAfterContentInit(): void {
    this.isOwnUser = this.auth.state.value.uid === this.message.from;
  }
}
