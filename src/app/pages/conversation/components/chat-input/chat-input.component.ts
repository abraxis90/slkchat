import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
  @Output() messageSubmitted = new EventEmitter<string>();
  public messageBody = '';
  public inputIsFocused = false;

  handleMessageSubmit($event: Event) {
    // TODO: consider using form instead
    $event.preventDefault();
    this.messageSubmitted.emit(this.messageBody);
    this.messageBody = '';
  }

  handleInputFocus($event: Event) {
    this.inputIsFocused = true;
  }

  handleInputBlur($event: Event) {
    this.inputIsFocused = false;
  }
}
