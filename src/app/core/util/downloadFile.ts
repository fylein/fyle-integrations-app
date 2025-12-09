export const downloadFile = (content: string, fileName: string, fileType: string) => {
  const blob = new Blob([content], { type: fileType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
};

export const downloadCSVFile = (content: string, fileName: string) => {
  downloadFile(content, fileName, 'text/csv');
};
