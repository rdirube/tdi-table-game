import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
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
import { anyElement, CorrectablePart, duplicateWithJSON, equalArrays, ExerciseData, MultipleChoiceSchemaData, numberArrayRange, OptionShowable, OxImageInfo, PartCorrectness, PartFormat, ScreenTypeOx, Showable } from 'ox-types';
import { TdiAnswerService } from 'src/app/shared/services/tdi-answer.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { AnswerType, ElementType, ExerciseType, HintGenerator, HintType, InitState, Measurements, Table, TableElement, TableGenerator, TdiExercise, TextWithAudio } from 'src/app/shared/types/types';
import { filter, take, timer } from 'rxjs';
import { TableValueComponent } from '../table-value/table-value.component';
import { ThisReceiver } from '@angular/compiler';
import { ComposeAnimGenerator, ComposeService } from 'ox-animations';
import anime from 'animejs';



@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})


export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {


  @ViewChildren('cells') cells!: QueryList<ElementRef>;
  @ViewChildren('tableValueComponent') tableValueComponent!: QueryList<TableValueComponent>;
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  @ViewChild('statementContainer') statementContainer!: ElementRef;


  public composeEvent = new EventEmitter<{ composeInZero: boolean }>();
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
  public statement: TextWithAudio = {
    text: '',
    audio: ''
  }

  public tableName: TextWithAudio = {
    text: '',
    audio: ''
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
  public currentCorrects!: number;
  public tableTitleDivWidth!: number;
  public titleColor!: string;
  public exerciseType!: ExerciseType;
  private currentExerciseCopy!: Table;
  private answersCorrected!:number;
  private answerCurrentIndex!:number;

  constructor(private challengeService: TdiChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private soundService: SoundOxService,
    private endService: EndGameService,
    private feedbackService: FeedbackOxService,
    private answerService: TdiAnswerService,
    private composeService: ComposeService<any>) {
    super();
    this.currentExercise = {
      columns: 1,
      rows: 1,
      entrance: '',
      measures: { width: 0, height: 0 },
      exerciseType: 'Completar casilleros',
      setedTable: '',
      statement: { text: '', audio: '' },
      tableElements: [{ elementType: 'empty', id: 0, isAnswer: false, isSelected: false, m: 0, n: 0, value: { text: '', audio: '' } }],
      tableName: { text: '', audio: '' },
      tableWidth: 2
    }
    this.restart = false;
    this.composeService.setSubscriptions(this.composeEvent, false)
    this.composeService.composeTime = 650;
    this.composeService.decomposeTime = 650;
    this.answerService.isCompleteAnswer = true;
    this.answersCorrected = 0;
    this.answerCurrentIndex = 0;
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x === undefined)),
      (exercise: ExerciseOx<TdiExercise>) => {
        this.exercise = undefined as any;
      });
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<TdiExercise>) => {
        this.selectionActivate.state = true;
        const tableExerciseQuantity = this.exercise ? this.currentExercise.tableElements.filter(el => el.isAnswer).length : 1000;
        const correctAnswers = this.exercise ? this.currentExercise.tableElements.filter(el => el.elementType === 'correct').length : 0;
        const allExerciseCorrectVal = this.challengeService.exerciseConfig.tables.length - 1 === this.challengeService.tablesIndex && this.exercise ? this.allExerciseAreCorrectValidator() : false;
        if (tableExerciseQuantity <= correctAnswers && !allExerciseCorrectVal) {
          this.challengeService.tablesIndex++;
          this.selectionActivate.state = false;
          this.restart = false;
          this.composeEvent.emit();
        }
        this.avaiableHints = duplicateWithJSON(this.challengeService.exerciseConfig.advancedSettings);
        this.hintService.usesPerChallenge = this.hintsAvaiableCalculator();
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length as number > 0) {
          return;
        }
        this.nextExercise(exercise.exerciseData);
        this.titleColor = this.currentExercise.setedTable === 'Castillo de números' ? 'white' : 'black';
      });
    this.addSubscription(this.composeService.composablesObjectsOut, x => {
      this.nextExercise(this.exercise)
    })
    this.addSubscription(this.composeService.composablesAtPosition, x => {
      this.selectionActivate.state = true;
    })
    this.addSubscription(this.gameActions.showHint, x => {
      this.restoreCellsColour();
      this.allExerciseAreCorrectValidator();
      const tableArrayCurrentValue = this.tableValueComponent.toArray()
      if (this.avaiableHints.find(hint => hint === "Iluminación encabezado")) {
        this.hint.hintModel1and2(true, this.currentExercise.entrance, this.currentExercise.setedTable)
      } else if (this.avaiableHints.find(hint => hint === "Iluminación de ejes")) {
        this.hint.hintModel1and2(false, this.currentExercise.entrance, this.currentExercise.setedTable);
      } else {
        const indexToUnblock = this.hint.hintModel3(this.currentExercise.tableElements);
        tableArrayCurrentValue[indexToUnblock].unBloquedAnimation();
      }
      this.avaiableHints.shift();
    })
    this.addSubscription(this.gameActions.surrender, surr => {
      this.surrender();
    })
    this.addSubscription(this.challengeService.actionToAnswerEmit, x => {
      this.tableCorrectablePart();
    })
    this.addSubscription(this.gameActions.checkedAnswer, x => {
      const selectedCell = this.tableElements.find(el => el.isSelected);
      if(selectedCell) {
        selectedCell.isSelected = false;
      }
      const exerciseAnswers = this.currentExerciseCopy.tableElements.filter(el => el.isAnswer).map(el => el.value.text);      
      const filledCells = this.currentExercise.tableElements.filter(el => el.elementType === 'filled');
      const selectedFixedCells = this.currentExercise.tableElements.filter(el => el.elementType === 'selected-fixed')
      const exerciseTypeCondition =  this.currentExercise.exerciseType === 'Completar casilleros'
      const answerDisplayed = exerciseTypeCondition ? filledCells.map(el => el.value.text) : selectedFixedCells.map(el => el.value.text);
      const answersId = exerciseTypeCondition ? filledCells.map(el => el.id - 1) : selectedFixedCells.map(el => el.id - 1);
      this.animationToPlay(answerDisplayed, exerciseAnswers, answersId);

    })
  }


  


  private animationToPlay(answerDisplayed:string[], exerciseAnswers:string[], answersId:number[]):void {
    if(answersId.length !== 0) {
      if(exerciseAnswers.includes(answerDisplayed[this.answerCurrentIndex])) {
        this.answersCorrected++
        this.correctAnswerAnimation(this.elementCorrected(answersId[this.answerCurrentIndex], 'correct'),  answerDisplayed, exerciseAnswers, answersId);
      } else {
        this.wrongAnswerAnimation(this.elementCorrected(answersId[this.answerCurrentIndex]), answersId, answerDisplayed, exerciseAnswers)
      }
      this.answerCurrentIndex++;
    } else {
      timer(300).subscribe(x => {
        this.feedbackService.endFeedback.emit();
      })
    }
  }




  ngOnInit(): void {
  }




  ngAfterViewInit(): void {
    this.composeService.addComposable(this.tableContainer.nativeElement, ComposeAnimGenerator.fromLeft(), ComposeAnimGenerator.toRight(), false);
    this.composeService.addComposable(this.statementContainer.nativeElement, ComposeAnimGenerator.fromTop(), ComposeAnimGenerator.toTop(), false);
  }




  public tryAnswer() {
    this.answerService.tryAnswer.emit();
  }





  allExerciseAreCorrectValidator(): boolean {
    const answers: TableElement[] = [];
    this.currentExercise.tableElements.filter(el => el.isAnswer).forEach(el => answers.push(el));
    return answers.length === this.correctGetter.length;
  }





  private hintsAvaiableCalculator(): number {
    const hiddenAvaiable = this.challengeService.exerciseConfig.tables[this.challengeService.tablesIndex].tableElements.find(el => el.elementType === 'Tapado') && this.avaiableHints ? this.avaiableHints.find(hint => hint === "Desbloquear tapados") ? true : false : false;
    if (this.challengeService.exerciseConfig.advancedSettings) {
      if (hiddenAvaiable) {
        return this.challengeService.exerciseConfig.advancedSettings.length;
      } else {
        return this.challengeService.exerciseConfig.advancedSettings.filter(hints => hints !== 'Desbloquear tapados').length
      }
    } else {
      return 0
    }
  }





  private elementCorrected(index?:number, correctness?: ElementType) {
    let correctElementContainer = '' as any;
    if(index !== undefined) {
      if(correctness === 'correct') {
        this.tableElements[index].elementType = correctness;
      }
      this.tableElements[index].isSelected = false;
      correctElementContainer = this.tableComponentArray[index];
    }  
    return correctElementContainer;
  }

  



  private restoreCellsColour(): void {
    const indexOfNotCorrected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].elementType !== 'correct')
    const oldSelected = this.tableElements.map((el, i) => i).filter(i => this.tableElements[i].isSelected);
    const indexElementsToRestore = indexOfNotCorrected.concat(oldSelected);
    if (oldSelected !== undefined) {
      indexElementsToRestore.forEach(i => this.tableElements[i].isSelected = false);
    }
  }





  public playLoadedSound(sound: string) {
    this.soundService.playSoundEffect(sound, ScreenTypeOx.Game);
  }





  public tableCorrectablePart(): void {
    const answersArray = duplicateWithJSON(this.challengeService.exerciseConfig.tables[this.challengeService.tablesIndex].tableElements).filter(el => el.isAnswer);
    const selectedFixed =  this.currentExercise.tableElements.filter(el => el.elementType === 'correct').concat(this.currentExercise.tableElements.filter(el => el.elementType === 'selected-fixed'));
    const correctablePart = answersArray.map((ans, i) => {
      const correctnessToReturn = (this.currentExercise.exerciseType === 'Completar casilleros' ? this.currentExercise.tableElements[ans.id - 1].value.text : selectedFixed[i] ? selectedFixed[i].value.text : '')
      return {
        correctness: (ans.value.text === correctnessToReturn ? 'correct' : 'wrong') as PartCorrectness,
        parts: [
          {
            format: 'word-text' as PartFormat,
            value: correctnessToReturn as string
          }
        ]
      }
    })
    this.answerService.currentAnswer = {
      parts: correctablePart as CorrectablePart[]
    }
  }





  public restoreCellsColoursAndSelect(id: number) {
    this.restoreCellsColour();
    const typesAllowToSelect = (((this.tableElements[id].elementType === 'empty' || this.tableElements[id].elementType === 'filled') && this.currentExercise.exerciseType === 'Completar casilleros') || (this.tableElements[id].elementType === 'fixed' && this.currentExercise.exerciseType === 'Seleccionar casilleros') || this.currentExercise.tableElements[id].isSelected);
    if (typesAllowToSelect && this.selectionActivate.state && this.exerciseType === 'Completar casilleros') {
      this.tableElements[id].isSelected = true;
    }
  }




  public correctAnswerAnimation(element: any, answerDisplayed:string[], exerciseAnswers:string[], answersId:number[]): void {
    this.selectionActivate.state = false;
    anime({
      targets: element.elementRef.nativeElement,
      keyframes: [
        {
          filter: 'brightness(90%)',
        },
        {
          filter: 'brightness(110%)',
        },
        {
          filter: '#brightness(100%)',
        }
      ],
      duration: 900,
      easing: 'linear',
      complete: () => {  
         if(answerDisplayed.length > this.answerCurrentIndex) {
          this.animationToPlay(answerDisplayed, exerciseAnswers, answersId);
         } else {
           this.answerCurrentIndex = 0;
           this.selectionActivate.state = true;
         }  
         if(this.answersCorrected >= answerDisplayed.length) {
          this.feedbackService.endFeedback.emit();
          this.answersCorrected = 0;
         } else {
          this.selectionActivate.state = true;
         }
      }
    })
  }





  public wrongAnswerAnimation(element: any, answersId: number[],  answerDisplayed:string[], exerciseAnswers:string[]): void {
    this.selectionActivate.state = false;
    anime({
      targets: element.elementContainer.nativeElement,
      duration: 550,
      loop: 2,
      direction: 'alternate',      
      backgroundColor: '#FF2D00',
      easing: 'linear',
      complete: () => {
        this.selectionActivate.state = true;
          if (this.answerCurrentIndex < answerDisplayed.length) {
            this.animationToPlay(answerDisplayed, exerciseAnswers, answersId)
       } else {
         this.answerCurrentIndex = 0;
         this.feedbackService.endFeedback.emit();          
       }
      }
    })
  }




  //RECORDAR CAMBIAR
  private addMetric(): void {
    const myMetric: ExerciseData = {
      extraInfo: {
        isInput: this.currentExercise.exerciseType === 'Completar casilleros' ? 'Completar casilleros' : 'Seleccionar casilleros'
      },
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
    const answerId = this.currentExercise.tableElements.map(el => el.id).filter(id => this.currentExercise.tableElements[id - 1].isAnswer && this.currentExercise.tableElements[id - 1].elementType !== 'correct');
    const tableArrayCurrentValue = this.tableValueComponent.toArray();
    answerId.forEach(id => {     
    if (this.currentExercise.tableElements[id - 1].elementType === 'filled' || this.currentExercise.tableElements[id - 1].elementType === 'empty') {
      tableArrayCurrentValue[id - 1].element.value.text = this.answerArray[id - 1].answer;
    }
    tableArrayCurrentValue[id - 1].correctAnswerAnimation();
    })
    // if (this.currentExercise.tableElements[(answerId as number) - 1].elementType === 'empty') {
    //   tableArrayCurrentValue[(answerId as number) - 1].element.value.text = this.answerArray[(answerId as number) - 1].answer;
    // }
    // tableArrayCurrentValue[(answerId as number) - 1].correctAnswerAnimation();
    this.selectionActivate.state = false;
    this.restoreCellsColour();
    const fixedSelected =  this.tableElements.filter(el => el.elementType === 'selected-fixed');
    fixedSelected.forEach(el => el.elementType = 'fixed');
    this.feedbackService.surrenderEnd.emit()
      ;
  }




  private answerQuantityCalc(): TableElement[] {
    const correctAnswers: TableElement[] = [];
    this.exercise.table.forEach(table => table.tableElements.filter(el => el.elementType === 'correct').forEach(elFilt => correctAnswers.push(elFilt)));
    return correctAnswers
  }





  private nextExercise(exercise: TdiExercise) {
    this.addMetric();
    this.exercise = exercise;
    console.log(this.exercise);
    this.challengeService.tablesIndex = this.restart ? 0 : this.challengeService.tablesIndex;
    this.currentExercise = this.exercise.table[this.challengeService.tablesIndex];
    this.currentExerciseCopy = duplicateWithJSON(this.currentExercise)
    this.answerService.isCompleteAnswer = this.currentExercise.exerciseType === 'Completar casilleros' ? true : false;
    this.newExercise = false;
    this.exerciseType = this.currentExercise.exerciseType;
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
    this.currentExercise.tableElements.forEach(el => this.init.push({
      init: false
    }))
    this.hint = new HintGenerator(this.currentExercise.tableElements);
    this.restart = true;
    this.tableTitleDivWidth = this.currentExercise.measures.width * this.currentExercise.columns + (this.pxToVHVar * 2 * this.currentExercise.columns);
  }





  get correctGetter(): TableElement[] {
    return this.answerQuantityCalc();
  }


  get tableComponentArray(): any[] {
      return this.tableValueComponentArr = this.tableValueComponent.toArray();
  }






}




