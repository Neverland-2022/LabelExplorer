
class MultiLineVis {

    // constructor method to initialize Timeline object
    constructor(parentElement, allData, title) {
        this.parentElement = parentElement;

        this.colors = ['#008000', '#808000', '#000080', '#800080', '#008080', '#808080']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land', 'impervious (other)', 'impervious (road)']
        this.groups = ["syn_000", "syn_025", "syn_050", "syn_075", "syn_100", "syn_200"]

        this.titleText = title

        this.metric = "Labelwise_DICE"
        this.metricName = 'DICE'

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

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'multiLineTooltip')


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
        vis.title = vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .attr('class', 'title')
            .text('Change in DICE Scores for predicted Label Masks (Real & Synthetic) over Different Experiment Ratios')
            .attr('transform', `translate(${vis.width / 2}, -20)`)
            .attr('text-anchor', 'middle');

        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .attr('class', 'sub-title')
            .text('(segmentation model trained on synthetic satellite images)')
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
            .domain([0, 1])

        // // axis
        vis.xAxisGroup.call(d3.axisBottom(vis.x))
        vis.yAxisGroup.call(d3.axisLeft(vis.y))


        vis.wrangleData()

    }
    wrangleData(){
        let vis = this


        let dataReal = []

        let helperReal = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]}
        let helperSyn = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[]}
        vis.data.forEach( (jsonFile,i) => {

            // syn if odd
            if (i%2){
                console.log(jsonFile[vis.metric])
                //
                jsonFile[vis.metric].forEach((d,i) => helperSyn[i].push(d))

            } else { // else -> real
                jsonFile[vis.metric].forEach((d,i) => helperReal[i].push(d))
            }
        })


        vis.finalSyn = []

        Object.entries(helperSyn).forEach(d =>{
            vis.finalSyn.push({
                key: `l${+d[0] +1}`,
                values: d[1]
            })
        })

        vis.finalReal = []

        Object.entries(helperReal).forEach(d =>{
            vis.finalReal.push({
                key: `l${+d[0] +1}`,
                values: d[1]
            })
        })

        vis.updateVis()
    }

    updateVis(){

        let vis = this

        // Draw the line for real
        let realLines = vis.svg.selectAll(".realline")
            .data(vis.finalReal)

            realLines
                .enter()
                .append("path")
                .attr('class','realline')
                .merge(realLines)
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
                .on('mouseover', function (event,d) {
                    console.log(d, +d.key[1])
                    d3.select(this).attr('stroke-width',6)

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY -100 + "px")
                        .html(`
                                <div style="background: ${vis.colorDict[d.key]}; border-radius: 5px; border: thin solid rgb(128,128,128);opacity: 0.9">
                                    <div style=" background: rgba(255,255,255,0.68); padding: 20px">
                                        <table>
                                            <tr>      
                                                  <h3 style="text-align: center">${vis.labels[+d.key[1]-1]}<h3>
                                                  <h4 style="text-align: center">(real Label mask)<h4>
    
                                            </tr>
                                            <tr style=" font-style: italic; " >
                                                <td style="border-right: thin solid grey; padding: 2px">syn_000</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_025</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_050</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_075</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_100</td>
                                                <td>syn_200</td>
                                              </tr>
                                              <tr>
                                                <td style="border-right: thin solid grey">${d.values[0].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[1].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[2].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[3].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[4].toFixed(3)}</td>
                                                <td>${d.values[5].toFixed(3)}</td>
                                              </tr>
                                        </table>
                                        
                                    </div>
                                </div>`);

                })
                .on('mouseout', function (event,d) {
                    console.log(d)
                    d3.select(this).attr('stroke-width',3)


                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0 + "px")
                        .style("top", 0 + "px")

                })

        // Draw the lines for synthetic
        let synLines = vis.svg.selectAll(".synline")
            .data(vis.finalSyn)

            synLines
                .enter()
                .append("path")
                .attr('class', 'synline')
                .merge(synLines)
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
                .on('mouseover', function (event,d) {
                    console.log(d, +d.key[1])
                    d3.select(this).attr('stroke-width',6)

                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY -100 + "px")
                        .html(`
                                <div style="background: ${vis.colorDict[d.key]}; border-radius: 5px; border: thin solid rgb(128,128,128);opacity: 0.9">
                                    <div style=" background: rgba(255,255,255,0.68); padding: 20px">
                                        <table>
                                            <tr>      
                                                  <h3 style="text-align: center">${vis.labels[+d.key[1]-1]}<h3>
                                                  <h4 style="text-align: center">(synthetic label mask)<h4>
    
                                            </tr>
                                            <tr style=" font-style: italic; " >
                                                <td style="border-right: thin solid grey; padding: 2px">syn_000</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_025</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_050</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_075</td>
                                                <td style="border-right: thin solid grey; padding: 2px">syn_100</td>
                                                <td>syn_200</td>
                                              </tr>
                                              <tr>
                                                <td style="border-right: thin solid grey">${d.values[0].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[1].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[2].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[3].toFixed(3)}</td>
                                                <td style="border-right: thin solid grey">${d.values[4].toFixed(3)}</td>
                                                <td>${d.values[5].toFixed(3)}</td>
                                              </tr>
                                        </table>
                                        
                                    </div>
                                </div>`);

                })
                .on('mouseout', function (event,d) {
                    console.log(d)
                    d3.select(this).attr('stroke-width',3)


                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0 + "px")
                        .style("top", 0 + "px")

                })



    }
}