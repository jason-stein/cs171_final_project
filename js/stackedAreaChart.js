// CLASS DECLARATION FOR STACKED AREA CHART
//
// expects data in raw row format as provided from original CSV

StackedAreaChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.filterData = _data;
    this.displayData = [];
    this.normalize = false;
    this.buddy;

    this.initVis();
};

// all one-time init business
StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    // object globals that determine what department is selected
    vis.selected = "";
    vis.toolTipClickSwitch = false;

    vis.margin = { top: 40, right: 25, bottom: 60, left: 80 };

    vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
    vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left +
              "," + vis.margin.top + ")");

    // initialize range of years (changes later)
    vis.extent = d3.extent(vis.data, function(d) { return d.ACADEMIC_YEAR; })

    // scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width]);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.colorScale = d3.scaleOrdinal(d3.schemeCategory20);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    vis.yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    // axis labels
    vis.ylab = vis.svg.append("text")
        .attr("transform", "translate(-50," + vis.height / 2 + ")rotate(270)")
        .attr("text-anchor", "middle");

    // LESS TEXT
    // vis.xlab = vis.svg.append("text")
    //     .attr("transform", "translate(" + (vis.width / 2) + "," + (vis.height + 40) + ")")
    //     .attr("text-anchor", "middle")
    //     .text("Year");

    // area constructor
    vis.area = d3.area()
        .x(function(d) { return vis.x(d.data.year); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });

    // mouseover display
    vis.tooltip = vis.svg.append("text")
        .attr("x", 50)
        .attr("y", -10);

    // where to update things when interacting
    vis.dashboardHeader = document.getElementById("DashboardHeader");
    vis.detailedHeader = document.getElementById("DetailedHeader");

    vis.mouseoverRect = vis.svg.append("rect")
        .attr("fill", "gray")
        .attr("height", vis.height)
        .attr("y", 0)
        .attr("opacity", 0)
        .attr("mouse-events", "none");

    vis.childName = "DashboardGanttChart";
    vis.childElement = document.getElementById(vis.childName);

    vis.detailChildName = "ZoomedGanttChart";
    vis.detailChildElement = document.getElementById(vis.detailChildName);

    vis.wrangleData();
};

// data manipulation
StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

    vis.displayData = [];

    // nest data by year first
    vis.nestData = d3.nest()
        .key(function(d){ return d.ACADEMIC_YEAR; })
        .entries(vis.filterData);

    // now for each year, nest per academic organization
    // this will give: [{year: ___, org1: ___, org2: ___ ...} ...]
    vis.nestData.forEach(function(year, i){
        var array = d3.nest()
            .key(function(d){ return d.CLASS_ACAD_ORG_DESCRIPTION })
            .rollup(function(leaves){ return leaves.length; })
            .entries(year.values);
        var object = {};
        array.forEach(function(d){
            object[d.key] = d.value;
        });
        vis.displayData.push(object);
        vis.displayData[i].year = year.key
    });

    // get all the concentrations we care about
    vis.keys = [];
    tmp = {};
    vis.data.forEach(function(d){
        if(!tmp.hasOwnProperty(d.CLASS_ACAD_ORG_DESCRIPTION)){
            vis.keys.push(d.CLASS_ACAD_ORG_DESCRIPTION);
            tmp[d.CLASS_ACAD_ORG_DESCRIPTION] = 1;
        }
    });

    // d3.stack wants zeros for empty fields
    // (could infer but whatever Mike Bostock)
    vis.displayData.forEach(function(d){
        vis.keys.forEach(function(e){
            if (!d.hasOwnProperty(e)){
                d[e] = 0;
            }
        });
    });


    // create a stack constructor
    vis.stack = d3.stack()
        .keys(vis.keys);

    // normalize?
    if(vis.normalize){
        vis.ylab.text("Fraction of Courses");
        vis.stack.offset(d3.stackOffsetExpand)
    }
    else{
        vis.ylab.text("Number of Courses");
        vis.stack = d3.stack()
        .keys(vis.keys);
    }

    // stack the data
    vis.displayData = vis.stack(vis.displayData);

    // that thing about nest with non-string keys... whatever Bostock
    vis.displayData.forEach(function(d){
        d.forEach(function(e){
            e.data.year = new Date(e.data.year);
        })
    });

    vis.updateVis()
};

