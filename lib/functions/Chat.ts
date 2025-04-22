"use server"

import fs from 'fs';
import path from 'path';

const CHATS_DIR = path.join(process.cwd(), 'nextlive', 'chats');

// Ensure chats directory exists
if (!fs.existsSync(CHATS_DIR)) {
  fs.mkdirSync(CHATS_DIR, { recursive: true });
}

export interface ChatData {
  id: string;
  model: string;
  messages: any[];
  timestamp: string;
}

interface ChatResult {
  success: boolean;
  error?: string;
  chat?: ChatData;
  chats?: ChatData[];
}

export async function listChats(): Promise<ChatResult> {
  try {
    const files = await fs.promises.readdir(CHATS_DIR);
    const chats = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          const filePath = path.join(CHATS_DIR, file);
          const content = await fs.promises.readFile(filePath, 'utf-8');
          return JSON.parse(content);
        })
    );

    // Sort chats by timestamp in descending order
    const sortedChats = chats.sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );

    return { success: true, chats: sortedChats };
  } catch (error) {
    console.error('Error listing chats:', error);
    return { success: false, error: 'Failed to list chats' };
  }
}

export async function saveChat(
  id: string,
  model: string,
  messages: any[]
): Promise<ChatResult> {
  try {
    if (!id || !model || !messages) {
      return { 
        success: false, 
        error: 'Missing required fields: id, model, messages' 
      };
    }

    const chatData = {
      id,
      model,
      messages,
      timestamp: new Date().toISOString()
    };

    const filePath = path.join(CHATS_DIR, `${id}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(chatData, null, 2));

    return { success: true, chat: chatData };
  } catch (error) {
    console.error('Error creating chat:', error);
    return { success: false, error: 'Failed to create chat' };
  }
}

export async function getChat(id: string): Promise<ChatResult> {
  try {
    const filePath = path.join(CHATS_DIR, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Chat not found' };
    }

    const content = await fs.promises.readFile(filePath, 'utf-8');
    const chat = JSON.parse(content);

    return { success: true, chat };
  } catch (error) {
    console.error('Error loading chat:', error);
    return { success: false, error: 'Failed to load chat' };
  }
}

export async function deleteChat(id: string): Promise<ChatResult> {
  try {
    const filePath = path.join(CHATS_DIR, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'Chat not found' };
    }

    await fs.promises.unlink(filePath);
    return { success: true };
  } catch (error) {
    console.error('Error deleting chat:', error);
    return { success: false, error: 'Failed to delete chat' };
  }
} 