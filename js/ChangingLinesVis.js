
class LineVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data

        this.colors = ['#008000', '#808000', '#000080', '#800080', '#008080', '#808080']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land', 'impervious (other)', 'impervious (road)']

        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
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
            .text('Title for Image')
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

    }
}