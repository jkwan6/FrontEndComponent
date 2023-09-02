import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageSevenComponent } from './three-js-page-seven.component';

describe('ThreeJsPageSevenComponent', () => {
  let component: ThreeJsPageSevenComponent;
  let fixture: ComponentFixture<ThreeJsPageSevenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageSevenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageSevenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
