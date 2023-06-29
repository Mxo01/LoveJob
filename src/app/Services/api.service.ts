import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user.model';
import { Observable } from 'rxjs';
import { FeedBack } from '../Models/feedBack.model';
import { Favorite } from '../Models/favorite.model';
import { Marker } from '../Models/marker.model';
import { TokenApi } from '../Models/tokenApi.model';
import { ResetPassword } from '../Models/resetPassword.model';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private baseUrl: string = 'https://localhost:7140/api/Authentication/';

  constructor(private http: HttpClient) {}

  login(user: User): Observable<TokenApi> {
    return this.http.post<TokenApi>(this.baseUrl + 'login', user);
  }

  sendResetPasswordLink(email: string) {
    return this.http.post(this.baseUrl + 'sendResetEmail/' + email, {});
  }

  resetPassword(resetPassword: ResetPassword) {
    return this.http.post(this.baseUrl + 'resetPassword', resetPassword);
  }

  signup(user: User) {
    return this.http.post(this.baseUrl + 'signup', user);
  }

  refreshToken(tokenApi: TokenApi): Observable<TokenApi> {
    return this.http.post<TokenApi>(this.baseUrl + 'refreshToken', tokenApi);
  }

  sendFeedBack(feedback: FeedBack) {
    return this.http.post(this.baseUrl + 'sendFeedBack', feedback);
  }

  deleteFeedBack(id: string) {
    return this.http.delete(this.baseUrl + 'deleteFeedBack/' + id);
  }

  getFeedBacks(): Observable<FeedBack[]> {
    return this.http.get<FeedBack[]>(this.baseUrl + 'getFeedBacks');
  }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'getUser/' + username);
  }

  editUser(username: string, updateUserRequest: User): Observable<User> {
    return this.http.put<User>(this.baseUrl + 'editUser/' + username, updateUserRequest);
  }

  deleteUser(username: string) {
    return this.http.delete(this.baseUrl + 'deleteUser/' + username);
  }

  getFavorites(username: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.baseUrl + 'getFavorites/' + username);
  }

  addFavorite(favorite: Favorite) {
    return this.http.post(this.baseUrl + 'addFavorite', favorite);
  }

  deleteFavorite(id: string) {
    return this.http.delete(this.baseUrl + 'deleteFavorite/' + id);
  }

  deleteFavoritesByUsername(username: string) {
    return this.http.delete(this.baseUrl + 'deleteFavorites/' + username);
  }

  getMarkers(): Observable<Marker[]> {
    return this.http.get<Marker[]>(this.baseUrl + 'getMarkers');
  }

  addMarker(marker: Marker) {
    return this.http.post(this.baseUrl + 'addMarker', marker);
  }

  deleteMarker(id: string) {
    return this.http.delete(this.baseUrl + 'deleteMarker/' + id);
  }

  deleteMarkersByUsername(username: string) {
    return this.http.delete(this.baseUrl + 'deleteMarkers/' + username);
  }
}
