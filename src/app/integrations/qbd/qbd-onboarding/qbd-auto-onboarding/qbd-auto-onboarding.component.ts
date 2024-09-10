import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { trigger, transition, style, animate } from '@angular/animations';
import { QbdOnboardingService } from 'src/app/core/services/qbd/qbd-helper.service';
import { QbdExportSettingService } from 'src/app/core/services/qbd/qbd-configuration/qbd-export-setting.service';
import { QBDExportSettingPost } from 'src/app/core/models/qbd/qbd-configuration/qbd-export-setting.model';
import { CCCExpenseState, ExpenseState, QBDCorporateCreditCardExpensesObject, QBDExpenseGroupedBy, QBDExportDateType, QBDReimbursableExpensesObject } from 'src/app/core/models/enum/enum.model';
import { Router } from '@angular/router';

interface Message {
  sender: 'ai' | 'user';
  content: string;
}

export interface ExportSettings {
  bank_account_name: string | null;
  credit_card_account_name: string | null;
  credit_card_expense_date: string | null;
  credit_card_expense_export_type: string | null;
  credit_card_expense_grouped_by: string | null;
  credit_card_expense_state: string | null;
  mileage_account_name: string | null;
  reimbursable_expense_date: string | null;
  reimbursable_expense_grouped_by: string | null;
  reimbursable_expense_state: string | null;
  reimbursable_expenses_export_type: string | null;
}

interface FinalResponse {
  output_export_settings?: any;
  output_field_mapping?: any;
  output_advanced_settings?: any;
}

@Component({
  selector: 'app-qbd-auto-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule
  ],
  templateUrl: './qbd-auto-onboarding.component.html',
  styleUrls: ['./qbd-auto-onboarding.component.scss'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class QbdAutoOnboardingComponent implements OnInit {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  displayConfirmDialog: boolean = false;
  displayChatDialog: boolean = false;
  chatForm: FormGroup;
  showCloseConfirmation: boolean = false;

  messages: Message[] = [];
  currentQuestionIndex = 0;
  conversationComplete = false;

  questions: string[] = [
    "How do you use your QBD Accounting Software?",
    "What is the accounts payable?",
    "What date should be set?",
    "Do you use any mapping, like customer or item mapping?",
    "Do you want to set any schedule for export for IIF?",
    "What email do you want us to send notifications to?"
  ];

  showSendButton: boolean = false;
  isFirstResponse: boolean = true;

  conversationId: number = 1;

  finalResponsesReceived: number = 0;
  finalResponses: FinalResponse = {};

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private qbdOnboardingService: QbdOnboardingService,
    private qbdExportSettings: QbdExportSettingService,
    private router: Router,
  ) {
    this.chatForm = this.fb.group({
      userInput: ['', Validators.required]
    });
  }
  
  showConfirmDialog() {
    this.displayConfirmDialog = true;
  }

  onConfirmYes() {
    this.displayConfirmDialog = false;
    this.startOnboarding();
  }

  onConfirmNo() {
    this.displayConfirmDialog = false;
    this.router.navigate(['/integrations/qbd/onboarding/export_settings']);
    // You can add any additional logic here if needed when the user declines
  }

  startOnboarding() {
    this.displayChatDialog = true;
    this.initializeChat();
  }

  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const userInput = this.chatForm.get('userInput')?.value;
      this.addMessage('user', userInput);
      this.chatForm.reset();
      this.isLoading = true;
  
      setTimeout(() => {
        this.qbdOnboardingService.sendMessage(userInput, this.conversationId).subscribe(
          (response) => {
            this.isLoading = false;
            if (response.output_type === 'CONVERSATION') {
              const output = response.output as { question: string };
              this.addMessage('ai', output.question);
            } else if (response.output_type === 'FINAL') {
              this.handleFinalResponse(response.output);
            }
            this.showSendButton = true;
            this.isFirstResponse = false;
          },
          (error) => {
            this.isLoading = false;
            console.error('Error:', error);
            this.addMessage('ai', 'Sorry, there was an error processing your request.');
          }
        );
      }, 1000); // 1 second delay
    }
  }

  private handleFinalResponse(output: any) {
    this.finalResponsesReceived++;

    if (output.output_export_settings) {
      this.finalResponses.output_export_settings = output.output_export_settings;
    } else if (output.output_field_mapping) {
      this.finalResponses.output_field_mapping = output.output_field_mapping;
    } else if (output.output_advanced_settings) {
      this.finalResponses.output_advanced_settings = output.output_advanced_settings;
    }

    if (this.finalResponsesReceived === 3) {
      this.completeOnboarding();
    } else {
      this.addMessage('ai', 'Great! Let\'s continue with the next set of questions.');
    }
  }

  private completeOnboarding() {
    this.addMessage('ai', 'We have successfully set up your QBD Accounting Software.');
    this.sendExportSettings(this.finalResponses.output_export_settings);
    // You might want to send other settings as well
    this.conversationComplete = true;
  }

  private convertToQBDExportSettingPost(settings: ExportSettings): QBDExportSettingPost {
    return {
      reimbursable_expenses_export_type: settings.reimbursable_expenses_export_type as QBDReimbursableExpensesObject,
      bank_account_name: settings.bank_account_name,
      mileage_account_name: settings.mileage_account_name,
      reimbursable_expense_state: settings.reimbursable_expense_state as ExpenseState,
      reimbursable_expense_date: settings.reimbursable_expense_date as QBDExportDateType,
      reimbursable_expense_grouped_by: settings.reimbursable_expense_grouped_by as QBDExpenseGroupedBy,
      credit_card_expense_export_type: settings.credit_card_expense_export_type as QBDCorporateCreditCardExpensesObject,
      credit_card_expense_state: settings.credit_card_expense_state as CCCExpenseState,
      credit_card_entity_name_preference: null, // This field is not present in ExportSettings
      credit_card_account_name: settings.credit_card_account_name,
      credit_card_expense_grouped_by: settings.credit_card_expense_grouped_by as QBDExpenseGroupedBy,
      credit_card_expense_date: settings.credit_card_expense_date as QBDExportDateType,
    };
  }

  private sendExportSettings(settings: ExportSettings) {
    const payload = this.convertToQBDExportSettingPost(settings);
    this.qbdExportSettings.postQbdExportSettings(payload).subscribe(
      () => console.log('Export settings sent successfully'),
      error => console.error('Error sending export settings:', error)
    );
  }

  addMessage(sender: 'ai' | 'user', content: string) {
    this.messages.push({ sender, content });
    setTimeout(() => this.scrollToBottom(), 0);
  }

  onEnterKey(event: Event) {
    if (event instanceof KeyboardEvent && !event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  closeConfirmDialog() {
    this.displayConfirmDialog = false;
  }

  closeChatDialog() {
    this.showCloseConfirmation = true;
  }

  confirmClose(confirmed: boolean) {
    this.showCloseConfirmation = false;
    if (confirmed) {
      this.displayChatDialog = false;
      this.router.navigate(['/integrations/qbd/onboarding/export_settings']);
    }
    // If not confirmed, just close the confirmation dialog and do nothing else
  }

  askQuestion() {
    // If you want to ask a specific question after the initial greeting, you can add it here
    // For now, we'll leave it empty as we're using the API for questions
  }

  ngOnInit() {
    this.showConfirmDialog();
  }

  private initializeChat() {
    this.messages = []; // Clear any existing messages
    this.addMessage('ai', 'Hey admin, tell us how you use your quickbooks desktop software?');
    this.askQuestion();
  }
}