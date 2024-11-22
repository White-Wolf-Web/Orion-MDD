import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SubscriptionDto } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllSubscriptions(): Observable<SubscriptionDto[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<SubscriptionDto[]>(`${this.apiUrl}/topics`, { headers });
  }

  subscribeToTopic(topicId: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.post<void>(`${this.apiUrl}/users/topics/${topicId}`, {}, { headers });
  }

  getTopics(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(this.apiUrl);
  }

 

  getSubscriptionById(id: string): Observable<SubscriptionDto> {
    const headers = this.createAuthHeaders();
    return this.http.get<SubscriptionDto>(`${this.apiUrl}/${id}`, { headers });
  }

  subscribe(subscriptionDto: SubscriptionDto): Observable<SubscriptionDto> {
    const headers = this.createAuthHeaders();
    return this.http.post<SubscriptionDto>(`${this.apiUrl}/subscribe`, subscriptionDto, { headers });
  }



  getUserSubscriptions(): Observable<SubscriptionDto[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<SubscriptionDto[]>(`${this.apiUrl}/users/me/subscriptions`, { headers });
  }


  unsubscribeFromTopic(subscriptionId: number): Observable<void> {
    const headers = this.createAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/users/subscriptions/${subscriptionId}`, {
        headers,
    });
}

  
}
