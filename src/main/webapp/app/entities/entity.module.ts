import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'candidate',
        loadChildren: () => import('./candidate/candidate.module').then(m => m.HiringAppOnlineCandidateModule)
      },
      {
        path: 'document',
        loadChildren: () => import('./document/document.module').then(m => m.HiringAppOnlineDocumentModule)
      },
      {
        path: 'content',
        loadChildren: () => import('./content/content.module').then(m => m.HiringAppOnlineContentModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class HiringAppOnlineEntityModule {}
