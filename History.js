const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  selectedXAxis: { type: String, required: true },
  selectedYAxis: { type: String, required: true },
  chartType: { type: String, required: true }
});

module.exports = mongoose.model('History', historySchema);
