import { AfterViewInit, Directive, DoCheck, Host, Optional, Renderer2, Self, ViewChild, ViewContainerRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButton } from '@angular/material/button';
import { MatMenuTrigger } from '@angular/material/menu';

@Directive({
  selector: '[appPagination]'
})

export class PaginatorDirective implements DoCheck, AfterViewInit {

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  private currentPage!: number;
  private pageGap!:   { first: string, last: string };
  private pageRange!: { start: number, end: number };
  private checkPage!: { length: number, pageSize: number, pageIndex: number };
  private buttons: MatButton[] = [];
  private numberDisplayButtons!: number;

  constructor(
    private readonly customPaginator: MatPaginator,
    private readonly ViewContainer: ViewContainerRef,
    private readonly renderer: Renderer2
  ) {
    this.initializePaginatorFromConstructor();
  }

  // Set Up
  // 1. Initial Values
  // 2. Custom Paginator Range Label
  // 3. Observable to Update PAginator Properties
  initializePaginatorFromConstructor() {
    this.currentPage = 0;
    this.pageGap = { first: '•••', last: '•••' };
    this.numberDisplayButtons = 10;
    this.checkPage = { length: 0, pageIndex: 0, pageSize: 0 }

    // Display custom range label text
    this.customPaginator._intl.getRangeLabel =
      (page: number, pageSize: number, length: number): string =>
      {
        const startIndex = page * pageSize;
        const endIndex =
          (startIndex < length)
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;
        var results =
          (length > 0)
            ? `Showing ${startIndex + 1} - ${endIndex} of ${length} records`
            : 'Showing 0 – 0 of 0 records';
        return results;
      };

    // Subscribe to rerender buttons when next page and last page button is used
    // When a page event happens on CustomPaginator, the function will be triggered
    // Will create buttons from the Constructor
    this.customPaginator.page.subscribe((results: PageEvent) =>
    {
      this.currentPage = results.pageIndex;
      this.customPaginator.pageIndex = results.pageIndex;
      this.initPageRange(); 
    });
  }

  public ngAfterViewInit(): void {}

  ngDoCheck(): void {
    if // Re-Build paginator if the pageSize, pageIndex, length changes
    (
      this.customPaginator?.length !== this.checkPage.length        ||
      this.customPaginator?.pageSize !== this.checkPage.pageSize    ||
      this.customPaginator?.pageIndex !== this.checkPage.pageIndex
    )
    {
      this.currentPage = this.customPaginator.pageIndex;

      this.initPageRange();     // Build up Buttons based on whether things changed

      // Re-assign Checkpage Values
      this.checkPage = {
        length: this.customPaginator.length,
        pageSize: this.customPaginator.pageSize,
        pageIndex: this.customPaginator.pageIndex
      };
    }
  }


  private initPageRange(): void {
    this.pageRange =
    {
      start: this.currentPage - this.numberDisplayButtons / 2,
      end: this.currentPage + this.numberDisplayButtons / 2
    }
    this.buildPageNumbers();
  }


