var stackedAreaChart, departmentTimeline;

var parseDate = d3.timeParse("%Y");

d3.select("#tooltip").text("Mouseover to see fields.");

var extent;
var range;

var instructions = "<p class='placeholder'><br><br><br><br><br>Mouseover the area chart to see department names. <br>\
Click a department to isolate and get more information. <br> Click again to go back to explore.</p>";

var bubblePlaceholder = "<p class='placeholder'><br><br>After selecting a department, click on a course in the upper-right chart\ " +
    "to see enrollment data for that year.</p>"

document.getElementById("gantt").innerHTML = instructions;
document.getElementById("detailedganttchart").innerHTML = instructions;
document.getElementById("bubblechart").innerHTML = bubblePlaceholder;


queue()
    .defer(d3.csv, "data/all_fields_FAS_1990_2017_EnrollmentAdded.csv")
    .await(createVis);

function createVis(error, data) {
    if (error) throw error;

    range = document.getElementById('slider');
    extent = d3.extent(data, function (d) {
        return +d.ACADEMIC_YEAR
    });
    noUiSlider.create(range, {
        start: extent,
        margin: 2,
        connect: true,
        direction: 'ltr',
        orientation: 'horizontal',
        behaviour: 'tap-drag',
        step: 1,
        format: {
            // get rid of float formatting
            to: function (value) {
                return d3.format("d")(value);
            },
            // don't undo formatting
            from: function (value) {
                return value;
            }
        },
        tooltips: true,
        range: {
            'min': extent[0],
            'max': extent[1]
        },
    });

    // callback for slider: update
    range.noUiSlider.on('slide', slid);

    data.forEach(function (d) {
        d.ACADEMIC_YEAR = parseDate(d.ACADEMIC_YEAR)
    });

    stackedAreaChart = new StackedAreaChart('stackedareachart', data);
    detailedStackedAreaChart = new StackedAreaChart('DetailedStackedAreaChart', data);
    stackedAreaChart.buddy = detailedStackedAreaChart;
    detailedStackedAreaChart.buddy = stackedAreaChart;
    // departmentTimeline = new DepartmentTimeline('departmenttimeline', data);

    // instantiating bubble chart -> probably do that within gantt chart!
    // bubbleChart = new BubbleChart('bubbleChart', filteredData, selectedCourse);
}

function normalizeStackedAreaChart() {
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    stackedAreaChart.wrangleData();
    detailedStackedAreaChart.normalize = !detailedStackedAreaChart.normalize;
    detailedStackedAreaChart.wrangleData();
}

function slid() {
    var selectionRange = range.noUiSlider.get();
    selectionRange = selectionRange.map(function (d) {
        return parseDate(d)
    });
    stackedAreaChart.selectionChanged(selectionRange);
    detailedStackedAreaChart.selectionChanged(selectionRange);
    // departmentTimeline.selectionChanged(selectionRange);
}

/*
function updateBubble(){
    bubbleChart.wrangleData();
}
*/
