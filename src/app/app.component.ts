import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AppInfoOxService, BaseMicroLessonApp, EndGameService, GameActionsService, InWumboxService, LevelService, MicroLessonCommunicationService, MicroLessonMetricsService, ProgressService, ResourceStateService, SoundOxService } from 'micro-lesson-core';
import { PostMessageBridgeFactory } from 'ngox-post-message';
import { CommunicationOxService, I18nService, PreloaderOxService, ResourceOx } from 'ox-core';
import { environment } from 'src/environments/environment';
import { TdiChallengeService } from './shared/services/tdi-challenge.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseMicroLessonApp {
  protected getBasePath(): string {
    return environment.basePath;
  }
  protected getGameResourcesToLoad(): ResourceOx[] {
    return [] 
 }
  title = 'tdi';

  constructor(preloader: PreloaderOxService, translocoService: TranslocoService, wumboxService: InWumboxService,
    communicationOxService: CommunicationOxService, microLessonCommunicationService: MicroLessonCommunicationService<any>,
    progressService: ProgressService, elementRef: ElementRef, private _gameActionsService: GameActionsService<any>,
    endGame: EndGameService, i18nService: I18nService, levelService: LevelService, http: HttpClient,
    private _challengeService: TdiChallengeService, private _appInfoService: AppInfoOxService,
    private _metrics: MicroLessonMetricsService<any>, // Todo
    resourceStateService: ResourceStateService,
    sound: SoundOxService, bridgeFactory: PostMessageBridgeFactory,
    transloco: TranslocoService) {
    super(preloader, translocoService, wumboxService, communicationOxService, microLessonCommunicationService,
      progressService, elementRef, _gameActionsService, endGame,
      i18nService, levelService, http, _challengeService, _appInfoService, _metrics, sound, bridgeFactory);
      preloader.addResourcesToLoad(this.getGameResourcesToLoad());

}


}