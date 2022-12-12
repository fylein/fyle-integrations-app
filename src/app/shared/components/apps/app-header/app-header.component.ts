import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BambooHRConfiguration, BambooHrModel } from 'src/app/core/models/bamboo-hr/bamboo-hr.model';
import { BambooHrService } from 'src/app/core/services/bamboo-hr/bamboo-hr.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  @Output() openDialog = new EventEmitter<void>();

  @Output() recipeUpdateInProgress = new EventEmitter<boolean>();

  @Input() isBambooConnected: boolean = false;

  @Input() isBambooSetupInProgress: boolean;

  @Input() isLoading: boolean;

  @Input() bambooHrConfiguration: BambooHRConfiguration;

  @Input() showErrorScreen: boolean;

  constructor(
    private bambooHrService: BambooHrService
  ) { }

  syncData(): void {
    this.recipeUpdateInProgress.emit(true);
    this.bambooHrService.syncEmployees().subscribe(() => {
      this.recipeUpdateInProgress.emit(false);
    });
  }

  connectBambooHR(): void {
    this.openDialog.emit();
  }

  updateRecipeStatus(): void {
    const isRecipeActive = this.bambooHrConfiguration?.recipe_status ? this.bambooHrConfiguration.recipe_status : false;
    this.recipeUpdateInProgress.emit(true);
    const payload = BambooHrModel.constructRecipeUpdatePayload(isRecipeActive);
    this.bambooHrService.updateRecipeStatus(payload).subscribe(() => {
      this.bambooHrConfiguration.recipe_status = !isRecipeActive;
      this.recipeUpdateInProgress.emit(false);
    });
  }

  ngOnInit(): void {
  }

}
