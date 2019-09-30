import { IDocument } from 'app/shared/model/document.model';

export interface ICandidate {
  id?: number;
  name?: string;
  surname?: string;
  document?: IDocument;
}

export class Candidate implements ICandidate {
  constructor(public id?: number, public name?: string, public surname?: string, public document?: IDocument) {}
}
