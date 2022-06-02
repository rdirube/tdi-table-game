import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { AnswerType, ExerciseType, InitState, TableElement, TdiExercise } from 'src/app/shared/types/types';
import { TdiChallengeService } from 'src/app/shared/services/tdi-challenge.service';
import { TdiAnswerService } from 'src/app/shared/services/tdi-answer.service';
import { GameActionsService, HintService, SoundOxService } from 'micro-lesson-core';
import { CorrectablePart, isEven, PartCorrectness, PartFormat, ScreenTypeOx } from 'ox-types';
import { SubscriberOxDirective } from 'micro-lesson-components';
import anime from 'animejs'
import { FeedbackOxService } from 'micro-lesson-core';
import { ComposeElement, ComposeService } from 'ox-animations';


@Component({
  selector: 'app-table-value',
  templateUrl: './table-value.component.html',
  styleUrls: ['./table-value.component.scss']
})

export class TableValueComponent extends SubscriberOxDirective implements OnInit, AfterViewInit, AfterViewChecked {


  @ViewChild('wordInput') wordInput !: ElementRef;
  @ViewChild('wordOxText') wordOxText !: ElementRef;
  @ViewChild('elementContainer') elementContainer !: ElementRef;
  @ViewChild('blockedDiv') blockedDiv !: ElementRef;

  @Output() restoreCellsColours  = new EventEmitter<number>();
  @Output() initEmitter = new EventEmitter();
  @Input() element!: TableElement;
  @Input() duplicatedElement!:TableElement;
  @Input() columns!: number;
  @Input() rows!: number;
  @Input() tableWidth!: number;
  @Input() variableHeight!: number;
  @Input() variableWidth!:number; 
  @Input() init!:InitState;
  @Input() answer!:AnswerType;
  @Input() exerciseType!:ExerciseType;

  @Input() selectionActivate!:{
    state:boolean
  };
  @Input() newExercise!:boolean;
  private selectedFixed!:boolean;

  constructor(public elementRef: ElementRef, public challengeService:TdiChallengeService,
    private hintService: HintService,
    private gameActions: GameActionsService<any>,
    public answerService: TdiAnswerService,
    private feedbackService: FeedbackOxService,
    private soundService: SoundOxService,
    private composeService: ComposeService<TdiExercise>) {
      super()
      this.selectedFixed = false;
  }




  ngOnInit(): void {
    this.parsedTypes(this.element.elementType, this.element);
    this.setAnswer();
    this.element.isSelected = false;

  }





  ngAfterViewInit(): void {
  }




  ngAfterViewChecked(): void {
  }





 private setAnswer(): void {
  if(this.element.isAnswer) {
    this.answer.answer = this.element.value.text;
  }
  if(this.element.elementType === 'empty') {
    this.answer.empty = true;
    this.element.value.text = '';
  }
 }





  public focusCell(): void {
    const cellsNotAvaiable = this.element.elementType === 'hidden' || this.element.elementType === 'property';
    if(this.selectionActivate.state && !cellsNotAvaiable) {
      if(this.element.elementType === 'empty' || this.element.elementType === 'filled') {
        if(this.element.elementType === 'filled') {
          this.element.elementType = 'empty';
        }
        this.wordInput.nativeElement.focus();
        this.element.value.text = '';
      } 
      if(this.element.elementType === 'selected-fixed') {
        this.element.elementType = 'fixed';
        this.element.isSelected = false; 
        this.challengeService.actionToAnswerEmit.emit() 
      }
     else if(this.element.elementType === 'fixed' && this.exerciseType === 'Seleccionar casilleros') {
       this.element.elementType = 'selected-fixed';
       this.challengeService.actionToAnswerEmit.emit() 
      }  
      this.restoreCellsColours.emit(this.element.id - 1);
      this.soundService.playSoundEffect('tdi/local-sounds/selectedInput.mp3', ScreenTypeOx.Game)
      this.hintService.checkHintAvailable();
    } else {
      this.soundService.playSoundEffect('sounds/cantClick.mp3', ScreenTypeOx.Game);
    }
  }






  public parsedTypes(type: string, element: TableElement):void {
    switch (type) {
      case 'Fijo':
        element.elementType = 'fixed';
        break;
      case 'A completar':
        element.elementType = 'empty';
        break;
      case 'Tapado':
        element.elementType = 'hidden';
        break;
      case 'Encabezado':
        element.elementType = 'property';
    }
  }



  
 public correctableEmitter():void {
  this.element.elementType = 'filled';
  this.challengeService.actionToAnswerEmit.emit() 
 }




 public correctAnswerAnimation():void {
    this.element.elementType = 'correct';
    this.element.isSelected = false;
    this.selectionActivate.state = false;
    anime({
      targets: this.elementContainer.nativeElement,
      keyframes:[
        {
          filter: 'brightness(90%)',
        },
      {
        filter:  'brightness(110%)',
      },
      {
        filter: '#brightness(100%)',
      }
      ],
      duration: 1200,
      easing: 'linear',
    })
  }




public playLoadedSound(sound: string) {
  this.soundService.playSoundEffect(sound, ScreenTypeOx.Game);
}




public unBloquedAnimation():void {
  anime({
    targets: this.blockedDiv.nativeElement,
    duration: 550,
    opacity: [1,0] ,
    easing: 'linear',
    complete: () => {
      this.element.elementType = 'fixed'
    }      
})
}



}


