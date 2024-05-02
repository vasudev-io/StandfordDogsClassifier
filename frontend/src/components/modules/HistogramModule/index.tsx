import React, { useEffect, useState } from 'react';
import { Histogram, BarSeries, withParentSize, XAxis, YAxis } from '@visx/histogram';
import { scaleLinear } from '@visx/scale';
import dataFetchService from '../../../services/DataFetchService';

const HistogramModule = withParentSize(({ parentWidth, parentHeight }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    dataFetchService.getHistogramData().then((histogramData) => {
      if (histogramData instanceof Error) {
        console.error('Failed to fetch histogram data:', histogramData);
      } else {
        setData(histogramData);
      }
    });
  }, []);

  const xScale = scaleLinear({
    domain: [Math.min(...data), Math.max(...data)],
    nice: true,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map((d) => d.count))],
    nice: true,
  });

  return (
    <div>
      <Histogram
        width={parentWidth}
        height={parentHeight}
        xScale={xScale}
        yScale={yScale}
        horizontal={false}
      >
        <BarSeries dataKey="Histogram" data={data} xAccessor={(d) => d.value} yAccessor={(d) => d.count} />
        <XAxis />
        <YAxis />
      </Histogram>
    </div>
  );
});

export default HistogramModule;
