import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubMenu1Component } from './sub-menu1.component';

describe('SubMenu1Component', () => {
  let component: SubMenu1Component;
  let fixture: ComponentFixture<SubMenu1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubMenu1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubMenu1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
