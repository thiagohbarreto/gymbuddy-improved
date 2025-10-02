// Cálculo de 1RM (Repetição Máxima)
export const calculate1RM = (peso: number, reps: number): number => {
  if (reps === 1) return peso;
  // Fórmula de Brzycki
  return Math.round(peso * (36 / (37 - reps)));
};

// Cálculo de volume total
export const calculateVolume = (peso: number, series: number, reps: number): number => {
  return peso * series * reps;
};

// Cálculo de intensidade relativa
export const calculateIntensity = (peso: number, oneRM: number): number => {
  return Math.round((peso / oneRM) * 100);
};

// Sugestão de peso baseado em RPE (Rate of Perceived Exertion)
export const suggestWeight = (oneRM: number, targetReps: number, rpe: number): number => {
  const intensityMap: { [key: number]: { [key: number]: number } } = {
    6: { 1: 0.86, 2: 0.84, 3: 0.82, 4: 0.80, 5: 0.78 },
    7: { 1: 0.89, 2: 0.87, 3: 0.85, 4: 0.83, 5: 0.81 },
    8: { 1: 0.92, 2: 0.90, 3: 0.88, 4: 0.86, 5: 0.84 },
    9: { 1: 0.95, 2: 0.93, 3: 0.91, 4: 0.89, 5: 0.87 },
    10: { 1: 1.00, 2: 0.97, 3: 0.94, 4: 0.92, 5: 0.89 }
  };

  const intensity = intensityMap[rpe]?.[targetReps] || 0.8;
  return Math.round(oneRM * intensity);
};

// Formatação de tempo
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};