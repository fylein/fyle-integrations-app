import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonSize, ButtonType } from 'src/app/core/models/enum/enum.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {

  @Input() type: 'ERROR' | null = null;

  @Input() header: string;

  @Input() buttonText: string;

  @Input() buttonType = ButtonType.PRIMARY;

  @Input() showCancelButton: boolean = false;

  @Input() isButtonDisabled: boolean = false;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  readonly ButtonType = ButtonType;

  readonly ButtonSize = ButtonSize;

  ngOnInit(): void {
    if (!this.buttonClick.observed) {
      this.buttonClick.subscribe(() => {
        this.closeDialog.emit();
      });
    }
  }
}
