gantt = function(_parentElement, _data, _color){
    this.parentElement = _parentElement;
    this.color = _color;
    this.data = _data;
    this.displayData = _data;

    this.initVis();
};

gantt.prototype.initVis = function(){
    var vis = this;

    // SVG drawing area
    vis.margin = { top: 30, right: 75, bottom: 60, left: 60 };

    vis.width = vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

    d3.select("#" + vis.parentElement).html("");
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
        .scale(vis.x);

    vis.gX = vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.y = d3.scaleBand()
        .range([0, vis.height])
        .paddingInner(.02);

    vis.yscale = 1;

    // tooltip
    vis.tooltip = vis.svg.append("text")
        .attr("id", "tooltip1")
        .attr("x", vis.width / 2)
        .attr("y", vis.height + 50)
        .attr("text-anchor", "middle");

    // to enable mouse events
    vis.svg.append("rect")
        .attr("height", vis.height)
        .attr("width", vis.width)
        .attr("opacity", 0);

    // zoom element
    vis.zoom = d3.zoom()
        .scaleExtent([1, 40])
        .on("zoom", function(){
            vis.yscale = d3.event.transform.k;
            vis.updateVis();
        })

    vis.svg.call(vis.zoom);

    vis.wrangleData();
};

gantt.prototype.wrangleData = function(){
    var vis = this;

    // get the list of keys
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

    // update domains
    vis.x.domain(d3.extent(vis.displayData, function(d) { return d.ACADEMIC_YEAR; }));

    vis.y.domain(vis.keys);

    // parenting!
    // visualizations can have "buddies" (versions of themselves)
    // or "children" (visualizations that are altered by them)
    // assigning buddies allows interactions to carry over to expanded views
    // assigning children enables interactions between visualizations

    var yearWidth = vis.x(parseDate(2017)) - vis.x(parseDate(2016));

    var childName = "DashboardBubbleChart";
    var childNode = document.getElementById(childName);

    var detailedChildName = "ZoomedBubbleChart";
    var detailedChildNode = document.getElementById(detailedChildName);

    var grandChildName = "DashboardBarChart";
    var grandChildNode = document.getElementById(grandChildName);

    var detailedgrandChildName = "ZoomedBarChart";
    var detailedgrandChildNode = document.getElementById(grandChildName);

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
            // clear children, make new children
            document.getElementById(childName).innerHTML = "";
            child = new BubbleChart(childName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);
            document.getElementById(detailedChildName).innerHTML = "";
            detailedChild = new BubbleChart(detailedChildName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);
            detailedChild.tooltip3.text("Enrollment: " + d.COURSE_ENROLLMENT_DATA);

            document.getElementById(grandChildName).innerHTML = "";
            grandChild = new EnrollmentBarchart(grandChildName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);
            document.getElementById(detailedgrandChildName).innerHTML = "";
            detailedgrandChild = new EnrollmentBarchart(detailedgrandChildName, vis.data, d.COURSE_TITLE_LONG, vis.color, d.ACADEMIC_YEAR);

            // assign buddies, children, and parents as necessary
            child.buddy = detailedChild;
            detailedChild.buddy = child;

            child.child1 = grandChild;
            child.child2 = detailedgrandChild;

            detailedChild.child1 = grandChild;
            detailedChild.child2 = detailedgrandChild;

            grandChild.parent1 = child;
            grandChild.parent2 = detailedChild;

            detailedgrandChild.parent1 = child;
            detailedgrandChild.parent2 = detailedChild;

            // update info box
            document.getElementById("info2").innerHTML =
                "<li>Course: " + d.COURSE_TITLE_LONG + "</li>";
            document.getElementById("info3").innerHTML =
                "<li>Year: " + d3.timeFormat("%Y")(d.ACADEMIC_YEAR) + "</li>";
            document.getElementById("info4").innerHTML =
                "<li>Enrollment: " + d.COURSE_ENROLLMENT_DATA + "</li>";
        });

    bars.exit().remove();

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
