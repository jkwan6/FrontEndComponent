import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenu2Component } from './sub-menu2.component';

describe('SubMenu2Component', () => {
  let component: SubMenu2Component;
  let fixture: ComponentFixture<SubMenu2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenu2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenu2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
