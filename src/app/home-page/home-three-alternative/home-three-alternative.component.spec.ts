import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeThreeAlternativeComponent } from './home-three-alternative.component';

describe('HomeThreeAlternativeComponent', () => {
  let component: HomeThreeAlternativeComponent;
  let fixture: ComponentFixture<HomeThreeAlternativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeThreeAlternativeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeThreeAlternativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
