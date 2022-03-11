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
    return this.currentAnswer.parts.every(part => part.parts.every(part => part.value !== ''))
  }

  constructor(private gameActionsService: GameActionsService<any>,
    m: MicroLessonMetricsService<any>,
    private challenge: TdiChallengeService) {
      super(gameActionsService, m)
    }
}
