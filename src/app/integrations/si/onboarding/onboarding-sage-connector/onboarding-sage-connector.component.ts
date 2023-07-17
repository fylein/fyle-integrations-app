import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-sage-connector',
  templateUrl: './onboarding-sage-connector.component.html',
  styleUrls: ['./onboarding-sage-connector.component.scss']
})
export class OnboardingSageConnectorComponent implements OnInit {

  isLoading: boolean;
  isSaveDisabled: boolean;
  connectSageIntacctForm: FormGroup;
  workspaceId: number;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

    

  ngOnInit(): void {
  }

}
