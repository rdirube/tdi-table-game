import { FormGroup } from "@angular/forms";
import { anyElement, numberArrayRange } from "ox-types";

export type ElementType = 'property' | 'fixed' | 'empty' | 'hidden' | 'hidden-hint' | 'null' | 'correct';



export interface Measurements {
  width: number,
  height: number
}


export interface TdiNivelation {
  tables:Table[];
}

export interface TdiExercise {
  table:Table
}

export interface TextWithAudio {
text:string,
audio:string
}



export interface Table {
statement: TextWithAudio,
tableName: TextWithAudio,
entrance: string,
columns: number,
rows: number,
tableElements: TableElement[],
setedTable:string,
tableWidth:number,
measures: Measurements
}


export interface TableElement {
id:number;
value: TextWithAudio,
elementType: ElementType,
isAnswer:boolean,
isSelected:boolean,
n:number,
m:number
}

export interface InitState {
  init:boolean;
}


export class TableGenerator {

  constructor() {
  }


  public tableGenerator(rowValues: TableElement[], propertyQuantity: number, rowQuantity: number, entrance: string) {
    if (entrance === 'Doble entrada') {
      const multipliersOfProperties = numberArrayRange(0, rowQuantity - 1).map(x => x * propertyQuantity)
      const verticalProperties = rowValues.filter((prop, i) => multipliersOfProperties.includes(i));
      verticalProperties.forEach(prop => prop.elementType = 'property');
    } else if (entrance === 'Entrada simple') {
      
    }
    //  rowValues.forEach(el => el.isProperty = true);
  }
  

  public sizeCalculator(rows: number, columns: number, width: number, height: number, totalWidth: number): void {
    let adjustVariable = 0.9;
    do {
      width *= adjustVariable;
    } while (totalWidth < width * columns);
    do {
      height *= adjustVariable;
    }
    while (76 < height * rows)
  }

}



export class HintGenerator {

 private tableElements!:TableElement[];

  constructor(tableElements:TableElement[]) {
    this.tableElements = tableElements;
  }





public hintModel2():number {
  const hiddenElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].elementType === 'hidden');
   return anyElement(hiddenElements);
}




public hintModel3(){
  const listOfFixedNotAnswer = this.tableElements.filter(el => el.elementType === 'fixed' && !el.isAnswer);
  const elToBlock = anyElement(listOfFixedNotAnswer);
  elToBlock.elementType = 'hidden-hint';
}




public hintModel1(tableSet:string, entrance:string) {
  const answerElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].isAnswer && this.tableElements[i].elementType !== 'correct');
  const answerSelectedIndex = anyElement(answerElements);
  const elementSelected = this.tableElements[answerSelectedIndex];
  if(tableSet === 'Calendario') {
     this.tableElements[answerSelectedIndex + 1].isSelected = true;
     this.tableElements[answerSelectedIndex - 1].isSelected = true;
  } else if(entrance === 'Doble entrada') {
    const firstColSameRowEl = this.tableElements.find(el => el.n === elementSelected.n && el.m === 0);
    const sameColFirstRowEl = this.tableElements.find(el => el.m === elementSelected.m && el.n === 0);
    (sameColFirstRowEl as TableElement).isSelected = true;
    (firstColSameRowEl as TableElement).isSelected = true;
  } else if(entrance === 'Entrada simple') {
    const answerColumn = this.tableElements.filter(el => elementSelected.n === el.n);
    answerColumn.forEach(el => el.isSelected = true);
  }

}

}