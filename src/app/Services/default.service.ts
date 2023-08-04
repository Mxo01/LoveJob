import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { Chat } from '../Models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  private loggedOut: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loggedOutObs = this.loggedOut.asObservable();

  private fullName: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public fullNameObs = this.fullName.asObservable();

  private role: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public roleObs = this.role.asObservable();

  private chat: BehaviorSubject<Chat> = new BehaviorSubject<Chat>({
    id: '',
    user1: '',
    name1: '',
    user2: '',
    name2: '',
    lastMessage: '',
    time: new Date()
  });
  public chatObs = this.chat.asObservable();

  private userPayload: any;

  routesLoggedIn: string[] = ['/search', '/profile', 'editprofile'];

  constructor(private router: Router) {
    this.userPayload = this.decodeToken();
  }

  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token')!;
  }

  storeRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  getRefreshToken(): string {
    return localStorage.getItem('refreshToken')!;
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    return jwtHelper.decodeToken(token);
  }

  setFullName(fullName: string): void {
    this.fullName.next(fullName);
  }

  getUsernameFromToken() {
    if (this.userPayload) return this.userPayload.unique_name;
  }

  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }

  setRole(role: string): void {
    this.role.next(role);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setLoggedOut(loggedOut: boolean): void {
    this.loggedOut.next(loggedOut);
  }

  logout() {
    localStorage.clear();
    this.setLoggedOut(true);
    this.setRole('');
    this.router.navigate(['']).then(() => window.location.reload());
  }

  addChat(chat: Chat) {
    this.chat.next(chat);
  }
}
