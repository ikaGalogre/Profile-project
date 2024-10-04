import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserInfo } from '../models/interfaces';
import { delay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  private apiUrl = 'http://localhost:3000/users';

  getUserData() {
    return this.httpClient.get<IUserInfo[]>(this.apiUrl);
  }
  editUserData(id: number) {
    return this.httpClient.get<IUserInfo>(`${this.apiUrl}/${id}`);
  }
  updateUserData(data: IUserInfo) {
    return this.httpClient
      .put<IUserInfo>(`${this.apiUrl}/${data.id}`, data)
      .pipe(delay(5000));
  }
}
