import { EventEmitter } from 'events';

export interface ThemeStyle {
  name: string;
  description?: string;
  author?: string;
  version?: string;
  styles: {
    backgroundColor: string;
    messageBackground: string;
    messageBackgroundHover: string;
    userMessageBackground: string;
    userMessageBackgroundHover: string;
    inputBackground: string;
    inputBackgroundHover: string;
    borderColor?: string;
    textColor: string;
    secondaryTextColor: string;
    accentColor: string;
    boxShadow?: string;
    backdropFilter?: string;
  };
  darkStyles?: {
    backgroundColor: string;
    messageBackground: string;
    messageBackgroundHover: string;
    userMessageBackground: string;
    userMessageBackgroundHover: string;
    inputBackground: string;
    inputBackgroundHover: string;
    borderColor?: string;
    textColor: string;
    secondaryTextColor: string;
    accentColor: string;
    boxShadow?: string;
    backdropFilter?: string;
  };
}

export interface ThemePlugin {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
  styles: ThemeStyle[];
}

class ThemePluginManager extends EventEmitter {
  private plugins: Map<string, ThemePlugin> = new Map();
  private activeTheme: string | null = null;

  constructor() {
    super();
    console.log('ThemePluginManager: Initializing...');
    // Register built-in themes
    this.registerBuiltInThemes();
    console.log('ThemePluginManager: Initialization complete');
  }

