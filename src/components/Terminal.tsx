import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';

interface TerminalProps {
  output: string;
  isDark?: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ output, isDark = false }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm if it hasn't been initialized yet
    if (!xtermRef.current) {
      const term = new XTerm({
        theme: {
          background: isDark ? '#1E1E1E' : '#FFFFFF',
          foreground: isDark ? '#E1E1E1' : '#333333',
          cursor: isDark ? '#4ECDC4' : '#1a73e8',
        },
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        cursorBlink: true,
        convertEol: true,
        scrollback: 1000,
      });

      // Add fit addon
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // Add web links addon
      const webLinksAddon = new WebLinksAddon();
      term.loadAddon(webLinksAddon);

      // Open terminal
      term.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current = term;

      // Handle window resize
      const handleResize = () => fitAddon.fit();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }
  }, [isDark]);

  // Write output to terminal
  useEffect(() => {
    if (xtermRef.current && output) {
      xtermRef.current.write(output);
    }
  }, [output]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: '300px',
        width: '100%',
        padding: '8px',
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default Terminal; 