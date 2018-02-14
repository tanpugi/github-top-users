import {
  Component, OnInit, AfterViewInit, OnChanges, SimpleChanges,
  ViewChild, ElementRef, Renderer2, Input} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { EventService } from '../services/event.service';

import {} from '@types/googlemaps';

declare const google: any;

@Component({
  selector: 'app-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css'],
})
export class MapComponent implements OnInit {

  @ViewChild('gmap')
  private gmap: ElementRef;
  private map: any = {};
  private mapMarker: any;
  private mapOptions: any = {
    center: {lat: 0, lng: 0},
    zoom: 3,
    minZoom: 3,
    disableDefaultUI: true
  }

  private eventMapLoaded: Subject<any>;
  private eventCountrySelected: Subject<any>;
  private eventCountryMapped: Subject<any>;
  private eventSubscriptions: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private eventService: EventService){
      this.eventMapLoaded = this.eventService.getMapLoadedEvent();
      this.eventCountrySelected = this.eventService.getCountrySelectedEvent();
      this.eventCountryMapped = this.eventService.getCountryMappedEvent();
  }

  //Angular Lifecycle Events
  ngOnInit() {
    this._mapLoaded();
    this._countrySelected();
    this._checkGoogleMapAPILoaded();
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngOnDestroy() {
    for (let esub of this.eventSubscriptions) {
      esub.unsubscribe();
    }
  }

  //Application Events
  private _mapLoaded() {
    let event = this.eventMapLoaded.subscribe(
      () => {
        this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
        this.eventSubscriptions.push(event);
      }
    );
  }
  private _countrySelected() {
    let event = this.eventCountrySelected.subscribe(
      (countryCode: string) => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {'address' : countryCode},
          (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              let latlng = results[0].geometry.location;
              this.map.setCenter(latlng);
              if (this.mapMarker) {
                  this.mapMarker.setMap(null);
              }
              this.mapMarker = new google.maps.Marker({
                  position: latlng,
                  map: this.map,
                  animation: google.maps.Animation.DROP,
                  icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
              });

              google.maps.event.addListener(
                this.mapMarker,
                'click', ()=> { this.eventCountryMapped.next(countryCode); }
              );
            }
          }
        );
        this.eventSubscriptions.push(event);
      }
    )
  }
  private _checkGoogleMapAPILoaded() {
    const CHECK_GMAP_COUNT_LIMIT = 10;
    let checkGMapCount = 0;
    let checkGMapApi = setInterval(() => {
      checkGMapCount++;
      try {
        if (google != undefined || checkGMapCount > CHECK_GMAP_COUNT_LIMIT) {
          this.eventMapLoaded.next({});
          clearInterval(checkGMapApi);
        }
      } catch (err) {
        console.log(err.message);
      }
    }, 100);
  }
}
