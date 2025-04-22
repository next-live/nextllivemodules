"use server"

import fs from 'fs';
import path from 'path';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

interface CodeEditResult {
  success?: boolean;
  error?: string;
  content?: string;
  tree?: FileNode[];
}

function buildFileTree(dir: string, basePath: string = ''): FileNode[] {
  const files = fs.readdirSync(dir);
  const tree: FileNode[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Skip node_modules and other common directories
      if (['node_modules', '.next', '.git'].includes(file)) {
        continue;
      }

      const node: FileNode = {
        name: file,
        path: relativePath,
        type: 'directory',
        children: buildFileTree(fullPath, relativePath)
      };
      tree.push(node);
    } else {
      // Only include certain file types
      const ext = path.extname(file).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json', '.md'].includes(ext)) {
        tree.push({
          name: file,
          path: relativePath,
          type: 'file'
        });
      }
    }
  }

  return tree;
}

export async function listFiles(listPath: string = 'src'): Promise<CodeEditResult> {
  try {
    const basePath = path.join(process.cwd(), listPath);
    const tree = buildFileTree(basePath);
    return { success: true, tree };
  } catch (error) {
    console.error('Error listing files:', error);
    return { success: false, error: 'Failed to list files' };
  }
}

export async function readFile(filepath: string): Promise<CodeEditResult> {
  try {
    const absolutePath = path.join(process.cwd(), "src/", filepath.replace('@', ''));
    
    // Security check: ensure the path is within the project directory
    if (!absolutePath.startsWith(process.cwd())) {
      return { success: false, error: 'Access denied' };
    }

    if (!fs.existsSync(absolutePath)) {
      return { success: false, error: 'File not found' };
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    console.error('Error reading file:', error);
    return { success: false, error: 'Failed to read file' };
  }
}

export async function writeFile(
  filepath: string, 
  code: string, 
  lineNumbers?: string
): Promise<CodeEditResult> {
  try {
    const absolutePath = path.join(process.cwd(), "src/", filepath.replace('@', ''));
    
    // Security check: ensure the path is within the project directory
    if (!absolutePath.startsWith(process.cwd())) {
      return { success: false, error: 'Access denied' };
    }

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

    if (lineNumbers) {
      // If file doesn't exist and we have line numbers, treat as error
      if (!fs.existsSync(absolutePath)) {
        return { success: false, error: 'Cannot specify line numbers for non-existent file' };
      }

      // Read the existing file
      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const lines = fileContent.split('\n');

      // Parse line numbers
      const [start, end] = lineNumbers.split('-').map(n => parseInt(n));
      if (!isNaN(start) && !isNaN(end)) {
        // Replace the lines in the specified range
        const newLines = [
          ...lines.slice(0, start - 1),
          code,
          ...lines.slice(end)
        ];
        fs.writeFileSync(absolutePath, newLines.join('\n'));
        return { success: true };
      }
    }

    // If no line numbers provided or parsing failed, replace/create entire file
    fs.writeFileSync(absolutePath, code);
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    return { success: false, error: 'Failed to write file' };
  }
}

export async function createFile(
  filepath: string, 
  code: string = ''
): Promise<CodeEditResult> {
  try {
    const absolutePath = path.join(process.cwd(), "src/", filepath.replace('@', ''));
    
    // Security check: ensure the path is within the project directory
    if (!absolutePath.startsWith(process.cwd())) {
      return { success: false, error: 'Access denied' };
    }

    // Check if file exists
    if (fs.existsSync(absolutePath)) {
      return { success: false, error: 'File already exists' };
    }

    // Create directory if it doesn't exist
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    
    // Write the file
    fs.writeFileSync(absolutePath, code);
    return { success: true };
  } catch (error) {
    console.error('Error creating file:', error);
    return { success: false, error: 'Failed to create file' };
  }
} 