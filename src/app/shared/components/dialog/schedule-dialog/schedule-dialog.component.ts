import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogComponent } from '../../core/dialog/dialog.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { brandingConfig } from 'src/app/branding/branding-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleDialogData, ScheduleForm, FrequencyOption } from 'src/app/core/models/misc/schedule-dialog.model';
import { FormGroup } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectFormOption } from 'src/app/core/models/common/select-form-option.model';
import { SentenceCasePipe } from 'src/app/shared/pipes/sentence-case.pipe';
import { ScheduleFormService } from 'src/app/core/services/misc/schedule-form.service';

@Component({
    selector: 'app-schedule-dialog',
    imports: [SharedModule, DialogComponent, RadioButtonModule],
    templateUrl: './schedule-dialog.component.html',
    styleUrl: './schedule-dialog.component.scss',
    providers: [SentenceCasePipe]
})
export class ScheduleDialogComponent implements OnInit {

  readonly brandingConfig = brandingConfig;

  frequencyOptions!: FrequencyOption[];

  dayOfWeekOptions!: SelectFormOption[];

  dayOfMonthOptions!: SelectFormOption[];

  timeOptions!: string[];

  form!: FormGroup<ScheduleForm>;

  get frequencyValue() {
    return this.form.get('frequency')?.value ?? null;
  }

  constructor(
    public config: DynamicDialogConfig<ScheduleDialogData>,
    public dialogRef: DynamicDialogRef,
    private scheduleFormService: ScheduleFormService
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      saved: true
    });
  }

  private constructOptions(): void {
    this.frequencyOptions = this.scheduleFormService.getFrequencyOptions();
    this.dayOfWeekOptions = this.scheduleFormService.getDayOfWeekOptions();
    this.dayOfMonthOptions = this.scheduleFormService.getDayOfMonthOptions();
    this.timeOptions = this.scheduleFormService.getTimeOptions();
  }

  ngOnInit(): void {
    this.constructOptions();

    this.form = this.config.data?.form!;
  }
}
