import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { LoginComponent } from "./login.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
//import { LoginService } from "./login.service";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "src/app/app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
    declarations:[
        LoginComponent,
        
    ],
    imports:[
        FormsModule,
        CommonModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        BrowserAnimationsModule,
    ],
    exports:[LoginComponent, FormsModule,
        CommonModule,
        HttpClientModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        BrowserAnimationsModule],
    providers:[
        HttpClient
    ],
    bootstrap:[LoginComponent]
})
export class LoginModule{

}