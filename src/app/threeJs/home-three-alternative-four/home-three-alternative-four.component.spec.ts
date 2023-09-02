import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeThreeAlternativeTwoComponent } from '../home-three-alternative-two/home-three-alternative-two.component';

import {HomeThreeAlternativeFourComponent } from './home-three-alternative-four.component';

describe('HomeThreeAlternativeTwoComponent', () => {
  let component: HomeThreeAlternativeTwoComponent;
  let fixture: ComponentFixture<HomeThreeAlternativeTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeThreeAlternativeTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeThreeAlternativeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
