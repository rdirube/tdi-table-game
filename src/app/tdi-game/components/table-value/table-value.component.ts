import { Component, Input, OnInit } from '@angular/core';
import { TableElement } from 'src/app/shared/types/types';

@Component({
  selector: 'app-table-value',
  templateUrl: './table-value.component.html',
  styleUrls: ['./table-value.component.scss']
})
export class TableValueComponent implements OnInit {
   
  @Input() element!: TableElement;
  @Input() columns!:number; 
  @Input() rows!:number;
  public variableHeight!:number;
  public variableWidth!:number;

  constructor() { 
     
  }

  ngOnInit(): void {
    this.variableWidth = 25;
   this.variableHeight = 15; 
  }

}
