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
import { AnswerType, HintGenerator, HintType, InitState, Measurements, Table, TableElement, TableGenerator, TdiExercise } from 'src/app/shared/types/types';
import { filter, take, timer } from 'rxjs';
import { TableValueComponent } from '../table-value/table-value.component';
import { ThisReceiver } from '@angular/compiler';

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
  public pxToVHVar = 100 / window.innerHeight;
  private emptyElements: TableElement[] = [];
  public answerArray: AnswerType[] = [];
  public selectionActivate: {
    state: boolean
  } = {
      state: true
    }
  public tableExerciseQuantity!: number;
  public newExercise!: boolean;
  public currentExercise!: Table;
  private avaiableHints!:HintType[];

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
    this.newExercise = true;
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<TdiExercise>) => {
        this.selectionActivate.state = true;
        const tableExerciseQuantity = this.exercise ? this.currentExercise.tableElements.filter(el => el.isAnswer).length : 1000;
        const correctAnswers = this.exercise ? this.currentExercise.tableElements.filter(el => el.elementType === 'correct').length : 0;
        this.hintService.usesPerChallenge = this.challengeService.exerciseConfig.advancedSettings ? this.challengeService.exerciseConfig.advancedSettings.length : 0;
        this.avaiableHints = duplicateWithJSON(this.challengeService.exerciseConfig.advancedSettings) ;
        if (tableExerciseQuantity <= correctAnswers) {
          this.challengeService.tablesIndex++;
          this.newExercise = true;
          this.selectionActivate.state = false;
        }
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length as number > 0 && !this.newExercise) {
          return;
        }
        this.addMetric();
        this.exercise = exercise.exerciseData;
        this.currentExercise = this.exercise.table[this.challengeService.tablesIndex];
        console.log(this.currentExercise);
        this.newExercise = false;
        this.currentExercise.tableElements.forEach((el, i) => this.answerArray.push({
          id: i + 1,
          answer: '',
          empty: false,
        }))
        this.selectionActivate.state = true;
        this.tableClass.sizeCalculator(this.currentExercise.rows, this.currentExercise.columns, this.currentExercise.measures.width, this.currentExercise.measures.height, this.currentExercise.tableWidth);
        this.tableWidth = this.currentExercise.tableWidth;
        this.tableElements = this.currentExercise.tableElements;
        this.statement = this.currentExercise.statement.text;
        this.hintService.usesPerChallenge = this.challengeService.exerciseConfig.advancedSettings ? this.challengeService.exerciseConfig.advancedSettings.length : 0;
        this.currentExercise.tableElements.forEach(el => this.init.push({
          init: false
        }))
        this.hint = new HintGenerator(this.currentExercise.tableElements);
      });

    this.addSubscription(this.gameActions.showHint, x => {
      this.restoreCellsColour();
      if (this.avaiableHints.find(hint => hint === 'Iluminación encabezado')) {
        this.hint.hintModel1and2(true, this.currentExercise.entrance, this.currentExercise.setedTable);
      } else if (this.avaiableHints.find(hint => hint === 'Iluminación de ejes')) {
        this.hint.hintModel1and2(false, this.currentExercise.entrance, this.currentExercise.setedTable);
      } else if (this.avaiableHints.find(hint => hint === 'Desbloquear tapados') && this.currentExercise.tableElements.find(el => el.elementType === 'hidden')) {
        const indexToUnblock = this.hint.hintModel3(this.currentExercise.tableElements);
        this.tableValueComponentArray[indexToUnblock].unBloquedAnimation();
      }
      this.avaiableHints.shift();
    })
    this.addSubscription(this.gameActions.surrender, surr => {
      this.surrender();
    })
  }





  ngOnInit(): void {
  }




  ngAfterViewInit(): void {
  }



  public tryAnswer() {
    this.answerService.tryAnswer.emit();
  }




  public restoreCellsColoursAndSelect(id: number) {
    this.restoreCellsColour();
    const typesAllowToSelect = this.tableElements[id].elementType === 'empty' || this.tableElements[id].elementType === 'fixed';
    if (typesAllowToSelect && this.selectionActivate.state) {
      this.tableElements[id].isSelected = true;
      console.log(this.tableElements[id].isSelected)

    }
  }




  private restoreCellsColour(): void {
    const indexOfNotCorrected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].elementType !== 'correct')
    const oldSelected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].isSelected && this.tableElements[i].elementType !== 'correct');
    const indexElementsToRestore = indexOfNotCorrected.concat(oldSelected);
    if (oldSelected !== undefined) {
      indexElementsToRestore.forEach(i => this.tableElements[i].isSelected = false);
    }
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
        console.log(this.answerArray.filter(ans => ans.answer !== '').length)
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
  }



  private surrender(): void {
    const answersId = this.currentExercise.tableElements.filter(el => el.isAnswer).map(el => el.id);
    answersId.forEach(id => this.tableValueComponentArray[id - 1].correctAnswerAnimation());
    const answerArrayEmpty = this.answerArray.filter(ans => ans.answer !== '' && ans.empty);
    answerArrayEmpty.forEach(ans => this.tableValueComponentArray[ans.id - 1].element.value.text = ans.answer)
    this.selectionActivate.state = false;
    this.restoreCellsColour();
    this.feedbackService.surrenderEnd.emit();
  }




  get tableValueComponentArray(): TableValueComponent[] {
    return this.tableValueComponentArr ? this.tableValueComponentArr :
      this.tableValueComponentArr = this.tableValueComponent.toArray();
  }




}


