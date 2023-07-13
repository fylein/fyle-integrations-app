import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimalUser } from 'src/app/core/models/db/user.model';
import { Workspace } from 'src/app/core/models/db/workspaces.model';
import { IntegrationsUserService } from 'src/app/core/services/core/integrations-user.service';
import { StorageService } from 'src/app/core/services/core/storage.service';
import { WindowService } from 'src/app/core/services/core/window.service';
import { SiWorkspaceService } from 'src/app/core/services/si/si-core/si-workspace.service';

@Component({
  selector: 'app-si',
  templateUrl: './si.component.html',
  styleUrls: ['./si.component.scss']
})
export class SiComponent implements OnInit {

  user: MinimalUser;

  workspace: Workspace;

  isLoading: boolean = true;

  windowReference: Window;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: IntegrationsUserService,
    private workspaceService: SiWorkspaceService,
    private windowService: WindowService
  ) {
    this.windowReference = this.windowService.nativeWindow;
  }

  ngOnInit(): void {
  }

}
