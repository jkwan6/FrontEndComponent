import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage11Component } from './three-js-page11.component';

describe('ThreeJsPage11Component', () => {
  let component: ThreeJsPage11Component;
  let fixture: ComponentFixture<ThreeJsPage11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
