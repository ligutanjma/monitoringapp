import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as ChartJS from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

class Chart extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: 'line',
			data: {
				labels: [0],
				datasets: [{
                    label: 'Current Readings',
                    data: [0],
                    fill: false,
                    pointRadius: 0,
                    lineTension: 0,
                    borderWidth: 2,
                    backgroundColor: 'rgba(0, 0, 255, 1)',
					borderColor: 'rgba(0, 0, 255, 1)',
                },{
                    label: 'Required Temperature',
                    data: [props.required_temp],
                    fill: false,
                    pointRadius: 0,
                    lineTension: 0,
                    borderWidth: 2,
                    backgroundColor: 'rgba(255, 0, 0, 1)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                }
            ]
			},
			options: {
                responsive: true,
                animation: {
                    duration: 0,
                },
				title: {
					text: 'Chart.js Time Scale'
				},
				scales: {
					xAxes: [{
                        distribution: 'series',
                        bounds: 'ticks',
                        display: true,
						scaleLabel: {
							display: true,
							labelString: 'Time'
                        },
                        autoSkip: true,
                        autoSkipPadding: 25,
                        ticks: {
                            major: {
                                enabled: true
                            }
                        }
                    }],
					yAxes: [{
                        type:"linear",
                        gridLines: {
							drawBorder: false
						},
                        display: true,
						scaleLabel: {
							display: true,
							labelString: 'Temperature'
						}
                    }]
                },
                tooltips:{
                    intersect: false,
                    mode: 'index',
                    position: 'nearest',
                    callbacks: {
						label: function(tooltipItem, myData) {
							var label = myData.datasets[tooltipItem.datasetIndex].label || '';
							if (label) {
								label += ': ';
							}
							label += parseFloat(tooltipItem.value).toFixed(2);
							return label;
						}
					}
                },
                annotation: {
                    drawTime: 'beforeDatasetsDraw',
                    events: ['click'],
                    annotations: []
                }
                
            }, 
            plugins : [ChartAnnotation]
            
            
        }
    }

    

    static defaultProps = {
        width: null,
        height: null,
        style: null,
    }

    static propTypes = {
        data: PropTypes.object,
        width: PropTypes.string,
        height: PropTypes.string,
        style: PropTypes.object,
        required_temp: PropTypes.string,
        readings: PropTypes.object,
    };

    
    
    initChart() {
        this.chart = new ChartJS.Chart(this.canvas, this.state);
    }

    getCanvas() {
        return this.canvas;
    }
    
    getBase64Image() {
        return this.chart.toBase64Image();
    }
    
    generateLegend() {
        if(this.chart) {
            this.chart.generateLegend();
        }
    }
    
    refresh() {
        if(this.chart) {
            this.chart.update();
        }
    }
    
    reinit() {
        if(this.chart) {
            this.chart.destroy()
            this.initChart();

        }
    }

    componentDidMount() {
        this.initChart();
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
        if(this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    render() {
        // let className = classNames('p-chart', this.props.className),
        let style = Object.assign({
            width: this.props.width,
            height: this.props.height
        }, this.props.style);
        return (
            <div id={this.props.id} style={style}>
                <canvas ref={(el) => {
                            this.canvas = el;
                        }} 

                        width={this.props.width} 
                        height={this.props.height} />
            </div>
        );
    }
}

export default Chart;