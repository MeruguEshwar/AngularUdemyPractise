import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MypipePipe } from './mypipe.pipe';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProductfuldetailsComponent } from './productfuldetails/productfuldetails.component';
import { MyService } from './my.service';

@NgModule({
  declarations: [
    AppComponent,
    MypipePipe,
    HeaderComponent,
    FooterComponent,
    ProductlistComponent,
    ProductfuldetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
