import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Servercomponent } from './Server/server.component';
import { ServersComponent } from './servers/servers.component';
import { InterpolationComponent } from './interpolation/interpolation.component';
import { PropertyComponent } from './property/property.component';
import { EventComponent } from './event/event.component';
import { TwoWayDataComponent } from './two-way-data/two-way-data.component';



@NgModule({
  declarations: [
    AppComponent,
    Servercomponent,
    ServersComponent,
    InterpolationComponent,
    PropertyComponent,
    EventComponent,
    TwoWayDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