  private registerBuiltInThemes() {
    console.log('ThemePluginManager: Registering built-in themes...');
    const defaultTheme: ThemePlugin = {
      id: 'default',
      name: 'Default Theme',
      description: 'The default chat theme',
      author: 'NextLive',
      version: '1.0.0',
      styles: [
        {
          name: 'Default',
          styles: {
            backgroundColor: '#ffffff',
            messageBackground: '#f8f9fa',
            messageBackgroundHover: 'rgba(26, 115, 232, 0.08)',
            userMessageBackground: 'linear-gradient(135deg, #1a73e8 0%, #3367D6 50%, #2E5AAC 100%)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #2a83f8 0%, #4377E6 50%, #3E6ABC 100%)',
            inputBackground: 'rgba(0,0,0,0.04)',
            inputBackgroundHover: 'rgba(0,0,0,0.08)',
            textColor: '#000000',
            secondaryTextColor: 'rgba(0,0,0,0.6)',
            accentColor: '#1a73e8'
          },
          darkStyles: {
            backgroundColor: '#1a1a1a',
            messageBackground: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(26, 115, 232, 0.15), rgba(156, 39, 176, 0.15))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(26, 115, 232, 0.2), rgba(156, 39, 176, 0.2))',
            userMessageBackground: 'linear-gradient(135deg, #4ECDC4 0%, #2E93A3 50%, #1a73e8 100%)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #5EDDD4 0%, #3EA3B3 50%, #2a83f8 100%)',
            inputBackground: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(26, 115, 232, 0.1), rgba(156, 39, 176, 0.1))',
            inputBackgroundHover: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(26, 115, 232, 0.15), rgba(156, 39, 176, 0.15))',
            borderColor: 'rgba(255,255,255,0.1)',
            textColor: '#ffffff',
            secondaryTextColor: 'rgba(255,255,255,0.7)',
            accentColor: '#4ECDC4'
          }
        }
      ]
    };

    const glassmorphismTheme: ThemePlugin = {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'A modern glass-like theme',
      author: 'NextLive',
      version: '1.0.0',
      styles: [
        {
          name: 'Glass',
          styles: {
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            messageBackground: 'rgba(255, 255, 255, 0.7)',
            messageBackgroundHover: 'rgba(255, 255, 255, 0.8)',
            userMessageBackground: 'linear-gradient(135deg, rgba(26, 115, 232, 0.8), rgba(51, 103, 214, 0.8))',
            userMessageBackgroundHover: 'linear-gradient(135deg, rgba(26, 115, 232, 0.9), rgba(51, 103, 214, 0.9))',
            inputBackground: 'rgba(255, 255, 255, 0.8)',
            inputBackgroundHover: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(0,0,0,0.1)',
            textColor: '#000000',
            secondaryTextColor: 'rgba(0,0,0,0.6)',
            accentColor: '#1a73e8',
            backdropFilter: 'blur(10px)'
          },
          darkStyles: {
            backgroundColor: 'rgba(26, 26, 26, 0.7)',
            messageBackground: 'rgba(26, 26, 26, 0.7)',
            messageBackgroundHover: 'rgba(26, 26, 26, 0.8)',
            userMessageBackground: 'linear-gradient(135deg, rgba(78, 205, 196, 0.8), rgba(26, 115, 232, 0.8))',
            userMessageBackgroundHover: 'linear-gradient(135deg, rgba(78, 205, 196, 0.9), rgba(26, 115, 232, 0.9))',
            inputBackground: 'rgba(0, 0, 0, 0.3)',
            inputBackgroundHover: 'rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(255,255,255,0.1)',
            textColor: '#ffffff',
            secondaryTextColor: 'rgba(255,255,255,0.7)',
            accentColor: '#4ECDC4',
            backdropFilter: 'blur(10px)'
          }
        }
      ]
    };

    const neonTheme: ThemePlugin = {
      id: 'neon',
      name: 'Neon Nights',
      description: 'A vibrant cyberpunk-inspired theme',
      author: 'NextLive',
      version: '1.0.0',
      styles: [
        {
          name: 'Cyberpunk',
          styles: {
            backgroundColor: '#ffffff',
            messageBackground: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05), rgba(0, 255, 255, 0.05))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1))',
            userMessageBackground: 'linear-gradient(135deg, #ff00ff, #00ffff)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #ff33ff, #33ffff)',
            inputBackground: 'rgba(0,0,0,0.04)',
            inputBackgroundHover: 'rgba(0,0,0,0.08)',
            borderColor: 'rgba(0,0,0,0.1)',
            textColor: '#000000',
            secondaryTextColor: 'rgba(0,0,0,0.6)',
            accentColor: '#ff00ff',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.1)'
          },
          darkStyles: {
            backgroundColor: '#0a0a0a',
            messageBackground: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.15))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2))',
            userMessageBackground: 'linear-gradient(135deg, #ff00ff, #00ffff)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #ff33ff, #33ffff)',
            inputBackground: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1))',
            inputBackgroundHover: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.15))',
            borderColor: 'rgba(255,255,255,0.1)',
            textColor: '#ffffff',
            secondaryTextColor: 'rgba(255,255,255,0.7)',
            accentColor: '#ff00ff',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }
        }
      ]
    };

    const natureTheme: ThemePlugin = {
      id: 'nature',
      name: 'Natural Harmony',
      description: 'A soothing nature-inspired theme',
      author: 'NextLive',
      version: '1.0.0',
      styles: [
        {
          name: 'Forest',
          styles: {
            backgroundColor: '#f8f9f7',
            messageBackground: 'linear-gradient(135deg, rgba(92, 184, 92, 0.05), rgba(141, 198, 63, 0.05))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(92, 184, 92, 0.1), rgba(141, 198, 63, 0.1))',
            userMessageBackground: 'linear-gradient(135deg, #5cb85c, #8dc63f)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #6cc86c, #9dd64f)',
            inputBackground: 'rgba(92, 184, 92, 0.05)',
            inputBackgroundHover: 'rgba(92, 184, 92, 0.1)',
            borderColor: 'rgba(92, 184, 92, 0.2)',
            textColor: '#2c3e50',
            secondaryTextColor: 'rgba(44, 62, 80, 0.7)',
            accentColor: '#5cb85c'
          },
          darkStyles: {
            backgroundColor: '#1a2416',
            messageBackground: 'linear-gradient(135deg, rgba(92, 184, 92, 0.15), rgba(141, 198, 63, 0.15))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(92, 184, 92, 0.2), rgba(141, 198, 63, 0.2))',
            userMessageBackground: 'linear-gradient(135deg, #5cb85c, #8dc63f)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #6cc86c, #9dd64f)',
            inputBackground: 'linear-gradient(135deg, rgba(92, 184, 92, 0.1), rgba(141, 198, 63, 0.1))',
            inputBackgroundHover: 'linear-gradient(135deg, rgba(92, 184, 92, 0.15), rgba(141, 198, 63, 0.15))',
            borderColor: 'rgba(255,255,255,0.1)',
            textColor: '#ffffff',
            secondaryTextColor: 'rgba(255,255,255,0.7)',
            accentColor: '#8dc63f',
            boxShadow: '0 0 20px rgba(92, 184, 92, 0.2)',
            backdropFilter: 'blur(10px)'
          }
        },
        {
          name: 'Ocean',
          styles: {
            backgroundColor: '#f7f9fb',
            messageBackground: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05), rgba(41, 128, 185, 0.05))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.1))',
            userMessageBackground: 'linear-gradient(135deg, #3498db, #2980b9)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #44a8eb, #3990c9)',
            inputBackground: 'rgba(52, 152, 219, 0.05)',
            inputBackgroundHover: 'rgba(52, 152, 219, 0.1)',
            borderColor: 'rgba(52, 152, 219, 0.2)',
            textColor: '#2c3e50',
            secondaryTextColor: 'rgba(44, 62, 80, 0.7)',
            accentColor: '#3498db'
          },
          darkStyles: {
            backgroundColor: '#162025',
            messageBackground: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(41, 128, 185, 0.15))',
            messageBackgroundHover: 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2))',
            userMessageBackground: 'linear-gradient(135deg, #3498db, #2980b9)',
            userMessageBackgroundHover: 'linear-gradient(135deg, #44a8eb, #3990c9)',
            inputBackground: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(41, 128, 185, 0.1))',
            inputBackgroundHover: 'linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(41, 128, 185, 0.15))',
            borderColor: 'rgba(255,255,255,0.1)',
            textColor: '#ffffff',
            secondaryTextColor: 'rgba(255,255,255,0.7)',
            accentColor: '#3498db',
            boxShadow: '0 0 20px rgba(52, 152, 219, 0.2)',
            backdropFilter: 'blur(10px)'
          }
        }
      ]
    };

    this.registerPlugin(defaultTheme);
    this.registerPlugin(glassmorphismTheme);
    this.registerPlugin(neonTheme);
    this.registerPlugin(natureTheme);

    // Debug log
    console.log('Registered themes:', Array.from(this.plugins.values()).map(p => p.name));
  }

  registerPlugin(plugin: ThemePlugin): boolean {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Theme plugin with id ${plugin.id} is already registered`);
      return false;
    }

    console.log(`Registering theme plugin: ${plugin.name} (${plugin.id})`);
    this.plugins.set(plugin.id, plugin);
    this.emit('pluginRegistered', plugin);
    return true;
  }

  unregisterPlugin(pluginId: string): boolean {
    const removed = this.plugins.delete(pluginId);
    if (removed) {
      this.emit('pluginUnregistered', pluginId);
    }
    return removed;
  }

  getPlugin(pluginId: string): ThemePlugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): ThemePlugin[] {
    const plugins = Array.from(this.plugins.values());
    console.log('ThemePluginManager: getAllPlugins called, returning:', plugins.map(p => p.name));
    return plugins;
  }

  setActiveTheme(pluginId: string, styleName: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      return false;
    }

    const style = plugin.styles.find(s => s.name === styleName);
    if (!style) {
      return false;
    }

    this.activeTheme = `${pluginId}:${styleName}`;
    this.emit('themeChanged', { pluginId, styleName, style });
    return true;
  }

  getActiveTheme(): { pluginId: string; styleName: string } | null {
    if (!this.activeTheme) {
      return null;
    }

    const [pluginId, styleName] = this.activeTheme.split(':');
    return { pluginId, styleName };
  }

  getActiveStyles(isDark: boolean = false): ThemeStyle['styles'] | null {
    const activeTheme = this.getActiveTheme();
    if (!activeTheme) {
      return null;
    }

    const plugin = this.plugins.get(activeTheme.pluginId);
    if (!plugin) {
      return null;
    }

    const style = plugin.styles.find(s => s.name === activeTheme.styleName);
    if (!style) {
      return null;
    }

    return isDark && style.darkStyles ? style.darkStyles : style.styles;
  }
}

export const themePluginManager = new ThemePluginManager(); 