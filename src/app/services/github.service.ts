import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GithubService {

  constructor(private http: HttpClient) {}

  public getUsersByCountry(countryValue: string): Observable<any> {
      return this.http.get("https://api.github.com/search/users?q=location:"
        +countryValue+"&sort=followers&order=desc");
  }

}
