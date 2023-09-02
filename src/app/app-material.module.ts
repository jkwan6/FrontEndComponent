import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatCarouselModule } from '@ngbmodule/material-carousel';

@NgModule({
  imports:[
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTooltipModule,
    MatSortModule,
    MatChipsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCarouselModule.forRoot()
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatTooltipModule,
    MatSortModule,
    MatChipsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCarouselModule
  ]
})
export class AngularMaterialModule { }
