import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage13Component } from './three-js-page13.component';

describe('ThreeJsPage13Component', () => {
  let component: ThreeJsPage13Component;
  let fixture: ComponentFixture<ThreeJsPage13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage13Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
