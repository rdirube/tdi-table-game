import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ViewChild, ElementRef } from '@angular/core';
import {
  EndGameService,
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import { TdiChallengeService } from 'src/app/shared/services/tdi-challenge.service';
import { ExerciseOx } from 'ox-core';
import { anyElement, duplicateWithJSON, ExerciseData, MultipleChoiceSchemaData, numberArrayRange, OptionShowable, OxImageInfo, ScreenTypeOx, Showable } from 'ox-types';
import { TdiAnswerService } from 'src/app/shared/services/tdi-answer.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { AnswerType, HintGenerator, InitState, Measurements, TableElement, TableGenerator, TdiExercise } from 'src/app/shared/types/types';
import { filter, take, timer } from 'rxjs';
import { TableValueComponent } from '../table-value/table-value.component';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChildren('cells') cells!: QueryList<ElementRef>;
  @ViewChildren('tableValueComponent') tableValueComponent!: QueryList<TableValueComponent>;

  public tableWidth: number = 0;
  public cellsArray!: any;
  public tableValueComponentArr!: any[];
  public duplicatedTable!: TableElement[];
  public measures: Measurements = {
    width: 35,
    height: 15
  }
  public exercise!: TdiExercise;
  public tableClass = new TableGenerator();
  public tableElements: TableElement[] = [];
  public init: InitState[] = [];
  public hint!: any;
  public statement: string = '';
  public pxToVHVar = 100/window.innerHeight;
  private emptyElements: TableElement[] = [];
  public answerArray:AnswerType[] = [];


  constructor(private challengeService: TdiChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private soundService: SoundOxService,
    private endService: EndGameService,
    private feedbackService: FeedbackOxService,
    private answerService: TdiAnswerService,
  ) {
    super();
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<TdiExercise>) => {
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length as number > 0) {
          return;
        }
        this.addMetric();
        this.exercise = exercise.exerciseData;
        console.log(this.exercise);
        this.exercise.table.tableElements.forEach(el => this.answerArray.push({
          answer:'',
          empty:false,
        }))
        this.hint = new HintGenerator(this.exercise.table.tableElements);
        this.tableClass.sizeCalculator(this.exercise.table.rows, this.exercise.table.columns, this.exercise.table.measures.width, this.exercise.table.measures.height, this.exercise.table.tableWidth);
        this.tableWidth = this.exercise.table.tableWidth;
        this.tableElements = this.exercise.table.tableElements;
        this.statement = this.exercise.table.statement.text;
        this.exercise.table.tableElements.forEach(el => this.init.push({
          init: false
        }))
        this.hintService.usesPerChallenge = this.challengeService.exerciseConfig.advancedSettings.length;

      });
    this.addSubscription(this.gameActions.showHint, x => {
      const avaiableHints = this.challengeService.exerciseConfig.advancedSettings;
      if(avaiableHints.find(hint => hint === 'Iluminación encabezado')) {
        this.hint.hintModel1and2(true , this.exercise.table.entrance, this.exercise.table.setedTable);
      } else if(avaiableHints.find(hint => hint === 'Iluminación de ejes')) {
        this.hint.hintModel1and2(false , this.exercise.table.entrance, this.exercise.table.setedTable);
      } else if(avaiableHints.find(hint => hint === 'Desbloquear tapados') && this.exercise.table.tableElements.find(el => el.elementType === 'hidden')) {
         const indexToUnblock = this.hint.hintModel3(this.exercise.table.tableElements);
         this.tableValueComponentArray[indexToUnblock].unBloquedAnimation();
      }
      avaiableHints.shift();
    })

    this.addSubscription(this.gameActions.surrender, surr => {
      this.surrender();
    })
    // this.addSubscription(this.feedbackService.endFeedback, params => {
    //   if (this.answerService.currentAnswer.parts.every(part => part.correctness === 'correct')) {
    //     console.log('Sending show next challange')
    //     timer(100).subscribe(z => {
    //       if (!endService.gameIsEnded())
    //         this.gameActions.showNextChallenge.emit();
    //     });
    //   }
    // });
  }





  ngOnInit(): void {
  }

  


  ngAfterViewInit(): void {
  }
 


  public tryAnswer() {
    this.answerService.tryAnswer.emit();
  }




  public restoreCellsColours(id: number) {
    const indexOfNotCorrected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].elementType !== 'correct')
    const oldSelected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].isSelected && this.tableElements[i].elementType !== 'correct');
    const indexElementsToRestore = indexOfNotCorrected.concat(oldSelected);
    if (oldSelected !== undefined) {
      indexElementsToRestore.forEach(i => this.tableElements[i].isSelected = false);
    }
    if (this.tableElements[id].id < this.exercise.table.columns && this.tableElements[id].elementType === 'property') {
      const multipliersOfProperties = numberArrayRange(0, this.exercise.table.columns).map(x => (x * this.exercise.table.columns) + id)
      const verticalProperties = this.tableElements.filter((prop, i) => multipliersOfProperties.includes(i));
      verticalProperties.forEach(prop => prop.isSelected = true);
    } else if (this.tableElements[id].elementType === 'property') {
      for (let i = id; i < id + 10; i++) {
        this.tableElements[i].isSelected = true;
      }
    }
    this.tableElements[id].isSelected = true;
  }




  //RECORDAR CAMBIAR
  private addMetric(): void {
    const myMetric: ExerciseData = {
      schemaType: 'multiple-choice',
      schemaData: {

      } as MultipleChoiceSchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answer',
      maxHints: 1,
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: undefined as any,
      firstInteractionTime: undefined as any
    };
    this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
      myMetric.firstInteractionTime = new Date();
    });
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(this.answerArray.filter(ans => ans.answer !== '').length)),
      z => {
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
  }


  private surrender():void {
   const answersId = this.exercise.table.tableElements.filter(el => el.isAnswer).map(el => el.id);
   answersId.forEach(id => this.tableValueComponentArray[id - 1].correctAnswerAnimation());
   const answerArrayEmpty = this.answerArray.filter(ans => ans.answer !== '' && ans.empty);
   const emptyElements = this.tableElements.filter(el => el.elementType === "empty");
   emptyElements.forEach((el,i) => el.value.text = answerArrayEmpty[i].answer);
   this.feedbackService.surrenderEnd.emit()
  }




  get tableValueComponentArray(): TableValueComponent[] {
    return this.tableValueComponentArr ? this.tableValueComponentArr :
      this.tableValueComponentArr = this.tableValueComponent.toArray();
  }




}


