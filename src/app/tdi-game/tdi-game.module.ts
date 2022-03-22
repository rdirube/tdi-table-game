import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import { SharedModule } from '../shared/shared.module';
import { TableValueComponent } from './components/table-value/table-value.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    GameBodyComponent,
    TableValueComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule
  ],
  exports:[
    GameBodyComponent
  ]
})
export class TdiGameModule { }
