import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import ExcelChart from './ExcelChart';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [parsedData, setParsedData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/history').then(res => setHistory(res.data));
  }, []);

  const handleReplay = async (item) => {
    setLoading(true);
    setSelected(item);
    try {
      const res = await axios.post('/api/files/parse', { filename: item.fileName });
      setParsedData({ columns: res.data.columns, data: res.data.data });
    } catch {
      setParsedData({ columns: [], data: [] });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Upload & Chart History</h2>
      <ul className="mb-6 divide-y">
        {history.map((item, idx) => (
          <li key={item._id || idx} className="py-2 flex items-center justify-between">
            <span>
              <b>{item.fileName}</b> ({item.chartType})<br/>
              <small>{item.selectedXAxis} vs {item.selectedYAxis} | {new Date(item.uploadDate).toLocaleString()}</small>
            </span>
            <button className="btn btn-sm btn-outline ml-2" onClick={() => handleReplay(item)}>Replay</button>
          </li>
        ))}
      </ul>
      {selected && parsedData.columns.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">{selected.fileName} ({selected.chartType})</h3>
          <ExcelChart
            columns={parsedData.columns}
            data={parsedData.data}
            xAxis={selected.selectedXAxis}
            yAxis={selected.selectedYAxis}
            chartType={selected.chartType}
          />
        </div>
      )}
      {loading && <div className="mt-4">Loading chart...</div>}
    </div>
  );
};

export default Dashboard;
