import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  isAuthenticated: boolean = false;
  username: any;
  roles: any;
  jwt: any;

  constructor(private httpClient: HttpClient) { }

  public login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    let params = new HttpParams().set('username', username).set('password', password);
    return this.httpClient.post("http://localhost:8080/auth/login", params, options);
  }

  loadProfile(data: any) {
    this.isAuthenticated = true;
    this.jwt = data['token'];
    let jwtdecoded: any = jwtDecode(this.jwt);
    this.username = jwtdecoded.sub;
    this.roles = jwtdecoded.scope;
    console.log(this.username);
    console.log(this.roles);
  }

  logout() {
    this.isAuthenticated=false;
    this.jwt=undefined;
    this.username=undefined;
    this.roles=undefined;
  }
}
