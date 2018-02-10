import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {

  private _gmapEventMap: Subject<any>[] = [];

  public getMapEvent(id: string) {
    if (!this._gmapEventMap[id]) {
      this._gmapEventMap[id] = new Subject<any>();
    }
    return this._gmapEventMap[id];
  }

  public getMapLoadedEvent() { return this.getMapEvent('MAP_LOADED'); }
  public getCountrySelectedEvent() { return this.getMapEvent('COUNTRY_SELECTED'); }
  public getCountryMappedEvent() { return this.getMapEvent('COUNTRY_MAPPED'); }
}
