var stackedAreaChart, departmentTimeline;

var parseDate = d3.timeParse("%Y");

d3.select("#tooltip").text("Mouseover to see fields.");

var range

queue()
    .defer(d3.csv,"data/all_fields_all_years.csv")
    .defer(d3.csv,"data/concentrations.csv")
    // .defer(d3.csv, "data/course_enrollments_test.csv")
    .await(createVis);

function createVis(error, data, test){
    if(error) throw error;

    range = document.getElementById('slider');
    var extent = d3.extent(data, function(d){ return +d.ACADEMIC_YEAR })
    console.log(extent);
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
                to: function(value){
                    return d3.format("d")(value);
                },
                // don't undo formatting
                from: function(value){
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
        range.noUiSlider.on('slide', slid)

    data.forEach(function(d){
        d.ACADEMIC_YEAR = parseDate(d.ACADEMIC_YEAR)
    });
    stackedAreaChart = new StackedAreaChart('stackedareachart', data);
    departmentTimeline = new DepartmentTimeline('departmenttimeline', data);
    // bubbleChart = new BubbleChart('bubbleChart', test);
}

function normalizeStackedAreaChart(){
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    stackedAreaChart.wrangleData();
}

function slid() {
    var selectionRange = range.noUiSlider.get();
    selectionRange = selectionRange.map(function(d){ return parseDate(d) })
    stackedAreaChart.selectionChanged(selectionRange);
    departmentTimeline.selectionChanged(selectionRange);
}
