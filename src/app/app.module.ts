import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnswerService, ChallengeService, ScoreStarsService } from 'micro-lesson-core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TdiAnswerService } from './shared/services/tdi-answer.service';
import { TdiChallengeService } from './shared/services/tdi-challenge.service';
import { SharedModule } from './shared/shared.module';
import { TdiGameModule } from './tdi-game/tdi-game.module';
import { TranslocoRootModule } from './transloco-root.module';
import { TdiScoreService } from './shared/services/tdi-score.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    TdiGameModule,
    HttpClientModule,
    TranslocoRootModule
  ],
  providers: [
    {
      provide: ChallengeService,
      useExisting: TdiChallengeService
    },
    {
      provide: AnswerService,
      useExisting: TdiAnswerService
    },
    {
      provide: ScoreStarsService,
      useExisting:TdiScoreService
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
