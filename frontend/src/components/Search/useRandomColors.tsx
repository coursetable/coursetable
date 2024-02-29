import { useState, useEffect } from 'react';
import type chroma from 'chroma-js';

export const useRandomColors = (
  isAuthenticated: boolean,
  ratingColormap: chroma.Scale,
  workloadColormap: chroma.Scale,
) => {
  const generateRandomColor = (colorMap: chroma.Scale) => {
    const scale = colorMap.colors(5);
    const randomIndex = Math.floor(Math.random() * scale.length);
    return scale[randomIndex] ?? ''; // For type
  };

  const [randomColors, setRandomColors] = useState({
    overallRatingColor: '',
    workloadRatingColor: '',
    professorRatingColor: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setRandomColors({
        overallRatingColor: generateRandomColor(ratingColormap),
        workloadRatingColor: generateRandomColor(workloadColormap),
        professorRatingColor: generateRandomColor(ratingColormap),
      });
    }
  }, [isAuthenticated, ratingColormap, workloadColormap]);

  return randomColors;
};
