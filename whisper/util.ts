import fs  from 'fs';
import path  from 'path';

export function rmDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      rmDir(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
  }
  fs.rmdirSync(dirPath);
}
