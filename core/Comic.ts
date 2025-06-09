import { Sale } from './Sale';

export class Comic {
    title: string;
    issue: string;
    publisher?: string;
    coverDate?: string;
    pedigree?: string;
    gradeSrc?: string;
    grade?: string;
    cgcid?: string;
    generalCommentary?: string;
    tags?: string; 
    sales? : Array<Sale>;  
    constructor(
        title: string,
        issue: string,
        publisher: string,
        coverDate: string,
        pedigree: string,
        gradeSrc: string,
        grade: string,
        cgcid:string,
        generalCommentary: string,
        tags : string,
        sales : Array<Sale>  
    
    ) {
      this.title = title;
      this.issue = issue;
      this.publisher = publisher;
      this.coverDate = coverDate;
      this.pedigree = pedigree;
      this.gradeSrc = gradeSrc;
      this.grade = grade;
      this.cgcid = cgcid;
      this.generalCommentary = generalCommentary;
      this.tags = tags;
      this.sales = sales;
    }
  }

