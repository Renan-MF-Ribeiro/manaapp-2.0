import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL, { optional: true });

  get<T>(path: string, params?: Record<string, any>) {
    const url = this.buildUrl(path);
    return this.http.get<T>(url, { params });
  }

  post<T>(path: string, body: unknown) {
    const url = this.buildUrl(path);
    return this.http.post<T>(url, body);
  }

  put<T>(path: string, body: unknown) {
    const url = this.buildUrl(path);
    return this.http.put<T>(url, body);
  }

  delete<T>(path: string) {
    const url = this.buildUrl(path);
    return this.http.delete<T>(url);
  }

  private buildUrl(path: string) {
    if (!this.baseUrl) return path;
    return path.startsWith('http') ? path : `${this.baseUrl}${path}`;
  }
}
