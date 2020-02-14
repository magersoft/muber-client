export const distancePipe = (distance: number): string => `${Math.round(distance / 100)} km`;
export const durationPipe = (duration: number): string => `${Math.floor(duration / 60)} min`;
