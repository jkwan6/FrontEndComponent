import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage8Component } from './three-js-page8.component';

describe('ThreeJsPage8Component', () => {
  let component: ThreeJsPage8Component;
  let fixture: ComponentFixture<ThreeJsPage8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage8Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
