import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, tap} from "rxjs";
import {Router} from '@angular/router';

@Injectable()
export class DefaultRequestOptions implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(options: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(localStorage.getItem('token') === null){
      this.router.navigate(['/login']);
    }

    if (options && options.headers) {
      if(options.headers.get('Content-Type') !== null){
        return next.handle(options);
      }
      if(options.headers.get('Content-Type') === ''){
        options.headers.set('Content-Type', 'application/json');
      }
      if(localStorage.getItem('token') !== null){
        const token  = localStorage.getItem('token') || '';
        options.headers.set('Authorization', token);
        const clone = options.clone({ setHeaders: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        return next.handle(clone).pipe( tap(() => {},
          (err: any) => {
            if(err.status === 403){
              localStorage.clear();
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            }
            if (err instanceof HttpErrorResponse) {
              if (err.status !== 401) {
                return;
              }else{
                this.router.navigate(['/login']);
              }
            }
          }));
      }

    } else {
      if(localStorage.getItem('token') !== null){
        const token  = localStorage.getItem('token') || '';
        options.headers.set('Authorization', token);
        const clone = options.clone({ setHeaders: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        return next.handle(clone);
      }
    }

    return next.handle(options);
  }
}
