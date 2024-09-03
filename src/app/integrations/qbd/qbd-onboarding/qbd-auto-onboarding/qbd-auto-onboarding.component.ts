import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

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
  styleUrls: ['./qbd-auto-onboarding.component.scss']
})
export class QbdAutoOnboardingComponent implements OnInit {
  displayDialog: boolean = false;
  showTextArea: boolean = false;
  customFieldForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.customFieldForm = this.fb.group({
      explanation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.openDialog();
  }

  openDialog() {
    this.displayDialog = true;
  }

  onYesClick() {
    this.showTextArea = true;
  }

  onNoClick() {
    this.displayDialog = false;
    this.showTextArea = false;
    this.customFieldForm.reset();
  }

  onSubmit() {
    if (this.customFieldForm.valid) {
      console.log('Submitted explanation:', this.customFieldForm.value.explanation);
      // Add logic to handle the submitted explanation
      this.displayDialog = false;
      this.showTextArea = false;
      this.customFieldForm.reset();
    }
  }
}