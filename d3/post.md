<a href="https://amzn.to/2DiaFD5">Mastering SVG has a whole chapter on D3.</a> It had been a while since I'd worked with it so it was a lot of fun to dive back in and roll up my sleeves with it. It was so much fun, in fact, I've continued to work on it even though the book is done. This article will go over one such example. 

This chart illustrates the progression of the world record price paid for a comic book over the past 50+ years. It's a line chart and with some libraries, generating a basic line chart would be a few lines of code. D3 offers that as well, but D3 allows so much control over every aspect of a visualization that w 
[code lang="json"]
{
  "sales": [
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "9.0",
      "buyer": "Metropolis (for Ayman Hariri)",
      "note":"",
      "date": "2014-08-24",
      "seller": "Pristine Comics on eBay",
      "price": "3207852",
      "goodDate": true
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "9.0",
      "buyer": "Ayman Hariri",
      "note":"Cage Copy",
      "date": "2011-11-30",
      "seller": "ComicConnect",
      "price": "2161000",
      "goodDate": true
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "8.5",
      "buyer": "",
      "note":"",
      "date": "2010-03-29",
      "seller": "ComicConnect",
      "price": "1500000",
      "goodDate": true
    },
    {
      "title": "Detective Comics",
      "issue": "27",
      "grade": "8.0",
      "buyer": "",
      "note":"",
      "date": "2010-02-25",
      "seller": "Heritage",
      "price": "1075000",
      "goodDate": true
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "8.0",
      "buyer":"",
      "note": "Kansas City",
      "date": "2010-02-22",
      "seller": "ComicConnect",
      "price": "1000000",
      "goodDate": true
    },
    {
      "title": "Flash Comics",
      "issue": "1",
      "grade": "9.6",
      "note":"Church copy",
      "buyer": "JP the Mint",
      "date": "2004-01-01",
      "seller": "unknown",
      "price": "350000",
      "goodDate": false
    },
    {
      "title": "Marvel Comics",
      "issue": "1",
      "grade": "9.0",
      "note":"Pay Copy",
      "buyer": "JP the Mint",
      "date": "2003-01-01",
      "seller": "Steve Geppi",
      "price": "350000",
      "goodDate": true
    },
    {
      "title": "Captain America Comics",
      "issue": "1",
      "grade": "9.6",
      "note": "Allentown",
      "buyer": "John Verzyl",
      "date": "2001-01-01",
      "seller": "unknown",
      "price": "260000",
      "goodDate": false
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "Now: CGC 8.5",
      "note":"current CGC 8.5 copy",
      "buyer": "Daniel Kramer",
      "date": "1995-01-01",
      "seller": "PCE",
      "price": "137500",
      "goodDate": false
    },
    {
      "title": "Detective Comics",
      "issue": "27",
      "grade": "8.5",
      "note": "Church",
      "buyer":"",
      "date": "1994-01-01",
      "seller": "Dave Anderson?",
      "price": "125000",
      "goodDate": false
    },
    {
      "title": "Detective Comics",
      "issue": "27",
      "grade": "high grade",
      "note": "'other high grade' copy",
      "buyer":"",
      "date": "1993-01-01",
      "seller": "unknown",
      "price": "101000",
      "goodDate": false
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "78",
      "note":"",
      "buyer": "Metropolis (for actor Nic Cage)",
      "seller": "Sotheby's",
      "price": "82500",
      "date": "1992-09-30",
      "goodDate": true
    },
    {
      "title": "Detective Comics",
      "issue": "27",
      "grade": "NM-MT",
      "note": "Allentown",
      "buyer":"Dave Anderson",
      "price": "80000",
      "seller": "Metropolis",
      "date": "1990-01-01",
      "goodDate": false
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "NM",
      "buyer":"Dave Anderson",
      "note": "Church Copy",
      "seller": "John Snyder",
      "price": "25000",
      "date": "1984-01-01",
      "goodDate": false
    },
    {
      "title": "Marvel Comics",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "Steve Geppi",
      "date": "1979-10-08",
      "seller": "John Snyder",
      "price": "17500",
      "goodDate": true
    },
    {
      "title": "Marvel Comics",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "John Snyder",
      "date": "1979-01-01",
      "seller": "unknown",
      "price": "13000",
      "goodDate": false
    },
    {
      "title": "Marvel Comics",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "",
      "date": "1977-01-01",
      "seller": "Robert Crestohl?",
      "price": "7500",
      "goodDate": false
    },
    {
      "title": "Motion Picture Funnies Weekly",
      "issue": "1",
      "grade": "",
      "buyer": "",
      "note":"",
      "date": "1976-01-01",
      "seller": "unknown",
      "price": "6300",
      "goodDate": false
    },
    {
      "title": "Whiz",
      "issue": "2",
      "grade": "",
      "note":"Reilly Copy",
      "buyer": "Burl Rowe",
      "date": "1974-01-04",
      "seller": "Comics & Comix",
      "price": "2000",
      "goodDate": true
    },
    {
      "title": "Action",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "Bruce Hamilton",
      "date": "1973-04-02",
      "seller": "Gene Henderson",
      "price": "1000",
      "goodDate": true
    },
    {
      "title": "Action",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "Theo Hostein",
      "date": "1973-04-22",
      "seller": "Bruce Hamilton",
      "price": "1500.00",
      "goodDate": true
    },
    {
      "title": "Action",
      "issue": "1",
      "grade": "",
      "note":"",
      "buyer": "Mitch Mehdy",
      "date": "1973-05-01",
      "seller": "Theo Hostein",
      "price": "1801.26",
      "goodDate": true
    },
    {
      "title": "Marvel Comics",
      "issue": "1",
      "grade": "",
      "buyer": "",
      "note":"",
      "date": "1968-01-01",
      "seller": "Howard Rogolfsky",
      "price": "330",
      "goodDate": false
    },
    {
      "title": "Action Comics",
      "issue": "1",
      "grade": "",
      "buyer": "",
      "note":"",
      "date": "1965-01-01",
      "seller": "unknown",
      "price": "250",
      "goodDate": false
    }
  ]
}
[/code]

