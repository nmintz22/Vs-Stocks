$(document).ready(function() {
    $("#compare-btn").click(function() {
        var ticker1Data;
        var ticker2Data;

        var ticker1 = $("#ticker-1").val().toLowerCase();
        var ticker2 = $("#ticker-2").val().toLowerCase();
        var validData = true

        if ($("#ticker-1").val() != "" && $("#ticker-2").val() != "") {
            $.ajax({
                url: `/get-data?ticker=${ticker1}`,
                type: "GET",
                async: false,
                success(data, status) {
                    ticker1Data = JSON.parse(data);
                    if (Object.keys(ticker1Data).length == 0) { 
                        validData=false
                        $("#ticker-1").css("border-color", "rgba(255,99,132,1)")
                    } else {
                        $("#ticker-1").css("border-color", "rgb(128, 128, 128)")
                    }
                }
            })

            $.ajax({
                url: `/get-data?ticker=${ticker2}`,
                type: "GET",
                async: false,
                success(data, status) {
                    ticker2Data = JSON.parse(data);
                    if (Object.keys(ticker2Data).length == 0) { 
                        validData=false
                        $("#ticker-2").css("border-color", "rgba(255,99,132,1)")
                    } else {
                        $("#ticker-2").css("border-color", "rgb(128, 128, 128)")
                    }
                }
            })
            
            if (validData) {
                makeChart(ticker1Data, ticker2Data);
            }
        }
    })
})

function makeChart(ticker1Data, ticker2Data) {
    $("#graph-canvas").remove();
    $("#canvas-div").append('<canvas id="graph-canvas"></canvas>')
    var canvas = document.querySelector("#graph-canvas");
    var ctx = canvas.getContext("2d");
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: getLabels(ticker1Data),
            datasets: [{
                label: ticker1Data['ticker'].toUpperCase(),
                data: getData(ticker1Data),
                fill: false,
                pointRadius: 0,
                borderColor: 'rgba(132,99,255,1)',
                borderWidth: 4
            },
            {
                label: ticker2Data['ticker'].toUpperCase(),
                data: getData(ticker2Data),
                fill: false,
                pointRadius: 0,
                borderColor: 'rgba(99,255,132,1)',
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

function getLabels(object) {
    keys = Object.keys(object)
    var labels = []
    for (var index in keys) {
       let label = keys[index]
       if (label != "ticker") {
            labels.push(label)
        }
    }

    return labels;
}

function getData(object) {
    let labels = getLabels(object)
    let data = []
    for (const index in labels) {
        let label = labels[index]
        if (label != "ticker") {
            data.push(object[label])
        }
    }
    return data;
}
