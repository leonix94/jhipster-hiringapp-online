import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDocument, Document } from 'app/shared/model/document.model';
import { DocumentService } from './document.service';
import { IContent } from 'app/shared/model/content.model';
import { ContentService } from 'app/entities/content/content.service';
import { ICandidate } from 'app/shared/model/candidate.model';
import { CandidateService } from 'app/entities/candidate/candidate.service';

@Component({
  selector: 'jhi-document-update',
  templateUrl: './document-update.component.html'
})
export class DocumentUpdateComponent implements OnInit {
  isSaving: boolean;

  contents: IContent[];

  candidates: ICandidate[];

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required]],
    size: [null, [Validators.required]],
    mimeType: [],
    content: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected documentService: DocumentService,
    protected contentService: ContentService,
    protected candidateService: CandidateService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ document }) => {
      this.updateForm(document);
    });
    this.contentService
      .query({ filter: 'document-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IContent[]>) => mayBeOk.ok),
        map((response: HttpResponse<IContent[]>) => response.body)
      )
      .subscribe(
        (res: IContent[]) => {
          if (!this.editForm.get('content').value || !this.editForm.get('content').value.id) {
            this.contents = res;
          } else {
            this.contentService
              .find(this.editForm.get('content').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IContent>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IContent>) => subResponse.body)
              )
              .subscribe(
                (subRes: IContent) => (this.contents = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.candidateService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICandidate[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICandidate[]>) => response.body)
      )
      .subscribe((res: ICandidate[]) => (this.candidates = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(document: IDocument) {
    this.editForm.patchValue({
      id: document.id,
      title: document.title,
      size: document.size,
      mimeType: document.mimeType,
      content: document.content
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const document = this.createFromForm();
    if (document.id !== undefined) {
      this.subscribeToSaveResponse(this.documentService.update(document));
    } else {
      this.subscribeToSaveResponse(this.documentService.create(document));
    }
  }

  private createFromForm(): IDocument {
    return {
      ...new Document(),
      id: this.editForm.get(['id']).value,
      title: this.editForm.get(['title']).value,
      size: this.editForm.get(['size']).value,
      mimeType: this.editForm.get(['mimeType']).value,
      content: this.editForm.get(['content']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocument>>) {
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

  trackContentById(index: number, item: IContent) {
    return item.id;
  }

  trackCandidateById(index: number, item: ICandidate) {
    return item.id;
  }
}
