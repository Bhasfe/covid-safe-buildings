import React, { useRef, useEffect } from 'react';

import {
  Chart, LineController, BarController, LineElement, BarElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { tailwindConfig, formatValue, hexToRGB } from '../../utils/Utils';

Chart.register(LineController, BarController, LineElement, BarElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function OccupancyMixedChart({
  width,
  height,
  capacity,
  chartData
}) {

  const canvas = useRef(null);

  useEffect(() => {

    let datasets = [];

    let datasetColors = [
      {
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
      },
      {
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.green[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.green[500],
        pointBackgroundColor: tailwindConfig().theme.colors.green[500],
      },
      {
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.yellow[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.yellow[500],
        pointBackgroundColor: tailwindConfig().theme.colors.yellow[500],
      },
      {
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.orange[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.orange[500],
        pointBackgroundColor: tailwindConfig().theme.colors.orange[500],
      },
      {
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.red[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.red[500],
        pointBackgroundColor: tailwindConfig().theme.colors.red[500],
      }
    ];


    for (let i = 0; i < chartData.length; i++) {

      let options = {
        label: chartData[i].label,
        data: [],
        type: 'line',
        fill: true,
        backgroundColor: datasetColors[i].backgroundColor,
        borderColor: datasetColors[i].borderColor,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: datasetColors[i].pointBackgroundColor,
        clip: 0,
      };


      if (i !== 0) {
        options.type = 'bar';
      }

      datasets.push(options);

    }

    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        animation: false,
        chartArea: {
          backgroundColor: tailwindConfig().theme.colors.slate[50],
        },
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            stacked: true,
            suggestedMax: capacity,
            max: capacity,
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            stacked: true,
            type: 'time',
            time: {
              parser: 'H:i:s',
              // unit: 'hour',
            },
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              // label: (context) => formatValue(context.parsed.y),
              label: function(context) {
                
                let occupant_count = context.parsed.y;

                let output = '';

                if (occupant_count <= 0) {
                  output = "No person";
                } else if (occupant_count > 1) {
                  output = `${occupant_count} people`;
                } else {
                  output = `${occupant_count} person`;
                }

                return context.dataset.label + ": " + output + " at " + (new Date(context.parsed.x)).toLocaleTimeString();

              }
            },
          },
          legend: {
            display: true,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
        // resizeDelay: 200,
      },
    });
    
    chart.data.labels = chartData[0]?.labels ?? [];

    for ( let i = 0; i < chartData.length; i++) {

      chart.data.datasets[i].data = chartData[i].data ?? [];
      chart.data.datasets[i].label = chartData[i].label ?? '';
    }

    // chart.data.datasets.forEach((dataset) => {
    //     dataset.data = chartData?.data ?? [];
    // });
    chart.update();

    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default OccupancyMixedChart;