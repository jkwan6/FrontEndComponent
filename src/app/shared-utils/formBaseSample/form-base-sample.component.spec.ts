import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBaseSample } from './form-base-sample.component';

describe('FormBaseSample', () => {
  let component: FormBaseSample;
  let fixture: ComponentFixture<FormBaseSample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormBaseSample ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBaseSample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
