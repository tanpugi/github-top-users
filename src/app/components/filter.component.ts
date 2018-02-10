import {
  Component, OnInit, ViewChild, OnChanges, SimpleChanges,
  ElementRef, Renderer2, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';

import { DataService } from '../services/data.service';
import { EventService } from '../services/event.service';

import { Country } from '../models/country.model'


@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css'],
})
export class FilterComponent implements OnInit {

  @ViewChild('countrySelection')
  private countrySelection: ElementRef;
  private countrySelected: string;
  private countries: Country[];

  private eventMapLoaded: Subject<any>;
  private eventCountrySelected: Subject<any>;
  private eventSubscriptions: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private dataService: DataService,
    private eventService: EventService){
      this.eventMapLoaded = this.eventService.getMapLoadedEvent();
      this.eventCountrySelected = this.eventService.getCountrySelectedEvent();
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
  private onCountrySelection(countryCode: string) {
    if (countryCode) {
      this.eventCountrySelected.next(countryCode);
    }
  }

  //Application Events
  private _mapLoaded() {
    let event = this.eventMapLoaded
      .mergeMap(() => {
        return this.dataService.getCountries();
      })
      .subscribe((data) => {
        if (data) {
          this.countries = data;
          this.countrySelected = 'SG';
          this.onCountrySelection(this.countrySelected);
        }
        this.eventSubscriptions.push(event);
      }
    );
  }
}
