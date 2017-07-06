import { AppSettingsService } from './../app-settings/app-settings.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http , Response , Headers, RequestOptions } from '@angular/http';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { User } from '../models/user.model';

@Injectable()
export class UserService {

  constructor(
    private sessionStorageService: SessionStorageService,
    private _http: Http,
    protected appSettingsService: AppSettingsService) { }

  public getLoggedInUser(): User {
    let userObject = this.sessionStorageService.getObject(Constants.USER_KEY);
    return new User(userObject);
  }

  getUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  // get all users

  public getAllUsers(): Observable <any> {

     let baseUrl = this.getUrl();
     let url = baseUrl + 'user?v=custom:(uuid,display,person)';

     let headers = new Headers({ 'Content-Type': 'application/json' });
     let options = new RequestOptions({ headers: headers });

        return this._http.get(url , options)
            .map((response) => {
                return response.json().results;
            });

  }
}
