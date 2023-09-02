import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentRowTemplateComponent } from './comment-template.component';

describe('CommentRowTemplateComponent', () => {
  let component: CommentRowTemplateComponent;
  let fixture: ComponentFixture<CommentRowTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentRowTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentRowTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
