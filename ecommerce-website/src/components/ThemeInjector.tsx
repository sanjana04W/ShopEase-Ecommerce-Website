'use client';
import { useEffect, useState } from 'react';

export default function ThemeInjector() {
  const [themeStyles, setThemeStyles] = useState('');

  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch('/api/theme');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const light = data.find(t => t.mode === 'light');
          const dark = data.find(t => t.mode === 'dark');
          
          let styles = '';
          
          if (light) {
            styles += `
              :root {
                --background: ${light.background};
                --foreground: ${light.foreground};
                --primary: ${light.primary};
                --primary-hover: ${light.primaryHover};
                --card-bg: ${light.cardBg};
                --card-border: ${light.cardBorder};
                --glass-bg: ${light.glassBg};
                --glass-border: ${light.glassBorder};
              }
            `;
          }
          
          if (dark) {
            styles += `
              html.dark {
                --background: ${dark.background};
                --foreground: ${dark.foreground};
                --primary: ${dark.primary};
                --primary-hover: ${dark.primaryHover};
                --card-bg: ${dark.cardBg};
                --card-border: ${dark.cardBorder};
                --glass-bg: ${dark.glassBg};
                --glass-border: ${dark.glassBorder};
              }
            `;
          }
          
          setThemeStyles(styles);
        }
      } catch (error) {
        console.error('Failed to load custom themes', error);
      }
    }
    
    fetchThemes();
  }, []);

  if (!themeStyles) return null;

  return <style dangerouslySetInnerHTML={{ __html: themeStyles }} />;
}
