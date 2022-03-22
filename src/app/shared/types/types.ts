import { FormGroup } from "@angular/forms";
import { anyElement, numberArrayRange } from "ox-types";

export type ElementType = 'property' | 'fixed' | 'empty' | 'hidden' | 'hidden-hint' | 'null' | 'correct';
export type HintType = 'Iluminación encabezado'| 'Iluminación de ejes'| 'Desbloquear tapados';



export interface Measurements {
  width: number,
  height: number
}


export interface AnswerType {
  id:number,
  answer:string,
  empty:boolean
}

export interface TdiNivelation {
  tables:Table[];
  advancedSettings:HintType[];
}

export interface TdiExercise {
  exerciseData: TdiExercise;
  table:Table[],
  hints:HintType[]
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
 private correctAnswers!:number[];

  constructor(tableElements:TableElement[]) {
    this.tableElements = tableElements;
  }



public hintModel3():number {
  const hiddenElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].elementType === 'hidden');
   return anyElement(hiddenElements);
}



public hintModel1and2(hint1:boolean, entrance:string, tableSet:string) {
  const answerElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].isAnswer && this.tableElements[i].elementType !== 'correct');
  const currentAns = this.tableElements.map(elem => (elem.id - 1)).find(t => this.tableElements[t].elementType !== 'correct' && this.tableElements[t].isAnswer);
  const elementSelected = this.tableElements[currentAns as number];
  hint1 ? this.hintModel1(entrance, elementSelected) : this.hintModel2(tableSet,entrance, currentAns as number, elementSelected)
}




public hintModel1(entrance:string, elementSelected:TableElement) {
  if(entrance === 'Doble entrada') {
    const firstColSameRowEl = this.tableElements.find(el => el.n === elementSelected.n );
    const sameColFirstRowEl = this.tableElements.find(el => el.m === elementSelected.m );
    (sameColFirstRowEl as TableElement).isSelected = true;
    (firstColSameRowEl as TableElement).isSelected = true;
  } else if(entrance === 'Entrada simple') {
    const sameColFirstRowEl = this.tableElements.find(el => el.n === elementSelected.n && el.m === 0);
    (sameColFirstRowEl as TableElement).isSelected = true;
  }
}





public hintModel2(tableSet:string, entrance:string, answerSelectedIndex:number, elementSelected:TableElement) {
  if(tableSet === 'Calendario') {
    this.tableElements[answerSelectedIndex + 1].isSelected = true;
    this.tableElements[answerSelectedIndex - 1].isSelected = true;
} else if(entrance === 'Doble entrada') {
    const elementCol = this.tableElements.filter(el => el.m === elementSelected.m && el.n > 0);
    const elementRow = this.tableElements.filter(el => el.n === elementSelected.n && el.m > 0);
    elementCol.forEach(el => el.isSelected = true);
    elementRow.forEach(el => el.isSelected = true);
} else if(entrance === 'Entrada simple') {
  const uniqueCol = this.tableElements.filter(el => el.n === elementSelected.n && el.m > 0);
  uniqueCol.forEach(col => col.isSelected = true);
}

}


}