import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-menu2',
  templateUrl: './sub-menu2.component.html',
  styleUrls: ['./sub-menu2.component.css']
})
export class SubMenu2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let scrollY = window.scrollY;
    let scrollX = window.scrollX;



    const test = document.getElementById('test')
    test!.addEventListener('scroll', () => {
      console.log('1')

    })

  }

}
