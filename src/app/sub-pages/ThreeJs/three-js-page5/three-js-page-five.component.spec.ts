import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageFiveComponent } from './three-js-page-five.component';

describe('ThreeJsPageFiveComponent', () => {
  let component: ThreeJsPageFiveComponent;
  let fixture: ComponentFixture<ThreeJsPageFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
