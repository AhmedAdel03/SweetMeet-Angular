import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServiceAccount } from '../service/service-account';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';

// Use a BehaviorSubject to track the refresh state
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const account = inject(ServiceAccount);
  const user = account.CurrentUser();

  let authReq = req;
  if (user?.accessToken) {
    authReq = addToken(req, user.accessToken);
  }

  return next(authReq).pipe(
    catchError(error => {
      // Check for 401 and ensure we aren't already trying to refresh a refresh request
      if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
        return handle401Error(account, authReq, next);
      }
      return throwError(() => error);
    })
  );
};

// Helper to clone request with header
const addToken = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
};

const handle401Error = (account: ServiceAccount, request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return account.refreshToken().pipe(
      switchMap((newTokens: any) => {
        isRefreshing = false;
        account.updateuser(newTokens); // Your storage logic
        refreshTokenSubject.next(newTokens.accessToken);
        
        return next(addToken(request, newTokens.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        account.Logout();
        return throwError(() => err);
      })
    );
  } else {
    // If refresh is already in progress, wait for the new token
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token!)))
    );
  }
};