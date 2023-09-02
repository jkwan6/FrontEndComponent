import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';
import { IComments } from '../../../interface/IComments';

@Component({
  selector: 'app-row-comment-template',
  templateUrl: './comment-row-template.component.html',
  styleUrls: ['./comment-row-template.component.css']
})
export class CommentRowTemplateComponent implements OnInit {

  @Input() comments!: IComments;

  constructor(
    private datePipe: DatePipe,
    @Inject(LOCALE_ID)
    private locale: string) {}

  ngOnInit(): void {
    this.comments.commentsTime =
      this.datePipe.transform
        (
        this.comments.commentsTime,
        'yyyy-MM-dd HH:mm:ss',
        'UTC',
        this.locale
      )!
  }
}