[code lang="html"]

[/code]
[code lang="js"]
const margin = {
  'top': 100,
  'right': 20,
  'bottom': 30,
  'left': 100
};
const width = 1440;
const height = 768;
onst yPadding = margin.top + margin.bottom;
const xPadding = margin.right + margin.left;

const svg = d3.select('#target')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);
const radius = 5;
const parseTime = d3.timeParse('%Y-%m-%d');

const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip bs-tooltip-right')
  .style('opacity', 0);
tooltip.html(`
  <div class="arrow"></div>
  <div class="tooltip-inner">
  </div>`);
const inflationTooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip bs-tooltip-right inflation')
  .style('opacity', 0);
inflationTooltip.html(`
  <div class="arrow"></div>
  <div class="tooltip-inner">
  </div>`);

const list = d3.select('#data')
  .append('ul').attr('class','list-group');

const x = d3.scaleTime()
  .rangeRound([0, width - xPadding]);

const y = d3.scaleLinear()
  .rangeRound([height - yPadding, 0]);


const line = d3.line()
  .x((d)=> {
    return x(d.date);
  })
  .y((d)=> {
    return y(d.price);
  });

const inflationLine = d3.line()
  .x((d)=> {
    return x(d.date);
  })
  .y((d)=> {
    return y(d.inflationAdjustedPrice);
  });


function yGridlines() {
  return d3.axisLeft(y)
    .ticks(5);
}

