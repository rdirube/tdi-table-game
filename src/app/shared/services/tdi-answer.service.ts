import { Injectable } from '@angular/core';
import { AnswerService, GameActionsService, MicroLessonMetricsService } from 'micro-lesson-core';
import { UserAnswer } from 'ox-types';
import { TableElement } from '../types/types';
import { TdiChallengeService } from './tdi-challenge.service';

@Injectable({
  providedIn: 'root'
})
export class TdiAnswerService extends AnswerService {

  public answer:TableElement[] = [];

  protected isValidAnswer(answer: UserAnswer): boolean {
    console.log(this.currentAnswer);
    return this.currentAnswer.parts.every(part => part.parts.every(part => part.value !== ''))
  }

  constructor(private gameActionsService: GameActionsService<any>,
    m: MicroLessonMetricsService<any>,
    private challenge: TdiChallengeService) {
      super(gameActionsService, m)


      this.gameActionsService.showNextChallenge.subscribe(value => {
        this.cleanAnswer();
      });
      this.gameActionsService.finishedTimeOfExercise.subscribe(() => {
        console.log('finishedTimeOfExercise');
        this.onTryAnswer();
      });
    }


    public cleanAnswer(): void {
      this.currentAnswer = { parts: [] };
    }

}