  private buildPageNumbers = () => {
    //let dots: { first: boolean, last: boolean };
    let pageDifference: number;
    let startIndex: number;
    let totalPagesFromPaginator: number = this.customPaginator.getNumberOfPages();                    // Get Number of Pages from Paginator

    const actionContainer: HTMLElement =
      this.ViewContainer.element.nativeElement.querySelector('div.mat-paginator-range-actions');      // Container div with paginator elements
    const nextPageNode: HTMLElement =
      this.ViewContainer.element.nativeElement.querySelector('button.mat-paginator-navigation-next'); // Button that triggers the next page action

    // Reset Previous Buttons
    let prevButtonCount = this.buttons.length;
    if (prevButtonCount > 0)
    {
      this.buttons.forEach(button =>
      {
        this.renderer.removeChild(actionContainer, button);
      });
      prevButtonCount = 0;
    }

    const pageRange =
      this.ViewContainer.element.nativeElement.querySelector('div.mat-paginator-range-label');        // Label showing the page range

    this.renderer.addClass(pageRange, 'custom-paginator-counter');
    this.renderer.addClass(actionContainer, 'custom-paginator-container');

    // Initialize next page and last page buttons
    if (prevButtonCount === 0) {
      const nodeArray: NodeListOf<ChildNode> = actionContainer.childNodes;
      setTimeout(() => {
        for (const node of nodeArray) {
          if (node.nodeName === 'BUTTON') {
            // Next Button styles
            const button = node as HTMLButtonElement;
            if (button.innerHTML.length > 100 && button.disabled)
            {
              this.renderer.addClass(node, 'custom-paginator-arrow-disabled');
              this.renderer.removeClass(node, 'custom-paginator-arrow-enabled');
            }
            else if (button.innerHTML.length > 100 && !button.disabled)
            {
              this.renderer.addClass(node, 'custom-paginator-arrow-enabled');
              this.renderer.removeClass(node, 'custom-paginator-arrow-disabled');
            }
          }
        }
      });
    }

    var pageToDisplay = this.numberDisplayButtons;
    pageDifference = totalPagesFromPaginator - pageToDisplay;
    startIndex = Math.max(this.currentPage - this.numberDisplayButtons, 0);

    for (let index = startIndex; index < totalPagesFromPaginator; index++) {
      if (
        (index < pageToDisplay + 0 && this.currentPage < this.numberDisplayButtons - 4) ||    // Substracted 2
        (index >= this.pageRange.start && index <= this.pageRange.end - 1)  ||
        (this.currentPage > pageDifference + 4 && index >= pageDifference + 0)  ||            // Added 1
        (totalPagesFromPaginator + this.customPaginator.pageSize + 3 < this.numberDisplayButtons + pageToDisplay)
      )
      {
        this.renderer.insertBefore(
          actionContainer,
          this.createButton(`${index}`, this.customPaginator.pageIndex),
          nextPageNode);
      }
    }

    //if (totalPagesFromPaginator > 20) {
    //  const linkBtn: MatButton = this.renderer.createElement('button');
    //  const text = this.renderer.createText('...');
    //  this.renderer.appendChild(linkBtn, text);
    //  this.renderer.insertBefore(actionContainer, linkBtn, nextPageNode);
    //  this.buttons.push(linkBtn);
    //}
  }

  private createButton(index: string, pageIndex: number): MatButton {
    const linkBtn: MatButton = this.renderer.createElement('button');
    this.renderer.setAttribute(linkBtn, 'class', 'custom-paginator-page');
    this.renderer.addClass(linkBtn, 'custom-paginator-page-enabled');
    if (index === this.pageGap.first || index === this.pageGap.last) {
      this.renderer.addClass(linkBtn, 'custom-paginator-arrow-enabled');
    }
    const pagingTxt = isNaN(+ index) ? this.pageGap.first : (+ index + 1);
    const text = this.renderer.createText(pagingTxt + '');
    this.renderer.addClass(linkBtn, 'mat-custom-page');
    switch (index) {
      case `${pageIndex}`:
        this.renderer.setAttribute(linkBtn, 'disabled', 'disabled');
        this.renderer.removeClass(linkBtn, 'custom-paginator-page-enabled');
        this.renderer.addClass(linkBtn, 'custom-paginator-page-disabled');
        break;
      case this.pageGap.first:
        this.renderer.listen(linkBtn, 'click', () => {
          this.switchPage(this.currentPage < this.numberDisplayButtons + 1
            ? this.numberDisplayButtons + 2
            : this.currentPage + this.numberDisplayButtons - 1
          );
        });
        break;
      case this.pageGap.last:
        this.renderer.listen(linkBtn, 'click', () => {
          this.switchPage(this.currentPage > this.customPaginator.getNumberOfPages() - this.numberDisplayButtons - 2
            ? this.customPaginator.getNumberOfPages() - this.numberDisplayButtons - 3
            : this.currentPage - this.numberDisplayButtons + 1
          );
        });
        break;
      default:
        this.renderer.listen(linkBtn, 'click', () => {
          this.switchPage(+ index);
        });
        break;
    }
    this.renderer.appendChild(linkBtn, text);
    this.buttons.push(linkBtn);
    return linkBtn;
  }

  private switchPage(index: number): void {
    this.customPaginator.pageIndex = index;
    this.customPaginator.page.emit({
      previousPageIndex: this.currentPage,
      pageIndex: index,
      pageSize: this.customPaginator.pageSize,
      length: this.customPaginator.length
    });
    this.currentPage = index;
    this.initPageRange();
  }
}
