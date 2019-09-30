import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICandidate, Candidate } from 'app/shared/model/candidate.model';
import { CandidateService } from './candidate.service';
import { IDocument } from 'app/shared/model/document.model';
import { DocumentService } from 'app/entities/document/document.service';

@Component({
  selector: 'jhi-candidate-update',
  templateUrl: './candidate-update.component.html'
})
export class CandidateUpdateComponent implements OnInit {
  isSaving: boolean;

  documents: IDocument[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    surname: [null, [Validators.required]],
    document: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected candidateService: CandidateService,
    protected documentService: DocumentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ candidate }) => {
      this.updateForm(candidate);
    });
    this.documentService
      .query({ filter: 'car-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IDocument[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDocument[]>) => response.body)
      )
      .subscribe(
        (res: IDocument[]) => {
          if (!this.editForm.get('document').value || !this.editForm.get('document').value.id) {
            this.documents = res;
          } else {
            this.documentService
              .find(this.editForm.get('document').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IDocument>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IDocument>) => subResponse.body)
              )
              .subscribe(
                (subRes: IDocument) => (this.documents = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(candidate: ICandidate) {
    this.editForm.patchValue({
      id: candidate.id,
      name: candidate.name,
      surname: candidate.surname,
      document: candidate.document
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const candidate = this.createFromForm();
    if (candidate.id !== undefined) {
      this.subscribeToSaveResponse(this.candidateService.update(candidate));
    } else {
      this.subscribeToSaveResponse(this.candidateService.create(candidate));
    }
  }

  private createFromForm(): ICandidate {
    return {
      ...new Candidate(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      surname: this.editForm.get(['surname']).value,
      document: this.editForm.get(['document']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICandidate>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackDocumentById(index: number, item: IDocument) {
    return item.id;
  }
}
