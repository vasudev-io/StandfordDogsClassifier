import React, { useEffect, useState } from "react";
import { Box, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import dataFetchService from "../../../services/DataFetchService";

const ConfusionMatrixModule = () => {
  const theme = useMantineTheme();
  const [confusionMatrix, setConfusionMatrix] = useState<{ [actualLabel: string]: { [predictedLabel: string]: number; } } | undefined>(undefined);
  const [classLabels, setClassLabels] = useState<string[]>([]);


  useEffect(() => {
    dataFetchService.getConfusionMatrix().then(matrix => {
      if (matrix instanceof Error) {
        // Handle error appropriately
        console.error(matrix);
        return;
      }
      setConfusionMatrix(matrix);
      setClassLabels(Object.keys(matrix));
    });
  }, []);

  const renderConfusionMatrix = () => {
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

  return (
    <Box
      sx={{
        display: 'flex', // make the container flex
        gap: theme.spacing.xs * 0.5,
        height: `calc(100% - ${theme.spacing.xs}px)`,
      }}>
      <Box
        sx={{
          width: '100%',
          height: '100%', // full height/width of the container
        }}>
        <Stack
          sx={{
            gap: theme.spacing.xs * 0.5,
            alignItems: 'center',
            justifyContent: 'stretch',
            height: '100%'
          }}>
          <Text sx={{
            fontFamily: 'Noto Sans',
            fontSize: theme.fontSizes.xl,
            color: theme.colors.gray[8],
            fontWeight: 400,
          }}>
            Confusion Matrix
          </Text>
          <ScrollArea 
            type='always'
            style={{ width: '100%', height: '100%' }}>
            {renderConfusionMatrix()}
          </ScrollArea>
        </Stack>
      </Box>
      
    </Box>
  );
  
};

export default ConfusionMatrixModule;
