import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageTwoComponent } from './three-js-page-two.component';

describe('ThreeJsPageTwoComponent', () => {
  let component: ThreeJsPageTwoComponent;
  let fixture: ComponentFixture<ThreeJsPageTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
