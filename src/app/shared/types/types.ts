import { numberArrayRange } from "ox-types";

export type ElementType = 'property' | 'fixed' | 'empty' | 'hidden';


export interface TableElement {
  value: any,
  elementType: ElementType
}


export interface Measurements {
  width: number,
  height: number
}




export class TableGenerator {

  constructor() {
  }


  public tableGenerator(rowValues: TableElement[], propertyQuantity: number, rowQuantity: number, isDoubleEntrance: boolean) {
    if (isDoubleEntrance) {
      const multipliersOfProperties = numberArrayRange(0, rowQuantity - 1).map(x => x * propertyQuantity)
      const verticalProperties = rowValues.filter((prop, i) => multipliersOfProperties.includes(i));
      verticalProperties.forEach(prop => prop.elementType = 'property');
      
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