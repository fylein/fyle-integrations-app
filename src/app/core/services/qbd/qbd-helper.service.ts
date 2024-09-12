import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportSettings } from 'src/app/integrations/qbd/qbd-onboarding/qbd-auto-onboarding/qbd-auto-onboarding.component';
import { environment } from 'src/environments/environment';
import { WorkspaceService } from '../common/workspace.service';

interface OnboardingResponse {
  conversation_id: string,
  content: {
    output_type: string;
    output: ExportSettings | { question: string };
}
}

@Injectable({
  providedIn: 'root'
})
export class QbdOnboardingService {
  private apiUrl = environment.qbd_api_url;

  constructor(
    private http: HttpClient,
    private workspaceService: WorkspaceService
  ) { }

  sendMessage(userInput: string, conversationId?: string): Observable<OnboardingResponse> {
      return this.http.post<OnboardingResponse>(`${this.apiUrl}/workspaces/${this.workspaceService.getWorkspaceId()}/conversations/`, {
        conversation_id: conversationId,
        content: userInput
      });

  }

  deleteMessage(conversationId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/workspaces/${this.workspaceService.getWorkspaceId()}/conversations/`, {
      body: { conversation_id: conversationId }
    });
  }

  saveExportSettings(settings: ExportSettings): Observable<any> {
    return this.http.post(`${this.apiUrl}/export_settings`, settings);
  }
}