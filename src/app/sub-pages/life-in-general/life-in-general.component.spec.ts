import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeInGeneralComponent } from './life-in-general.component';

describe('LifeInGeneralComponent', () => {
  let component: LifeInGeneralComponent;
  let fixture: ComponentFixture<LifeInGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LifeInGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeInGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
