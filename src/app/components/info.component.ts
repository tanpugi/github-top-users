import {
  Component, OnInit, ViewChild, OnChanges, SimpleChanges,
  ElementRef, Renderer2, Input, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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
  private eventCountryMapped: Subject<string>;
  private eventCountrySelected: Subject<string>;
  private eventSubscriptions: Subject<any>[] = [];

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
      (countryValue: String) => {
        this.isHidden = true;
        this.eventSubscriptions.push(event);
        this.changeDetector.detectChanges();
      }
    )
  }
  private _countryMapped() {
    let event = this.eventCountryMapped.subscribe(
      (countryValue: string) => {
        this.githubService.getUsersByCountry(countryValue)
          .subscribe((data) => {
            let userCount = data.total_count;
            let users = data.items;
            this.githubUsers.userCount = userCount,
            this.githubUsers.topUsers = users.slice(0, 10);
            this.githubUsers.country = countryValue;
            this.isHidden = false;

            this.dataService.getCountries().subscribe(
              (data) => {
                if (data) {
                  this.countries = data;
                  for (let country of this.countries) {
                    if (country.name === countryValue) {
                      this.githubUsers.countryCode = country.code;
                    }
                  }
                }
                //Angular can't update the above models in UI. need to manually update it.
                this.changeDetector.detectChanges();
            });
        });

        this.eventSubscriptions.push(event);
      }
    );
  }
}
