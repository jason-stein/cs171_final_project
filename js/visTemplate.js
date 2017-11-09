Visualization = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];

    this.initVis();
}

Visualization.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 50, right: 0, bottom: 60, left: 60 };

    vis.width = 800 - vis.margin.left - vis.margin.right,
    vis.height = 600 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    vis.wrangleData();
}

Visualization.prototype.wrangleData = function(){
    var vis = this;

    vis.updateVis();
}

Visualization.prototype.updateVis = function(){
    var vis = this;
}

