
class MultiLineVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, allData, title) {
        this.parentElement = parentElement;

        this.colors = ['#008000', '#808000', '#000080', '#800080', '#008080', '#808080']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land', 'impervious (other)', 'impervious (road)']
        this.groups = ["syn_000", "syn_025", "syn_050", "syn_075", "syn_100", "syn_200"]

        this.title = title

        this.colorDict = {
            "l1": "#B9E0FF",
            "l2": "#285430",
            "l3": "#A4BE7B",
            "l4": "#E5D9B6",
            "l5": "#EB6440",
            "l6": "#7743DB"
        }

        this.data = allData


        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
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
            .text('title')
            .attr('transform', `translate(${vis.width / 2}, -5)`)
            .attr('text-anchor', 'middle');

        // axis groups
        vis.xAxisGroup = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxisGroup = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        //scales
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .domain(vis.groups)
            .padding([0.2])


        vis.y = d3.scaleLinear()
            .range([vis.height, 0])
            .domain([0,1])

        // // axis
        vis.xAxisGroup.call(d3.axisBottom(vis.x))
        vis.yAxisGroup.call(d3.axisLeft(vis.y))



        console.log(vis.data)

        let dataReal = []

        let helperReal = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]}
        let helperSyn = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]}
        vis.data.forEach( (jsonFile,i) => {

            // syn if odd
            if (i%2){
                console.log(jsonFile["Labelwise_DICE"])
                //
                jsonFile["Labelwise_DICE"].forEach((d,i) => helperSyn[i].push(d))

            } else { // else -> real
                jsonFile["Labelwise_DICE"].forEach((d,i) => helperReal[i].push(d))
            }
        })


        let finalSyn = []

        Object.entries(helperSyn).forEach(d =>{
            finalSyn.push({
                key: `l${+d[0] +1}`,
                values: d[1]
            })
        })

        let finalReal = []

        Object.entries(helperReal).forEach(d =>{
            finalReal.push({
                key: `l${+d[0] +1}`,
                values: d[1]
            })
        })


        console.log(finalReal)





        // Draw the line
        vis.svg.selectAll(".line")
            .data(finalSyn)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", function(d){ return vis.colorDict[d.key] })
            .attr("d", function(d){
                return d3.line()
                    .x(function(d,i) { return vis.x(vis.groups[i]) +vis.x.bandwidth()/2})
                    .y(function(d) { return vis.y(d); })
                    .curve(d3.curveCardinal)
                    (d.values)
            })

        // Draw the line
        vis.svg.selectAll(".line")
            .data(finalReal)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke-dasharray","5,5")
            .attr("stroke", function(d){ return vis.colorDict[d.key] })
            .attr("d", function(d){
                return d3.line()
                    .x(function(d,i) { return vis.x(vis.groups[i]) +vis.x.bandwidth()/2})
                    .y(function(d) { return vis.y(d); })
                    .curve(d3.curveCardinal)
                    (d.values)
            })

        // let circleGroups = vis.svg.selectAll(".circle").data(finalSyn)
        //     .enter().append("g")
        //
        //     circleGroups
        //     .selectAll('.circle').data((d,i)=>d.values)
        //         .enter().append('circle')
        //         .attr('class', (d,i)=>{
        //             console.log(d,i)
        //         })
        //         .attr("cx", (d,i) => vis.x(vis.groups[i]) +vis.x.bandwidth()/2)
        //         .attr('cy', d=>vis.y(d))
        //         .attr('r',5)
        //         .attr("fill", )



        finalSyn.forEach(labelData=>{

        })

        //
        // // draw circles




    }
}