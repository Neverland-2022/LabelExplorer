
class LegendVis {

    // constructor method to initialize Timeline object
    constructor(parentElement) {
        this.parentElement = parentElement;

        this.colors = ['#B9E0FF', '#285430', '#A4BE7B', '#E5D9B6', '#EB6440', '#7743DB']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land', 'impervious (other)', 'impervious (road)']
        this.colors13 = ['#B9E0FF', '#285430', '#A4BE7B',]
        this.colors46 = ['#E5D9B6', '#EB6440', '#7743DB']

        this.labels13 = ['water', 'tree canopy / forest', 'low vegetation / field']
        this.labels46 = ['barren land', 'impervious (other)', 'impervious (road)']


        this.colorDict = {
            "l1": "#B9E0FF",
            "l2": "#285430",
            "l3": "#A4BE7B",
            "l4": "#E5D9B6",
            "l5": "#EB6440",
            "l6": "#7743DB"
        }
        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 30, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .attr('class', 'legend-title')
            .text('Legend')
            .attr('transform', `translate(${vis.width / 2}, -10)`)
            .attr('text-anchor', 'middle');

        vis.svg
            .append('defs')
            .append('pattern')
            .attr('id', 'diagonalHatch')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', 4)
            .attr('height', 4)
            .append('path')
            .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
            .attr('stroke', '#000000')
            .attr('stroke-width', 1);


        vis.svg.selectAll().data(vis.colors13)
            .enter()
            .append('rect')
            .attr("x", vis.width/2-vis.width/6-2.5)
            .attr('y', (d,i)=>(i)*vis.height/6   + (i+1)*5)
            .attr('height', vis.height/6)
            .attr('width', vis.width/6)
            .style('fill', d=>d)

        vis.svg.selectAll().data(vis.labels13)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .attr("x",vis.width/2 - vis.width/6-7.5)
            .attr('y', (d,i)=>(i)*vis.height/6 + (i+1)*5 +10)
            .style('text-anchor', 'end')
            .text(d=>d)


        vis.svg.selectAll().data(vis.colors46)
            .enter()
            .append('rect')
            .attr("x", vis.width/2+2.5)
            .attr('y', (d,i)=>(i)*vis.height/6 + (i+1)*5)
            .attr('height', vis.height/6)
            .attr('width', vis.width/6)
            .style('fill', d=>d)

        vis.svg.selectAll().data(vis.labels46)
            .enter()
            .append('text')
            .attr('class', 'legend-text')
            .attr("x", vis.width/2 + vis.width/6 + 7.5)
            .attr('y', (d,i)=>(i)*vis.height/6 + (i+1)*5 +10)
            .text(d=>d)

        vis.svg.append('rect')
            .attr("x", vis.width/2 - vis.width/12)
            .attr('y', (d,i)=>(4)*vis.height/6 + (4+1)*5)
            .attr('height', vis.height/6)
            .attr('width', vis.width/6)
            .attr('fill', 'url(#diagonalHatch)')

        vis.svg
            .append('text')
            .attr('class', 'legend-text')
            .style('text-anchor', 'middle')
            .attr("x", vis.width/2)
            .attr('y', (d,i)=>(4)*vis.height/6+20)
            .text('synthetic')
    }
}