import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { AnswerType, InitState, TableElement, TdiExercise } from 'src/app/shared/types/types';
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
  @Input() selectionActivate!:{
    state:boolean
  };
  @Input() newExercise!:boolean;
  

  constructor(public elementRef: ElementRef, public challengeService:TdiChallengeService,
    private hintService: HintService,
    private gameActions: GameActionsService<any>,
    public answerService: TdiAnswerService,
    private feedbackService: FeedbackOxService,
    private soundService: SoundOxService,
    private composeService: ComposeService<TdiExercise>) {
      super()
      this.addSubscription(this.gameActions.checkedAnswer, x => {
        if(this.element.isSelected) {
          this.answerCorrection()
        }   
      })
      this.addSubscription(this.challengeService.actionToAnswerEmit, x => {
        this.isAnswerReady();
      })
  }




  ngOnInit(): void {
    this.parsedTypes(this.element.elementType, this.element);
    this.setAnswer();
    this.element.isSelected = false;
    console.log('tableComp');

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
      if(this.element.elementType === 'empty') {
        this.wordInput.nativeElement.focus();
      } 
      this.tableElementCorrectablePart();
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

  




  public answerCorrection():void {
    if(this.answer.answer === this.wordInput.nativeElement.value) {
      this.correctAnswerAnimation();
    } else {
      this.wrongAnswerAnimation();
    }
    this.feedbackService.endFeedback.emit();

  }






  private isAnswerReady() : void {
    const emptyCondition = this.element.elementType === 'empty' && this.element.value.text !== '';
    const fixedCondition = this.element.elementType === 'fixed' && this.element.isSelected;
    if (fixedCondition || emptyCondition) {
      this.gameActions.actionToAnswer.emit()
      console.log('actionToAnswer');
      console.log(this.hintService);
    }
  }






  public tableElementCorrectablePart(): void {
     
    const correctablePart = 
       [{
        correctness: (this.answer.answer === this.wordInput.nativeElement.value ? 'correct' : 'wrong') as PartCorrectness,
        parts: [
          {
            format: 'word-text' as PartFormat,
            value: this.wordInput.nativeElement.value as string
          }]
      }]
   
    this.answerService.currentAnswer = {
      parts: correctablePart as CorrectablePart[]
    }
    if(this.element.elementType === 'empty') {
      this.isAnswerReady();

    }
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





  public wrongAnswerAnimation():void {
    this.selectionActivate.state = false;
      anime({
        targets: this.elementContainer.nativeElement,
        duration: 550,
        loop:2,
        direction:'alternate',
        keyframes: [{
          backgroundColor: '#FF2D00'
        }],
        easing: 'linear',
        complete: () => {
          this.selectionActivate.state = true;
          this.restoreCellsColours.emit(this.element.id - 1);
        }    
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


