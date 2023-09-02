import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage14Component } from './three-js-page14.component';

describe('ThreeJsPage14Component', () => {
  let component: ThreeJsPage14Component;
  let fixture: ComponentFixture<ThreeJsPage14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage14Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
