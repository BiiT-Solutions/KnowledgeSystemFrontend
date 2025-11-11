import {Component} from '@angular/core';
import {Environment} from "../environments/environment";
import {BiitSnackbarHorizontalPosition, BiitSnackbarService, BiitSnackbarVerticalPosition} from "@biit-solutions/wizardry-theme/info";
import {AvailableLangs, TRANSLOCO_SCOPE, TranslocoService} from "@ngneat/transloco";
import {Route, Router} from "@angular/router";
import {completeIconSet} from "@biit-solutions/biit-icons-collection";
import {BiitIconService} from "@biit-solutions/wizardry-theme/icon";
import {KnowledgeSystemRootService, SessionService} from "@biit-solutions/knowledge-system-structure";
import {UserManagerRootService} from "@biit-solutions/user-manager-structure";
import {PermissionService} from "./services/permission.service";
import {User} from "@biit-solutions/authorization-services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi:true,
      useValue: {scope: 'components/main', alias: 'main'}
    }
  ]
})
export class AppComponent {
  protected menu: Route[]= [];
  constructor(knowledgeSystemRootService: KnowledgeSystemRootService,
              userManagerRootService: UserManagerRootService,
              biitSnackbarService: BiitSnackbarService,
              biitIconService: BiitIconService,
              protected sessionService: SessionService,
              private permissionService: PermissionService,
              private router: Router,
              private translocoService: TranslocoService) {
    this.setLanguage();
    knowledgeSystemRootService.serverUrl = new URL(`${Environment.KNOWLEDGE_SYSTEM_SERVER}`);
    userManagerRootService.serverUrl = new URL(`${Environment.USER_MANAGER_SERVER}`);
    biitSnackbarService.setPosition(BiitSnackbarVerticalPosition.TOP, BiitSnackbarHorizontalPosition.CENTER);
    biitIconService.registerIcons(completeIconSet);
    this.setPermissions();
  }

  private setPermissions(): void {
    const user: User = this.sessionService.getUser();
    if (!user) {
      return;
    }
    this.permissionService.setRole(user.applicationRoles);
  }

  private setLanguage(): void {
    const clientLanguages: ReadonlyArray<string>= navigator.languages;
    const languages: AvailableLangs = this.translocoService.getAvailableLangs();
    const language: string = clientLanguages.find(lang => languages.map(lang => lang.toString()).includes(lang));
    if (language) {
      this.translocoService.setActiveLang(language);
    }
  }

  logout() {
    this.router.navigate(['/login'], {queryParams: {logout: true}});
  }
}
