EnrollmentBarchart = function(_parentElement, _data, _selected, _color, _year){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = [];
    this.selected = _selected;
    this.color = _color;
    this.year = _year;

    this.initVis();
};

EnrollmentBarchart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 10, right: 60, bottom: 40, left: 40 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;




    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x)
        .ticks(vis.parentElement == "DashboardBarChart" ? 4 : 10);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.wrangleData();
}

EnrollmentBarchart.prototype.wrangleData = function(){
    var vis = this;

    vis.displayData = vis.data.filter(function(d){
        return d.COURSE_TITLE_LONG == vis.selected;
    })


    vis.updateVis();
}

EnrollmentBarchart.prototype.updateVis = function(){
    var vis = this;

    var bars = vis.svg.selectAll("rect")
        .data(vis.displayData);

    var ext = d3.extent(vis.displayData, function(d){ return d.ACADEMIC_YEAR; });
    if (ext[0] == ext[1]){
        console.log("ass")
        document.getElementById(vis.parentElement).innerHTML = "Course only available for one year :("
        return
    }
    vis.x.domain(ext);

    vis.y.domain([0, d3.max(vis.displayData, function(d){ return +d.COURSE_ENROLLMENT_DATA; })]);

    bars.enter().append("rect")
        .merge(bars)
        .attr("fill", vis.color)
        .attr("opacity", function(d){ return d.ACADEMIC_YEAR.toString() == vis.year.toString() ? 1 : 0.35; })
        .attr("width", vis.width / (vis.displayData.length + .1))
        .attr("height", function(d){ return vis.y(+d.COURSE_ENROLLMENT_DATA); })
        .attr("x", function(d,i){ return (i * vis.width / (vis.displayData.length)) + 2})
        .attr("y", function(d){ return vis.height - vis.y(+d.COURSE_ENROLLMENT_DATA)});

    bars.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

}

