import { EventEmitter, Injectable } from '@angular/core';
import { ChallengeService, GameActionsService, SoundOxService, SubLevelService } from 'micro-lesson-core';
import { ComposeService } from 'ox-animations';
import { PreloaderOxService } from 'ox-core';
import { Typographies } from 'typography-ox';
import { TdiExercise } from '../types/types';
import { TdiChallengeService } from './tdi-challenge.service';



@Injectable({
  providedIn: 'root'
})
export class TdiComposeService extends ComposeService<TdiExercise> {


  public animationTrigger = new EventEmitter<any>()
  

  constructor(challengeService: ChallengeService<TdiExercise,any>, soundService: SoundOxService, 
    gameActions: GameActionsService<any>)  
  {
    super(challengeService, soundService, gameActions);

   
 
  }


  
   
  

   
}
