import React, { useRef, useEffect } from 'react';

import {
  Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip,
} from 'chart.js';
import 'chartjs-adapter-moment';

// Import utilities
import { tailwindConfig, formatValue, hexToRGB } from '../../utils/Utils';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function OccupancyLineChart({
  width,
  height,
  capacity,
  chartData
}) {

  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            fill: true,
            backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
            borderColor: tailwindConfig().theme.colors.indigo[500],
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
            clip: 20,
          },
    
        ],
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
            suggestedMax: capacity,
            max: capacity,
            display: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            type: 'time',
            time: {
              parser: 'H:i:s',
              unit: 'hour',
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

                return output + " at " + (new Date(context.parsed.x)).toLocaleTimeString();

              }
            },
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    
    chart.data.labels = chartData?.labels ?? [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = chartData?.data ?? [];
    });
    chart.update();

    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default OccupancyLineChart;