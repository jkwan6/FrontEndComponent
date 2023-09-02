import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeJsPageSixComponent } from './three-js-page-six.component';

describe('ThreeJsPageSixComponent', () => {
  let component: ThreeJsPageSixComponent;
  let fixture: ComponentFixture<ThreeJsPageSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeJsPageSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeJsPageSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
