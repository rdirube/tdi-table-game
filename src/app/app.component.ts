import { HttpClient } from '@angular/common/http';
import { Component, ElementRef } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AppInfoOxService, BaseMicroLessonApp, EndGameService, GameActionsService, InWumboxService, LevelService, MicroLessonCommunicationService, MicroLessonMetricsService, ProgressService, ResourceStateService, SoundOxService } from 'micro-lesson-core';
import { PostMessageBridgeFactory } from 'ngox-post-message';
import { CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType } from 'ox-core';
import { ResourceFinalStateOxBridge, ScreenTypeOx } from 'ox-types';
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
      communicationOxService.receiveI18NInfo.subscribe(z => {
        console.log('i18n', z);
      });
      this._gameActionsService.microLessonCompleted.subscribe(__ => {
        if (resourceStateService.currentState?.value) {
          microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
        }
      });
      preloader.addResourcesToLoad(this.getGameResourcesToLoad());
      this.sound.setSoundOn(true);
      preloader.loadAll().subscribe(x => this.loaded = true)
}


protected getGameResourcesToLoad(): ResourceOx[] {

  const svgElementos: string[] = ['check.svg', 'copa-memotest.svg', 'next-memotest.svg', 'surrender.svg', 'menu.svg', 'pista.svg', 'sonido-activado.svg'];

  const gameResources: string[] = ['locker.svg', 'background.svg']

  const sounds:string[] = ['click.mp3', 'bubble01.mp3', 'bubble02.mp3', 'rightAnswer.mp3', 'woosh.mp3', 'wrongAnswer.mp3', 'clickSurrender.mp3', 'cantClick.mp3',  'hint.mp3'].map(z => 'sounds/' + z);

  const localSounds:string[] = ['selectedInput.mp3']


  return svgElementos.map(x => new ResourceOx('tdi/svg/buttons/' + x, ResourceType.Svg, [ScreenTypeOx.Game], true))
    .concat(gameResources.map(x => new ResourceOx('tdi/svg/game/' + x, ResourceType.Svg, [ScreenTypeOx.Game], true)))
    .concat(getResourceArrayFromUrlList(sounds, ResourceType.Audio, false))
    .concat(localSounds.map(x => new ResourceOx('tdi/local-sounds/' + x, ResourceType.Audio,[ScreenTypeOx.Game] ,true)));
}


}

function getResourceArrayFromUrlList(urlList: string[], resourceType: ResourceType, isLocal: boolean): ResourceOx[] {
  return urlList.map(listElement => new ResourceOx(listElement, resourceType, [ScreenTypeOx.Game], isLocal));
}
