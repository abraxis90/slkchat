import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DateTime } from 'luxon';

const START_OF_TODAY = DateTime.local().startOf('day');
const MESSAGES_SENT_AT_FILTERS = [
  START_OF_TODAY.plus({ days: 3 }).toJSDate(),
  START_OF_TODAY.plus({ days: 7 }).toJSDate(),
  START_OF_TODAY.plus({ days: 30 }).toJSDate(),
  START_OF_TODAY.plus({ days: 60 }).toJSDate(),
  START_OF_TODAY.plus({ days: 120 }).toJSDate(),
  START_OF_TODAY.plus({ days: 360 }).toJSDate(),
  DateTime.fromMillis(0).toJSDate()
];

@Injectable({
  providedIn: 'root'
})
export class ChatDispatcherService {

  public messageFromOtherUser$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

}
