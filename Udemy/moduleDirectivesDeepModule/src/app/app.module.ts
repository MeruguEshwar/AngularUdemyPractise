import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { basichighlightdirective } from './Basichighlight/basic-highlight-directive';
import {BetterComponentModule} from './better-component/better-component.module';

@NgModule({
  declarations: [
    AppComponent,
    basichighlightdirective,
    BetterComponentModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
