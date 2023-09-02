import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage9Component } from './three-js-page9.component';

describe('ThreeJsPage9Component', () => {
  let component: ThreeJsPage9Component;
  let fixture: ComponentFixture<ThreeJsPage9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage9Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
