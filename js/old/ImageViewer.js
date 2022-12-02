/* * * * * * * * * * * * * *
*        ScatterVis        *
* * * * * * * * * * * * * */


class ImageViewer {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data

        this.colors = ['#008000', '#808000', '#000080',  '#800080', '#008080', '#808080']
        this.labels = ['water', 'tree canopy / forest', 'low vegetation / field', 'barren land',  'impervious (other)', 'impervious (road)']

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

        vis.rowOneHeight = vis.width/8

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')




        this.initImages();
        this.updateBars();

    }

    initImages(){
        let vis = this;

        // sat_image_gt
        vis.img_1 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/sat_image_gt/${selectedImageName}.jpeg`)
            .attr('height', `${vis.rowOneHeight}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width/100}`)
            .attr('y', `${vis.height/16}`)


        // sat_image_syn
        vis.img_2 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/sat_image_syn/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width/100}`)
            .attr('y', `${vis.height*4/8}`)


        // label_in_gt
        vis.img_3 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/label_in_gt/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*15.5/100}`)
            .attr('y', `${vis.height*2.3/8}`)


        // label_out_real
        vis.img_4 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/label_out_real/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*30/100}`)
            .attr('y', `${vis.height/16}`)


        // label_out_syn
        vis.img_5 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/label_out_syn/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*30/100}`)
            .attr('y', `${vis.height/2}`)

        // init satellite ground truth
        vis.img_6 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/contrast_real/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', '40vw')
            .attr('y', '5vh')


        // init satellite ground truth
        vis.img_7 = vis.svg.append('image')
            .attr('href', `data/rob_1/img/contrast_syn/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', '40vw')
            .attr('y', `${vis.height/2}`)

        // top
        vis.barTopGroup = vis.svg.append('g')
            .attr('transform', `translate (${vis.width/1.5}, 50)`)

        // axis groups
        vis.xAxisGroupTop = vis.barTopGroup.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.rowOneHeight})`);

        vis.yAxisGroupTop = vis.barTopGroup.append('g')
            .attr('class', 'axis y-axis');


        // bottom
        vis.barBottomGroup = vis.svg.append('g')
            .attr('transform', `translate (${vis.width/1.5}, ${vis.height/2})`)

        // axis groups
        vis.xAxisGroupBottom = vis.barBottomGroup.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.rowOneHeight})`);

        vis.yAxisGroupBottom = vis.barBottomGroup.append('g')
            .attr('class', 'axis y-axis');

    }

    updateImages(selectedImageName){

        let vis = this
        vis.img_1.attr('href', `data/rob_1/img/sat_image_gt/${selectedImageName}.jpeg`)       // sat_image_gt
        vis.img_2.attr('href', `data/rob_1/img/sat_image_syn/${selectedImageName}.jpeg`)      // sat_image_syn
        vis.img_3.attr('href', `data/rob_1/img/label_in_gt/${selectedImageName}.jpeg`)        // label_in_gt
        vis.img_4.attr('href', `data/rob_1/img/label_out_real/${selectedImageName}.jpeg`)     // label_out_real
        vis.img_5.attr('href', `data/rob_1/img/label_out_syn/${selectedImageName}.jpeg`)      // label_out_syn
        vis.img_6.attr('href', `data/rob_1/img/contrast_real/${selectedImageName}.jpeg`)      // contrast_real
        vis.img_7.attr('href', `data/rob_1/img/contrast_syn/${selectedImageName}.jpeg`)       // contrast_syn
    }

    updateBars() {
        let vis = this;

        // grab name of currently selected image and get the data
        let imageData = vis.data['info_by_image'][selectedImageName]

        console.log(imageData)

        let dataReal = []
        imageData['f1_real'].forEach( (f1_score,i) =>{
            dataReal.push({
                f1_score : f1_score,
                summary: imageData['tmp_summary_dict_real'][i+1],
                label: vis.labels[i],
                color: vis.colors[i]
            })
        })

        let dataSyn = []
        imageData['f1_syn'].forEach( (f1_score, i) =>{
            //console.log(imageData['tmp_summary_dict_syn'], imageData['tmp_summary_dict_syn'][i])
            dataSyn.push({
                f1_score : f1_score,
                summary: imageData['tmp_summary_dict_syn'][i+1],
                label: vis.labels[i],
                color: vis.colors[i]
            })
        })

        let f1_syn_data = imageData['f1_syn']

        // scale for x axis
        vis.xScale = d3.scaleBand()
            .domain((dataReal).map( (d,i) => i))
            .range([0, vis.width/4])
            .round(true)
            .padding(.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.rowOneHeight, 0])
            .domain([0, 1])



        // draw top bars
        vis.barsTop = vis.barTopGroup.selectAll("rect").data(dataReal)

        vis.barsTop.enter().append('rect')
            .merge(vis.barsTop)
            .attr('class', d => "topBar")
            .attr('x', (d,i) => vis.xScale(i))
            .attr('y', d => vis.yScale(d.f1_score))
            .attr('height', d => vis.rowOneHeight - vis.yScale(d.f1_score))
            .attr('width', vis.xScale.bandwidth())
            .attr('fill', (d,i) => vis.colors[i])

            .on("mouseout", function (event, d) {

                // reset opacity
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0 + "px")
                    .style("top", 0 + "px")

            })
            .on('mouseover', function (event, d, i) {

                // update color of hovered state
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 0.8)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                            <div style="background: ${d.color}; border-radius: 5px; border: thin solid rgb(128,128,128);">
                                <div style=" background: rgba(255,255,255,0.68); padding: 20px">
                                    <h3>${d.label}<h3>
                                    <h4> f1: ${d.f1_score}</h4>
                                    <h4> correct labels: ${d.summary['correct']}</h4>
                                    <h4> incorrect labels: ${d.summary['incorrect']}</h4>
                                </div>
                            </div>`);
            })

        vis.barsTop.exit().remove()

        // axis
        vis.xAxisGroupTop.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroupTop.transition().duration(500).call(d3.axisLeft(vis.yScale))

        // draw top bars
        vis.barsBottom = vis.barBottomGroup.selectAll("rect").data(dataSyn)

        vis.barsBottom.enter().append('rect')
            .merge(vis.barsBottom)
            .attr('class', d => "topBar")
            .attr('x', (d,i) => vis.xScale(i))
            .attr('y', d => vis.yScale(d.f1_score))
            .attr('height', d => vis.rowOneHeight - vis.yScale(d.f1_score))
            .attr('width', vis.xScale.bandwidth())
            .attr('fill', (d,i) => vis.colors[i])

            .on("mouseout", function (event, d) {

                // reset opacity
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 1)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0 + "px")
                    .style("top", 0 + "px")

            })
            .on('mouseover', function (event, d, i) {

                // update color of hovered state
                d3.select(this)
                    .attr('stroke-width', 1)
                    .style('opacity', 0.8)

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                            <div style="background: ${d.color}; border-radius: 5px; border: thin solid rgb(128,128,128);">
                                <div style=" background: rgba(255,255,255,0.68); padding: 20px">
                                    <h3>${d.label}<h3>
                                    <h4> f1: ${d.f1_score}</h4>
                                    <h4> correct labels: ${d.summary['correct']}</h4>
                                    <h4> incorrect labels: ${d.summary['incorrect']}</h4>
                                </div>
                            </div>`);
            })

        vis.barsBottom.exit().remove()

        // axis
        vis.xAxisGroupBottom.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroupBottom.transition().duration(500).call(d3.axisLeft(vis.yScale))


    }



}