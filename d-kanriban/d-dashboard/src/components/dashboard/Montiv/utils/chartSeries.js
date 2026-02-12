// src/pages/Manhour/utils/chartSeries.js

export const getLineSeries = (selectedMetrics, getLineColor) => {
  const series = [];
  
  if (selectedMetrics.actual_pcs) {
    series.push({
      dataKey: "actual_pcs",
      stroke: getLineColor('actual_pcs'),
      strokeWidth: 2,
      dot: { fill: getLineColor('actual_pcs'), strokeWidth: 1, r: 2 },
      name: "Actual PCS"
    });
  }
  
  if (selectedMetrics.target) {
    series.push({
      dataKey: "target",
      stroke: getLineColor('target'),
      strokeWidth: 1.5,
      strokeDasharray: "5 5",
      dot: { fill: getLineColor('target'), strokeWidth: 1, r: 2 },
      name: "Target"
    });
  }
  
  if (selectedMetrics.efficiency) {
    series.push({
      dataKey: "efficiency",
      stroke: getLineColor('efficiency'),
      strokeWidth: 1.5,
      dot: { fill: getLineColor('efficiency'), strokeWidth: 1, r: 2 },
      name: "Efficiency"
    });
  }
  
  if (selectedMetrics.loading_time) {
    series.push({
      dataKey: "loading_time",
      stroke: getLineColor('loading_time'),
      strokeWidth: 1.5,
      dot: { fill: getLineColor('loading_time'), strokeWidth: 1, r: 2 },
      name: "Loading Time"
    });
  }
  
  if (selectedMetrics.cycle_time) {
    series.push({
      dataKey: "cycle_time",
      stroke: getLineColor('cycle_time'),
      strokeWidth: 1.5,
      dot: { fill: getLineColor('cycle_time'), strokeWidth: 1, r: 2 },
      name: "Cycle Time"
    });
  }
  
  if (selectedMetrics.actual_ct) {
    series.push({
      dataKey: "actual_ct",
      stroke: getLineColor('actual_ct'),
      strokeWidth: 1.5,
      dot: { fill: getLineColor('actual_ct'), strokeWidth: 1, r: 2 },
      name: "Actual CT (seconds)"
    });
  }
  
  return series;
};

export const getBarSeries = (selectedMetrics, getLineColor) => {
  const series = [];
  
  if (selectedMetrics.actual_pcs) {
    series.push({
      dataKey: "actual_pcs",
      fill: getLineColor('actual_pcs'),
      name: "Actual PCS"
    });
  }
  
  if (selectedMetrics.target) {
    series.push({
      dataKey: "target",
      fill: getLineColor('target'),
      name: "Target"
    });
  }
  
  if (selectedMetrics.efficiency) {
    series.push({
      dataKey: "efficiency",
      fill: getLineColor('efficiency'),
      name: "Efficiency"
    });
  }
  
  if (selectedMetrics.loading_time) {
    series.push({
      dataKey: "loading_time",
      fill: getLineColor('loading_time'),
      name: "Loading Time"
    });
  }
  
  if (selectedMetrics.cycle_time) {
    series.push({
      dataKey: "cycle_time",
      fill: getLineColor('cycle_time'),
      name: "Cycle Time"
    });
  }
  
  if (selectedMetrics.actual_ct) {
    series.push({
      dataKey: "actual_ct",
      fill: getLineColor('actual_ct'),
      name: "Actual CT (seconds)"
    });
  }
  
  return series;
};

export const getAreaSeries = (selectedMetrics, getLineColor) => {
  const series = [];
  
  if (selectedMetrics.actual_pcs) {
    series.push({
      dataKey: "actual_pcs",
      stroke: getLineColor('actual_pcs'),
      fill: getLineColor('actual_pcs'),
      name: "Actual PCS"
    });
  }
  
  if (selectedMetrics.target) {
    series.push({
      dataKey: "target",
      stroke: getLineColor('target'),
      fill: getLineColor('target'),
      name: "Target"
    });
  }
  
  if (selectedMetrics.efficiency) {
    series.push({
      dataKey: "efficiency",
      stroke: getLineColor('efficiency'),
      fill: getLineColor('efficiency'),
      name: "Efficiency"
    });
  }
  
  if (selectedMetrics.loading_time) {
    series.push({
      dataKey: "loading_time",
      stroke: getLineColor('loading_time'),
      fill: getLineColor('loading_time'),
      name: "Loading Time"
    });
  }
  
  if (selectedMetrics.cycle_time) {
    series.push({
      dataKey: "cycle_time",
      stroke: getLineColor('cycle_time'),
      fill: getLineColor('cycle_time'),
      name: "Cycle Time"
    });
  }
  
  if (selectedMetrics.actual_ct) {
    series.push({
      dataKey: "actual_ct",
      stroke: getLineColor('actual_ct'),
      fill: getLineColor('actual_ct'),
      name: "Actual CT (seconds)"
    });
  }
  
  return series;
};