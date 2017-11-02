StackedAreaChart = function(_parentElement, _data, _fields){
    this.parentElement = _parentElement;
    this.data = _data;
    this.fields = _fields;
    this.displayData = [];

    this.initVis();
}

StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    vis.width = 800 - vis.margin.left - vis.margin.right,
    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.data, function(d) { return d.ACADEMIC_YEAR; }));

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

    vis.area = d3.area()
        .curve(d3.curveCardinal)
        .x(function(d) { return vis.x(d.data.year); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });

    vis.wrangleData();
}

StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

    // nest data by year first
    vis.nestData = d3.nest()
        .key(function(d){ return d.ACADEMIC_YEAR; })
        .entries(vis.data);

    // now for each year, nest per academic organization
    // this will give: [{year: ___, org1: ___, org2: ___ ...} ...]
    vis.nestData.forEach(function(year, i){
        var array = d3.nest()
            .key(function(d){ return d.CLASS_ACAD_ORG_DESCRIPTION })
            .rollup(function(leaves){ return leaves.length; })
            .entries(year.values);
        var object = {}
        array.forEach(function(d){
            object[d.key] = d.value;
        })
        vis.displayData.push(object);
        vis.displayData[i].year = year.key
    });

    vis.keys = []
    vis.fields.forEach(function(d){
        vis.keys.push(d.Concentration)
    })

    // stack wants zeros for empty fields
    vis.displayData.forEach(function(d){
        vis.fields.forEach(function(e){
            if (!d.hasOwnProperty(e.Concentration)){
                d[e.Concentration] = 0;
            }
        });
    });

    vis.stack = d3.stack()
        .keys(vis.keys);

    vis.displayData = vis.stack(vis.displayData);

    vis.displayData.forEach(function(d){
        d.forEach(function(e){
            e.data.year = new Date(e.data.year);
        })
    })

    vis.updateVis()
}

StackedAreaChart.prototype.updateVis = function(){
    var vis = this;

    vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
    ]);

    vis.colorScale.domain(vis.keys);

    var categories = vis.svg.selectAll(".area")
        .data(vis.displayData);

    categories.enter().append("path")
        .attr("class", "area")
        .merge(categories)
        .attr("d", function(d) {
            return vis.area(d);
        })
        .attr("fill", function(d){
            console.log(d);
            return vis.colorScale(d.key);
        })

    // Call axis functions with the new domain
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
}
