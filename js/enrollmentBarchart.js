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

    vis.margin = { top: 5, right: 40, bottom: 40, left: 40 };
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

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.formatDate = d3.timeFormat("%Y")

    vis.wrangleData();
}

EnrollmentBarchart.prototype.wrangleData = function(){
    var vis = this;

    vis.displayData = vis.data.filter(function(d){
        return d.COURSE_TITLE_LONG == vis.selected;
    })

    // var tmpObj = {}
    // tmpData.forEach(function(d){
    //     if(tmpObj.hasOwnProperty(d.COURSE_TITLE_LONG + "/" + d.ACADEMIC_YEAR)){
    //         tmpObj[d.COURSE_TITLE_LONG + "/" + d.ACADEMIC_YEAR] += +d.COURSE_ENROLLMENT_DATA
    //     }
    //     else{
    //         tmpObj[d.COURSE_TITLE_LONG + "/" + d.ACADEMIC_YEAR] = +d.COURSE_ENROLLMENT_DATA
    //     }
    // })

    // Object.keys(tmpObj).forEach(function(key){
    //     keySplit = key.split("/")
    //     vis.displayData.push({"COURSE_TITLE_LONG": keySplit[0], "ACADEMIC_YEAR": keySplit[1], "COURSE_ENROLLMENT_DATA": tmpObj[key]})
    // })
    // console.log(vis.data)
    // console.log(vis.displayData)

    // console.log(tmpObj)


    vis.updateVis();
}

EnrollmentBarchart.prototype.updateVis = function(){
    var vis = this;

    var bars = vis.svg.selectAll("rect")
        .data(vis.displayData);

    var ext = d3.extent(vis.displayData, function(d){ return d.ACADEMIC_YEAR; });
    ext[0] = new Date(ext[0])
    ext[1] = new Date(ext[1])
    ext[1].setFullYear(ext[1].getFullYear() + 1)
    vis.x.domain(ext);

    console.log(ext)

    console.log(vis.displayData)
    vis.displayData.forEach(function(d){
        console.log(d.ACADEMIC_YEAR, +d.COURSE_ENROLLMENT_DATA)
    })

    vis.y.domain([0, d3.max(vis.displayData, function(d){ return +d.COURSE_ENROLLMENT_DATA; })]);

    var barwidth = vis.width / (+vis.formatDate(ext[1]) - +vis.formatDate(ext[0]) + 1)

    bars.enter().append("rect")
        .merge(bars)
        .attr("fill", vis.color)
        .attr("width", barwidth)
        .attr("height", function(d){ return vis.height - vis.y(+d.COURSE_ENROLLMENT_DATA); })
        .attr("x", function(d,){ return vis.x(d.ACADEMIC_YEAR) + 1 })
        .attr("y", function(d){ return vis.y(+d.COURSE_ENROLLMENT_DATA)});

    bars.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis).attr("transform", "translate(" + (barwidth / 2) + "," + vis.height + ")");;
    vis.svg.select(".y-axis").call(vis.yAxis);

}

