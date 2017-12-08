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

    vis.margin = { top: 40, right: 40, bottom: 40, left: 40 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;




    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    // scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x)
        .ticks(vis.parentElement == "DashboardBarChart" ? 4 : 10);

    vis.svg.append("line")
        .attr("x1",0)
        .attr("x2", vis.width)
        .attr("y1", vis.height + .5)
        .attr("y2", vis.height + .5)
        .attr("stroke", "black");

    vis.svg.append("g")
        .attr("class", "x-axis axis");

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.formatDate = d3.timeFormat("%Y");

    // course title placeholder
    vis.subtitle = vis.svg.append("text")
        .attr("class", "bubbletooltip")
        .attr("x", vis.width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "17pt");

    vis.wrangleData();
}

EnrollmentBarchart.prototype.wrangleData = function(){
    var vis = this;

    // filter to course
    vis.displayData = vis.data.filter(function(d){
        return d.COURSE_TITLE_LONG == vis.selected;
    })

    vis.updateVis();
}

EnrollmentBarchart.prototype.updateVis = function(){
    var vis = this;

    // create bars
    var bars = vis.svg.selectAll("rect")
        .data(vis.displayData);

    var ext = d3.extent(vis.displayData, function(d){ return d.ACADEMIC_YEAR; });
    // date objects are permanent
    ext[0] = new Date(ext[0])
    ext[1] = new Date(ext[1])
    ext[1].setFullYear(ext[1].getFullYear() + 1)
    vis.x.domain(ext);

    vis.y.domain([0, d3.max(vis.displayData, function(d){ return +d.COURSE_ENROLLMENT_DATA; })]);

    // define width of bars
    var barwidth = vis.width / (+vis.formatDate(ext[1]) - +vis.formatDate(ext[0]) + 1)
    if (isNaN(barwidth)){
        barwidth = vis.width / 2
    }

    // create bars
    bars.enter().append("rect")
        .merge(bars)
        .attr("fill", vis.color)
        .attr("width", barwidth)
        .attr("height", function(d){ return vis.height - vis.y(+d.COURSE_ENROLLMENT_DATA); })
        .attr("x", function(d,){ return vis.x(d.ACADEMIC_YEAR) + 1 })
        .attr("y", function(d){ return vis.y(+d.COURSE_ENROLLMENT_DATA)})
        .on("click", function(d){
            // reset bubble charts
            vis.parent1.year = d.ACADEMIC_YEAR;
            vis.parent1.svg.selectAll(".node").remove();
            vis.parent1.wrangleData();
            vis.parent2.year = d.ACADEMIC_YEAR;
            vis.parent2.svg.selectAll(".node").remove();
            vis.parent2.wrangleData();
            // reset info box
            document.getElementById("info3").innerHTML =
                    "<li>Year: " + vis.formatDate(d.ACADEMIC_YEAR) + "</li>";
            document.getElementById("info4").innerHTML =
                    "<li>Year: " + d.COURSE_ENROLLMENT_DATA + "</li>";
        });

    bars.exit().remove();

    // only want text on parent
    if (vis.parentElement == "ZoomedBarChart"){
        vis.subtitle.text(vis.selected);
    }

    vis.svg.select(".x-axis").call(vis.xAxis).attr("transform", "translate(" + (barwidth / 2) + "," + vis.height + ")");;
    vis.svg.select(".y-axis").call(vis.yAxis);

}

