import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentModuleComponent } from './comment-module.component';

describe('CommentServiceComponent', () => {
  let component: CommentModuleComponent;
  let fixture: ComponentFixture<CommentModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
