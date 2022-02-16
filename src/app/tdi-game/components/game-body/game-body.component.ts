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
import { anyElement, duplicateWithJSON, ExerciseData, MultipleChoiceSchemaData, OptionShowable, OxImageInfo, ScreenTypeOx, Showable } from 'ox-types';
import { TdiAnswerService } from 'src/app/shared/services/tdi-answer.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { TableElement , TableGenerator} from 'src/app/shared/types/types';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit {


  public testTableValues:TableElement[][] = [[{value:'Club', isProperty:false},{value:'Jugador', isProperty: false},{value:'precio', isProperty:false}],[{value:'Boca', isProperty:false}, {value:'Tevez', isProperty:false}, {value:'50 mll', isProperty:false}],[{value:'Racing', isProperty:false},{value:'Milito', isProperty:false}, {value:'25 mll', isProperty:false}]]
  public tableGenerator = new TableGenerator();

  constructor(private challengeService: TdiChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private soundService: SoundOxService,
    private endService: EndGameService,
    private feedbackService: FeedbackOxService,
    private answerService: TdiAnswerService,
  ) 
  { 
  super()
  }

  ngOnInit(): void {
    this.tableGenerator.tableGenerator(this.testTableValues, false);
  }

  


}
