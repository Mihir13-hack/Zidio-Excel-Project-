import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportChartAsPNG(chartRef, filename = 'chart.png') {
  if (!chartRef.current) return;
  const canvas = await html2canvas(chartRef.current);
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = filename;
  link.click();
}

export async function exportChartAsPDF(chartRef, filename = 'chart.pdf') {
  if (!chartRef.current) return;
  const canvas = await html2canvas(chartRef.current);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'landscape' });
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(filename);
}
