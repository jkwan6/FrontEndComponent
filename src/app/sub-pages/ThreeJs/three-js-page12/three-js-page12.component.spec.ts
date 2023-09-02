import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPage12Component } from './three-js-page12.component';

describe('ThreeJsPage12Component', () => {
  let component: ThreeJsPage12Component;
  let fixture: ComponentFixture<ThreeJsPage12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPage12Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPage12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
