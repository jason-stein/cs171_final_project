

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
    console.log("test");

    vis.updateVis();
};




BubbleChart.prototype.updateVis = function() {
    var vis = this;

    vis.root = d3.hierarchy({children: vis.data})
        .sum(function(d) { return d.course_enrollment; })
        .each(function(d) {
            if (id = d.course) {
                var id, i = id.lastIndexOf(".");
                d.id = id;
                d.package = id.slice(0, i);
                d.class = id.slice(i + 1);
            }
        });

    console.log(vis.root);
    vis.pack = d3.pack()
        .size([vis.width, vis.height])
        .padding(1.5);

    var node = vis.svg.selectAll(".node")
        .data(vis.pack(vis.root).leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return "blue"; });

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function(d) { return d; });

    node.append("title")
        .text(function(d) { return d.id + "\n" + format(d.course_enrollment); });
/*    console.log("update vis is running");
    console.log(vis.displayData);

    vis.svg.append("text")
        .attr("transform", "translate(" + (vis.width / 2) + "," + (vis.height / 2) + ")")
        .attr("text-anchor", "middle")
        .text("Bubble Chart");*/



/*    var bubbles = vis.svg.selectAll('.course').append('circle').data(vis.displayData);
https://bl.ocks.org/mbostock/4063269
    bubbles.enter().append("circle")
        .attr("class", "course")
        .attr("x", vis.width/2)
        .attr("y", vis.height/2)
        .attr("r", 10);*/



};



