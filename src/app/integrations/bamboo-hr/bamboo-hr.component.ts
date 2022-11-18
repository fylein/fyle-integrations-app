import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bamboo-hr',
  templateUrl: './bamboo-hr.component.html',
  styleUrls: ['./bamboo-hr.component.scss']
})
export class BambooHrComponent implements OnInit {

  showDialog: boolean = false;

  isBambooConnected: boolean = false;

  isBambooConnectionInProgress: boolean = false;

  isRecipeActive: boolean = false;

  bambooConnectionForm: FormGroup = this.formBuilder.group({
    apiToken: [null, Validators.required],
    subDomain: [null, Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder
  ) { }

  openDialog(): void {
   this.showDialog = true;
  }

  connectBambooHR(): void {
    // TODO
    if (this.bambooConnectionForm.valid) {
      this.isBambooConnectionInProgress = true;
      setTimeout(() => {
        this.isBambooConnectionInProgress = false;
        this.showDialog = false;
      }, 1000);
    }
  }

  ngOnInit(): void {
    this.isBambooConnected = true;
  }

}
