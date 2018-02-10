import {
  Component, OnInit, ViewChild, OnChanges, SimpleChanges,
  ElementRef, Renderer2, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';

import { GithubService } from '../services/github.service';
import { EventService } from '../services/event.service';
import { DataService } from '../services/data.service';

import { User } from '../models/user.model';

@Component({
  selector: 'app-info',
  templateUrl: 'info.component.html',
  styleUrls: ['info.component.css'],
})
export class InfoComponent implements OnInit {

  private isHidden:boolean = true;
  private githubUsers:any = {country: '', countryCode: 'sg', userCount:0, topUsers:[]};
  private eventCountryMapped: Subject<any>;
  private eventCountrySelected: Subject<any>;
  private eventSubscriptions: Subscription[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2,
    private githubService: GithubService,
    private eventService: EventService,
    private dataService: DataService){
      this.eventCountryMapped = this.eventService.getCountryMappedEvent();
      this.eventCountrySelected = this.eventService.getCountrySelectedEvent();
  }

  //Angular Lifecycle Events
  ngOnInit() {
    this._countrySelected();
    this._countryMapped();
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnDestroy() {
    for (let esub of this.eventSubscriptions) {
      esub.unsubscribe();
    }
  }

  //Application Events
  private _countrySelected() {
    let event = this.eventCountrySelected.subscribe(
      (countryCode: String) => {
        this.isHidden = true;
        this.changeDetector.detectChanges();
        this.eventSubscriptions.push(event);
      }
    )
  }
  private _countryMapped() {
    let _countryCode = '';
    let _countryName = '';
    let event = this.eventCountryMapped
      .mergeMap((countryCode: string) => {
          _countryCode = countryCode;
          return this.dataService.getCountries();
      })
      .mergeMap((data) => {
        if (data) {
          let countries = data;
          for (let country of countries) {
            if (country.code === _countryCode) {
              _countryName = country.name;
              return this.githubService.getUsersByCountry(country.name);
            }
          }
        }
      })
      .subscribe((data) => {
        let userCount = data.total_count;
        let users = data.items;
        this.githubUsers.country = _countryName;
        this.githubUsers.countryCode = _countryCode;
        this.githubUsers.userCount = userCount;
        this.githubUsers.topUsers = users.slice(0, 10);
        this.isHidden = false;
        //Angular can't update the above models in UI. need to manually update it.
        this.changeDetector.detectChanges();
        this.eventSubscriptions.push(event);
      }
    );
  }
}
