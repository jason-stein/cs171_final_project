

function drawMartiniTwo (data){

    // introduce margins
    var margin = {top: 10, right: 0, bottom: 50, left: 80};

    // define SVG Size
    var MartiniTwoWidth = $("#MartiniStoryTwo").width() - margin.left - margin.right,
        MartiniTwoHeight = 550 - margin.top - margin.bottom;

    // Define svg_MartiniTwo_StackedArea as a child-element (g) of the drawing area and include spaces
    var svg_MartiniTwo_StackedArea = d3.select("#MartiniStoryTwo").append("svg")
        .attr("id", "my-svg")
        .attr("width", MartiniTwoWidth + margin.left + margin.right)
        .attr("height", MartiniTwoHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y");



    // linear scale for x
    var scaleX = d3.scaleTime()
        .domain([
            d3.min( data, function () { return parseTime(1991) } ),
            d3.max( data, function () { return parseTime(2017) } )
        ])
        .range([0, MartiniTwoWidth]);

    // linear scale for y
    var scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.value
        })])
        .range([MartiniTwoHeight, 0]);



        //.attr("stop-color", "#740702")


    // calculate area
    var area = d3.area()
        .x(function (d) {
            return scaleX( parseTime(d.key) )
        })
        .y1(function (d) {
            return scaleY(d.value)
        })
        .y0(MartiniTwoHeight);

    // draw the actual area chart
    svg_MartiniTwo_StackedArea.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "#484848");

    // create x axis
    var xAxis_areaChart = d3.axisBottom()
        .scale(scaleX);
    // append x axis
    svg_MartiniTwo_StackedArea.append("g")
        .attr("class", "axis x-axis areaChart")
        .attr("transform", "translate(0," + (MartiniTwoHeight) + ")")
        .call(xAxis_areaChart);

    // append y axis
    svg_MartiniTwo_StackedArea.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(scaleY));


    ylab = svg_MartiniTwo_StackedArea.append("text")
        .attr("transform", "translate(-50," + MartiniTwoHeight / 2 + ")rotate(270)")
        .attr("text-anchor", "middle")
        .text("Course Count");

    xlab = svg_MartiniTwo_StackedArea.append("text")
        .attr("transform", "translate(" + (MartiniTwoWidth / 2) + "," + (MartiniTwoHeight + 40) + ")")
        .attr("text-anchor", "middle")
        .text("Year");


    // create and draw tooltip area
    MartiniStoryTwo_TooltipArea = svg_MartiniTwo_StackedArea.append("text")
        .attr("id", "MartiniStoryTwo_TooltipArea")
        .attr("x", 10)
        .attr("y", MartiniTwoHeight/10);


    // advanced tooltip
    svg_MartiniTwo_StackedArea.append("circle")
        .attr("class", "MartiniGuidanceCircle")
        .attr("cx", MartiniTwoWidth / 2)
        .attr("cy", MartiniTwoHeight / 5)
        .attr("r", 10)
        .attr("fill", "GREY")
        .on('click', function (){
            MartiniStoryTwo_TooltipArea.text("Sample Text 1")
            // draw line from text anchor end to
        });
}


var fastData_MartiniTwo = [
    {key: "1991", value: 4631},
    {key: "1992", value: 4784},
    {key: "1993", value: 4739},
    {key: "1994", value: 4879},
    {key: "1995", value: 5138},
    {key: "1996", value: 5271},
    {key: "1997", value: 5467},
    {key: "1998", value: 5570},
    {key: "1999", value: 6354},
    {key: "2000", value: 6570},
    {key: "2001", value: 6804},
    {key: "2002", value: 7088},
    {key: "2003", value: 7208},
    {key: "2004", value: 7303},
    {key: "2005", value: 7545},
    {key: "2006", value: 7738},
    {key: "2007", value: 8044},
    {key: "2008", value: 8279},
    {key: "2009", value: 8402},
    {key: "2010", value: 8704},
    {key: "2011", value: 9038},
    {key: "2012", value: 9203},
    {key: "2013", value: 9620},
    {key: "2014", value: 9588},
    {key: "2015", value: 9724},
    {key: "2016", value: 13189},
    {key: "2017", value: 13598}
    /*,
    {key: "2018", value: 10879},
    {key: "2019", value: 4}
    */
];

drawMartiniTwo(fastData_MartiniTwo);

/*
<li><h5>Now you can see the more complete dataset displayed from 1992 to 2017. This plot
includes all schools (FAS, GSD, HKS, HLS, etc.).</h5></li>
<li><h5>Even this "all-schools" data is asynchronous and incomplete, so we are going to further
focus on just FAS, again colored in crimson.</h5></li>
<li><h5>The next page will give you an idea of the exploration you can do with the FAS data on
the final dashboard.</h5></li>*/


