"use server"

import { spawn } from 'child_process';

interface CommandResult {
  success: boolean;
  error?: string;
  stream?: ReadableStream;
}

export async function executeCommand(
  command: string,
  isBackground: boolean = false
): Promise<CommandResult> {
  try {
    if (!command) {
      return { success: false, error: 'Command is required' };
    }

    // Create a new TransformStream for real-time streaming
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Spawn the command process
    const process = spawn(command, [], {
      shell: true,
      detached: isBackground,
    });

    // Handle process output
    process.stdout.on('data', async (data) => {
      await writer.write(new TextEncoder().encode(`data: ${data}\n\n`));
    });

    process.stderr.on('data', async (data) => {
      await writer.write(new TextEncoder().encode(`error: ${data}\n\n`));
    });

    process.on('close', async (code) => {
      await writer.write(new TextEncoder().encode(`exit: ${code}\n\n`));
      await writer.close();
    });

    // If running in background, detach the process
    if (isBackground) {
      process.unref();
    }

    return {
      success: true,
      stream: stream.readable
    };

  } catch (error) {
    console.error('Error executing command:', error);
    return {
      success: false,
      error: 'Failed to execute command'
    };
  }
} 