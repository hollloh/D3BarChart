'use strict';

const Root = document.querySelector('#root');

function makeD3Svg(x) {
  const    data = x.data,
                w = 1000,
                h = 500,
          padding = 60,
  
              svg = d3.select(Root)
                      .append('svg')
                      .attr('width', w)
                      .attr('height', h),
  
        parseTime = d3.timeParse('%Y-%m-%d'),
          minDate = d3.min(data, (d) => parseTime(d[0])),
          maxDate = d3.max(data, (d) => parseTime(d[0])),
  
           xScale = d3.scaleTime()
                      .domain([minDate, maxDate])
                      .range([padding, w - padding]),
  
           yScale = d3.scaleLinear()
                      .domain([0, d3.max(data, (d) => d[1])])
                      .range([h - padding, padding]),
  
          tooltip = d3.tip().attr('id', 'tooltip');

  svg.call(tooltip);

  svg.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('x', (d) => xScale(parseTime(d[0])))
     .attr('y', (d) => yScale(d[1]))
     .attr('width', 3)
     .attr('height', (d) => h - padding - yScale(d[1]))
     .attr('fill', '#616')
     .attr('class', 'bar')
     .attr('data-date', (d) => d[0])
     .attr('data-gdp', (d) => d[1])
     .on('mouseover', (d) => {
       tooltip.show(d)
              .attr('data-date', d[0])
              .offset([-50, -30])
              .html( (d) => d[0].slice(0, -6) + ' Q-' + d[0].slice(5, -3) + '<br />$' + d[1] + ' billion');
       if (d[1] < 400) {
         tooltip.offset([-50, 60]);
       }
       if (d[1] > 16000) {
         tooltip.offset([-30, -70]);
       }
     })
     .on('mouseout', tooltip.hide);

  const xAxis = d3.axisBottom(xScale),
        yAxis = d3.axisLeft(yScale);

  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', 'translate(0, ' + (h - padding) + ')')
     .call(xAxis)
     .attr('class', 'tick');

  svg.append('g')
     .attr('id', 'y-axis')
     .attr('transform', 'translate(' + padding + ', 0)')
     .call(yAxis)
     .attr('class', 'tick');

  svg.append('text')
     .attr('y', h / 6 )
     .attr('x', 0 - (h / 2))
     .attr('transform', 'rotate(-90)')
     .attr('fill', '#0f0')
     .text('Billion');

  svg.append('text')
     .attr('y', h - (padding / 4))
     .attr('x', w / 2)
     .attr('fill', '#0f0')
     .text('Year');
}

function init() {
  const req = new XMLHttpRequest();
  req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
  req.send();
  req.onload = function() {
    const json = JSON.parse(req.responseText);
    console.log( json );
    makeD3Svg(json);
  };
}
init();
