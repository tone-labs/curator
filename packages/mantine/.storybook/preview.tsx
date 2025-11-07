import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import type { Preview } from '@storybook/react-vite';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { useEffect } from 'react';

import { useDarkMode } from '@vueless/storybook-dark-mode';
import { themes } from 'storybook/theming';

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
  const { setColorScheme } = useMantineColorScheme();
  const isDarkMode = useDarkMode();

  useEffect(() => {
    setColorScheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, setColorScheme]);

  return <>{children}</>;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      dark: { ...themes.dark },
      light: { ...themes.normal },
      stylePreview: true,
    },
  },
  decorators: [
    (Story) => (
      <MantineProvider>
        <ColorSchemeWrapper>
          <Story />
        </ColorSchemeWrapper>
      </MantineProvider>
    ),
  ],
};

export default preview;
