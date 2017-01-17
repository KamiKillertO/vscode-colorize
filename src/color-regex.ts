'use strict';

// const COLOR_REGEX = /(#(?:[\da-f]{3}){1,2}|rgb\((?:\d{1,3},\s*){2}\d{1,3}\)|rgba\((?:\d{1,3},\s*){3}\d*\.?\d+\)|hsl\(\d{1,3}(?:,\s*\d{1,3}%){2}\)|hsla\(\d{1,3}(?:,\s*\d{1,3}%){2},\s*\d*\.?\d+\))/gi 
// const HEXA_COLOR = /#(?:[\da-f]{3}($| |,|;)){1}|(?:(#(?:[\da-f]{3}){2})(\t|$| |,|;))/gi 


/** 
 * Utils object for color manipulation 
 */
export const HEXA_COLOR = /(#[\da-f]{3}|#[\da-f]{6})($|,| |;|\n)/gi;

export default {
  HEXA_COLOR
};
