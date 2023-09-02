import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageFourComponent } from './three-js-page-four.component';

describe('ThreeJsPageFourComponent', () => {
  let component: ThreeJsPageFourComponent;
  let fixture: ComponentFixture<ThreeJsPageFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
