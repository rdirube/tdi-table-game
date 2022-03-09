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
import { HintGenerator, InitState, Measurements, TableElement, TableGenerator, TdiExercise } from 'src/app/shared/types/types';
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
        console.log(this.exercise.table);
        this.hint = new HintGenerator(this.exercise.table.tableElements)
        this.tableClass.sizeCalculator(this.exercise.table.rows, this.exercise.table.columns, this.exercise.table.measures.width, this.exercise.table.measures.height, this.exercise.table.tableWidth);
        this.tableWidth = this.exercise.table.tableWidth;
        this.tableElements = this.exercise.table.tableElements;
        this.statement = this.exercise.table.statement.text;
        this.challengeService.exerciseIndex++;
        this.exercise.table.tableElements.forEach(el => this.init.push({
          init: false
        }))

      });
    this.hintService.usesPerChallenge = 3;
    this.addSubscription(this.gameActions.showHint, x => {
      if (this.hintService.currentUses === 1) {
        this.hint.hintModel1(this.exercise.table.setedTable, this.exercise.table.entrance);
      } else if (this.hintService.currentUses === 2) {
        const indexToUnblock = this.hint.hintModel2(this.exercise.table.tableElements);
        this.tableValueComponentArray[indexToUnblock].unBloquedAnimation();
      } else {
        this.hint.hintModel3();
      }
    })
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
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
      z => {
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
  }





  get tableValueComponentArray(): TableValueComponent[] {
    return this.tableValueComponentArr ? this.tableValueComponentArr :
      this.tableValueComponentArr = this.tableValueComponent.toArray();
  }




}


