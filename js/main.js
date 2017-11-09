var stackedAreaChart;

var parseDate = d3.timeParse("%Y");

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
}

function normalizeStackedAreaChart(){
    stackedAreaChart.normalize = !stackedAreaChart.normalize;
    console.log
    stackedAreaChart.wrangleData();
}

