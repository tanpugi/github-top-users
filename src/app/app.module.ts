import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { FilterComponent } from './components/filter.component';
import { MapComponent } from './components/map.component';
import { InfoComponent } from './components/info.component';

import { DataService } from './services/data.service';
import { EventService } from './services/event.service';
import { GithubService } from './services/github.service';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    DataService,
    EventService,
    GithubService
  ],
  declarations: [
    AppComponent,
    FilterComponent,
    MapComponent,
    InfoComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
