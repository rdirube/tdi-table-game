import { Injectable } from '@angular/core';
import { ScoreParameters, ScoreStarsService } from 'micro-lesson-core';
import { ExerciseData, sum, UserAnswer } from 'ox-types';

@Injectable({
  providedIn: 'root'
})
export class TdiScoreService extends ScoreStarsService<any>{

  constructor() {
    super();
  }


  protected calculateScoreForMetric(exerciseMetric: ExerciseData, parameters: ScoreParameters): { points: number; bonusPoints: number; } {
    const answers = exerciseMetric.userInput.answers;
    const errorsInExercise = answers.filter( x => x.parts.some(z => z.correctness === 'wrong')).length;
    const percentageOfAnAnswer = (1 / answers.length) * 100
    if (exerciseMetric.extraInfo?.['isInput'] === 'Completar casilleros') {
      return { points: sum(answers.map((z,i) => this.calculateAnswerPointsComplete(z, parameters.exerciseValue, percentageOfAnAnswer, errorsInExercise))), bonusPoints: 0 }
    } else {
      return { points: sum(answers.map((z,i) => this.calculateAnswerPointsSelect(z, parameters.exerciseValue, percentageOfAnAnswer, errorsInExercise))), bonusPoints: 0 }
    }
  }


  private calculateAnswerPointsComplete(answer: UserAnswer, totalAnswerPoints: number, percentageOfAnAnswer:number, errorsInExercise:number): number {
    return answer.parts.every(part => part.correctness === 'correct') ? totalAnswerPoints :
     - ((totalAnswerPoints * percentageOfAnAnswer) / 100) * errorsInExercise
  }


  private calculateAnswerPointsSelect(answer: UserAnswer, totalAnswerPoints: number , percentageOfAnAnswer:number, errorsInExercise:number): number {
    return answer.parts.every(part => part.correctness === 'correct') ? totalAnswerPoints :
    Math.max(-((totalAnswerPoints * percentageOfAnAnswer) / 100) * errorsInExercise, - totalAnswerPoints) 
  } 

}
