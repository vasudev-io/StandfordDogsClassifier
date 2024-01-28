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
  
    const headerRow = (
      <tr>
        <th>Actual\Predicted</th>
        {classLabels.map(label => <th key={`header-${label}`}>{label}</th>)}
      </tr>
    );
  
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
  
    // reverse to match matrix orientation
    const labels = classLabels;
    const reversedLabels = [...labels].reverse();

    // 2D array
    const values = classLabels.map((actualLabel) =>
      classLabels.map((predictedLabel) => confusionMatrix[actualLabel][predictedLabel] || 0)
    ).reverse();
  
    const data: Partial<Plotly.PlotData>[] = [
      {
        x: labels,
        y: reversedLabels,
        z: values,
        type: "heatmap" as const,
        colorscale: "Viridis",
        
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