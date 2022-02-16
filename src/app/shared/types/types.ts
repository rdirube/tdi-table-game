


export interface TableElement {
value:any,
isProperty:boolean
}




export class TableGenerator {
 
  constructor(){
  }


  public tableGenerator(rowValues:TableElement[][], isDoubleEntrance:boolean) {
   if(isDoubleEntrance) {
    rowValues.forEach(row => row[0].isProperty = true);
    rowValues[0].unshift({
        value:'',
        isProperty:true,
    })
   } 
   rowValues[0].forEach(el => el.isProperty = true);
  }




}