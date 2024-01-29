import React, { useEffect, useState } from "react";
import { Box, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core";
import dataFetchService from "../../../services/DataFetchService";

const SensitivityMatrixModule = () => {
  const theme = useMantineTheme();
  const [sensitivityScores, setSensitivityScores] = useState<{ [label: string]: number } | undefined>(undefined);
  const [classLabels, setClassLabels] = useState<string[]>([]);

  useEffect(() => {
    dataFetchService.getSensitivityScores().then(scores => {
      if (scores instanceof Error) {
        console.error(scores);
        return;
      }
      setSensitivityScores(scores);
      setClassLabels(Object.keys(scores));
    });
  }, []);

  const renderSensitivityMatrix = () => {
    if (!sensitivityScores) return null;

    const rows = classLabels.map((label) => (
      <tr key={`row-${label}`}>
        <td key={`label-${label}`}>{label}</td>
        <td key={`score-${label}`}>{sensitivityScores[label].toFixed(2)}</td>
      </tr>
    ));

    return (
      <div style={{ overflow: 'auto', maxHeight: '500px' }}>
        <table>
          <thead>
            <tr>
              <th>Class Label</th>
              <th>Sensitivity Score</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: `100%` }}>
      <Box sx={{ width: '100%', height: '100%' }}>
        <Text sx={{ fontFamily: 'Noto Sans', fontSize: theme.fontSizes.xl, color: theme.colors.gray[8], fontWeight: 400 }}>
          Sensitivity Matrix
        </Text>
        <Stack sx={{ alignItems: 'left', justifyContent: 'stretch', height: '100%', flexGrow: 1 }}>
          <ScrollArea type="always" style={{ width: '100%', height: '100%' }}>
            {renderSensitivityMatrix()}
          </ScrollArea>
        </Stack>
      </Box>
    </Box>
  );
};

export default SensitivityMatrixModule;
