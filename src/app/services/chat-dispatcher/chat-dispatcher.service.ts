import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DateTime } from 'luxon';

export const START_OF_TODAY = DateTime.local().startOf('day').toJSDate();

@Injectable({
  providedIn: 'root'
})
export class ChatDispatcherService {

  public messageFromOtherUser$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

}
