// https://coolors.co/494368-fc60a8-9d99ac-f5f7fb-ffffff
const rawColors = {
  purpleNavy: 'rgba(73, 67, 104, 1)',
  hotPink: 'rgba(252, 96, 168, 1)',
  manatee: 'rgba(157, 153, 172, 1)',
  ghostWhite: 'rgb(245,247,251)',
  white: 'rgba(255, 255, 255, 1)',
  crimson: 'rgba(215, 38, 61, 1)'
}

export const theme = {
  ...rawColors,
  primary: rawColors.purpleNavy,
  secondary: rawColors.hotPink,
  lightText: rawColors.manatee,
  background: rawColors.ghostWhite,
  light: colorWithOpacity(rawColors.hotPink, 0.09),
  vibrant: rawColors.crimson,
  border: rawColors.manatee,
  headerBar: rawColors.white
}

export function colorWithOpacity (color, opacity) {
  let [r, g, b] = color
    .substring(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',').map(e => e.trim());
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