// when a department is selected
StackedAreaChart.prototype.select = function(key){
    var vis = this;

    // update the dropdown
    for(var i = 1; i < 4; i++){
        $("#departmentselect" + i).val(key);
    }
    // update selection
    vis.toolTipClickSwitch = true;
    vis.selected = key;
    // update headers
    vis.dashboardHeader.innerHTML = key;
    vis.detailedHeader.innerHTML = key;
    // make 2 new Gantt charts (dashboard and big slide)
    vis.childElement.innerHTML = "";
    var ganttData = vis.data.filter(function(e){ return e.CLASS_ACAD_ORG_DESCRIPTION == key });
    vis.child = new gantt(vis.childName, ganttData, vis.colorScale(key));
    vis.child.selectionChanged(vis.extent);
    vis.detailedChild = new gantt(vis.detailChildName, ganttData, vis.colorScale(key));
    vis.detailedChild.selectionChanged(vis.extent);
    // reset the bubble chart
    document.getElementById("DashboardBubbleChart").innerHTML = bubblePlaceholder;
    document.getElementById("ZoomedBubbleChart").innerHTML = bubblePlaceholder;
    // update buddy vis
    if (vis.buddy){
        vis.buddy.toolTipClickSwitch = true;
        vis.buddy.selected = key;
        vis.buddy.updateVis();
    }
    // update info box
    document.getElementById("info1").innerHTML = "<li>Department: " + key + "</li>";
    for(var i = 2; i <= 5; i++){
        document.getElementById("info" + i).innerHTML = "";
    }
    // redraw
    vis.updateVis();
}

StackedAreaChart.prototype.deselect = function(){
    var vis = this;

    // clear selection
    vis.selected = "";
    vis.toolTipClickSwitch = false;
    // remove bubble and gantt charts (because we have left the department)
    document.getElementById("DashboardBubbleChart").innerHTML = bubblePlaceholder;
    document.getElementById("ZoomedBubbleChart").innerHTML = bubblePlaceholder;
    vis.detailChildElement.innerHTML = instructions;
    vis.childElement.innerHTML = instructions;
    // deselect buddy
    if (vis.buddy){
        vis.buddy.selected = "";
        vis.buddy.toolTipClickSwitch = false;
        vis.buddy.updateVis();
    }
    // clear info box
    for(var i = 1; i <= 5; i++){
        document.getElementById("info" + i).innerHTML = "";
    }
    vis.updateVis();
    // reset all dropdowns
    for(var i = 1; i < 4; i++){
        $("#departmentselect" + i).val("NULL");
    }
}

// dynamic shit
StackedAreaChart.prototype.updateVis = function(){
    var vis = this;

    vis.extent = d3.extent(vis.filterData, function(d) { return d.ACADEMIC_YEAR; })

    vis.x.domain(vis.extent);

    // get 2-d max
    vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
    ]);

    // colorscale domain
    // (will overflow range and repeat... actually thanks Bostock)
    vis.colorScale.domain(vis.keys);

    // enter-update-exit paths
    var categories = vis.svg.selectAll(".stackarea")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "stackarea")
        .merge(categories)
        .on("mousemove", function (d) {
            if(!vis.toolTipClickSwitch){
                var hoverYear = +d3.timeFormat("%Y")(vis.x.invert(d3.mouse(this)[0]))
                var selectionRange = range.noUiSlider.get();
                var yearwidth = vis.width / (selectionRange[1] - selectionRange[0]);
                var index = hoverYear - selectionRange[0]
                var dataSlice = vis.displayData.filter(function(e){
                    return e.key == d.key;
                })
                var yearSlice = dataSlice[0][index]
                var total = yearSlice[1] - yearSlice[0]
                if (vis.normalize){
                    total = Math.round(total*1000)/10 + "% of";
                }
                vis.dashboardHeader.innerHTML = d.key + " (" + hoverYear +") " + total + " Courses";
                vis.detailedHeader.innerHTML = d.key + " (" + hoverYear +") " + total + " Courses";
                document.getElementById("info1").innerHTML = "<li>Department: " + d.key + "</li>";
                vis.mouseoverRect
                    .attr("x", vis.x(parseDate(hoverYear)))
                    .attr("opacity", 0.35)
                    .attr("width", yearwidth);
            }
        })
        .on("mouseout", function () {
            if(!vis.toolTipClickSwitch){
                vis.dashboardHeader.innerHTML = "Dashboard";
                vis.detailedHeader.innerHTML = "Departments";
                vis.mouseoverRect.attr("opacity", 0);
            }
        })
        .on("click", function (d) {
            vis.mouseoverRect.attr("opacity", 0);
            // select
            if(!vis.toolTipClickSwitch){
                vis.select(d.key);
            }
            // deselect
            else if(vis.toolTipClickSwitch && vis.dashboardHeader.innerHTML === d.key){
                vis.deselect();
            }
            // reselect
            else{
                vis.select(d.key);
            }
        })
        .attr("d", function(d) {
            return vis.area(d);
        })
        // appropriate color if nothing selected or it's the selected path, else black
        .attr("fill", function(d){
            return vis.selected === "" || vis.selected === d.key ? vis.colorScale(d.key) : "black";
        });

    categories.exit().remove();

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").transition().duration(800).call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);
};

// for slider
StackedAreaChart.prototype.selectionChanged = function(brushRegion){
    var vis = this;

    if(vis.child){
        vis.child.selectionChanged(brushRegion);
    }

    // Filter data accordingly without changing the original data
    vis.filterData = vis.data.filter(function(d){
        return d.ACADEMIC_YEAR >= brushRegion[0] && d.ACADEMIC_YEAR <= brushRegion[1]
    });

    // Update the visualization
    vis.wrangleData();
};
