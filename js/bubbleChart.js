// USE THIS ONE
// https://bl.ocks.org/mbostock/4063269


BubbleChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.normalize = false;

    this.initVis();
    this.updateVis();
};

BubbleChart.prototype.initVis = function(){
    var vis = this;

    // define margins
    vis.margin = { top: 10, right: 10, bottom: 30, left: 30 };

    // calculate width and height
    vis.width = $("#" + this.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = 200 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
            "," + vis.margin.top + ")");
    
    vis.wrangleData();
};


BubbleChart.prototype.wrangleData = function() {
    var vis = this;

    console.log(vis.data);

    vis.data.forEach(function(d){
        vis.displayData.push({
            key: d.id,
            value: +d.course_enrollment
        });
    });
    vis.updateVis();
};




BubbleChart.prototype.updateVis = function() {
    var vis = this;

    console.log("update vis is running");
    console.log(vis.displayData);

    vis.svg.append("text")
        .attr("transform", "translate(" + (vis.width / 2) + "," + (vis.height / 2) + ")")
        .attr("text-anchor", "middle")
        .text("Bubble Chart");

/*    var bubbles = vis.svg.selectAll('.course').append('circle').data(vis.displayData);

    bubbles.enter().append("circle")
        .attr("class", "course")
        .attr("x", vis.width/2)
        .attr("y", vis.height/2)
        .attr("r", 10);*/



};

