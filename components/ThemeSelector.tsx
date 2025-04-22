import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Palette as PaletteIcon, Style as StyleIcon } from '@mui/icons-material';
import { themePluginManager, ThemePlugin } from '../services/theme/themePluginManager';

interface ThemeSelectorProps {
  isDark: boolean;
  onThemeChange: (pluginId: string, styleName: string) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isDark, onThemeChange }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [plugins, setPlugins] = useState<ThemePlugin[]>([]);
  const [activeTheme, setActiveTheme] = useState<{ pluginId: string; styleName: string } | null>(null);

  useEffect(() => {
    // Load initial plugins
    const allPlugins = themePluginManager.getAllPlugins();
    console.log('ThemeSelector loaded plugins:', allPlugins.map(p => p.name));
    setPlugins(allPlugins);

    // Listen for plugin changes
    const handlePluginRegistered = (plugin: ThemePlugin) => {
      setPlugins(prev => [...prev, plugin]);
    };

    const handlePluginUnregistered = (pluginId: string) => {
      setPlugins(prev => prev.filter(p => p.id !== pluginId));
    };

    themePluginManager.on('pluginRegistered', handlePluginRegistered);
    themePluginManager.on('pluginUnregistered', handlePluginUnregistered);

    // Get active theme
    setActiveTheme(themePluginManager.getActiveTheme());

    return () => {
      themePluginManager.off('pluginRegistered', handlePluginRegistered);
      themePluginManager.off('pluginUnregistered', handlePluginUnregistered);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (pluginId: string, styleName: string) => {
    themePluginManager.setActiveTheme(pluginId, styleName);
    setActiveTheme({ pluginId, styleName });
    onThemeChange(pluginId, styleName);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          color: isDark ? 'rgba(255,255,255,0.7)' : '#5f6368',
          backgroundColor: Boolean(anchorEl) ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)') : 'transparent',
          '&:hover': {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
          }
        }}
      >
        <PaletteIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            backgroundColor: isDark ? 'rgb(30, 30, 30)' : 'rgb(255, 255, 255)',
            borderRadius: '12px',
            overflow: 'hidden',
            minWidth: 220,
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: isDark ? '#e1e1e1' : '#333',
            }}
          >
            Select Theme
          </Typography>
        </Box>

        {plugins.map(plugin => (
          <Box key={plugin.id}>
            <Typography
              sx={{
                px: 2,
                py: 1,
                fontSize: '12px',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              }}
            >
              {plugin.name}
            </Typography>
            {plugin.styles.map(style => (
              <MenuItem
                key={`${plugin.id}:${style.name}`}
                onClick={() => handleThemeSelect(plugin.id, style.name)}
                selected={activeTheme?.pluginId === plugin.id && activeTheme?.styleName === style.name}
                sx={{
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(26, 115, 232, 0.08)',
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(78, 205, 196, 0.25)' : 'rgba(26, 115, 232, 0.12)',
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <StyleIcon sx={{ 
                    color: activeTheme?.pluginId === plugin.id && activeTheme?.styleName === style.name
                      ? (isDark ? '#4ECDC4' : '#1a73e8')
                      : (isDark ? 'rgba(255,255,255,0.7)' : '#5f6368')
                  }} />
                </ListItemIcon>
                <ListItemText
                  primary={style.name}
                  secondary={style.description}
                  primaryTypographyProps={{
                    sx: {
                      color: isDark ? '#e1e1e1' : '#333',
                      fontSize: '14px',
                    }
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      fontSize: '12px',
                    }
                  }}
                />
              </MenuItem>
            ))}
          </Box>
        ))}
      </Menu>
    </>
  );
}; 