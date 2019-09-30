import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HiringAppOnlineSharedModule } from 'app/shared/shared.module';
import { CandidateComponent } from './candidate.component';
import { CandidateDetailComponent } from './candidate-detail.component';
import { CandidateUpdateComponent } from './candidate-update.component';
import { CandidateDeletePopupComponent, CandidateDeleteDialogComponent } from './candidate-delete-dialog.component';
import { candidateRoute, candidatePopupRoute } from './candidate.route';

const ENTITY_STATES = [...candidateRoute, ...candidatePopupRoute];

@NgModule({
  imports: [HiringAppOnlineSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CandidateComponent,
    CandidateDetailComponent,
    CandidateUpdateComponent,
    CandidateDeleteDialogComponent,
    CandidateDeletePopupComponent
  ],
  entryComponents: [CandidateDeleteDialogComponent]
})
export class HiringAppOnlineCandidateModule {}
