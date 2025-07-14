import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { UserStorageService } from './user-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) { }
  signUp(data: any) {
    return this.httpClient.post(this.url + '/user/signup/', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  login(data: any) {
    return this.httpClient.post(this.url + '/user/login/', data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    });
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken/');
  }

  addNewRoom(data: any): Observable<any>{
    return this.httpClient.post(this.url + '/rooms/addNewRoom/', data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRooms(pageNumber: number): Observable<any>{
    return this.httpClient.get(this.url + `/rooms/getRooms/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRoomById(roomId: number): Observable<any> {
    return this.httpClient.get(this.url + `/rooms/getRoomById/${roomId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAvailableRooms(pageNumber: number): Observable<any> {
    return this.httpClient.get(this.url + `/rooms/getAvailableRooms/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateRoom(roomId:number, data: any): Observable<any> {
    return this.httpClient.post(this.url + '/rooms/updateRooms', data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.httpClient.delete(this.url + `/rooms/deleteRoom/${roomId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  bookRooms(data: any): Observable<any> {
    return this.httpClient.post(this.url + '/reservations/addNewReservation', data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getReservations(pageNumber: number): Observable<any> {
    return this.httpClient.get(this.url + `/reservations/getReservations/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUserReservations(pageNumber: number, userID: number): Observable<any> {
    return this.httpClient.get(this.url + `/reservations/getReservationsByUser/${userID}/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateReservationStatus(data: any): Observable<any> {
    return this.httpClient.post(this.url + '/reservations/updateReservationStatus', data, {
      headers: this.createAuthorizationHeader(),
    });
  }

  createAuthorizationHeader() {
    let authheaders: HttpHeaders = new HttpHeaders();
    return authheaders.set(
      'Authorization','Bearer ' + UserStorageService.getToken()
    )
  }
}
