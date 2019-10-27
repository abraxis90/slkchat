import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

  @Input() public appAutoFocus: boolean;

  public constructor(private el: ElementRef, private deviceService: DeviceDetectorService) {}

  public ngAfterContentInit() {
    // only trigger for desktop
    // TODO perhaps only load this directive on desktop in the future
    if (this.deviceService.isDesktop()) {

      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 500);

    }

  }

}
