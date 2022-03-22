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
  changeToCorrect = new EventEmitter<number[]>();

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
        this.exerciseConfig = JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"tdi","type":"challenges","screenTheme":"executive-functions","exerciseCount":5,"microLessonGameInfo":{"tables":[{"statement":{"text":"Me llamo Rodrigo","audio":""},"tableName":{"text":"TABLA 1","audio":""},"entrance":"Doble entrada","columns":"3","rows":"3","tableElements":[{"id":1,"value":{"text":"","audio":""},"elementType":"blocked","n":0,"m":0,"isAnswer":false,"isSelected":false},{"id":2,"value":{"text":"g","audio":""},"elementType":"Encabezado","n":1,"m":0,"isAnswer":false,"isSelected":false},{"id":3,"value":{"text":"f","audio":""},"elementType":"Encabezado","n":2,"m":0,"isAnswer":false,"isSelected":false},{"id":4,"value":{"text":"t","audio":""},"elementType":"Encabezado","n":0,"m":1,"isAnswer":false,"isSelected":false},{"id":5,"value":{"text":"20","audio":""},"elementType":"Fijo","n":1,"m":1,"isAnswer":false,"isSelected":false},{"id":6,"value":{"text":"10","audio":""},"elementType":"Fijo","n":2,"m":1,"isAnswer":false,"isSelected":false},{"id":7,"value":{"text":"u","audio":""},"elementType":"Encabezado","n":0,"m":2,"isAnswer":false,"isSelected":false},{"id":8,"value":{"text":"5","audio":""},"elementType":"Fijo","n":1,"m":2,"isAnswer":true,"isSelected":false},{"id":9,"value":{"text":"1","audio":""},"elementType":"Fijo","n":2,"m":2,"isAnswer":false,"isSelected":false}],"setedTable":"Libre","tableWidth":80,"measures":{"width":25.2,"height":10.2}},{"statement":{"text":"","audio":""},"tableName":{"text":"","audio":""},"entrance":"Doble entrada","columns":"2","rows":"2","tableElements":[{"id":1,"value":{"text":"","audio":""},"elementType":"blocked","n":0,"m":0,"isAnswer":false,"isSelected":false},{"id":2,"value":{"text":"t","audio":""},"elementType":"Encabezado","n":1,"m":0,"isAnswer":false,"isSelected":false},{"id":3,"value":{"text":"i","audio":""},"elementType":"Encabezado","n":0,"m":1,"isAnswer":false,"isSelected":false},{"id":4,"value":{"text":"r","audio":""},"elementType":"Fijo","n":1,"m":1,"isAnswer":true,"isSelected":false}],"setedTable":"Libre","tableWidth":50,"measures":{"width":22.68,"height":10.2}},{"statement":{"text":"","audio":""},"tableName":{"text":"","audio":""},"entrance":"Doble entrada","columns":"2","rows":"2","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"t","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"i","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":4,"elementType":"Fijo","value":{"text":"r","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1}],"setedTable":"Libre","tableWidth":50,"measures":{"width":22.68,"height":10.2}},{"statement":{"text":"","audio":""},"tableName":{"text":"","audio":""},"entrance":"Doble entrada","columns":"2","rows":"2","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"t","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"i","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":4,"elementType":"Fijo","value":{"text":"y","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1}],"setedTable":"Libre","tableWidth":50,"measures":{"width":22.68,"height":10.2}},{"statement":{"text":"","audio":""},"tableName":{"text":"","audio":""},"entrance":"Doble entrada","columns":"2","rows":"2","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"t","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"i","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":4,"elementType":"Fijo","value":{"text":"u","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":1}],"setedTable":"Libre","tableWidth":50,"measures":{"width":22.68,"height":10.2}}],"advancedSettings":["Iluminación encabezado","Iluminación de ejes","Desbloquear tapados"]}},"extraInfo":{"gameUrl":"","theme":"volcano","exerciseCase":"created"}},"format":"tdi","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"","url":"https://ml-screen-manager.firebaseapp.com"}}').properties.customConfig.creatorInfo?.microLessonGameInfo;
        this.exerciseConfig.tables[2] = duplicateWithJSON(this.exerciseConfig.tables[0]) 
        this.exerciseConfig.tables = [this.exerciseConfig.tables[0], this.exerciseConfig.tables[1]]
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
    
  }

}
