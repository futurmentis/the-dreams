import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';

const shapes = {
  moon: <Path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  book: <Path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2zM12 6v14" />,
  plus: <Path d="M12 5v14M5 12h14" />,
  bars: <Path d="M5 20v-7M12 20V5M19 20v-10" />,
  sliders: (
    <>
      <Path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
      <Circle cx="16" cy="7" r="2" />
      <Circle cx="8" cy="17" r="2" />
    </>
  ),
  filter: <Path d="M4 7h16M7 12h10M10 17h4" />,
  list: <Path d="M5 7h14M5 12h14M5 17h14" />,
  back: <Path d="M15 5l-7 7 7 7" />,
  forward: <Path d="M9 5l7 7-7 7" />,
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  pencil: <Path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />,
  trash: <Path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  calendar: (
    <>
      <Rect x="4" y="5.5" width="16" height="15" rx="2" />
      <Path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  warning: <Path d="M12 4l9 16H3l9-16zM12 10v4.5M12 17.5v.01" />,
  error: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  info: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 11v5.5M12 7.5v.01" />
    </>
  ),
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
} as const;

export type IconName = keyof typeof shapes;

export function Icon({ name, size = 22, color = Colors.text }: { name: IconName; size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </Svg>
  );
}
