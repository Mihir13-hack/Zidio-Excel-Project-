import React, { useState, useRef } from 'react';
import axios from '../utils/axiosInstance';
import ExcelChart from './ExcelChart';
import { exportChartAsPNG, exportChartAsPDF } from './ChartExport';

const chartTypes = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
  { value: 'scatter', label: 'Scatter' },
];

const ExcelParse = () => {
  const [filename, setFilename] = useState('');
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [error, setError] = useState('');
  const chartRef = useRef();

  const handleParse = async () => {
    try {
      const res = await axios.post('/api/files/parse', { filename });
      setColumns(res.data.columns);
      setData(res.data.data);
      setXAxis('');
      setYAxis('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Parse failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <input type="text" placeholder="Uploaded filename..." value={filename} onChange={e => setFilename(e.target.value)} className="input input-bordered w-full mb-2" />
      <button onClick={handleParse} className="btn btn-primary w-full mb-4">Parse Excel</button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {columns.length > 0 && (
        <div className="space-y-2">
          <div>
            <label className="mr-2">X Axis:</label>
            <select value={xAxis} onChange={e => setXAxis(e.target.value)} className="select select-bordered">
              <option value="">Select column</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          <div>
            <label className="mr-2">Y Axis:</label>
            <select value={yAxis} onChange={e => setYAxis(e.target.value)} className="select select-bordered">
              <option value="">Select column</option>
              {columns.map(col => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          <div>
            <label className="mr-2">Chart Type:</label>
            <select value={chartType} onChange={e => setChartType(e.target.value)} className="select select-bordered">
              {chartTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="mt-8 bg-white rounded shadow p-4" ref={chartRef}>
        <ExcelChart columns={columns} data={data} xAxis={xAxis} yAxis={yAxis} chartType={chartType} />
      </div>
      {columns.length > 0 && xAxis && yAxis && (
        <div className="flex gap-2 mt-4">
          <button className="btn btn-outline" onClick={() => exportChartAsPNG(chartRef)}>
            Download PNG
          </button>
          <button className="btn btn-outline" onClick={() => exportChartAsPDF(chartRef)}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelParse;
