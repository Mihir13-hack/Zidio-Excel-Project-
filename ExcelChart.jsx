import React from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = ['bar', 'line', 'pie', 'scatter'];

const ExcelChart = ({ columns, data, xAxis, yAxis, chartType }) => {
  if (!xAxis || !yAxis || !columns.length || !data.length) return null;

  // Prepare chart.js data
  const labels = data.map(row => row[xAxis]);
  const values = data.map(row => Number(row[yAxis]));

  const chartData = {
    labels,
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data: chartType === 'scatter' ? data.map(row => ({ x: row[xAxis], y: row[yAxis] })) : values,
        backgroundColor: 'rgba(59,130,246,0.5)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: chartType !== 'pie' } },
    scales: chartType === 'pie' ? {} : { x: { title: { display: true, text: xAxis } }, y: { title: { display: true, text: yAxis } } },
  };

  switch (chartType) {
    case 'bar':
      return <Bar data={chartData} options={options} />;
    case 'line':
      return <Line data={chartData} options={options} />;
    case 'pie':
      return <Pie data={{ labels, datasets: [{ ...chartData.datasets[0], data: values }] }} options={options} />;
    case 'scatter':
      return <Scatter data={chartData} options={options} />;
    default:
      return null;
  }
};

export default ExcelChart;
