
export const createFileFromPath = (path: string): File => {
    const fileName = path.split('/').pop() || path;
    return new File([], fileName, { type: getFileTypeFromName(fileName) });
  };
  
export const getFileTypeFromName = (fileName: string): string => {
    if (fileName.endsWith('.pdf')) return 'application/pdf';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'image/jpeg';
    if (fileName.endsWith('.png')) return 'image/png';
    return 'application/octet-stream';
};