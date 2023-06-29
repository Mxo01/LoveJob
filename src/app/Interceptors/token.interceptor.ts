import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { DefaultService } from '../Services/default.service';
import { APIService } from '../Services/api.service';
import { TokenApi } from '../Models/tokenApi.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private service: DefaultService, private apiService: APIService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.service.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + myToken
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log('error')
            return this.handleUnauthorizedError(request, next);
          }
        }
        return throwError(() => new Error(err.message));
      })
    );
  }

  handleUnauthorizedError(req: HttpRequest<unknown>, next: HttpHandler) {
    const tokenApi = new TokenApi();

    tokenApi.accessToken = this.service.getToken()!;
    tokenApi.refreshToken = this.service.getRefreshToken()!;

    return this.apiService.refreshToken(tokenApi).pipe(
      switchMap((token: TokenApi) => {
        this.service.storeToken(token.accessToken);
        this.service.storeRefreshToken(token.refreshToken);

        req = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token.accessToken
          }
        });

        return next.handle(req);
      }),
      catchError(() => {
        return throwError(() => {
          Swal.fire({
            icon: 'warning',
            title: 'Token is expired',
            text: 'Please log in again to continue using the application',
            confirmButtonText: 'Ok',
            background: '#212529',
            color: '#fff',
            confirmButtonColor: '#0b5ed7'
          });

          this.router.navigate(['/login']);
        });
      })
    );
  }
}
