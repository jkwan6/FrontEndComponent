import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../service/AuthenticationService/AuthenticationService';
import { SideNavService } from '../../service/SideNavService/SideNavService';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.css']
})
export class FooterBarComponent implements OnInit {

  vm = this;  // Variable used in the HTML Template
  isPressed: boolean = false;
  isLoggedIn!: boolean;

  showDelay = new FormControl(500);
  hideDelay = new FormControl(0);

  toggleStatus!: boolean;
  subscription: Subscription = new Subscription;
  constructor(
    private sideNavService: SideNavService
  ) { };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    //this.subscription.add(
    //  this.sideNavService.themeToggleStatus$.subscribe(toggleStatus => this.toggleStatus = toggleStatus))
    this.subscription.add(
      this.sideNavService.$themeLocalStorage.subscribe(toggleStatus => {
        this.toggleStatus = toggleStatus
        console.log(this.toggleStatus)
      })
    )
  }

  onToggle() {
    console.log(this.toggleStatus)
    this.sideNavService.changeThemeLocalStorage(this.toggleStatus);
  }

}
