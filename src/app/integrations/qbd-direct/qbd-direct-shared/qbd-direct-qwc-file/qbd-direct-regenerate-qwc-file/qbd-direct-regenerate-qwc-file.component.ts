import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QwcRegenerationFlowType } from 'src/app/core/models/qbd-direct/qbd-direct-configuration/qbd-direct-qwc-file.model';

@Component({
  selector: 'app-qbd-direct-regenerate-qwc-file',
  imports: [],
  templateUrl: './qbd-direct-regenerate-qwc-file.component.html',
  styleUrl: './qbd-direct-regenerate-qwc-file.component.scss'
})
export class QbdDirectRegenerateQwcFileComponent implements OnInit {
  flowType: QwcRegenerationFlowType;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.flowType = data.flowType;
    });
  }
}
