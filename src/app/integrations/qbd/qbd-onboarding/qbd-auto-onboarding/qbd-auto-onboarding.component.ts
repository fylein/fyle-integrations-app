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

  constructor(
    private fb: FormBuilder,
    private qbdOnboardingService: QbdOnboardingService,
    private qbdExportSettings: QbdExportSettingService
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
    // You can add any additional logic here if needed when the user declines
  }

  startOnboarding() {
    this.displayChatDialog = true;
    this.askQuestion();
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

      this.qbdOnboardingService.sendMessage(userInput, this.conversationId).subscribe(
        (response) => {
          if (response.output_type === 'CONVERSATION') {
            const output = response.output as { question: string };
            this.addMessage('ai', output.question);
          } else if (response.output_type === 'FINAL') {
            this.addMessage('ai', 'We have successfully set up your QBD Accounting Software.');
            this.sendExportSettings(response.output as ExportSettings);
          }
          this.chatForm.reset();
          this.showSendButton = true;
          this.isFirstResponse = false;
        },
        (error) => {
          console.error('Error:', error);
          this.addMessage('ai', 'Sorry, there was an error processing your request.');
        }
      );
    }
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
    this.displayChatDialog = false;
  }

  askQuestion() {
    // Remove this method or keep it empty as we're now using the API for questions
  }

  ngOnInit() {
    this.showConfirmDialog();
  }
}