

BubbleChart = function(_parentElement, _data, _selectedCourse, _color, _year){
    this.parentElement = _parentElement;
    this.data = _data;
    this.selectedCourse = _selectedCourse;
    this.color = _color;
    this.displayData = [];
    this.year = _year;
    this.buddy;

    this.initVis();
};



BubbleChart.prototype.initVis = function(){
    var vis = this;

    // define margins
    vis.margin = { top: 10, right: 40, bottom: 40, left: 40 };

    // calculate width and height
    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
            "," + vis.margin.top + ")");

    vis.formatDate = d3.timeFormat("%Y");

    // info displays
    vis.tooltip1 = vis.svg.append("text")
        .attr("class", "bubbletooltip")
        .attr("y",2);
    vis.tooltip2 = vis.svg.append("text")
        .attr("class", "bubbletooltip")
        .attr("y",22);
    vis.tooltip3 = vis.svg.append("text")
        .attr("class", "bubbletooltip")
        .attr("y",42);

    vis.wrangleData();
};



BubbleChart.prototype.wrangleData = function() {
    var vis = this;

    vis.filteredData = vis.data.filter(function(d){
        return d.ACADEMIC_YEAR.toString() === vis.year.toString();
    });


    vis.bubbles = [];
    vis.filteredData.forEach(function(d){
        var tmp = {
            course: d["CLASS_ACAD_ORG_DESCRIPTION"] + "." + d["COURSE_TITLE_LONG"],
            course_enrollment: d["COURSE_ENROLLMENT_DATA"]
        };
        vis.bubbles.push(tmp);
    });

    vis.updateVis();
};



BubbleChart.prototype.updateVis = function() {
    var vis = this;

    // only want info displays on zoomed
    if(vis.parentElement == "ZoomedBubbleChart"){
        vis.tooltip1.text(vis.selectedCourse);
        vis.tooltip2.text("Year: " + vis.formatDate(vis.year));
    }

    // bubble chart data prep (bostock)
    vis.root = d3.hierarchy({children: vis.bubbles})
        .sum(function(d) { return d.course_enrollment; })
        .each(function(d) {
            if (id = d.course) {
                var id, i = id.lastIndexOf(".");
                d.id = id;
                d.package = id.slice(0, i);
                d.class = id.slice(i + 1);
            }
        });

    vis.pack = d3.pack()
        .size([vis.width, vis.height])
        .padding(1.5);

    node = vis.svg.selectAll(".node")
        .data(vis.pack(vis.root).leaves());

    // create bubbles
    node.enter().append("g")
        .merge(node)
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .append("circle")
        .attr("id", function(d) { return d.id; })
        .attr("r", function(d) { return d.r; })
        .attr("fill", vis.color)
        .style("opacity", function(d) {
            return d.data.course.split(".")[1] === vis.selectedCourse ? 1 : .35;
        })
        .on("click", function(d){
            // clear bubbles, reset self
            vis.svg.selectAll(".node").remove();
            vis.selectedCourse = d.data.course.split(".")[1];
            vis.updateVis();
            // reset info box
            document.getElementById("info2").innerHTML =
                "<li>Course: " + d.data.course.split(".")[1] + "</li>";
            document.getElementById("info4").innerHTML =
                "<li>Enrollment: " + d.data.course_enrollment + "</li>";
            // reset buddy
            if (vis.buddy){
                vis.buddy.svg.selectAll(".node").remove();
                vis.buddy.selectedCourse = d.data.course.split(".")[1];
                vis.buddy.updateVis();
            }
            // reset bar charts
            if (vis.child1){
                vis.child1.selected = d.data.course.split(".")[1];
                vis.child1.wrangleData();
            }
            if (vis.child2){
                vis.child2.selected = d.data.course.split(".")[1];
                vis.child2.wrangleData();
            }

            if (vis.parentElement == "ZoomedBubbleChart"){
                vis.tooltip3.text("Enrollment: " + d.data.course_enrollment)
            }


        });
    node.exit().remove();

    node.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#" + d.id; });
};



