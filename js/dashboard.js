var stackedAreaChart, departmentTimeline;

var parseDate = d3.timeParse("%Y");

var extent;
var range;

// placeholder for gantt chart
var instructions = "<p class='placeholder'><br><br><br><br><br>Mouseover the area chart to see department names. <br>\
Click a department to isolate and get more information. <br> Click again to go back to explore.</p>";

// placeholder for bubble chart
var bubblePlaceholder = "<p class='placeholder'><br><br>After selecting a department, click on a course in the 'Departmental Courses' chart\ " +
    "to see the department's enrollment data for that year.</p>"

var barchartPlaceholder = "<p class='placeholder'><br><br>After selecting a department, click on a course in the 'Departmental Courses' chart\ " +
    "to see that course's enrollment data over time.</p>"

// set all placeholders
document.getElementById("DashboardGanttChart").innerHTML = instructions;
document.getElementById("ZoomedGanttChart").innerHTML = instructions;
document.getElementById("DashboardBubbleChart").innerHTML = bubblePlaceholder;
document.getElementById("ZoomedBubbleChart").innerHTML = bubblePlaceholder;
document.getElementById("DashboardBarChart").innerHTML = barchartPlaceholder;
document.getElementById("ZoomedBarChart").innerHTML = barchartPlaceholder;

// load data
queue()
    .defer(d3.csv, "data/all_fields_FAS_1990_2017_EnrollmentAdded.csv")
    .await(createVis);

function createVis(error, data) {
    if (error) throw error;

    // set up noUiSlider
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

    // parse dates
    data.forEach(function (d) {
        d.ACADEMIC_YEAR = parseDate(d.ACADEMIC_YEAR)
    });

    // initialize SACs
    stackedAreaChart = new StackedAreaChart('DashboardStackedAreaChart', data);
    detailedStackedAreaChart = new StackedAreaChart('ZoomedStackedAreaChart', data);
    stackedAreaChart.buddy = detailedStackedAreaChart;
    detailedStackedAreaChart.buddy = stackedAreaChart;

    // fill dropdowns
    keys = [];
    tmp = {};
    data.forEach(function(d){
        if(!tmp.hasOwnProperty(d.CLASS_ACAD_ORG_DESCRIPTION)){
            keys.push(d.CLASS_ACAD_ORG_DESCRIPTION);
            tmp[d.CLASS_ACAD_ORG_DESCRIPTION] = 1;
        }
    });
    keys = keys.sort();
    for(var i = 1; i < 4; i++){
        selectElement = document.getElementById("departmentselect" + i);
        keys.forEach(function(key){
            selectElement.innerHTML += "<option value='" + key + "'>" + key + "</option>";
        });
    }
}

// normalized / absolute SAC
function normalizeStackedAreaChart() {
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    stackedAreaChart.wrangleData();
    detailedStackedAreaChart.normalize = !detailedStackedAreaChart.normalize;
    detailedStackedAreaChart.wrangleData();
}

// slider callback
function slid() {
    var selectionRange = range.noUiSlider.get();
    selectionRange = selectionRange.map(function (d) {
        return parseDate(d)
    });
    stackedAreaChart.selectionChanged(selectionRange);
    detailedStackedAreaChart.selectionChanged(selectionRange);
}

// dropdown callback
function selectHappened(value){
    if (value == "NULL"){
        console.log("asdf");
        stackedAreaChart.deselect();
        detailedStackedAreaChart.deselect();
    }
    else{
        stackedAreaChart.select(value);
        detailedStackedAreaChart.select(value);
    }
}
