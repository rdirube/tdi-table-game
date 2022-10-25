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
  actionToAnswerEmit = new EventEmitter();

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
        this.exerciseConfig =  JSON.parse('{"supportedLanguages":{"es":true,"en":false},"isPublic":false,"ownerUid":"oQPbggIFzLcEHuDjp5ZNbkkVOlZ2","uid":"dUKr5JJrsVDOD47oscop","inheritedPedagogicalObjectives":[],"customTextTranslations":{"es":{"name":{"text":""},"description":{"text":""},"previewData":{"path":""}}},"backupReferences":"","type":"mini-lesson","libraryItemType":"resource","tagIds":{},"properties":{"customConfig":{"customMedia":[],"creatorInfo":{"metricsType":"results","creatorType":"tdi","type":"challenges","screenTheme":"executive-functions","exerciseCount":2,"microLessonGameInfo":{"tables":[{"statement":{"text":"Ver que onda esto, ojo con los marcianos que son picanchis.","audio":""},"tableName":{"text":"Pepito","audio":""},"entrance":"Doble entrada","columns":"5","rows":"5","tableElements":[{"id":1,"elementType":"blocked","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"Boca","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"River","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"value":{"text":"Racing","audio":""},"elementType":"Encabezado","n":3,"m":0,"isAnswer":false,"isSelected":false},{"id":5,"value":{"text":"Total","audio":""},"elementType":"Encabezado","n":4,"m":0,"isAnswer":false,"isSelected":false},{"id":6,"elementType":"Encabezado","value":{"text":"Varones","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":7,"elementType":"Fijo","value":{"text":"50","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":1},{"id":8,"elementType":"Fijo","value":{"text":"42","audio":""},"isAnswer":true,"isSelected":false,"n":2,"m":1},{"id":9,"value":{"text":"15","audio":""},"elementType":"Tapado","n":3,"m":1,"isAnswer":false,"isSelected":false},{"id":10,"value":{"text":"107","audio":""},"elementType":"Fijo","n":4,"m":1,"isAnswer":false,"isSelected":false},{"id":11,"elementType":"Encabezado","value":{"text":"Mujeres","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":12,"elementType":"A completar","value":{"text":"48","audio":""},"isAnswer":true,"isSelected":false,"n":1,"m":2},{"id":13,"elementType":"Fijo","value":{"text":"40","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":2},{"id":14,"value":{"text":"12","audio":""},"elementType":"Fijo","n":3,"m":2,"isAnswer":false,"isSelected":false},{"id":15,"value":{"text":"100","audio":""},"elementType":"A completar","n":4,"m":2,"isAnswer":true,"isSelected":false},{"id":16,"value":{"text":"Marcianos","audio":""},"elementType":"Encabezado","n":0,"m":3,"isAnswer":false,"isSelected":false},{"id":17,"value":{"text":"28","audio":""},"elementType":"Fijo","n":1,"m":3,"isAnswer":false,"isSelected":false},{"id":18,"value":{"text":"22","audio":""},"elementType":"Fijo","n":2,"m":3,"isAnswer":false,"isSelected":false},{"id":19,"value":{"text":"5","audio":""},"elementType":"Fijo","n":3,"m":3,"isAnswer":true,"isSelected":false},{"id":20,"value":{"text":"55","audio":""},"elementType":"Fijo","n":4,"m":3,"isAnswer":false,"isSelected":false},{"id":21,"value":{"text":"Total","audio":""},"elementType":"Encabezado","n":0,"m":4,"isAnswer":false,"isSelected":false},{"id":22,"value":{"text":"126","audio":""},"elementType":"A completar","n":1,"m":4,"isAnswer":true,"isSelected":false},{"id":23,"value":{"text":"104","audio":""},"elementType":"Tapado","n":2,"m":4,"isAnswer":false,"isSelected":false},{"id":24,"value":{"text":"32","audio":""},"elementType":"Fijo","n":3,"m":4,"isAnswer":true,"isSelected":false},{"id":25,"value":{"text":"524","audio":""},"elementType":"A completar","n":4,"m":4,"isAnswer":true,"isSelected":false}],"setedTable":"Libre","tableWidth":130,"measures":{"width":25.515,"height":12.75}},{"statement":{"text":"hola","audio":""},"tableName":{"text":"pedrito","audio":""},"entrance":"Doble entrada","columns":"8","rows":"8","tableElements":[{"id":1,"elementType":"Bloqueado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":0},{"id":2,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":0},{"id":3,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":0},{"id":4,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":0},{"id":5,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":0},{"id":6,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":0},{"id":7,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":0},{"id":8,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":0},{"id":9,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":1},{"id":10,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":1},{"id":11,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":1},{"id":12,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":1},{"id":13,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":1},{"id":14,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":1},{"id":15,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":1},{"id":16,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":1},{"id":17,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":2},{"id":18,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":2},{"id":19,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":2},{"id":20,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":2},{"id":21,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":2},{"id":22,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":2},{"id":23,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":2},{"id":24,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":2},{"id":25,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":3},{"id":26,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":3},{"id":27,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":3},{"id":28,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":3},{"id":29,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":3},{"id":30,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":3},{"id":31,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":3},{"id":32,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":3},{"id":33,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":4},{"id":34,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":4},{"id":35,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":4},{"id":36,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":4},{"id":37,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":4},{"id":38,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":4},{"id":39,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":4},{"id":40,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":4},{"id":41,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":5},{"id":42,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":5},{"id":43,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":5},{"id":44,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":5},{"id":45,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":5},{"id":46,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":5},{"id":47,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":5},{"id":48,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":5},{"id":49,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":6},{"id":50,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":6},{"id":51,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":6},{"id":52,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":6},{"id":53,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":6},{"id":54,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":6},{"id":55,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":6},{"id":56,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":6},{"id":57,"elementType":"Encabezado","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":0,"m":7},{"id":58,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":1,"m":7},{"id":59,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":2,"m":7},{"id":60,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":3,"m":7},{"id":61,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":4,"m":7},{"id":62,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":5,"m":7},{"id":63,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":6,"m":7},{"id":64,"elementType":"Fijo","value":{"text":"","audio":""},"isAnswer":false,"isSelected":false,"n":7,"m":7}],"setedTable":"Libre","tableWidth":90,"measures":{"width":35,"height":15}}]}},"extraInfo":{"gameUrl":"https://tdi.web.app/","theme":"volcano","exerciseCase":"created","language":"ESP"}},"format":"tdi","miniLessonVersion":"with-custom-config-v2","miniLessonUid":"","url":"https://ml-screen-manager.firebaseapp.com"}}').properties.customConfig.creatorInfo?.microLessonGameInfo;;
        console.log(this.exerciseConfig);
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }  
  }

}
