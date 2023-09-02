import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IElementDimensions } from '../../interface/IElementDimensions';


@Injectable({
  providedIn: 'root'    // Singleton bcz Injected in Root
})

export class SideNavService {

  // TEST
  private themeLocalStoragePresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public $themeLocalStorage = this.themeLocalStoragePresent.asObservable();



  // Subject but with Behaviour = Will send the last Emitted Value to Late Subscribers
  private bodyDims = new BehaviorSubject<IElementDimensions>({ height: 0, width: 0 });
  private verticalViewHeight = new BehaviorSubject<number>(0);



  private toggleSidebar = new BehaviorSubject<boolean>(false);
  public sidebarToggleStatus$ = this.toggleSidebar.asObservable();




  //private toggleTheme = new BehaviorSubject<boolean>(false);
  //public themeToggleStatus$ = this.toggleTheme.asObservable();

  constructor() {
    this.checkThemeLocalStorage();
}

  // Invert
  changeThemeLocalStorage(bool: boolean) {
    if (bool) {
      localStorage.setItem("dark-theme", 'false')
      this.themeLocalStoragePresent.next(false);
    }
    else {
      localStorage.setItem("dark-theme", 'true')
      this.themeLocalStoragePresent.next(true);
    }
  }

   //Defaults to Dark-Theme
  checkThemeLocalStorage() {
    var themeVariableIsPresent = localStorage.getItem("dark-theme")
    if (themeVariableIsPresent && themeVariableIsPresent === 'false') {
      this.themeLocalStoragePresent.next(false);
    } else {
      this.themeLocalStoragePresent.next(true);
    }
    console.log(`'dark-theme : ${this.themeLocalStoragePresent.value}`)
  }


  changeSidebarStatus(_toggle: boolean) {
    this.toggleSidebar.next(_toggle);
  }

  //changeThemeStatus(_toggle: boolean) {
  //  this.toggleTheme.next(_toggle);
  //}

  // bodyDims Getters & Setters
  public set setBodyDims(dims: IElementDimensions) {
    this.bodyDims.next(dims);
  }
  public get getBodyDims() {
    return this.bodyDims;
  }

  // verticalViewHeight Getters & Setters
  public set setVerticalViewHeight(height: number) {
    this.verticalViewHeight.next(height);
  }
  public get getVerticalViewHeight() {
    return this.verticalViewHeight;
  }
}
