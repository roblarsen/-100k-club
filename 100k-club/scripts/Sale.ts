export class Sale {
    price: number;
    salesDate: string;
    venue: string;
    link?: string;

    constructor(
        price: number,
        salesDate: string,
        venue: string,
        link: string,
    
    ) {
      this.price = price;
      this.salesDate = salesDate;
      this.venue = venue;
      this.link = link;
    }
  }

