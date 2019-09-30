import { IContent } from 'app/shared/model/content.model';
import { ICandidate } from 'app/shared/model/candidate.model';

export interface IDocument {
  id?: number;
  title?: string;
  size?: number;
  mimeType?: string;
  content?: IContent;
  car?: ICandidate;
}

export class Document implements IDocument {
  constructor(
    public id?: number,
    public title?: string,
    public size?: number,
    public mimeType?: string,
    public content?: IContent,
    public car?: ICandidate
  ) {}
}
