DepartmentTimeline = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

DepartmentTimeline.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 25, right: 25, bottom: 60, left: 20 };

    vis.width = $("#departmenttimeline").width() - vis.margin.left - vis.margin.right;

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.wrangleData();
};

DepartmentTimeline.prototype.wrangleData = function(){
    var vis = this;

    vis.x.domain(d3.extent(vis.displayData, function(d) { return d.ACADEMIC_YEAR; }));

    vis.displayData = d3.nest()
        .key(function(d){ return d.CLASS_ACAD_ORG_DESCRIPTION })
        .rollup(function(leaves){ return d3.extent(leaves, function(d){
            return d.ACADEMIC_YEAR
        }); })
        .entries(vis.displayData);

    vis.updateVis();
}

DepartmentTimeline.prototype.updateVis = function(){
    var vis = this;

    vis.height = 5 * vis.displayData.length;
    // SVG drawing area
    d3.select("#" + vis.parentElement).html("")
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis);

    // mouseover display
    vis.tooltip = vis.svg.append("text")
        .attr("x", 50)
        .attr("y", -10);

    var bars = vis.svg.selectAll("rect.timebar")
        .data(vis.displayData);
    bars.enter().append("rect")
        .attr("class", "timebar")
        .merge(bars)
        .on("mouseover", function(d){
            d3.select("#tooltip").text(d.key);
        })
        .on("mouseout", function(d){
            d3.select("#tooltip").text("Mouseover to see fields.");
        })
        .attr("x", function(d){
            return vis.x(d.value[0]);
        })
        .attr("y", function(d, i){
            return i * 5
        })
        .attr("height", 3)
        .attr("width", function(d){
            return vis.x(d.value[1]) - vis.x(d.value[0]);
        })
        .attr("fill", "steelblue");
        // .attr("pointer-events", "none");

    bars.exit().remove()
}

DepartmentTimeline.prototype.selectionChanged = function(brushRegion){
    var vis = this;

    // Filter data accordingly without changing the original data
    vis.displayData = vis.data.filter(function(d){
        return d.ACADEMIC_YEAR >= brushRegion[0] && d.ACADEMIC_YEAR <= brushRegion[1]
    });

    // Update the visualization
    vis.wrangleData();
};
