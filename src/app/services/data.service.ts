import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) {}

  public getCountries(): Observable<any> {
      return this.http.get("./assets/data/countries.json")
  }

}
