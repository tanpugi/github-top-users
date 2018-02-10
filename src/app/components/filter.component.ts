import {
  Component, OnInit, ViewChild, OnChanges, SimpleChanges,
  ElementRef, Renderer2, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';

import { Country } from '../models/Country'

@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css'],
})
export class FilterComponent implements OnInit {

  @ViewChild('countrySelection')
  private countrySelection: ElementRef;
  private countrySelected: String;
  private countries: Country[];

  private eventMapLoaded: Subject<any>;
  private eventCountrySelected: Subject<string>;
  private eventSubscriptions: Subject<any>[] = [];

  constructor(
    private renderer: Renderer2,
    private dataService: DataService,
    private eventService: EventService){
      this.eventMapLoaded = this.eventService.getMapEvent('MAP_LOADED');
      this.eventCountrySelected = this.eventService.getMapEvent('COUNTRY_SELECTED');
  }

  //Angular Lifecycle Events
  ngOnInit() {
    this._mapLoaded();
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnDestroy() {
    for (let esub of this.eventSubscriptions) {
      esub.unsubscribe();
    }
  }

  //Component Events
  private onCountrySelection(countryValue: string) {
    if (countryValue) {
      this.eventCountrySelected.next(countryValue);
    }
  }

  //Application Events
  private _mapLoaded() {
    let event = this.eventMapLoaded.subscribe(
      () => {
        this.dataService.getCountries().subscribe(
          (data) => {
            if (data) {
              this.countries = data;
              this.countrySelected = 'Singapore';
              this.onCountrySelection(this.countrySelected);
            }
        });
        this.eventSubscriptions.push(event);
      }
    );
  }
}
