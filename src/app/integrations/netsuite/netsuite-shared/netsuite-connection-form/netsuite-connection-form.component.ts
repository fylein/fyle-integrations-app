import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from 'src/app/core/services/common/helper.service';

@Component({
  selector: 'app-netsuite-connection-form',
  templateUrl: './netsuite-connection-form.component.html',
  styleUrl: './netsuite-connection-form.component.scss',
  standalone: false,
})
export class NetsuiteConnectionFormComponent {
  @Input() connectNetsuiteForm: FormGroup;

  @Input() isReconnecting?: boolean;

  constructor(public helper: HelperService) {}
}
