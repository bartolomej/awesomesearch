/**
 * Basic theme
 */

const color = {
  light: '#F5F7FB',
  dark: '#2A363B',
  orange: '#FF847C',
  red: '#E84A5F',
  gold: '#FECEA8',
  white: 'white'
};

const baseSize = 16;

const typography = {
  baseFontSize: `${baseSize}px`,
};

const zIndex = {
  header: 10,
  overlay: 15,
  drawer: 20,
  headerText: 25,
};

export default {
  color,
  typography,
  zIndex,
  size: size => `${size * baseSize}px`,
  opacity: (hexColor, value) => `${hexColor}${value.toString(16)}`
};
