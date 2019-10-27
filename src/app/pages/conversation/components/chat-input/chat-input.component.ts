import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {
  @Output() messageSubmitted = new EventEmitter<string>();
  @ViewChild('chatInput', { static: true }) chatInput: ElementRef;
  messageBody = new FormControl('', [this.minLengthNoWhitespace(0)]);

  private minLengthNoWhitespace(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const strippedString = control.value.replace(/\s/g, '');
      return strippedString.length > length ? null : { 'minLengthNoWhitespace': { value: control.value } };
    };
  }

  handleMessageSubmit($event: Event) {
    $event.preventDefault();
    this.messageSubmitted.emit(this.messageBody.value);
    this.messageBody.reset('');
    this.chatInput.nativeElement.focus();
  }
}
