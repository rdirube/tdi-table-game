import { Injectable } from '@angular/core';
import { ScoreStarsService } from 'micro-lesson-core';

@Injectable({
  providedIn: 'root'
})
export class TdiScoreService extends ScoreStarsService<any>{

  constructor() {
    super();
  }
  
  


}
