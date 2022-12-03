
class BreadCrumbBar {

    // constructor method to initialize Timeline object
    constructor(parentElement, scoreReal, scoreSyn, title) {
        this.parentElement = parentElement;
        //this.data = data

        this.colors = ['#008000', '#808000', '#000080', '#800080', '#008080', '#808080']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land', 'impervious (other)', 'impervious (road)']

        this.title = title

        this.colorDict = {
            "l1": "#B9E0FF",
            "l2": "#285430",
            "l3": "#A4BE7B",
            "l4": "#E5D9B6",
            "l5": "#EB6440",
            "l6": "#7743DB"
        }


        this.scoreReal = scoreReal;
        this.scoreSyn = scoreSyn;
        this.data = []

        this.scoreReal["Labelwise_DICE"].forEach( (d,i) =>{
            this.data.push({
                "label_name":`l${i+1}`,
                "real": d,
                "syn": this.scoreSyn["Labelwise_DICE"][i]
            })
        })

        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 20, right: 20, bottom: 20, left: 30};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // append pattern

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


        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .attr('class','title')
            .text(vis.title)
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')



        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');





        console.log(vis.scoreReal["Labelwise_DICE"])

        vis.groups = ["l1", "l2", "l3", "l4", "l5", "l6"]
        vis.subGroups = ["real", "syn"]

        //scales
        vis.x0 = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.groups)
            .padding([0.2])

        vis.x1 = d3.scaleBand()
            .domain(vis.subGroups)
            .range([0, vis.x0.bandwidth()])
            .padding([0.05])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0,1])

        // // axis
        vis.xAxisGroup.call(d3.axisBottom(vis.x0))
        vis.yAxisGroup.call(d3.axisLeft(vis.y).ticks(5))


        let barGroups = vis.svg.selectAll().data(vis.data)
            .enter().append('g')
            .attr('class', 'barGroup')
            .attr("transform", (d,i) => `translate(${vis.x0(d.label_name)},0)`)
            .attr('stroke', 5)
            .on('mouseover', function(event, d){
                console.log('d')
            })

        barGroups.selectAll(".bar.real")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar real")
            .style("fill","blue")
            .attr("x", d => vis.x1('real'))
            .attr("y", d => vis.y(d.real))
            .attr("width", vis.x1.bandwidth())
            .attr("height", d => {
                return vis.height - vis.y(d.real)
            })
            .style('fill', d => vis.colorDict[d.label_name])
            .on("mouseout", function (event, d) {

                console.log('out')

                // reset opacity
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0 + "px")
                    .style("top", 0 + "px")

            })
            .on('mouseover', function (event, d) {
                
                // update color of hovered state
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 0.8)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                            <div style="background: ${vis.colorDict[d.label_name]}; border-radius: 5px; border: thin solid rgb(128,128,128);">
                                <div style=" background: rgba(255,255,255,0.68); padding: 20px">
                                    <h3>${vis.labels[+  d.label_name[1]+1]}<h3>
                                    <h4> DICE real: ${d.real.toFixed(3)}</h4>
                                    <h4> DICE syn: ${d.syn.toFixed(3)}</h4>
                                </div>
                            </div>`);
            })



        let synRects = barGroups.selectAll(".bar.syn")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar syn")
            .attr("x", d => vis.x1('syn'))
            .attr("y", d => vis.y(d.syn))
            .attr("width", vis.x1.bandwidth())
            .attr("height", d => {
                return vis.height - vis.y(d.syn)
            })
            .style('fill', d => vis.colorDict[d.label_name])

        // add pattern
        barGroups.selectAll(".bar.syn.pattern")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("x", d => vis.x1('syn'))
            .attr("y", d => vis.y(d.syn))
            .attr("width", vis.x1.bandwidth())
            .attr("height", d => {
                return vis.height - vis.y(d.syn)
            })
            .attr('fill', 'url(#diagonalHatch)');



        // add color patches to color manager




    }
}