import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDto } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) {}

  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Méthode pour récupérer les commentaires par ID d'article
  getCommentsByArticleId(articleId: string): Observable<CommentDto[]> {
    const headers = this.createAuthHeaders();
    return this.http.get<CommentDto[]>(`/api/articles/${articleId}/comments`, { headers });
  }

  // Méthode pour ajouter un commentaire à un article
  addComment(articleId: string, content: string): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post<void>(`${this.apiUrl}/${articleId}/comments`, { content }, { headers });
  }
}
