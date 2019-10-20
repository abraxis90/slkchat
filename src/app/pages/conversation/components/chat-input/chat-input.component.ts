import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
  @Output() messageSubmitted = new EventEmitter<string>();
  private messageBody = '';

  messageSubmit($event: Event) {
    // TODO: consider using form instead
    $event.preventDefault();
    this.messageSubmitted.emit(this.messageBody);
    this.messageBody = '';
  }
}
