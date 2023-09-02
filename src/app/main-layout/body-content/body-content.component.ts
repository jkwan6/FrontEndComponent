import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { elementAt, Subscription } from 'rxjs';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';



@Component({
  selector: 'app-body-content',
  templateUrl: './body-content.component.html',
  styleUrls: ['./body-content.component.css']
})
export class BodyContentComponent implements AfterViewInit {

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild('bodyElement') bodyElement!: ElementRef;
  @ViewChild('container') containerElement!: ElementRef;

  // PROPERTIES
  bodyElementDim!: IElementDimensions;
  verticalViewHeight!: number;

  constructor(private sideNavService: SideNavService) {}

  showFiller = false;
  subscription!: Subscription;
  toggleStatus!: boolean;

  ngAfterViewInit(): void {
    this.subscription = this.sideNavService.sidebarToggleStatus$.subscribe(x => this.matDrawer.toggle(x.valueOf()))

    this.verticalViewHeight = this.bodyElement!.nativeElement.offsetHeight / window.innerHeight;
    //this.sideNavService.setVerticalViewHeight = this.verticalViewHeight;

    this.bodyElementDim = {
      height: this.bodyElement!.nativeElement.offsetHeight,
      width: this.bodyElement!.nativeElement.offsetWidth
    };
    this.sideNavService.setBodyDims = this.bodyElementDim;
    const element: Element = document.getElementById('bodyElement')!;
    const wholePage: Element = document.documentElement;
    new ResizeObserver(this.outputsize).observe(element);
    new ResizeObserver(this.outputsize).observe(wholePage);
  }

  outputsize: () => void = (): void => {
    let elementRect = this.containerElement;
    //console.log(elementRect.nativeElement.offsetHeight);

    let totalHeight = window.innerHeight;
    let footerHeight!: number;
    let navbarHeight!: number;
    if (window.innerWidth >= 599) {
      footerHeight = 64;
      navbarHeight = 64;
    }
    else {
      navbarHeight = 56;
      footerHeight = 56;
    }

    let visibleBodyHeight = Math.max(totalHeight - navbarHeight - footerHeight, 0);
    //console.log(bodyHeight)
    const element: Element = document.getElementById('bodyElement')!;
    var x = element.clientHeight;
    //console.log(x + 64 +64)

    //let windowHeight = window.innerHeight || document.documentElement.clientHeight;
    //let visibleHeight = Math.min(elementRect.bottom, windowHeight) - Math.max(elementRect.top, 0);
    //visibleHeight = Math.max(0, visibleHeight);
    this.bodyElementDim.height = visibleBodyHeight;
    this.bodyElementDim.width = this.bodyElement!.nativeElement.offsetWidth;
    this.sideNavService.setBodyDims = this.bodyElementDim;


    this.verticalViewHeight = visibleBodyHeight / window.innerHeight;
    this.sideNavService.setVerticalViewHeight = this.verticalViewHeight;
  }

}