d3.json('data/books.json').then((data) => {
  const sales = data.sales.sort((d1, d2) => moment.utc(d1.date).diff(moment.utc(d2.date)));

  sales.forEach((d) => {
    d.date = parseTime(d.date);
    d.price = parseInt(d.price);
    const year = parseInt(moment(d.date).format('YYYY'));
    d.inflationAdjustedPrice = inflation({'amount': d.price, 'year': year});
  });

  x.domain([
    d3.min(sales, (d) => {
      return moment(d.date).startOf('year').toDate();
    }), moment().toDate()]);
  y.domain([0, d3.max(sales, (d) => {
    return Math.ceil(d.price / 500000) * 500000;
  })]);
  const years = parseInt(moment().format('YYYY')) - parseInt(moment(x.domain()[0]).format('YYYY'));

  let axis = g.append('g')
    .attr('class', 'axis');

  axis.append('g')
    .attr('class', 'y axis')
    .call(d3.axisLeft(y)
      .tickSize(-(width - xPadding)).tickFormat(d3.format('($~s')));
  axis.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height - yPadding})`)
    .call(d3.axisBottom(x).ticks(years).tickSize(-(height - yPadding)).tickPadding(10));

  let paths = g.append('g')
    .attr('class', 'paths');

  paths.append('path')
    .data([sales])
    .attr('class', 'line nominal')
    .attr('d', line);

  paths.append('path')
    .data([sales])
    .attr('class', 'inflation line')
    .attr('d', inflationLine);

  let dots = g.append('g')
    .attr('class', 'dots');

  dots.selectAll('.dot')
    .data(sales)
    .enter()
    .append('circle')
    .attr('class', 'dot nominal')
    .attr('cx',  (d)=> {
      return x(d.date);
    })
    .attr('cy',  (d)=> {
      return y(d.price);
    })
    .attr('r', radius)
    .on('mouseout', (d)=> {
      tooltip.style('opacity', 0);
    })
    .on('mouseover', (data)=> {
      tooltip.style('opacity', 1);
      tooltip.style('left', (d3.event.pageX + radius) + 'px')
        .style('top', (d3.event.pageY) + 'px');
      tooltip.select('.tooltip-inner')
        .text((d)=> {
          return `${data.title} #${data.issue} ${data.grade}  ${data.price.toLocaleString('us-EN', {style: 'currency', currency: 'USD'})}`;
        });
    });
  dots.selectAll('.inflation dot')
    .data(sales)
    .enter().append('circle')
    .attr('class', 'inflation dot')
    .attr('cx',(d)=> {
      return x(d.date);
    })
    .attr('cy',(d)=> {
      return y(d.inflationAdjustedPrice);
    })
    .attr('r', radius)
    .on('mouseout', ()=> {
      inflationTooltip.style('opacity', 0);
    })
    .on('mouseover', (data)=> {
      inflationTooltip.style('opacity', 1);
      inflationTooltip.style('left', (d3.event.pageX + radius) + 'px')
        .style('top', (d3.event.pageY) + 'px');
      inflationTooltip.select('.tooltip-inner')
        .text(()=> {
          return `${data.title} #${data.issue} ${data.grade}  ${data.inflationAdjustedPrice.toLocaleString('us-EN', {style: 'currency', currency: 'USD'})} (inflation adj.)`;
        });
    });
  list.selectAll('li')
    .data(sales)
    .enter()
    .append('li')
    .attr('class','list-group-item')
    .text((d)=>{
      let soldBy = ' ';
      let soldTo = ' ';
      let note = ' ';
      let date;
      if (d.seller !== '') {
        if (d.seller === 'unknown') {
          soldBy = ' by an unknown seller ';
        } else {
          soldBy = ` sold by ${d.seller} `;
        }
      }
      if (d.buyer !== '') {
        soldTo = ` to ${d.buyer} `;
      }
      if (d.note !== '') {
        note = ` (${d.note}) `;
      }
      if (d.goodDate) {
        date = `in ${moment(d.date).format('MMMM of YYYY')}`;
      } else {
        date = `sometime in ${moment(d.date).format('YYYY')}`;
      }
      return `${d.title} #${d.issue}${note}${soldBy} for ${d.price.toLocaleString('us-EN', {style: 'currency', currency: 'USD'})} (${d.inflationAdjustedPrice.toLocaleString('us-EN', {style: 'currency', currency: 'USD'})})${soldTo} ${date}`;
    });

});

document.getElementById('inflationValue').addEventListener('change', () => {
  document.getElementById('target').classList.toggle('inflation');
});
document.getElementById('nominalValue').addEventListener('change', () => {
  document.getElementById('target').classList.toggle('nominal');
});


[/code]
