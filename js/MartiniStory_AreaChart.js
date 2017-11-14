


d3.csv("../data/all_fields_all_years.csv", function(RawData) {

    //console.log(data);

    var data = d3.nest()
        .key(function(d){ return d.ACADEMIC_YEAR })
        .rollup(function(leaves){ return leaves.length; })
        .entries(RawData);

    console.log(data);


    // introduce margins
    var margin = {top: 10, right: 0, bottom: 50, left: 80};

    // define SVG Size
    var areaChartWidth = 600 - margin.left - margin.right,
        areaChartHeight = 350 - margin.top - margin.bottom;

    // Define svg_areaChart as a child-element (g) of the drawing area and include spaces
    var svg_areaChart = d3.select("#MartiniStory_AreaChart").append("svg")
        .attr("id", "my-svg")
        .attr("width", areaChartWidth + margin.left + margin.right)
        .attr("height", areaChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var parseTime = d3.timeParse("%Y");

    console.log(parseTime(data[1].key));


    // linear scale for x
    var scaleX = d3.scaleTime()
        .domain([
            d3.min( data, function () { return parseTime(1932) } ),
            d3.max( data, function () { return parseTime(2019) } )
        ])
        .range([0, areaChartWidth]);

    // linear scale for y
    var scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.value
        })])
        .range([areaChartHeight, 0]);


    // calculate myOffset
    myOffset = (scaleX(parseTime(1990))) / areaChartWidth * 100 + "%";

    var gradient = svg_areaChart.append("defs").append("linearGradient")
        .attr("id", "svgGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr('class', 'start')
        .attr("offset", myOffset)
        .attr("stop-color", "#484848")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr('class', 'end')
        .attr("offset", myOffset)
        .attr("stop-color", "#740702")
        .attr("stop-opacity", 1);

    // calculate area
    var area = d3.area()
        .x(function (d) {
            return scaleX( parseTime(d.key) )
        })
        .y1(function (d) {
            return scaleY(d.value)
        })
        .y0(areaChartHeight);



    // draw the actual area chart
    svg_areaChart.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "url(#svgGradient)");



    // create x axis
    var xAxis_areaChart = d3.axisBottom()
        .scale(scaleX);

    // append x axis
    svg_areaChart.append("g")
        .attr("class", "axis x-axis areaChart")
        .attr("transform", "translate(0," + (areaChartHeight) + ")")
        .call(xAxis_areaChart/*d3.axisBottom(scaleX)*/);



    // append y axis
    svg_areaChart.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(scaleY));


    ylab = svg_areaChart.append("text")
        .attr("transform", "translate(-50," + areaChartHeight / 2 + ")rotate(270)")
        .attr("text-anchor", "middle")
        .text("Course Count");

    xlab = svg_areaChart.append("text")
        .attr("transform", "translate(" + (areaChartWidth / 2) + "," + (areaChartHeight + 40) + ")")
        .attr("text-anchor", "middle")
        .text("Year");

/*    svg_areaChart.append("circle")
        .attr("cx", areaChartWidth / 2)
        .attr("cy", areaChartHeight / 2)
        .attr("r", 0)
        .attr("data-hint", "hallo");

    introJs().showHints();*/
    var myVivus = new Vivus('my-svg');
    myVivus
        .stop()
        .reset()
        .play(2)

});


/*

    THEN: SAVE SVG IN IMG USING THIS CODE SNIPPET IN THE CONSOLE:

    var e = document.createElement('script');
    e.setAttribute('src', 'https://nytimes.github.io/svg-crowbar/svg-crowbar.js');
    e.setAttribute('class', 'svg-crowbar');
    document.body.appendChild(e);

*/
