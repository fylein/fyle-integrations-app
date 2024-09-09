import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportSettings } from 'src/app/integrations/qbd/qbd-onboarding/qbd-auto-onboarding/qbd-auto-onboarding.component';

interface OnboardingResponse {
  output: ExportSettings | { question: string };
  output_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class QbdOnboardingService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  sendMessage(userInput: string, conversationId: number): Observable<OnboardingResponse> {
    return this.http.post<OnboardingResponse>(`${this.apiUrl}/setup`, {
      user_input: userInput,
      conversation_id: conversationId
    });
  }

  saveExportSettings(settings: ExportSettings): Observable<any> {
    return this.http.post(`${this.apiUrl}/export_settings`, settings);
  }
}