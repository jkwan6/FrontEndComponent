import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageThreeComponent } from './three-js-page-three.component';

describe('ThreeJsPageThreeComponent', () => {
  let component: ThreeJsPageThreeComponent;
  let fixture: ComponentFixture<ThreeJsPageThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
