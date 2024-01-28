import React, { useEffect, useState } from "react";
import { Box, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import dataFetchService from "../../../services/DataFetchService";
import Plot from "react-plotly.js";

const ConfusionMatrixModule = () => {
  const theme = useMantineTheme();
  const [confusionMatrix, setConfusionMatrix] = useState<{ [actualLabel: string]: { [predictedLabel: string]: number; } } | undefined>(undefined);
  const [classLabels, setClassLabels] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState("table");

  useEffect(() => {
    dataFetchService.getConfusionMatrix().then(matrix => {
      if (matrix instanceof Error) {
        console.error(matrix);
        return;
      }
      setConfusionMatrix(matrix);
      setClassLabels(Object.keys(matrix));
    });
  }, []);

  const renderConfusionMatrixTable = () => {
    
    if (!confusionMatrix) return null;
  
    // create the header row of the table
    const headerRow = (
      <tr>
        <th>Actual\Predicted</th>
        {classLabels.map(label => <th key={`header-${label}`}>{label}</th>)}
      </tr>
    );
  
    // generate table cells containing confusion matrix values 
    const bodyRows = classLabels.map((actualLabel, rowIndex) => (
      <tr key={`row-${actualLabel}`}>
        <td key={`actual-${actualLabel}`}>{actualLabel}</td>
        {classLabels.map((predictedLabel) => (
          <td key={`${actualLabel}-${predictedLabel}`}>
            {confusionMatrix[actualLabel][predictedLabel] || 0}
          </td>
        ))}
      </tr>
    ));
  
    // return a div containing a table with a scrollable area
    return (
      <div style={{ overflow: 'auto', maxHeight: '500px' }}>
        <table>
          <thead>{headerRow}</thead>
          <tbody>{bodyRows}</tbody>
        </table>
      </div>
    );
  };
  
  const renderConfusionMatrixHeatmap = () => {
    if (!confusionMatrix) return null;

    const labels = classLabels;
    const reversedLabels = [...labels].reverse();

    // 2D array for heatmap values
    const values = classLabels.map((actualLabel) =>
      classLabels.map((predictedLabel) => confusionMatrix[actualLabel][predictedLabel] || 0)
    ).reverse();

    // overlay values for false positives that occur in a custom range
    const customRange = { min: 1, max: 10 };

    const overlayValues = values.map(row =>
      row.map(value => (value >= customRange.min && value <= customRange.max ? value : null))
    );

    const mapZToAlpha = (value: number | null) => {
      if (value === null) return 0; 
      return 0.15 + 0.9 * (value - 1) / 9;
    };
    
    const overlayColorscale: [number, string][] = [];
    for (let i = 0; i <= 10; i++) {
      const alpha = mapZToAlpha(i);
      overlayColorscale.push([i / 10, `rgba(255, 0, 0, ${alpha})`]);
    }

    const data: Partial<Plotly.PlotData>[] = [
      // main heatmap
      {
        x: labels,
        y: reversedLabels,
        z: values,
        type: "heatmap",
        colorscale: "Viridis",
      },
      // overlay for custom values - false positives
      {
        x: labels,
        y: reversedLabels,
        z: overlayValues,
        type: "heatmap",
        colorscale: overlayColorscale,
        showscale: false,
      },
    ];
  
    const layout: Partial<Plotly.Layout> = {
      title: "Confusion Matrix Heatmap",
      yaxis: {
        title: "Predicted Labels",
        tickangle: -45,
        tickvals: reversedLabels.map((_, index) => index), 
        ticktext: reversedLabels, 
        automargin: true, 
      },
      xaxis: {
        title: "Actual Labels",
        side: 'top',
        tickangle: -45,
        tickvals: labels.map((_, index) => index),
        ticktext: labels,
        automargin: true, 
        scaleanchor: 'x' as Plotly.AxisName,
        scaleratio: 1,
      },
      autosize: false,
      height: reversedLabels.length * 20,
      width: labels.length * 40
    };
  
    return (
      <div style={{ width: '100%', maxHeight: '500px'}}>
        <Plot
          data={data}
          layout={layout}
          useResizeHandler={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  };

  
  return (
    <Box sx={{ display: 'flex', height: `100%` }}>
      <Box sx={{ width: '100%', height: '100%' }}>
          <Text sx={{ fontFamily: 'Noto Sans', fontSize: theme.fontSizes.xl, color: theme.colors.gray[8], fontWeight: 400 }}>
            Confusion Matrix
          </Text>
          <button onClick={() => setDisplayMode(displayMode === "table" ? "heatmap" : "table")}>
            Switch Display
          </button>
        <Stack sx={{ alignItems: 'center', justifyContent: 'stretch', height: '100%', flexGrow: 1 }}>
          
          <ScrollArea type="always" style={{ width: '100%', height: '100%' }}>
            {displayMode === 'table' ? renderConfusionMatrixTable() : renderConfusionMatrixHeatmap()}
          </ScrollArea>
        </Stack>
      </Box>
    </Box>
  );
};

export default ConfusionMatrixModule;