

function drawMartiniOne (data) {

    // introduce margins
    var margin = {top: 10, right: 50, bottom: 50, left: 50};

    // define SVG Size
    var MartiniOneWidth = $("#MartiniStoryOne").width() - margin.left - margin.right,
        MartiniOneHeight = 500 - margin.top - margin.bottom;

    // Define svg_MartiniTwo_StackedArea as a child-element (g) of the drawing area and include spaces
    var svg_MartiniOne_AreaChart = d3.select("#MartiniStoryOne").append("svg")
        .attr("id", "my-svg")
        .attr("width", MartiniOneWidth + margin.left + margin.right)
        .attr("height", MartiniOneHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y");


    // linear scale for x
    var scaleX = d3.scaleTime()
        .domain([
            d3.min( data, function () { return parseTime(1933) } ),
            d3.max( data, function () { return parseTime(2017) } )
        ])
        .range([0, MartiniOneWidth]);

    // linear scale for y
    var scaleY = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.value
        })])
        .range([MartiniOneHeight, 0]);


    // calculate myOffset
    myOffset = (scaleX(parseTime(1990))) / MartiniOneWidth * 100 + "%";

    var gradient = svg_MartiniOne_AreaChart.append("defs").append("linearGradient")
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
        .y0(MartiniOneHeight);

    // draw the actual area chart
    svg_MartiniOne_AreaChart.append("path")
        .datum(data)
        //.attr("class", "area")
        .attr("d", area)
        .attr("fill", "url(#svgGradient)");

    // create x axis
    var xAxis_areaChart = d3.axisBottom()
        .scale(scaleX);
    // append x axis
    svg_MartiniOne_AreaChart.append("g")
        .attr("class", "axis x-axis areaChart")
        .attr("transform", "translate(0," + (MartiniOneHeight) + ")")
        .call(xAxis_areaChart);

    // append y axis
    svg_MartiniOne_AreaChart.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(scaleY));


    ylab = svg_MartiniOne_AreaChart.append("text")
        .attr("transform", "translate(-50," + MartiniOneHeight / 2 + ")rotate(270)")
        .attr("text-anchor", "middle")
        .text("Course Count");

    xlab = svg_MartiniOne_AreaChart.append("text")
        .attr("transform", "translate(" + (MartiniOneWidth / 2) + "," + (MartiniOneHeight + 40) + ")")
        .attr("text-anchor", "middle")
        .text("Year");


    /*
        INFO TOOLTIPS
    */

    // first calculate a fitting font size
    var FontSize = ( $("#MartiniStoryOne").width()/50 ).toString() + "px";


    // info text box 1
    var MartiniStoryOne_TooltipAreaOne = svg_MartiniOne_AreaChart.append("text")
        .attr("class", "MartiniStoryOne_TooltipArea")
        .attr("x", 10)
        .attr("y", 40)
        .style("font-size", FontSize  );

    // info text box 2
    var MartiniStoryOne_TooltipAreaTwo = svg_MartiniOne_AreaChart.append("text")
        .attr("class", "MartiniStoryOne_TooltipArea")
        .attr("x", 10)
        .attr("y", 90)
        .style("font-size", FontSize  );

    // info text box 3
    var MartiniStoryOne_TooltipAreaThree = svg_MartiniOne_AreaChart.append("text")
        .attr("class", "MartiniStoryOne_TooltipArea")
        .attr("x", 10)
        .attr("y", 140)
        .style("font-size", FontSize  );



    // first info circle
    var infoCircleOne = svg_MartiniOne_AreaChart.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse")
        .attr("cx", MartiniOneWidth / 2.12)
        .attr("cy", MartiniOneHeight / 1.06)
        .attr("r", 10)
        .on('click', function (){
            MartiniStoryOne_TooltipAreaOne.text(" - There is curricular data starting in 1931; you will notice it is quite sparse prior to the 1990s.");
            infoCircleTwo.classed("hideInfo2", false)

            // drawLine( (MartiniOneWidth / 2.12), (MartiniOneHeight / 1.06) );
        });


    // second info circle
    var infoCircleTwo = svg_MartiniOne_AreaChart.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse hideInfo2")
        .attr("cx", MartiniOneWidth / 1.5)
        .attr("cy", MartiniOneHeight / 1.2)
        .attr("r", 10)
        .on('click', function (){
            MartiniStoryOne_TooltipAreaTwo.text(" - It is only in 1990 that the number of courses recorded reaches a significant size.");
            infoCircleThree.classed("hideInfo3", false)

            // drawLine( (MartiniOneWidth / 1.5), (MartiniOneHeight / 1.2) );
        });


    // third info circle
    var infoCircleThree = svg_MartiniOne_AreaChart.append("circle")
        .attr("class", "MartiniGuidanceCircle pulse hideInfo3")
        .attr("cx", MartiniOneWidth / 1.15)
        .attr("cy", MartiniOneHeight / 3)
        .attr("r", 10)

        .on('click', function (){
            MartiniStoryOne_TooltipAreaThree.html(" - The area highlighted in crimson corresponds to a robust dataset from 1991 to 2017.");
            // drawLine( (MartiniOneWidth / 1.15), (MartiniOneHeight / 3) );
        });

    // draw line function to connect info text with info circle

