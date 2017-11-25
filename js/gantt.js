gantt = function(_parentElement, _data, _color){
    this.parentElement = _parentElement;
    this.color = _color;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

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

    vis.gX = vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.y = d3.scaleBand()
        .range([0, vis.height])
        .paddingInner(.02);

    vis.yscale = 1;

    vis.tooltip = vis.svg.append("text")
        .attr("id", "tooltip1")
        .attr("x", vis.width / 2)
        .attr("y", vis.height + 50)
        .attr("text-anchor", "middle")

    vis.svg.append("rect")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("opacity", 0);

    vis.wrangleData();
};

gantt.prototype.wrangleData = function(){
    var vis = this;

    vis.keys = [];
    tmp = {};
    vis.displayData.forEach(function(d){
        if(!tmp.hasOwnProperty(d.COURSE_TITLE_LONG)){
            tmp[d.COURSE_TITLE_LONG] = 1;
            vis.keys.push(d.COURSE_TITLE_LONG)
        }
    });

    vis.updateVis();
};

gantt.prototype.updateVis = function(){
    var vis = this;

    vis.x.domain(d3.extent(vis.displayData, function(d) { return d.ACADEMIC_YEAR; }));

    vis.y.domain(vis.keys);

    vis.zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [vis.width + 90, vis.height + 100]])
        .on("zoom", function(){
            vis.yscale = d3.event.transform.k;
            vis.updateVis();
        });

    var yearWidth = vis.x(parseDate(2017)) - vis.x(parseDate(2016));

    var childName = "bubblechart";
    var childNode = document.getElementById(childName);

    var detailedChildName = "detailedbubblechart";
    var detailedChildNode = document.getElementById(detailedChildName);

    var bars = vis.svg.selectAll("rect.gantt")
        .data(vis.displayData);

    bars.enter().append("rect")
        .attr("class", "gantt")
        .merge(bars)
        .attr("x", function(d){
            return vis.x(d.ACADEMIC_YEAR) - yearWidth / 2;
        })
        .attr("y", function(d){
            return vis.y(d.COURSE_TITLE_LONG) * vis.yscale;
        })
        .attr("height", vis.y.bandwidth() * vis.yscale)
        .attr("width", yearWidth)
        .attr("fill", vis.color)
        .on("mouseover", function(d){
            vis.tooltip.text(d.COURSE_TITLE_LONG)
        })
        .on("mouseout", function(){ vis.tooltip.text("")})
        .on("click", function(d){
            document.getElementById(childName).innerHTML="";
            child = new BubbleChart(childName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);
            document.getElementById(detailedChildName).innerHTML="";
            detailedChild = new BubbleChart(detailedChildName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);
            child.buddy = detailedChild;
            detailedChild.buddy = child;
            document.getElementById("info2").innerHTML =
                "<li>Course: " + d.COURSE_TITLE_LONG + "</li>";
            document.getElementById("info3").innerHTML =
                "<li>Year: " + d3.timeFormat("%Y")(d.ACADEMIC_YEAR) + "</li>";
            document.getElementById("info4").innerHTML =
                "<li>Enrollment: " + d.COURSE_ENROLLMENT_DATA + "</li>";
        });

    bars.exit().remove();

    vis.svg.call(vis.zoom);

    vis.svg.select(".x-axis").call(vis.xAxis);
};

gantt.prototype.selectionChanged = function(brushRegion){
    var vis = this;

    // Filter data accordingly without changing the original data
    vis.displayData = vis.data.filter(function(d){
        return d.ACADEMIC_YEAR >= brushRegion[0] && d.ACADEMIC_YEAR <= brushRegion[1]
    });

    // Update the visualization
    vis.wrangleData();
};
