import React, { PureComponent } from 'react'
import Chart from "chart.js";
let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
Chart.defaults.global.legend.display = false;
//--Chart Style Options--//

export default class LineGraph extends PureComponent {
    
    chartRef = React.createRef();
    xAxis = [0]
    yAxis = [0]
    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, labels } = this.props;
        
        if(data !== undefined){
            this.xAxis.push(labels)
            this.yAxis.push(data)
            
        }
        if (typeof myLineChart !== "undefined") myLineChart.destroy();

        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: this.xAxis,
                datasets: [
                    {
                        label: 'Current Temp',
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        data: this.yAxis,
                    },
                    {
                        label: 'Max Temperature',
                        type: 'line',
                        data: [100],
                        clip: 0,
                        fill: false,
                    }
                ]
            },
            options: {
                //Customize chart options
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 2
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature'
                          }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            distribution: 'series',
                            bounds : 'ticks'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                          }
                    }]
                },
                title: {
                    display: true,
                    text: 'Current Temperature'
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'rgb(255, 99, 132)'
                    },
                }
            }
        });
    }
    
    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}