/*    function drawLine (circleX, circleY){
        svg_MartiniOne_AreaChart.append("line")
            .attr("x1", MartiniOneWidth/2)
            .attr("x2", circleX)
            .attr("y1", 50)
            .attr("y2", circleY)
            .style("stroke", "black")
    }*/
}


var fastData_MartiniOne = [
    {key: "1933", value: 8},
    {key: "1939", value: 6},
    {key: "1940", value: 8},
    {key: "1941", value: 6},
    {key: "1945", value: 8},
    {key: "1946", value: 2},
    {key: "1948", value: 9},
    {key: "1950", value: 4},
    {key: "1951", value: 2},
    {key: "1952", value: 10},
    {key: "1954", value: 7},
    {key: "1955", value: 3},
    {key: "1956", value: 16},
    {key: "1957", value: 13},
    {key: "1958", value: 13},
    {key: "1959", value: 8},
    {key: "1960", value: 17},
    {key: "1961", value: 18},
    {key: "1962", value: 25},
    {key: "1963", value: 48},
    {key: "1964", value: 46},
    {key: "1965", value: 48},
    {key: "1966", value: 68},
    {key: "1967", value: 79},
    {key: "1968", value: 113},
    {key: "1969", value: 133},
    {key: "1970", value: 185},
    {key: "1971", value: 217},
    {key: "1972", value: 184},
    {key: "1973", value: 221},
    {key: "1974", value: 267},
    {key: "1975", value: 306},
    {key: "1976", value: 420},
    {key: "1977", value: 505},
    {key: "1978", value: 525},
    {key: "1979", value: 529},
    {key: "1980", value: 642},
    {key: "1981", value: 744},
    {key: "1982", value: 716},
    {key: "1983", value: 759},
    {key: "1984", value: 722},
    {key: "1985", value: 718},
    {key: "1986", value: 784},
    {key: "1987", value: 812},
    {key: "1988", value: 883},
    {key: "1989", value: 943},
    {key: "1990", value: 960},
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

drawMartiniOne(fastData_MartiniOne);

/*
d3.csv("../data/all_fields_all_years.csv", function(RawData) {

    var data = d3.nest()
        .key(function(d){ return d.ACADEMIC_YEAR })
        .rollup(function(leaves){ return leaves.length; })
        .entries(RawData);

    console.log(data);


*/


/*
    var myVivus = new Vivus('my-svg');
    myVivus
        .stop()
        .reset()
        .play(2)*/

/*});*/


/*

    THEN: SAVE SVG IN IMG USING THIS CODE SNIPPET IN THE CONSOLE:

    var e = document.createElement('script');
    e.setAttribute('src', 'https://nytimes.github.io/svg-crowbar/svg-crowbar.js');
    e.setAttribute('class', 'svg-crowbar');
    document.body.appendChild(e);

*/


/*
function pulsate(selection) {
    recursive_transitions();

    function recursive_transitions() {
        if (selection.data()[0].pulse) {
            selection.transition()
                .duration(400)
                .attr("stroke-width", 2)
                .attr("r", 8)
                .ease('sin-in')
                .transition()
                .duration(800)
                .attr('stroke-width', 3)
                .attr("r", 12)
                .ease('bounce-in')
                .each("end", recursive_transitions);
        } else {
            // transition back to normal
            selection.transition()
                .duration(200)
                .attr("r", 8)
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "1, 0");
        }
    }
}*/



