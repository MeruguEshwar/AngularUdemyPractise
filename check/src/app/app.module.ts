import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReasturantComponent } from './reasturant/reasturant.component';
import { BusTicketBookingComponent } from './bus-ticket-booking/bus-ticket-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    ReasturantComponent,
    BusTicketBookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
