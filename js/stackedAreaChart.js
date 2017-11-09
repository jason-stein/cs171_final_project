// CLASS DECLARATION FOR STACKED AREA CHART
//
// expects data in raw row format as provided from original CSV

StackedAreaChart = function(_parentElement, _data, _fields){
    this.parentElement = _parentElement;
    this.data = _data;
    this.fields = _fields;
    this.displayData = [];
    this.normalize = false;

    this.initVis();
}

// all one-time init business
StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 80 };

    vis.width = 800 - vis.margin.left - vis.margin.right,
    vis.height = 600 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");


    // scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.ACADEMIC_YEAR; }));

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.ylab = vis.svg.append("text")
        .attr("transform", "translate(-50," + vis.height / 2 + ")rotate(270)")
        .attr("text-anchor", "middle")

    vis.xlab = vis.svg.append("text")
        .attr("transform", "translate(" + (vis.width / 2) + "," + (vis.height + 40) + ")")
        .attr("text-anchor", "middle")
        .text("Year")

    // area constructor
    vis.area = d3.area()
        .x(function(d) { return vis.x(d.data.year); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });

    // mouseover display
    vis.tooltip = vis.svg.append("text")
        .attr("x", 50)
        .attr("y", -10);

    vis.wrangleData();
}

// data manipulation
StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

    vis.displayData = []

    // nest data by year first
    vis.nestData = d3.nest()
        .key(function(d){ return d.ACADEMIC_YEAR; })
        .entries(vis.data);

    // now for each year, nest per academic organization
    // this will give: [{year: ___, org1: ___, org2: ___ ...} ...]
    vis.nestData.forEach(function(year, i){
        var array = d3.nest()
            .key(function(d){ return d.CLASS_ACAD_ORG_DESCRIPTION })
            .rollup(function(leaves){ return leaves.length; })
            .entries(year.values);
        var object = {}
        array.forEach(function(d){
            object[d.key] = d.value;
        })
        vis.displayData.push(object);
        vis.displayData[i].year = year.key
    });

    // get all the concentrations we care about
    vis.keys = []
    vis.fields.forEach(function(d){
        vis.keys.push(d.Concentration)
    })

    // d3.stack wants zeros for empty fields
    // (could infer but whatever Mike Bostock)
    vis.displayData.forEach(function(d){
        vis.fields.forEach(function(e){
            if (!d.hasOwnProperty(e.Concentration)){
                d[e.Concentration] = 0;
            }
        });
    });

    // create a stack constructor
    vis.stack = d3.stack()
        .keys(vis.keys);

    // normalize?
    if(vis.normalize){
        vis.ylab.text("Fraction of Courses")
        vis.stack.offset(d3.stackOffsetExpand)
    }
    else{
        vis.ylab.text("Number of Courses")
        vis.stack = d3.stack()
        .keys(vis.keys);
    }

    // stack the data
    vis.displayData = vis.stack(vis.displayData);

    // that thing about nest with non-string keys... whatever Bostock
    vis.displayData.forEach(function(d){
        d.forEach(function(e){
            e.data.year = new Date(e.data.year);
        })
    })

    vis.updateVis()
}

// dynamic shit
StackedAreaChart.prototype.updateVis = function(){
    var vis = this;

    // get 2-d max
    vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
    ]);

    // colorscale domain
    // (will overflow range and repeat... actually thanks Bostock)
    vis.colorScale.domain(vis.keys);

    // enter-update-exit paths
    var categories = vis.svg.selectAll(".area")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "area")
        .merge(categories)
        .on("mouseover", function(d, i){
            vis.tooltip.text(d.key);
        })
        .on("mouseout", function(d){
            vis.tooltip.text("");
        })
        .transition()
        .duration(800)
        .attr("d", function(d) {
            return vis.area(d);
        })
        .attr("fill", function(d){
            return vis.colorScale(d.key);
        })

    categories.exit().remove();

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").transition().duration(800).call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);
}
