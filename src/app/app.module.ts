import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './app-material.module';
import { DialogAnimationsExampleDialog, NavBarMenuComponent } from './main-layout/nav-bar-menu/nav-bar-menu.component';
import { FooterBarComponent } from './main-layout/footer-bar/footer-bar.component';
import { BodyContentComponent } from './main-layout/body-content/body-content.component';
import { SideBarComponent } from './main-layout/body-content/side-bar/side-bar.component';
import { ContactInfoComponent } from './sub-pages/contact-info/contact-info.component';
import { AcademicComponent } from './sub-pages/academic/academic.component';
import { ExperienceComponent } from './sub-pages/experience/experience.component';
import { TimelineComponent } from './sub-pages/timeline/timeline.component';
import { SkillsComponent } from './sub-pages/skills/skills.component';
import { LifeInGeneralComponent } from './sub-pages/life-in-general/life-in-general.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CommentModuleComponent } from './modules/comment-module/comment-module.component';
import { CommentRowTemplateComponent } from './modules/comment-module/comment-row-template/comment-template.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorTest } from './modules/comment-module/paginator-extension/paginator-test';
import { PaginatorDirective } from './modules/comment-module/paginator-extension/pagination.directive';
import { FormBaseSample } from './shared-utils/formBaseSample/form-base-sample.component';
import { AngularThreeModule } from './app-three.module';
import { AuthenticationModule } from './app-authentication-module';
import { TokenHeaderInterceptor } from './interceptors/TokenHeaderInterceptor';
import { CommentPostComponent } from './modules/comment-module/comment-post/comment-post.component';
import { RefreshTokenInterceptor } from './interceptors/RefreshTokenErrorInterceptor';
import { WebsiteDetailsComponent } from './sub-pages/website-details/website-details.component';
import { RefreshTokenTimeOutInterceptor } from './interceptors/RefreshTokenTimeOutInterceptor';
import { HomeThreeComponent } from './home-page/home-three/home-three.component';
import { HomeThreeAlternativeComponent } from './home-page/home-three-alternative/home-three-alternative.component';
import { HomeThreeAlternativeTwoComponent } from './threeJs/home-three-alternative-two/home-three-alternative-two.component';
import { HomeThreeAlternativeThreeComponent } from './threeJs/home-three-alternative-three/home-three-alternative-three.component';
import { HomeThreeAlternativeFourComponent } from './threeJs/home-three-alternative-four/home-three-alternative-four.component';
import { ScheduleComponent } from './sub-pages/schedule/schedule.component';
import { CarouselModuleComponent } from './modules/carousel-module/carousel-module.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarMenuComponent,
    FooterBarComponent,
    BodyContentComponent,
    SideBarComponent,
    ContactInfoComponent,
    AcademicComponent,
    ExperienceComponent,
    TimelineComponent,
    SkillsComponent,
    LifeInGeneralComponent,
    HomePageComponent,
    CommentModuleComponent,
    CommentRowTemplateComponent,
    PaginatorTest,
    PaginatorDirective,
    FormBaseSample,
    DialogAnimationsExampleDialog,
    CommentPostComponent,
    WebsiteDetailsComponent,
    HomeThreeComponent,
    HomeThreeAlternativeComponent,
    HomeThreeAlternativeTwoComponent,
    ScheduleComponent,
    HomeThreeAlternativeThreeComponent,
    HomeThreeAlternativeFourComponent,
    CarouselModuleComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    FormsModule,
    AngularThreeModule,
    AuthenticationModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenTimeOutInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
