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
import { Measurements, TableElement, TableGenerator } from 'src/app/shared/types/types';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {

  @ViewChildren('cells') cells!: QueryList<ElementRef>;
  public testTableProperties!: TableElement[];
  public testTableValues!: TableElement[];
  public testCompleteTable!: TableElement[];
  public tableGenerator = new TableGenerator();
  public rowsQuantity!: number;
  public tableWidth!: number;
  public cellsArray!:any;
  public measures: Measurements = {
    width: 35,
    height: 15
  }



  constructor(private challengeService: TdiChallengeService,
    private metricsService: MicroLessonMetricsService<any>,
    private gameActions: GameActionsService<any>,
    private hintService: HintService,
    private soundService: SoundOxService,
    private endService: EndGameService,
    private feedbackService: FeedbackOxService,
    private answerService: TdiAnswerService,
  ) {
    super()
    this.testTableProperties = [{ value: '', elementType: 'property' }, { value: 'Sponsor', elementType: 'property' }, { value: 'Age', elementType: 'property' },{ value: 'Precio', elementType: 'property' }, { value: 'Sponsor', elementType: 'property' }, { value: 'Age', elementType: 'property' }, { value: 'Age', elementType: 'property' }, { value: 'Age', elementType: 'property' }, { value: 'Age', elementType: 'property' }, { value: 'Age', elementType: 'property' }]
    this.testTableValues = [ { value: 'Racing', elementType: 'fixed' }, { value: 'Milito', elementType: 'empty' }, { value: '25 mll', elementType: 'fixed' }, { value: "Adidas", elementType: 'fixed' }, { value: '32', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' }, { value: 'Nike', elementType: 'empty' },{ value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: 'Racing', elementType: 'fixed' }, { value: 'Milito', elementType: 'fixed' }, { value: '25 mll', elementType: 'fixed' }, { value: "Adidas", elementType: 'fixed' }, { value: '32', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' }, { value: 'Nike', elementType: 'fixed' },{ value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: 'Racing', elementType: 'fixed' }, { value: 'Milito', elementType: 'fixed' }, { value: '25 mll', elementType: 'fixed' }, { value: "Adidas", elementType: 'fixed' }, { value: '32', elementType: 'hidden' }, { value: '50 mll', elementType: 'hidden' }, { value: 'Nike', elementType: 'fixed' },{ value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: 'Racing', elementType: 'fixed' }, { value: 'Milito', elementType: 'fixed' }, { value: '25 mll', elementType: 'fixed' }, { value: "Adidas", elementType: 'fixed' }, { value: '32', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' }, { value: 'Nike', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' }, { value: 'Nike', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' },{ value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' },{ value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' },{ value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' },{ value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' },{ value: 'River', elementType: 'fixed' }, { value: 'Alvarez', elementType: 'fixed' }, { value: '40 mll', elementType: 'fixed' }, { value: 'Puma', elementType: 'fixed' }, { value: '22', elementType: 'fixed' }, { value: '20', elementType: 'fixed' }, { value: '50 mll', elementType: 'fixed' }]
    this.testCompleteTable = this.testTableProperties.concat(this.testTableValues);
    this.rowsQuantity = this.testCompleteTable.length / this.testTableProperties.length;
    this.tableWidth = this.testTableProperties.length > 3 ? 130 : 105;
    const erraseEmptyValues = this.testTableValues.filter(x => x.elementType === 'empty');
    erraseEmptyValues.forEach(val => val.value = '');
    this.tableGenerator.tableGenerator(this.testTableValues,this.testTableProperties.length,this.rowsQuantity ,true);
    this.sizeCalculator()
  }




  ngOnInit(): void {

  }



  ngAfterViewInit(): void {
   
  }


  public sizeCalculator() {
    let adjustVariable = 0.9;
    do {
      this.measures.width *= adjustVariable;
    } while (this.tableWidth < this.measures.width * this.testTableProperties.length);
    do {
      this.measures.height *= adjustVariable;
    }
    while (76 < this.measures.height * this.rowsQuantity)
  }


  // public sizeCalculator(rows:number, columns:number, width:number, height:number, totalWidth:number):void {
  //   let adjustVariable = 0.9;
  //   do {
  //     width *= adjustVariable;
  //   } while (totalWidth < width * columns);
  //   do {
  //     height *= adjustVariable;
  //   }
  //   while (76 < height * rows)
  // }

}
