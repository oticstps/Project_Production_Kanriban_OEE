// src/pages/Manhour/utils/chartUtils.js

export const getChartConfig = ({ chartType, selectedMetrics, getLineColor }) => {
  const commonConfig = {
    margin: { top: 5, right: 5, left: 5, bottom: 5 },
    components: {
      CartesianGrid: { strokeDasharray: "3 3", stroke: "#D1D5DB" },
      XAxis: { dataKey: "time", stroke: "#000000ff", fontSize: 10 },
      YAxis: { stroke: "#000000ff", fontSize: 10 },
      Tooltip: {
        content: ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return {
              type: 'div',
              props: {
                className: "bg-white border border-black p-2 text-xs text-black",
                style: {
                  boxShadow: '2px 2px 0 0 #222, 0 1px 6px 0 #0008',
                  border: '2px solid #111',
                  borderRadius: 4,
                },
                children: [
                  { type: 'p', props: { className: "font-semibold", children: label } },
                  ...payload.map((entry, index) => ({
                    type: 'p',
                    props: {
                      key: index,
                      style: { color: entry.color },
                      children: [
                        `${entry.dataKey}: `,
                        { type: 'strong', props: { children: entry.value } }
                      ]
                    }
                  })),
                  payload[0]?.payload?.product_name && {
                    type: 'p',
                    props: {
                      className: "mt-1 text-black",
                      children: [
                        "Product: ",
                        { type: 'strong', props: { children: payload[0].payload.product_name } }
                      ]
                    }
                  }
                ].filter(Boolean)
              }
            };
          }
          return null;
        }
      },
      Legend: { wrapperStyle: { fontSize: '12px', paddingTop: '10px', color: '#374151' } }
    }
  };

  const createMetricConfig = (key, type, name, additionalProps = {}) => {
    if (!selectedMetrics[key]) return null;
    
    const baseProps = {
      dataKey: key,
      name: name,
      stroke: getLineColor(key),
      fill: getLineColor(key)
    };

    return {
      type: type,
      props: {
        ...baseProps,
        ...additionalProps
      }
    };
  };

  switch (chartType) {
    case 'line':
      return {
        ...commonConfig,
        chartType: 'LineChart',
        series: [
          createMetricConfig('actual_pcs', 'Line', 'Actual PCS', {
            type: "monotone",
            strokeWidth: 2,
            dot: { fill: getLineColor('actual_pcs'), strokeWidth: 1, r: 2 }
          }),
          createMetricConfig('target', 'Line', 'Target', {
            type: "monotone",
            strokeWidth: 1.5,
            strokeDasharray: "5 5",
            dot: { fill: getLineColor('target'), strokeWidth: 1, r: 2 }
          }),
          createMetricConfig('efficiency', 'Line', 'Efficiency', {
            type: "monotone",
            strokeWidth: 1.5,
            dot: { fill: getLineColor('efficiency'), strokeWidth: 1, r: 2 }
          }),
          createMetricConfig('loading_time', 'Line', 'Loading Time', {
            type: "monotone",
            strokeWidth: 1.5,
            dot: { fill: getLineColor('loading_time'), strokeWidth: 1, r: 2 }
          }),
          createMetricConfig('cycle_time', 'Line', 'Cycle Time', {
            type: "monotone",
            strokeWidth: 1.5,
            dot: { fill: getLineColor('cycle_time'), strokeWidth: 1, r: 2 }
          }),
          createMetricConfig('actual_ct', 'Line', 'Actual CT (seconds)', {
            type: "monotone",
            strokeWidth: 1.5,
            dot: { fill: getLineColor('actual_ct'), strokeWidth: 1, r: 2 }
          })
        ].filter(Boolean)
      };

    case 'bar':
      return {
        ...commonConfig,
        chartType: 'BarChart',
        series: [
          createMetricConfig('actual_pcs', 'Bar', 'Actual PCS'),
          createMetricConfig('target', 'Bar', 'Target'),
          createMetricConfig('efficiency', 'Bar', 'Efficiency'),
          createMetricConfig('loading_time', 'Bar', 'Loading Time'),
          createMetricConfig('cycle_time', 'Bar', 'Cycle Time'),
          createMetricConfig('actual_ct', 'Bar', 'Actual CT (seconds)')
        ].filter(Boolean)
      };

    case 'area':
      return {
        ...commonConfig,
        chartType: 'AreaChart',
        series: [
          createMetricConfig('actual_pcs', 'Area', 'Actual PCS'),
          createMetricConfig('target', 'Area', 'Target'),
          createMetricConfig('efficiency', 'Area', 'Efficiency'),
          createMetricConfig('loading_time', 'Area', 'Loading Time'),
          createMetricConfig('cycle_time', 'Area', 'Cycle Time'),
          createMetricConfig('actual_ct', 'Area', 'Actual CT (seconds)')
        ].filter(Boolean)
      };

    default:
      return {
        ...commonConfig,
        chartType: 'LineChart',
        series: []
      };
  }
};