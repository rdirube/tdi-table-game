import { FormGroup } from "@angular/forms";
import { anyElement, numberArrayRange } from "ox-types";

export type ElementType = 'property' | 'fixed' | 'empty' | 'hidden' | 'hidden-hint' | 'null' | 'correct';
export type HintType = 'Iluminación encabezado'| 'Iluminación de ejes'| 'Desbloquear tapados';



export interface Measurements {
  width: number,
  height: number
}


export interface AnswerType {
  answer:string,
  empty:boolean
}

export interface TdiNivelation {
  tables:Table[];
  advancedSettings:HintType[];
}

export interface TdiExercise {
  table:Table,
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

  constructor(tableElements:TableElement[]) {
    this.tableElements = tableElements;
  }



public hintModel3():number {
  const hiddenElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].elementType === 'hidden');
   return anyElement(hiddenElements);
}



public hintModel1and2(hint1:boolean, entrance:string, tableSet:string) {
  const answerElements = this.tableElements.map((el,i) => i).filter(i => this.tableElements[i].isAnswer && this.tableElements[i].elementType !== 'correct');
  const answerSelectedIndex = anyElement(answerElements);
  const elementSelected = this.tableElements[answerSelectedIndex];
  hint1 ? this.hintModel1(entrance, elementSelected) : this.hintModel2(tableSet,entrance, answerSelectedIndex, elementSelected)
}




public hintModel1(entrance:string, elementSelected:TableElement) {
  if(entrance === 'Doble entrada') {
    const firstColSameRowEl = this.tableElements.find(el => el.n === elementSelected.n && el.m === 0);
    const sameColFirstRowEl = this.tableElements.find(el => el.m === elementSelected.m && el.n === 0);
    (sameColFirstRowEl as TableElement).isSelected = true;
    (firstColSameRowEl as TableElement).isSelected = true;
  } else if(entrance === 'Entrada simple') {
    const sameColFirstRowEl = this.tableElements.find(el => el.m === elementSelected.m && el.n === 0);
    (sameColFirstRowEl as TableElement).isSelected = true;
  }
}





public hintModel2(tableSet:string, entrance:string, answerSelectedIndex:number, elementSelected:TableElement) {
  if(tableSet === 'Calendario') {
    this.tableElements[answerSelectedIndex + 1].isSelected = true;
    this.tableElements[answerSelectedIndex - 1].isSelected = true;
} else if(entrance === 'Doble entrada') {
    const elementCol = this.tableElements.filter(el => el.m === elementSelected.m);
    const elementRow = this.tableElements.filter(el => el.n === elementSelected.n);
    elementCol.forEach(el => el.isSelected = true);
    elementRow.forEach(el => el.isSelected = true);
} else if(entrance === 'Entrada simple') {
  const uniqueCol = this.tableElements.filter(el => el.m === elementSelected.m);
  uniqueCol.forEach(col => col.isSelected = true);
}

}


}