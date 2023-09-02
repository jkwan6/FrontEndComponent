import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage15Component } from './three-js-page15.component';

describe('ThreeJsPage15Component', () => {
  let component: ThreeJsPage15Component;
  let fixture: ComponentFixture<ThreeJsPage15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
