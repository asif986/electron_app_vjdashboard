import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebServer } from './WebServer';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})


export class APIClient {

    /*constructor(public networkService:NetworkServiceService,private nativeHttp: HTTP, public toastController: ToastController, public  webServer: WebServer) { }  private nativeHttp: HTTP*/
    constructor(
        public http: HttpClient,
        public webServer: WebServer) { }


    /*Get Data*/
    get(urlWithQueryParams: string) {
        const httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.get<any>(urlWithQueryParams);
    }
    /*Post Data*/

    post(url: string, psdata?: any) {
        let httpHeaders = new HttpHeaders();
        httpHeaders.append('Accept', 'application/json');

        httpHeaders.append('Content-Type', 'multipart/form-data');
        // httpHeaders = new HttpHeaders().set('Authorization', localStorage.getItem('Auth'));
        const options = {
            headers: httpHeaders,
            // observe: 'response' as 'body',
        };

        return this.http.post<any>(url, psdata, options);
    }
    /*put Data*/

    put(url: string, psdata?: any) {
        return this.http.put<any>(url, psdata);
    }


    /*Get Data with Cors*/
    /*  public getNative(urlWithQueryParams: string): Observable<any> {
          console.log(urlWithQueryParams);
          return from(this.nativeHttp.get(urlWithQueryParams, {}, {})).map((res: any) => {
              return {
                  json() {
                      return JSON.parse(res.data);
                  },
                  text(ignoredEncodingHint) {
                      return res.data.toString();
                  },
                  body: this.parseBodyFromNativeHttpResponse(res,{}),
                  headers: new Headers(res.headers)
              };
          });
  
      }
  
      public postNative(url: string, postData: any): Observable<any> {
  
          return from(this.nativeHttp.post(url, postData,{})).map((res: any) => {
              return {
                  json() {
                      return JSON.parse(res.data);
                  },
                  text(ignoredEncodingHint) {
                      return res.data.toString();
                  },
                  body: this.parseBodyFromNativeHttpResponse(res,{}),
                  headers: new Headers(res.headers)
              };
          });
  
      }
  
      private parseBodyFromNativeHttpResponse(res, options) {
          if (res.data) {
              if (options === undefined || options.responseType === undefined || options.responseType === 'json') {
                  return JSON.parse(res.data);
              }
              return res.data;
          }
          return null;
      }
  
      private parseHeadersForNativeHttp(options) {
          let headers: Headers | {} | null = options !== undefined && options.headers !== undefined ? options.headers : {};
          if (headers instanceof Headers) {
              let newHeaders: any = {};
              headers.forEach(function (value, name) {
                  newHeaders[name.toString()] = value.toString();
              });
              headers = newHeaders;
          }
          return headers;
      }*/

}
