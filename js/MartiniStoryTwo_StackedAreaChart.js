


d3.csv("data/MartiniStoryTwo_StackedAreaChart_DATA.csv", function(data) {

    // introduce time parser which will need for many tasks
    var parseTime = d3.timeParse("%Y");


    /*
        DATA WRANGLING
    */

    // get data types right
    data.forEach(function(d) {
        d.year = parseTime(d.year);
        /*d["FAS"] = +d["FAS"];
        d["GSD"] = +d["GSD"];
        d["KEN"] = +d["KEN"];*/

    });

    // find all keys within data
    var keys = data.columns.filter(function(key) { return key !== 'year'; });

    // prepare stacking of the data
    var stack = d3.stack()
        .keys(keys)
        .order(d3.stackOrderInsideOut)
        //.order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    // create display data
    var displayData = stack(data);
    // console.log(displayData);


    /*
        INITIALIZE VISUALIZATION
    */

    // introduce margins
    var margin = {top: 10, right: 50, bottom: 50, left: 50};

    // define SVG Size
    var MartiniTwoWidth = $("#MartiniStoryTwo").width() - margin.left - margin.right,
        MartiniTwoHeight = 500 - margin.top - margin.bottom;

    // Define svg_MartiniTwo_StackedArea as a child-element (g) of the drawing area and include spaces
    var svg_MartiniTwo_StackedArea = d3.select("#MartiniStoryTwo").append("svg")
        .attr("id", "my-svg")
        .attr("width", MartiniTwoWidth + margin.left + margin.right)
        .attr("height", MartiniTwoHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // linear scale for x
    var scaleX = d3.scaleTime()
        .domain([
            d3.min( data, function () { return parseTime(1991) } ),
            d3.max( data, function () { return parseTime(2017) } )
        ])
        .range([0, MartiniTwoWidth]);

    // append x axis
    svg_MartiniTwo_StackedArea.append("g")
        .attr("class", "axis x-axis areaChart")
        .attr("transform", "translate(0," + (MartiniTwoHeight) + ")")
        .call(d3.axisBottom().scale(scaleX));

    // append x axis label
    svg_MartiniTwo_StackedArea.append("text")
        .attr("transform", "translate(-50," + MartiniTwoHeight / 2 + ")rotate(270)")
        .attr("text-anchor", "middle")
        .text("Course Count");


    // calculating max value for y scale
    var maxDateVal = d3.max(data, function(d){
        var vals = d3.keys(d).map(function(key){ return key !== 'year' ? d[key] : 0 });
        return d3.sum(vals);
    });

    // linear scale for y
    var scaleY = d3.scaleLinear()
        .domain([0, maxDateVal])
        .range([MartiniTwoHeight, 0]);

    // append y axis
    svg_MartiniTwo_StackedArea.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(scaleY));

    // append y axis label
    svg_MartiniTwo_StackedArea.append("text")
        .attr("transform", "translate(" + (MartiniTwoWidth / 2) + "," + (MartiniTwoHeight + 40) + ")")
        .attr("text-anchor", "middle")
        .text("Year");



    // calculate area
    var area = d3.area()
        .x(function(d) {
            return scaleX(d.data.year); })
        .y0(function(d) { return scaleY(d[0]); })
        .y1(function(d) { return scaleY(d[1]); });

    // draw stacked area chart
    var browser = svg_MartiniTwo_StackedArea.selectAll('.browser')
        .data(displayData)
        .enter().append('path')
        .attr('class', 'area')
        .attr('d', area)
        .style('fill', function(d) {
            console.log(d.key);
            if (d.key === "FAS"){
                return "#740702"
            }
            return "#484848"
        });

    /*
        INFO TOOLTIPS
    */

    // first calculate a fitting font size
    var FontSize = ( $("#MartiniStoryTwo").width()/80 ).toString() + "px";


    // info text box 1
    var MartiniStoryTwo_TooltipAreaOne = svg_MartiniTwo_StackedArea.append("text")
        .attr("class", "MartiniStoryTwo_TooltipArea")
        .attr("x", 10)
        .attr("y", 40)
        .style("font-size", FontSize  );

    // info text box 2
    var MartiniStoryTwo_TooltipAreaTwo = svg_MartiniTwo_StackedArea.append("text")
        .attr("class", "MartiniStoryTwo_TooltipArea")
        .attr("x", 10)
        .attr("y", 90)
        .style("font-size", FontSize  );

    // info text box 3
    var MartiniStoryTwo_TooltipAreaThree = svg_MartiniTwo_StackedArea.append("text")
        .attr("class", "MartiniStoryTwo_TooltipArea")
        .attr("x", 10)
        .attr("y", 140)
        .style("font-size", FontSize  );



    // first info circle
    var infoCircleOne = svg_MartiniTwo_StackedArea.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse")
        .attr("cx", MartiniTwoWidth / 2.12)
        .attr("cy", MartiniTwoHeight / 1.06)
        .attr("r", 10)
        .on('click', function (){
            MartiniStoryTwo_TooltipAreaOne.text(" - Now you can see the more complete dataset displayed from 1992 to 2017. This plot\n" +
                "includes all schools (FAS, GSD, HKS, HLS, etc.).");
            infoCircleTwo.classed("hideInfo2", false)
        });


    // second info circle
    var infoCircleTwo = svg_MartiniTwo_StackedArea.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse hideInfo2")
        .attr("cx", MartiniTwoWidth / 1.5)
        .attr("cy", MartiniTwoHeight / 1.2)
        .attr("r", 10)
        .on('click', function (){
            MartiniStoryTwo_TooltipAreaTwo.text(" - Even this \"all-schools\" data is asynchronous and incomplete, so we are going to further\n" +
                "focus on just FAS, again colored in crimson.");
            infoCircleThree.classed("hideInfo3", false)
        });


    // third info circle
    var infoCircleThree = svg_MartiniTwo_StackedArea.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse hideInfo3")
        .attr("cx", MartiniTwoWidth / 1.15)
        .attr("cy", MartiniTwoHeight / 3)
        .attr("r", 10)

        .on('click', function (){
            MartiniStoryTwo_TooltipAreaThree.html(" - The next page will give you an idea of the exploration you can do with the FAS data on\n" +
                "the final dashboard.");
        });
    }
);


