gantt = function(_parentElement, _data, _color){
    this.parentElement = _parentElement;
    this.color = _color;
    this.data = _data;
    this.displayData = _data;
    console.log(_data);

    this.initVis();
}

gantt.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 50, right: 75, bottom: 60, left: 60 };

    vis.width = vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = 350 - vis.margin.top - vis.margin.bottom;

    d3.select("#" + vis.parentElement).html("")
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")

    vis.y = d3.scaleBand()
        .range([0, vis.height])
        .paddingInner(.02);

    vis.wrangleData();
}

gantt.prototype.wrangleData = function(){
    var vis = this;

    vis.keys = []
    tmp = {}
    vis.displayData.forEach(function(d){
        if(!tmp.hasOwnProperty(d.COURSE_TITLE_LONG)){
            tmp[d.COURSE_TITLE_LONG] = 1;
            vis.keys.push(d.COURSE_TITLE_LONG)
        }
    })

    vis.updateVis();
}

gantt.prototype.updateVis = function(){
    var vis = this;

    vis.x.domain(d3.extent(vis.displayData, function(d) { return d.ACADEMIC_YEAR; }));

    vis.y.domain(vis.keys);

    var yearWidth = vis.x(parseDate(2017)) - vis.x(parseDate(2016));

    var bars = vis.svg.selectAll("rect.gantt")
        .data(vis.displayData);

    bars.enter().append("rect")
        .attr("class", "gantt")
        .merge(bars)
        .attr("x", function(d){
            return vis.x(d.ACADEMIC_YEAR) - yearWidth / 2;
        })
        .attr("y", function(d){
            return vis.y(d.COURSE_TITLE_LONG);
        })
        .attr("height", vis.y.bandwidth())
        .attr("width", yearWidth)
        .attr("fill", vis.color)
        .on("mouseover", function(d){
            console.log(d.COURSE_TITLE_LONG);
        })
        .on('click', function(d) {
            selectedCourse = d.COURSE_TITLE_LONG;
            selectedDepartment = d.CLASS_ACAD_ORG_DESCRIPTION;
            selectedYear = d.ACADEMIC_YEAR;
        });


    vis.svg.select(".x-axis").call(vis.xAxis);

}

gantt.prototype.selectionChanged = function(brushRegion){
    var vis = this;

    // Filter data accordingly without changing the original data
    vis.displayData = vis.data.filter(function(d){
        return d.ACADEMIC_YEAR >= brushRegion[0] && d.ACADEMIC_YEAR <= brushRegion[1]
    });

    // Update the visualization
    vis.wrangleData();
};
