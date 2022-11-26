/* * * * * * * * * * * * * *
*        ScatterVis        *
* * * * * * * * * * * * * */


class ImageViewer {

    // constructor method to initialize Timeline object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data

        this.labelToColor = {
            1: '#008000',
            2: '#808000',
            3: '#000080',
            4: '#800080',
            5: '#008080',
            6: '#808080'
        }

        this.colors = ['#008000', '#808000', '#000080',  '#800080', '#008080', '#808080']



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
            .attr('href', `../img/sat_image_gt/${selectedImageName}.jpeg`)
            .attr('height', `${vis.rowOneHeight}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width/100}`)
            .attr('y', `${vis.height/16}`)


        // sat_image_syn
        vis.img_2 = vis.svg.append('image')
            .attr('href', `../img/sat_image_syn/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width/100}`)
            .attr('y', `${vis.height*4/8}`)


        // label_in_gt
        vis.img_3 = vis.svg.append('image')
            .attr('href', `../img/label_in_gt/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*15.5/100}`)
            .attr('y', `${vis.height*2.3/8}`)


        // label_out_real
        vis.img_4 = vis.svg.append('image')
            .attr('href', `../img/label_out_real/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*30/100}`)
            .attr('y', `${vis.height/16}`)


        // label_out_syn
        vis.img_5 = vis.svg.append('image')
            .attr('href', `../img/label_out_syn/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', `${vis.width*30/100}`)
            .attr('y', `${vis.height/2}`)

        // init satellite ground truth
        vis.img_6 = vis.svg.append('image')
            .attr('href', `../img/contrast_real/${selectedImageName}.jpeg`)
            .attr('height', `${vis.width/8}`)
            .attr('width',  `${vis.width/8}`)
            .attr('x', '40vw')
            .attr('y', '5vh')


        // init satellite ground truth
        vis.img_7 = vis.svg.append('image')
            .attr('href', `../img/contrast_syn/${selectedImageName}.jpeg`)
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
        vis.img_1.attr('href', `../img/sat_image_gt/${selectedImageName}.jpeg`)       // sat_image_gt
        vis.img_2.attr('href', `../img/sat_image_syn/${selectedImageName}.jpeg`)      // sat_image_syn
        vis.img_3.attr('href', `../img/label_in_gt/${selectedImageName}.jpeg`)        // label_in_gt
        vis.img_4.attr('href', `../img/label_out_real/${selectedImageName}.jpeg`)     // label_out_real
        vis.img_5.attr('href', `../img/label_out_syn/${selectedImageName}.jpeg`)      // label_out_syn
        vis.img_6.attr('href', `../img/contrast_real/${selectedImageName}.jpeg`)      // contrast_real
        vis.img_7.attr('href', `../img/contrast_syn/${selectedImageName}.jpeg`)       // contrast_syn
    }

    updateBars() {
        let vis = this;

        // grab name of currently selected image and get the data
        let imageData = vis.data['info_by_image'][selectedImageName]


        let f1_real_data = imageData['f1_real']
        let f1_syn_data = imageData['f1_syn']

        // scale for x axis
        vis.xScale = d3.scaleBand()
            .domain((f1_real_data).map( (d,i) => i))
            .range([0, vis.width/5])
            .round(true)
            .padding(.1)

        vis.yScale = d3.scaleLinear()
            .range([vis.rowOneHeight, 0])
            .domain([0, 1])



        // draw top bars
        vis.barsTop = vis.barTopGroup.selectAll("rect").data(f1_real_data)

        vis.barsTop.enter().append('rect')
            .merge(vis.barsTop)
            .attr('class', d => "topBar")
            .attr('x', (d,i) => vis.xScale(i))
            .attr('y', d => vis.yScale(d))
            .attr('height', d => vis.rowOneHeight - vis.yScale(d))
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
                        <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <h3>test<h3>
                            <h4> f1: ${d}</h4>
                      
                        </div>`);
            })

        vis.barsTop.exit().remove()

        // axis
        vis.xAxisGroupTop.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroupTop.transition().duration(500).call(d3.axisLeft(vis.yScale))

        // draw top bars
        vis.barsBottom = vis.barBottomGroup.selectAll("rect").data(f1_syn_data)

        vis.barsBottom.enter().append('rect')
            .merge(vis.barsBottom)
            .attr('class', d => "topBar")
            .attr('x', (d,i) => vis.xScale(i))
            .attr('y', d => vis.yScale(d))
            .attr('height', d => vis.rowOneHeight - vis.yScale(d))
            .attr('width', vis.xScale.bandwidth())
            .attr('fill', (d,i) => vis.colors[i])

        vis.barsBottom.exit().remove()

        // axis
        vis.xAxisGroupBottom.transition().duration(500).call(d3.axisBottom(vis.xScale))
        vis.yAxisGroupBottom.transition().duration(500).call(d3.axisLeft(vis.yScale))


    }


}