var stackedAreaChart, departmentTimeline;

var parseDate = d3.timeParse("%Y");

d3.select("#tooltip").text("Mouseover to see fields.")

queue()
    .defer(d3.csv,"data/filter_to_concentrations.csv")
    .defer(d3.csv,"data/concentrations.csv")
    .await(createVis);

function createVis(error, data, concentrations){
    if(error) throw error;
    data.forEach(function(d){
        d.ACADEMIC_YEAR = parseDate(d.ACADEMIC_YEAR)
    })
    stackedAreaChart = new StackedAreaChart('stackedareachart', data, concentrations);
    departmentTimeline = new DepartmentTimeline('departmenttimeline', data);
}

function normalizeStackedAreaChart(){
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    console.log
    stackedAreaChart.wrangleData();
}

function brushed() {
    var selectionRange = d3.brushSelection(d3.select(".brush").node());
    var selectionDomain = selectionRange.map(departmentTimeline.x.invert);
    stackedAreaChart.selectionChanged(selectionDomain);
}

