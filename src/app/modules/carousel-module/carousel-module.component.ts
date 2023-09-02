import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-carousel-module',
  templateUrl: './carousel-module.component.html',
  styleUrls: ['./carousel-module.component.scss']
})
export class CarouselModuleComponent implements OnInit {
  constructor() { }

  initialTransform: number = 0;

  ngOnInit(): void {
  }

  onBack() {
    let editCSS: HTMLDivElement = document.querySelector('.carousel-test')!;
    var transformChange = Number(100).toString();
    editCSS.style.transform = 'translateX(-100%)';
  }
  onForward() {
    let editCSS: HTMLDivElement = document.querySelector('.carousel-test')!;
    editCSS.style.transform = 'translateX(+00%)';
  }
}
