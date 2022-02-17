import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TableElement } from 'src/app/shared/types/types';

@Component({
  selector: 'app-table-value',
  templateUrl: './table-value.component.html',
  styleUrls: ['./table-value.component.scss']
})
export class TableValueComponent implements OnInit, AfterViewInit {

  @Input() element!: TableElement;
  @Input() columns!: number;
  @Input() rows!: number;
  @Input() tableWidth!: number;
  @Input() variableHeight!: number;
  @Input() variableWidth!:number; 


  constructor(public elementRef: ElementRef) {
  }



  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }


  // public sizeCalculator() {
  // let adjustVariable = 0.9;
  //  while(this.tableWidth - 35 < this.variableWidth * this.columns) {
  //     this.variableWidth *= adjustVariable;
  //     adjustVariable -= 0.1;
  //     console.log("hola");
  //   }
  // }
}
