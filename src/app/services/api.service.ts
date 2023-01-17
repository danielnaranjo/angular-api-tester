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
    let setHeaders = {
      headers: {
        "content-Type": "application/json; charset=utf-8",
        accept: "application/json",
        //Authorization: `Bearer ${userToken}`,
        "Access-Control-Allow-Origin": "*",
      }
    };
    // console.log(methodService, apiService, userToken, setHeaders, body);
    return this.http.request<[]>(methodService, apiService, setHeaders).pipe(
      timeout(6000),
      retry(3),
      catchError(
        // @ts-ignore
        (err: any, caught: Observable<any>): ObservableInput<any> => {
          if (err instanceof TimeoutError) {
            console.error('[timeout]', err);
          }
          if (err.status === 400 || err.status === 0 || err.status === 403) {
            console.error('[400/403]', err.status);
          } else if (err.status === 429) {
            console.error('[429]');
          } else if (err.status === 500) {
            if (err.error && err.error.message) {
              console.error('[ServerError]', err.error.message);
            } else if (err.message) {
              console.error('[ServerError]', err.message);
            } else {
              console.error('[ServerError]', `unknown error from server `);
            }
            console.error('[500]');
          } else if (err.status === 401) {
            console.log('[401]');
          } else {
            if (err.error && err.error.message) {
              console.error('[NA]', 'ERROR MSG 1: ', err.error.message);
              return throwError(err.error.message);
            }
            if (err.message) {
              console.error('[NA]', 'ERROR MSG 2: ', err.message);
              return throwError(err.message);
            }
          }
        }
      )
    )
  }
}
