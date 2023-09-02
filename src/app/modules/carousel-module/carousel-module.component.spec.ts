import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselModuleComponent } from './carousel-module.component';

describe('CarouselModuleComponent', () => {
  let component: CarouselModuleComponent;
  let fixture: ComponentFixture<CarouselModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
