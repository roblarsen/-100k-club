export class RecordSale {
    title: string;
    issue: string;
    pedigree?: string;
    gradeSrc?: string;
    grade?: string;
    price: number;
    salesDate: string;
    venue: string;

    constructor(
        title: string,
        issue: string,
        pedigree: string,
        gradeSrc: string,
        grade: string,
        price: number,
        salesDate: string,
        venue: string
        
    ) {
       this.title = title;
       this.issue = issue;
        this.pedigree = pedigree;
        this.gradeSrc = gradeSrc;
        this.grade = grade;
         this.price = price;
        this.salesDate = salesDate;
        this.venue = venue;
    }
  } 
 