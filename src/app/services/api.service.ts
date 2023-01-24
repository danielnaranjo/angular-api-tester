import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableInput, throwError, TimeoutError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  serverRequest(methodService: string, apiService: string, userToken: string, body?: any): Observable<[]> {
    let setOptions: any = {};
    if (body) {
      setOptions.body = body;
    }
    setOptions.headers = {
        "Content-Type": "application/json; charset=utf-8",
        accept: "application/json",
    };

    if (userToken) {
      setOptions.headers.Authorization = `Bearer ${userToken}`;
    }
    console.log(methodService, apiService, userToken, setOptions, body);
    return this.http.request<[]>(methodService, apiService, setOptions).pipe(
      timeout(6000),
      retry(1),
      catchError(
        // @ts-ignore
        (err: any, caught: Observable<any>): ObservableInput<any> => {
          if (err instanceof TimeoutError) {
            console.error('[timeout]', err);
          }

          switch (err.status) {
            case 0:
              console.error('[0]', err.message);
              break;
            case 400:
              console.error('[400]', err.message, err);
              break;
            case 401:
              console.error('[401]', err.message);
              break;
            case 403:
              console.error('[403]', err.message);
              break;
            case 429:
              console.error('[429]', err.message);
              break;
            case 500:
              if (err.error && err.error.message) {
                console.error('[ServerError]', err.error.message);
              } else if (err.message) {
                console.error('[ServerError]', err.message);
              } else {
                console.error('[ServerError]', `unknown error from server `);
              }
              break;
            default:
              if (err.error && err.error.message) {
                console.error('[NA]', 'ERROR MSG 1: ', err.error.message);
                return throwError(err.error.message);
              }
              if (err.message) {
                console.error('[NA]', 'ERROR MSG 2: ', err.message);
                return throwError(err.message);
              }
              break;
          }
      })
    )
  }
}
