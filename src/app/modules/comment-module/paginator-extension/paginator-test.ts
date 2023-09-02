import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'paginator-test',
  templateUrl: './paginator-test.html',
  styleUrls: ['./paginator-test.scss']
})

export class PaginatorTest implements OnInit {

  constructor() {

  }

  EmitResult = { pageNumber: '', pageSize: '' };
  testPaginator = { length: 500, pageSize: 3, pageIndex: 0 };

  ngOnInit(): void {
  }
  showTestEmit = ($event: any) => {
      this.EmitResult =  {
        pageNumber: $event.pageIndex,
        pageSize: $event.pageSize
      };
  }
}
