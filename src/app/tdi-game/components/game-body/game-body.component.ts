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
import { AnswerType, HintGenerator, HintType, InitState, Measurements, Table, TableElement, TableGenerator, TdiExercise, TextWithAudio } from 'src/app/shared/types/types';
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
  public statement:TextWithAudio = {
    text:'',
    audio:''
  }
  
  public tableName:TextWithAudio = {
    text:'',
    audio:''
  }

  public pxToVHVar = 100 / window.innerHeight;
  public answerArray: AnswerType[] = [];
  public selectionActivate: {
    state: boolean
  } = {
      state: true
    }
  public tableExerciseQuantity!: number;
  public newExercise!: boolean;
  public currentExercise!: Table;
  private avaiableHints!: HintType[];
  private restart!: boolean;
  

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
    this.restart = false;
 

    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<TdiExercise>) => {
        this.selectionActivate.state = true;
        const tableExerciseQuantity = this.exercise ? this.currentExercise.tableElements.filter(el => el.isAnswer).length : 1000;
        const correctAnswers = this.exercise ? this.currentExercise.tableElements.filter(el => el.elementType === 'correct').length : 0;
        const allExerciseCorrectVal = this.challengeService.exerciseConfig.tables.length - 1 === this.challengeService.tablesIndex && this.exercise ? this.allExerciseAreCorrectValidator() : false;
        this.hintService.usesPerChallenge = this.challengeService.exerciseConfig.advancedSettings ? this.challengeService.exerciseConfig.advancedSettings.length : 0;
        this.avaiableHints = duplicateWithJSON(this.challengeService.exerciseConfig.advancedSettings);
        if (tableExerciseQuantity <= correctAnswers && !allExerciseCorrectVal) {
          this.challengeService.tablesIndex++;
          this.newExercise = true;
          this.selectionActivate.state = false;
          this.restart = false;
          this.soundService.playSoundEffect('sounds/woosh.mp3', ScreenTypeOx.Game)
        }
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length as number > 0 && !this.newExercise) {
          return;
        }
        this.addMetric();
        this.exercise = exercise.exerciseData;
        // this.allExecirseCorrect = this.exercise.table.map(table => table.tableElements.filter(el => el.elementType === 'correct')) === this.
        this.challengeService.tablesIndex = this.restart ? 0 : this.challengeService.tablesIndex;
        this.currentExercise = this.exercise.table[this.challengeService.tablesIndex];
        this.newExercise = false;
        this.answerArray = [];
        this.currentExercise.tableElements.forEach((el, i) => this.answerArray.push({
          id: i + 1,
          answer: '',
          empty: false,
        }))
        this.selectionActivate.state = true;
        this.tableClass.sizeCalculator(this.currentExercise.rows, this.currentExercise.columns, this.currentExercise.measures.width, this.currentExercise.measures.height, this.currentExercise.tableWidth);
        this.tableWidth = this.currentExercise.tableWidth;
        this.tableElements = this.currentExercise.tableElements;
        this.statement = {
          text: this.currentExercise.statement.text,
          audio: this.currentExercise.statement.audio
        } 
        this.tableName = {
          text: this.currentExercise.tableName.text,
          audio: this.currentExercise.tableName.audio
        }
        this.hintService.usesPerChallenge = this.challengeService.exerciseConfig.advancedSettings ? this.challengeService.exerciseConfig.advancedSettings.length : 0;
        this.currentExercise.tableElements.forEach(el => this.init.push({
          init: false
        }))
        this.hint = new HintGenerator(this.currentExercise.tableElements);
        this.restart = true;
      });

    this.addSubscription(this.gameActions.showHint, x => {
      this.restoreCellsColour();
      this.allExerciseAreCorrectValidator();
      const tableArrayCurrentValue = this.tableValueComponent.toArray()
      if (this.avaiableHints.find(hint => hint === 'Iluminación encabezado')) {
        this.hint.hintModel1and2(true, this.currentExercise.entrance, this.currentExercise.setedTable);
      } else if (this.avaiableHints.find(hint => hint === 'Iluminación de ejes')) {
        this.hint.hintModel1and2(false, this.currentExercise.entrance, this.currentExercise.setedTable);
      } else if (this.avaiableHints.find(hint => hint === 'Desbloquear tapados') && this.currentExercise.tableElements.find(el => el.elementType === 'hidden')) {
        const indexToUnblock = this.hint.hintModel3(this.currentExercise.tableElements);
        tableArrayCurrentValue[indexToUnblock].unBloquedAnimation();
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


  public playLoadedSound(sound: string) {
    this.soundService.playSoundEffect(sound, ScreenTypeOx.Game);
  }

  allExerciseAreCorrectValidator(): boolean {
    const answers: TableElement[] = [];
    this.currentExercise.tableElements.filter(el => el.isAnswer).forEach(el => answers.push(el)); 
    return answers.length === this.correctGetter.length;
  }



  private restoreCellsColour(): void {
    const indexOfNotCorrected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].elementType !== 'correct')
    const oldSelected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].isSelected);
    const indexElementsToRestore = indexOfNotCorrected.concat(oldSelected);
    if (oldSelected !== undefined) {
      indexElementsToRestore.forEach(i => this.tableElements[i].isSelected = false);
    }
  }




  public restoreCellsColoursAndSelect(id: number) {
    this.restoreCellsColour();
    const typesAllowToSelect = this.tableElements[id].elementType === 'empty' || this.tableElements[id].elementType === 'fixed';
    if (typesAllowToSelect && this.selectionActivate.state) {
      this.tableElements[id].isSelected = true;
    }
      this.challengeService.changeToCorrect.emit();

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
    console.log(this.tableValueComponent);
    const answerId = this.currentExercise.tableElements.map(el => el.id).find(id => this.currentExercise.tableElements[id - 1].isAnswer && this.currentExercise.tableElements[id - 1].elementType !== 'correct');
    const tableArrayCurrentValue = this.tableValueComponent.toArray()
    if (this.currentExercise.tableElements[(answerId as number) - 1].elementType === 'empty') {
      tableArrayCurrentValue[(answerId as number) - 1].element.value.text = this.answerArray[(answerId as number) - 1].answer;
    }
    tableArrayCurrentValue[(answerId as number) - 1].correctAnswerAnimation();
    this.selectionActivate.state = false;
    this.restoreCellsColour();
    this.feedbackService.surrenderEnd.emit()
      ;
  }




  private answerQuantityCalc(): TableElement[] {
    const correctAnswers: TableElement[] = [];
    this.exercise.table.forEach(table => table.tableElements.filter(el => el.elementType === 'correct').forEach(elFilt => correctAnswers.push(elFilt)));
    return correctAnswers
  }




  get correctGetter(): TableElement[] {
    return this.answerQuantityCalc();
  }




}


