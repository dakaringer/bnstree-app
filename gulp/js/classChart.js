$('#classModal').on('shown.bs.modal', function (event) {
    var option = {
        // String - Animation easing effect
        // Possible effects are:
        // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
        //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
        //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
        //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
        //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
        //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
        //  easeOutElastic, easeInCubic]
        animationEasing: "easeOutQuad",
        
        scale: {
            ticks: {
                beginAtZero: true,
                showLabelBackdrop: false,
                max: 100
            },
            gridLines : {
                color: "rgba(255,255,255,.1)"
            }
        },
        
        legend: {
            position: "bottom"
        }
    }
    
    var data = {
        labels: ["Attack", "Combo", "Protection", "Defense", "Range", "Control"],
        datasets: [
            {
                label: "BnS Official",
                backgroundColor: "rgba(220,220,220,0.2)",
                borderColor: "rgba(220,220,220,1)",
                pointBackgroundColor: "rgba(220,220,220,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointRadius: 2,
                data: ncChart
            },
            {
                label: "Di'el's Opinion",
                backgroundColor: "rgba(151,187,205,0.2)",
                borderColor: "rgba(151,187,205,1)",
                pointBackgroundColor: "rgba(151,187,205,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointRadius: 2,
                data: dielChart
            }
        ]
    };

    var ctx = document.getElementById("classChart").getContext("2d");
    var myRadarChart = new Chart(ctx, {type: 'radar', data: data, options: option});
});