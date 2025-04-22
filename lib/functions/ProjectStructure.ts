"use server"
import fs from 'fs/promises';
import path from 'path';

// Types
interface FileInfo {
  type: 'file';
  size: number;
  modified: Date;
}

interface DirectoryInfo {
  type: 'directory';
  children: Record<string, FileInfo | DirectoryInfo>;
}

type FileSystemNode = FileInfo | DirectoryInfo;

async function getDirectoryStructure(
  dir: string,
  maxDepth: number,
  currentDepth = 0
): Promise<Record<string, FileSystemNode>> {
  if (currentDepth > maxDepth) return {};

  const structure: Record<string, FileSystemNode> = {};
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        structure[item.name] = {
          type: 'directory',
          children: await getDirectoryStructure(fullPath, maxDepth, currentDepth + 1),
        };
      } else {
        const stats = await fs.stat(fullPath);
        structure[item.name] = {
          type: 'file',
          size: stats.size,
          modified: stats.mtime,
        };
      }
    }
  } catch (err) {
    console.error('Failed to read directory:', dir, err);
  }

  return structure;
}

function formatTreeStructure(
  structure: Record<string, FileSystemNode>,
  prefix = '',
  isLast = true
): string {
  let output = '';
  const entries = Object.entries(structure);

  entries.forEach(([name, info], index) => {
    const isLastEntry = index === entries.length - 1;
    const currentPrefix = prefix + (isLast ? '└── ' : '├── ');
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    if (info.type === 'directory') {
      output += currentPrefix + name + '/\n';
      output += formatTreeStructure(info.children, childPrefix, isLastEntry);
    } else {
      output += currentPrefix + name + '\n';
    }
  });

  return output;
}

export async function getProjectStructure(baseDir: string, maxDepth = 2): Promise<string> {
  const structure = await getDirectoryStructure(baseDir, maxDepth);
  return formatTreeStructure(structure);
}
