import formatDuration from "format-duration";

export const formatTime = (timeInMs = 0) => {
  return formatDuration(timeInMs);
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
