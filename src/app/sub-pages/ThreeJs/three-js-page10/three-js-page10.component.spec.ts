import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage10Component } from './three-js-page10.component';

describe('ThreeJsPage10Component', () => {
  let component: ThreeJsPage10Component;
  let fixture: ComponentFixture<ThreeJsPage10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
