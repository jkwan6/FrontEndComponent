import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularMaterialModule } from "./app-material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AngularThreeModule } from "./app-three.module";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { LoginFormComponent } from "./authentication/login/login-form/login-form.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SignUpFormComponent } from "./authentication/sign-up/sign-up-form/sign-up-form.component";
import { SignUpComponent } from "./authentication/sign-up/sign-up.component";


@NgModule({
  declarations: [
    AuthenticationComponent,
    LoginComponent,
    LoginFormComponent,
    SignUpComponent,
    SignUpFormComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularMaterialModule,
    ]
})
export class AuthenticationModule { }
