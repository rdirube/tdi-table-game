import { EventEmitter, Injectable } from '@angular/core';
import { AppInfoOxService, ChallengeService, FeedbackOxService, GameActionsService, LevelService, SubLevelService } from 'micro-lesson-core';
import { ExerciseOx, PreloaderOxService } from 'ox-core';
import { duplicateWithJSON, ExpandableInfo } from 'ox-types';
import { TdiExercise, TdiNivelation } from '../types/types';

@Injectable({
  providedIn: 'root'
})


export class TdiChallengeService extends ChallengeService<TdiExercise, any>{
  

  public exerciseConfig!: TdiNivelation;
  public tablesIndex:number = 0;


  inputModified = new EventEmitter();
 

  protected generateNextChallenge(subLevel: number): ExerciseOx<TdiExercise> {
    return new ExerciseOx(
      duplicateWithJSON({
        table: this.exerciseConfig.tables,
        hints:this.exerciseConfig.advancedSettings

      }) as TdiExercise, 1, {
      maxTimeToBonus: 0,
      freeTime: 0
    }, []);    
  } 


  protected equalsExerciseData(exerciseData: TdiExercise, exerciseDoneData: TdiExercise): boolean {
    return true
  }


  getMetricsInitialExpandableInfo(): ExpandableInfo {
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'total',
      },
    }; }

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
    subLevelService: SubLevelService,
    private preloaderService: PreloaderOxService,
    private feedback: FeedbackOxService,
    private appInfo: AppInfoOxService) {

    super(gameActionsService, subLevelService, preloaderService);
    console.log(this.appInfo.microLessonInfo);
  }


  public getExerciseConfig(): any {
    return this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo;
  }



   beforeStartGame(): void  {
    const gameCase = 'created-config';
    console.log('this', this);
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"tdi","type":"challenges","screenTheme":"executive-functions","exerciseCount":6,"microLessonGameInfo":{"tables":[{"statement":{"text":"Seleccionar deportes por género","audio":""},"tableName":{"text":"Tabla 1","audio":""},"entrance":"Doble entrada","columns":"5","rows":"5","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"H","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"M","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"value":{"text":"P","audio":""},"elementType":"Encabezado","n":3,"m":0,"isAnswer":false,"isSelected":false},{"id":5,"value":{"text":"T","audio":""},"elementType":"Encabezado","n":4,"m":0,"isAnswer":false,"isSelected":false},{"id":6,"elementType":"Encabezado","value":{"text":"F","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":7,"elementType":"A completar","value":{"text":"20","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1},{"id":8,"elementType":"Fijo","value":{"text":"15","audio":""},"isAnswer":true,"isSelected":false,"n":2,"m":1},{"id":9,"value":{"text":"10","audio":""},"elementType":"Fijo","n":3,"m":1,"isAnswer":false,"isSelected":false},{"id":10,"value":{"text":"45","audio":""},"elementType":"Fijo","n":4,"m":1,"isAnswer":false,"isSelected":false},{"id":11,"elementType":"Encabezado","value":{"text":"H","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":12,"elementType":"Fijo","value":{"text":"15","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":2},{"id":13,"elementType":"Fijo","value":{"text":"20","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":2},{"id":14,"value":{"text":"5","audio":""},"elementType":"Tapado","n":3,"m":2,"isAnswer":false,"isSelected":false},{"id":15,"value":{"text":"40","audio":""},"elementType":"Fijo","n":4,"m":2,"isAnswer":false,"isSelected":false},{"id":16,"value":{"text":"B","audio":""},"elementType":"Encabezado","n":0,"m":3,"isAnswer":false,"isSelected":false},{"id":17,"value":{"text":"10","audio":""},"elementType":"Fijo","n":1,"m":3,"isAnswer":false,"isSelected":false},{"id":18,"value":{"text":"10","audio":""},"elementType":"A completar","n":2,"m":3,"isAnswer":true,"isSelected":false},{"id":19,"value":{"text":"10","audio":""},"elementType":"Fijo","n":3,"m":3,"isAnswer":false,"isSelected":false},{"id":20,"value":{"text":"30","audio":""},"elementType":"Fijo","n":4,"m":3,"isAnswer":false,"isSelected":false},{"id":21,"value":{"text":"T","audio":""},"elementType":"Encabezado","n":0,"m":4,"isAnswer":false,"isSelected":false},{"id":22,"value":{"text":"45","audio":""},"elementType":"Tapado","n":1,"m":4,"isAnswer":false,"isSelected":false},{"id":23,"value":{"text":"45","audio":""},"elementType":"Fijo","n":2,"m":4,"isAnswer":false,"isSelected":false},{"id":24,"value":{"text":"25","audio":""},"elementType":"Fijo","n":3,"m":4,"isAnswer":false,"isSelected":false},{"id":25,"value":{"text":"155","audio":""},"elementType":"Fijo","n":4,"m":4,"isAnswer":false,"isSelected":false}],"setedTable":"Libre","tableWidth":120,"measures":{"width":22.68,"height":10.2}},{"statement":{"text":"Seleccionar tabla por producto","audio":""},"tableName":{"text":"Tabla 2","audio":""},"entrance":"Doble entrada","columns":"5","rows":"4","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"M1","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"M2","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"elementType":"Encabezado","value":{"text":"M3","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":0},{"id":5,"elementType":"Encabezado","value":{"text":"T","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":0},{"id":6,"elementType":"Encabezado","value":{"text":"P1","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":7,"elementType":"A completar","value":{"text":"3","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1},{"id":8,"elementType":"Fijo","value":{"text":"4","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":1},{"id":9,"elementType":"Fijo","value":{"text":"2","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":1},{"id":10,"elementType":"Fijo","value":{"text":"9","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":1},{"id":11,"elementType":"Encabezado","value":{"text":"P2","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":12,"elementType":"Fijo","value":{"text":"6","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":2},{"id":13,"elementType":"Fijo","value":{"text":"8","audio":""},"isAnswer":true,"isSelected":false,"n":2,"m":2},{"id":14,"elementType":"Fijo","value":{"text":"1","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":2},{"id":15,"elementType":"A completar","value":{"text":"15","audio":""},"isAnswer":true,"isSelected":false,"n":4,"m":2},{"id":16,"elementType":"Encabezado","value":{"text":"T","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":3},{"id":17,"elementType":"Fijo","value":{"text":"9","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":3},{"id":18,"elementType":"Fijo","value":{"text":"12","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":3},{"id":19,"elementType":"Tapado","value":{"text":"3","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":3},{"id":20,"elementType":"Fijo","value":{"text":"24","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":3}],"setedTable":"Libre","tableWidth":120,"measures":{"width":22.68,"height":10.2}}],"advancedSettings":["Iluminación encabezado","Iluminación de ejes", "Desbloquear tapados"]}},"extraInfo":{"gameUrl":"","theme":"volcano","exerciseCase":"created"}},"format":"tdi","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"","url":"https://ml-screen-manager.firebaseapp.com"}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
        console.log(JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"tdi","type":"challenges","screenTheme":"executive-functions","exerciseCount":6,"microLessonGameInfo":{"tables":[{"statement":{"text":"Seleccionar deportes por género","audio":""},"tableName":{"text":"Tabla 1","audio":""},"entrance":"Doble entrada","columns":"5","rows":"5","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"H","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"M","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"value":{"text":"P","audio":""},"elementType":"Encabezado","n":3,"m":0,"isAnswer":false,"isSelected":false},{"id":5,"value":{"text":"T","audio":""},"elementType":"Encabezado","n":4,"m":0,"isAnswer":false,"isSelected":false},{"id":6,"elementType":"Encabezado","value":{"text":"F","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":7,"elementType":"A completar","value":{"text":"20","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1},{"id":8,"elementType":"Fijo","value":{"text":"15","audio":""},"isAnswer":true,"isSelected":false,"n":2,"m":1},{"id":9,"value":{"text":"10","audio":""},"elementType":"Fijo","n":3,"m":1,"isAnswer":false,"isSelected":false},{"id":10,"value":{"text":"45","audio":""},"elementType":"Fijo","n":4,"m":1,"isAnswer":false,"isSelected":false},{"id":11,"elementType":"Encabezado","value":{"text":"H","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":12,"elementType":"Fijo","value":{"text":"15","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":2},{"id":13,"elementType":"Fijo","value":{"text":"20","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":2},{"id":14,"value":{"text":"5","audio":""},"elementType":"Tapado","n":3,"m":2,"isAnswer":false,"isSelected":false},{"id":15,"value":{"text":"40","audio":""},"elementType":"Fijo","n":4,"m":2,"isAnswer":false,"isSelected":false},{"id":16,"value":{"text":"B","audio":""},"elementType":"Encabezado","n":0,"m":3,"isAnswer":false,"isSelected":false},{"id":17,"value":{"text":"10","audio":""},"elementType":"Fijo","n":1,"m":3,"isAnswer":false,"isSelected":false},{"id":18,"value":{"text":"10","audio":""},"elementType":"A completar","n":2,"m":3,"isAnswer":true,"isSelected":false},{"id":19,"value":{"text":"10","audio":""},"elementType":"Fijo","n":3,"m":3,"isAnswer":false,"isSelected":false},{"id":20,"value":{"text":"30","audio":""},"elementType":"Fijo","n":4,"m":3,"isAnswer":false,"isSelected":false},{"id":21,"value":{"text":"T","audio":""},"elementType":"Encabezado","n":0,"m":4,"isAnswer":false,"isSelected":false},{"id":22,"value":{"text":"45","audio":""},"elementType":"Tapado","n":1,"m":4,"isAnswer":false,"isSelected":false},{"id":23,"value":{"text":"45","audio":""},"elementType":"Fijo","n":2,"m":4,"isAnswer":false,"isSelected":false},{"id":24,"value":{"text":"25","audio":""},"elementType":"Fijo","n":3,"m":4,"isAnswer":false,"isSelected":false},{"id":25,"value":{"text":"155","audio":""},"elementType":"Fijo","n":4,"m":4,"isAnswer":false,"isSelected":false}],"setedTable":"Libre","tableWidth":120,"measures":{"width":22.68,"height":10.2}},{"statement":{"text":"Seleccionar tabla por producto","audio":""},"tableName":{"text":"Tabla 2","audio":""},"entrance":"Doble entrada","columns":"5","rows":"4","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"M1","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"M2","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"elementType":"Encabezado","value":{"text":"M3","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":0},{"id":5,"elementType":"Encabezado","value":{"text":"T","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":0},{"id":6,"elementType":"Encabezado","value":{"text":"P1","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":7,"elementType":"A completar","value":{"text":"3","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1},{"id":8,"elementType":"Fijo","value":{"text":"4","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":1},{"id":9,"elementType":"Fijo","value":{"text":"2","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":1},{"id":10,"elementType":"Fijo","value":{"text":"9","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":1},{"id":11,"elementType":"Encabezado","value":{"text":"P2","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":12,"elementType":"Fijo","value":{"text":"6","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":2},{"id":13,"elementType":"Fijo","value":{"text":"8","audio":""},"isAnswer":true,"isSelected":false,"n":2,"m":2},{"id":14,"elementType":"Fijo","value":{"text":"1","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":2},{"id":15,"elementType":"A completar","value":{"text":"15","audio":""},"isAnswer":true,"isSelected":false,"n":4,"m":2},{"id":16,"elementType":"Encabezado","value":{"text":"T","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":3},{"id":17,"elementType":"Fijo","value":{"text":"9","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":3},{"id":18,"elementType":"Fijo","value":{"text":"12","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":3},{"id":19,"elementType":"Tapado","value":{"text":"3","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":3},{"id":20,"elementType":"Fijo","value":{"text":"24","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":3}],"setedTable":"Libre","tableWidth":120,"measures":{"width":22.68,"height":10.2}}],"advancedSetings":null}},"extraInfo":{"gameUrl":"","theme":"volcano","exerciseCase":"created"}},"format":"tdi","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"","url":"https://ml-screen-manager.firebaseapp.com"}}').properties.customConfig.creatorInfo);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
    
  }

}
