import * as d3 from "d3";
import { inflation } from "./inflation";
import moment from "moment";
import * as data from "../../data/data/records.json";

const margin = {
  'top': 100,
  'right': 20,
  'bottom': 30,
  'left': 100
};
const width = 1440;
const height = 768;
const yMargin = margin.top + margin.bottom;
const xMargin = margin.right + margin.left;

const sales = data.sales.sort((d1, d2) => moment.utc(d1.date).diff(moment.utc(d2.date)));

const svg = d3.select('#viz')
  .append('svg')
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)

const g = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);
const radius = 5;
const parseTime = d3.timeParse('%Y-%m-%d');

const tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tt')
  .style('opacity', 0)
tooltip.html(`
  <div class="tt-inner">
  </div>`);
const inflationTooltip = d3.select('body')
  .append('div')
  .attr('class', 'tt inflation')
  .style('opacity', 0)
;
inflationTooltip.html(`
  <div class="tt-inner">
  </div>`);

const list = d3.select('#data')
  .append('ul').attr('class', 'list-group');

const x = d3.scaleTime()
  .rangeRound([0, width - xMargin]);

const y = d3.scaleLinear()
  .rangeRound([height - yMargin, 0]);


const line = d3.line()
  .x((d) => {
    return x(d.date);
  })
  .y((d) => {
    return y(d.price);
  });

const inflationLine = d3.line()
  .x((d) => {
    return x(d.date);
  })
  .y((d) => {
    return y(d.inflationAdjustedPrice);
  });



sales.forEach((d) => {
  d.date = parseTime(d.date);
  const year = parseInt(moment(d.date).format('YYYY'));
  d.inflationAdjustedPrice = inflation({'amount': d.price, 'year': year});
});

x.domain([
  d3.min(sales, (d) => {
    return moment(d.date).startOf('year').toDate();
  }), moment().toDate()]);

const max = d3.max(sales, (d) => {
  return Math.ceil(d.price / 500000) * 500000;
})
y.domain([0, max + (max*.10)]);
const years = parseInt(moment().format('YYYY')) - parseInt(moment(x.domain()[0]).format('YYYY'));

const axis = g.append('g')
  .attr('class', 'axis');

axis.append('g')
  .attr('class', 'y axis')
  .call(d3.axisLeft(y)
    .tickSize(-(width - xMargin)).tickFormat(d3.format('($~s')));
axis.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${height - yMargin})`)
  .call(d3.axisBottom(x).ticks(years).tickSize(-(height - yMargin)).tickPadding(10));

const paths = g.append('g')
  .attr('class', 'paths');

paths.append('path')
  .data([sales])
  .attr('class', 'line nominal')
  .attr('d', line);

paths.append('path')
  .data([sales])
  .attr('class', 'inflation line')
  .attr('d', inflationLine);

const dots = g.append('g')
  .attr('class', 'dots');

const formatText = (data)=>{
 return `<h1>${data.title}</h1>
        <h2>#${data.issue} ${data.note} ${data.grade}</h2>
        Sold for ${data.price.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })} (${data.inflationAdjustedPrice.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })})
        `
}
dots.selectAll('.dot')
  .data(sales)
  .enter()
  .append('circle')
  .attr('class', 'dot nominal')
  .attr('cx', (d) => {
    return x(d.date);
  })
  .attr('cy', (d) => {
    return y(d.price);
  })
  .attr('r', radius)
  .on('mouseout', () => {
    tooltip.style('opacity', 0);
  })
  .on('mouseover', (e:MouseEvent) => {

    tooltip.style('opacity', 1);
    tooltip.select('.tt-inner')
      .html(() => {
        return formatText(d3.select(e.target).datum());
      });
  });
dots.selectAll('.inflation dot')
  .data(sales)
  .enter().append('circle')
  .attr('class', 'inflation dot')
  .attr('cx', (d) => {
    return x(d.date);
  })
  .attr('cy', (d) => {
    return y(d.inflationAdjustedPrice);
  })
  .attr('r', radius)
  .on('mouseout', () => {
    inflationTooltip.style('opacity', 0);
  })
  .on('mouseover', (e:MouseEvent) => {
    inflationTooltip.style('opacity', 1);
    inflationTooltip.select('.tt-inner')
      .html(() => {
        return `${formatText(d3.select(e.target).datum())} (iniflation adjusted)`;
      });
  });
list.selectAll('li')
  .data(sales)
  .enter()
  .append('li')
  .attr('class', 'list-group-item')
  .text((d) => {
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
    return `${d.title} #${d.issue}${note}${soldBy} for ${d.price.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })} (${d.inflationAdjustedPrice.toLocaleString('us-EN', { style: 'currency', currency: 'USD' })})${soldTo} ${date}`;
  });
  


document.getElementById('inflationValue').addEventListener('change', () => {
  document.getElementById('viz').classList.toggle('inflation');
});
document.getElementById('nominalValue').addEventListener('change', () => {
  document.getElementById('viz').classList.toggle('nominal');
});