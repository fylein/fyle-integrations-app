import { Component } from '@angular/core';
import { SharedModule } from "../../../../shared/shared.module";
import { QbdDirectSharedComponent } from '../qbd-direct-shared.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-qbd-direct-download-file',
  standalone: true,
  imports: [SharedModule, QbdDirectSharedComponent, CardModule],
  templateUrl: './qbd-direct-download-file.component.html',
  styleUrl: './qbd-direct-download-file.component.scss'
})
export class QbdDirectDownloadFileComponent {
downloadFilePath: any;

}
