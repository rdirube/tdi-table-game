import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TypographyOxModule} from 'typography-ox';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {NgoxPostMessageModule} from 'ngox-post-message';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ComponentsOxModule } from 'micro-lesson-components';
import { OxAnimationsModule } from 'ox-animations';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TypographyOxModule,
    NgoxPostMessageModule,
    MicroLessonComponentsModule,
    FlexLayoutModule,
   ComponentsOxModule,
   OxAnimationsModule
  ],
  exports:[
    CommonModule,
    TypographyOxModule,
    NgoxPostMessageModule,
    MicroLessonComponentsModule,
    FlexLayoutModule,
    ComponentsOxModule,
    OxAnimationsModule
  ],
})
export class SharedModule { }
