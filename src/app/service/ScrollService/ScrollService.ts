import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class ScrollService {

  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private scrollY?: number;
  private totalScrollHeight?: number;

  constructor() { }

  setScrollY(scrollY: number) {
    this.scrollY = scrollY;
  }
  getScrollY(): number | undefined {
    return this.scrollY;
  }

  setTotalScrollHeight(scrollHeight: number) {
    this.totalScrollHeight = scrollHeight;
  }

  getTotalScrollHeight(): number | undefined {
    return this.totalScrollHeight;
  }
}
