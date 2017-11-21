var stackedAreaChart, departmentTimeline;

var parseDate = d3.timeParse("%Y");

d3.select("#tooltip").text("Mouseover to see fields.");

var extent;
var range;
var selectedYear = '1992';
var selectedDepartment = 'Astronomy';
var selectedCourse = 'Solar System: Origin and Development';
var filteredData = [];

var instructions = "<p>Mouseover to see department names. <br>\
Click a department to isolate and get more information. <br> Click again to go back to explore.</p>";

document.getElementById("gantt").innerHTML = instructions;



queue()
    .defer(d3.csv, "data/all_fields_FAS_1990_2017_EnrollmentAdded.csv")
    // .defer(d3.csv, "data/all_fields_FAS_1990_2017_EnrollmentAdded.csv")
    .await(createVis);

function createVis(error, data, bubbleData) {
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


    function filterBubbleData() {
        filteredData = data.filter(function (d) {
            return d.ACADEMIC_YEAR === selectedYear && d.CLASS_ACAD_ORG_DESCRIPTION === selectedDepartment;
            bubbleChart.updateVis()
        });
    }

    //filtered data for bubble chart
    filterBubbleData();

    console.log(filteredData);

    // var tmpData = [];
    // filteredData.forEach(function (d) {
    //     var tmp = {
    //         course: d["CLASS_ACAD_ORG_DESCRIPTION"] + "." + d["COURSE_TITLE_LONG"],
    //         course_enrollment: d["COURSE_ENROLLMENT_DATA"]
    //         //      course: d["CLASS_ACAD_ORG_DESCRIPTION"] + "." + d["COURSE_TITLE_LONG"],
    //         //     course_enrollment: d["COURSE_ENROLLMENT_DATA"]
    //     };
    //     tmpData.push(tmp);
    // });
    //
    // console.log(tmpData)
    // //



    data.forEach(function (d) {
        d.ACADEMIC_YEAR = parseDate(d.ACADEMIC_YEAR)
    });



    stackedAreaChart = new StackedAreaChart('stackedareachart', data);
    DetailedStackedAreaChart = new StackedAreaChart('DetailedStackedAreaChart', data);
    departmentTimeline = new DepartmentTimeline('departmenttimeline', data);
    bubbleChart = new BubbleChart('bubbleChart', filteredData, selectedCourse);
}

function normalizeStackedAreaChart() {
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    stackedAreaChart.wrangleData();
}

function slid() {
    var selectionRange = range.noUiSlider.get();
    selectionRange = selectionRange.map(function (d) {
        return parseDate(d)
    });
    stackedAreaChart.selectionChanged(selectionRange);
    // DetailedStackedAreaChart.selectionChanged(selectionRange);
    departmentTimeline.selectionChanged(selectionRange);
}
