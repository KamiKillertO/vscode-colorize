"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("./../color");
const color_extractor_1 = require("./color-extractor");
exports.COLORS = Object({
    'aliceblue': {
        'value': '#F0F8FF',
        'rgb': [240, 248, 255],
        'luminace': 1
    },
    'antiquewhite': {
        'value': '#FAEBD7',
        'rgb': [250, 235, 215],
        'luminace': 1
    },
    'aqua': {
        'value': '#00FFFF',
        'rgb': [0, 255, 255],
        'luminace': 1
    },
    'aquamarine': {
        'value': '#7FFFD4',
        'rgb': [127, 255, 212],
        'luminace': 1
    },
    'azure': {
        'value': '#F0FFFF',
        'rgb': [240, 255, 255],
        'luminace': 1
    },
    'beige': {
        'value': '#F5F5DC',
        'rgb': [245, 245, 220],
        'luminace': 1
    },
    'bisque': {
        'value': '#FFE4C4',
        'rgb': [255, 228, 196],
        'luminace': 1
    },
    'black': {
        'value': '#000000',
        'rgb': [0, 0, 0],
        'luminace': 1
    },
    'blanchedalmond': {
        'value': '#FFEBCD',
        'rgb': [255, 235, 205],
        'luminace': 1
    },
    'blue': {
        'value': '#0000FF',
        'rgb': [0, 0, 255],
        'luminace': 1
    },
    'blueviolet': {
        'value': '#8A2BE2',
        'rgb': [138, 43, 226],
        'luminace': 1
    },
    'brown': {
        'value': '#A52A2A',
        'rgb': [165, 42, 42],
        'luminace': 1
    },
    'burlyWood': {
        'value': '#DEB887',
        'rgb': [222, 184, 135],
        'luminace': 1
    },
    'cadetblue': {
        'value': '#5F9EA0',
        'rgb': [95, 158, 160],
        'luminace': 1
    },
    'chartreuse': {
        'value': '#7FFF00',
        'rgb': [127, 255, 0],
        'luminace': 1
    },
    'chocolate': {
        'value': '#D2691E',
        'rgb': [210, 105, 30],
        'luminace': 1
    },
    'coral': {
        'value': '#FF7F50',
        'rgb': [255, 127, 80],
        'luminace': 1
    },
    'cornflowerblue': {
        'value': '#6495ED',
        'rgb': [100, 149, 237],
        'luminace': 1
    },
    'cornsilk': {
        'value': '#FFF8DC',
        'rgb': [255, 248, 220],
        'luminace': 1
    },
    'crimson': {
        'value': '#DC143C',
        'rgb': [220, 20, 60],
        'luminace': 1
    },
    'cyan': {
        'value': '#00FFFF',
        'rgb': [0, 255, 255],
        'luminace': 1
    },
    'darkblue': {
        'value': '#00008B',
        'rgb': [0, 0, 139],
        'luminace': 1
    },
    'darkcyan': {
        'value': '#008B8B',
        'rgb': [0, 139, 139],
        'luminace': 1
    },
    'darkgoldenrod': {
        'value': '#B8860B',
        'rgb': [184, 134, 11],
        'luminace': 1
    },
    'darkgray': {
        'value': '#A9A9A9',
        'rgb': [169, 169, 169],
        'luminace': 1
    },
    'darkgrey': {
        'value': '#A9A9A9',
        'rgb': [169, 169, 169],
        'luminace': 1
    },
    'darkgreen': {
        'value': '#006400',
        'rgb': [0, 100, 0],
        'luminace': 1
    },
    'darkkhaki': {
        'value': '#BDB76B',
        'rgb': [189, 183, 107],
        'luminace': 1
    },
    'darkmagenta': {
        'value': '#8B008B',
        'rgb': [139, 0, 139],
        'luminace': 1
    },
    'darkolivegreen': {
        'value': '#556B2F',
        'rgb': [85, 107, 47],
        'luminace': 1
    },
    'darkorange': {
        'value': '#FF8C00',
        'rgb': [255, 140, 0],
        'luminace': 1
    },
    'darkorchid': {
        'value': '#9932CC',
        'rgb': [153, 50, 204],
        'luminace': 1
    },
    'darkred': {
        'value': '#8B0000',
        'rgb': [139, 0, 0],
        'luminace': 1
    },
    'darksalmon': {
        'value': '#E9967A',
        'rgb': [233, 150, 122],
        'luminace': 1
    },
    'darkseagreen': {
        'value': '#8FBC8F',
        'rgb': [143, 188, 143],
        'luminace': 1
    },
    'darkslateblue': {
        'value': '#483D8B',
        'rgb': [72, 61, 139],
        'luminace': 1
    },
    'darkslategray': {
        'value': '#2F4F4F',
        'rgb': [47, 79, 79],
        'luminace': 1
    },
    'darkslategrey': {
        'value': '#2F4F4F',
        'rgb': [47, 79, 79],
        'luminace': 1
    },
    'darkturquoise': {
        'value': '#00CED1',
        'rgb': [0, 206, 209],
        'luminace': 1
    },
    'darkviolet': {
        'value': '#9400D3',
        'rgb': [148, 0, 211],
        'luminace': 1
    },
    'deeppink': {
        'value': '#FF1493',
        'rgb': [255, 20, 147],
        'luminace': 1
    },
    'deepskyblue': {
        'value': '#00BFFF',
        'rgb': [0, 191, 255],
        'luminace': 1
    },
    'dimgray': {
        'value': '#696969',
        'rgb': [105, 105, 105],
        'luminace': 1
    },
    'dimgrey': {
        'value': '#696969',
        'rgb': [105, 105, 105],
        'luminace': 1
    },
    'dodgerblue': {
        'value': '#1E90FF',
        'rgb': [30, 144, 255],
        'luminace': 1
    },
    'firebrick': {
        'value': '#B22222',
        'rgb': [178, 34, 34],
        'luminace': 1
    },
    'floralwhite': {
        'value': '#FFFAF0',
        'rgb': [255, 250, 240],
        'luminace': 1
    },
    'forestgreen': {
        'value': '#228B22',
        'rgb': [34, 139, 34],
        'luminace': 1
    },
    'fuchsia': {
        'value': '#FF00FF',
        'rgb': [255, 0, 255],
        'luminace': 1
    },
    'gainsboro': {
        'value': '#DCDCDC',
        'rgb': [220, 220, 220],
        'luminace': 1
    },
    'ghostwhite': {
        'value': '#F8F8FF',
        'rgb': [248, 248, 255],
        'luminace': 1
    },
    'gold': {
        'value': '#FFD700',
        'rgb': [255, 215, 0],
        'luminace': 1
    },
    'goldenrod': {
        'value': '#DAA520',
        'rgb': [218, 165, 32],
        'luminace': 1
    },
    'gray': {
        'value': '#808080',
        'rgb': [128, 128, 128],
        'luminace': 1
    },
    'grey': {
        'value': '#808080',
        'rgb': [128, 128, 128],
        'luminace': 1
    },
    'green': {
        'value': '#008000',
        'rgb': [0, 128, 0],
        'luminace': 1
    },
    'greenyellow': {
        'value': '#ADFF2F',
        'rgb': [173, 255, 47],
        'luminace': 1
    },
    'honeydew': {
        'value': '#F0FFF0',
        'rgb': [240, 255, 240],
        'luminace': 1
    },
    'hotpink': {
        'value': '#FF69B4',
        'rgb': [255, 105, 180],
        'luminace': 1
    },
    'indianred': {
        'value': '#CD5C5C',
        'rgb': [205, 92, 92],
        'luminace': 1
    },
    'indigo': {
        'value': '#4B0082',
        'rgb': [75, 0, 130],
        'luminace': 1
    },
    'ivory': {
        'value': '#FFFFF0',
        'rgb': [255, 255, 240],
        'luminace': 1
    },
    'khaki': {
        'value': '#F0E68C',
        'rgb': [240, 230, 140],
        'luminace': 1
    },
    'lavender': {
        'value': '#E6E6FA',
        'rgb': [230, 230, 250],
        'luminace': 1
    },
    'lavenderblush': {
        'value': '#FFF0F5',
        'rgb': [255, 240, 245],
        'luminace': 1
    },
    'lawngreen': {
        'value': '#7CFC00',
        'rgb': [124, 252, 0],
        'luminace': 1
    },
    'lemonchiffon': {
        'value': '#FFFACD',
        'rgb': [255, 250, 205],
        'luminace': 1
    },
    'lightblue': {
        'value': '#ADD8E6',
        'rgb': [173, 216, 230],
        'luminace': 1
    },
    'lightcoral': {
        'value': '#F08080',
        'rgb': [240, 128, 128],
        'luminace': 1
    },
    'lightcyan': {
        'value': '#E0FFFF',
        'rgb': [224, 255, 255],
        'luminace': 1
    },
    'lightgoldenrodyellow': {
        'value': '#FAFAD2',
        'rgb': [250, 250, 210],
        'luminace': 1
    },
    'lightgray': {
        'value': '#D3D3D3',
        'rgb': [211, 211, 211],
        'luminace': 1
    },
    'lightgrey': {
        'value': '#D3D3D3',
        'rgb': [211, 211, 211],
        'luminace': 1
    },
    'lightgreen': {
        'value': '#90EE90',
        'rgb': [144, 238, 144],
        'luminace': 1
    },
    'lightpink': {
        'value': '#FFB6C1',
        'rgb': [255, 182, 193],
        'luminace': 1
    },
    'lightsalmon': {
        'value': '#FFA07A',
        'rgb': [255, 160, 122],
        'luminace': 1
    },
    'lightseagreen': {
        'value': '#20B2AA',
        'rgb': [32, 178, 170],
        'luminace': 1
    },
    'lightskyblue': {
        'value': '#87CEFA',
        'rgb': [135, 206, 250],
        'luminace': 1
    },
    'lightslategray': {
        'value': '#778899',
        'rgb': [119, 136, 153],
        'luminace': 1
    },
    'lightslategrey': {
        'value': '#778899',
        'rgb': [119, 136, 153],
        'luminace': 1
    },
    'lightsteelblue': {
        'value': '#B0C4DE',
        'rgb': [176, 196, 222],
        'luminace': 1
    },
    'lightyellow': {
        'value': '#FFFFE0',
        'rgb': [255, 255, 224],
        'luminace': 1
    },
    'lime': {
        'value': '#00FF00',
        'rgb': [0, 255, 0],
        'luminace': 1
    },
    'limegreen': {
        'value': '#32CD32',
        'rgb': [50, 205, 50],
        'luminace': 1
    },
    'linen': {
        'value': '#FAF0E6',
        'rgb': [250, 240, 230],
        'luminace': 1
    },
    'magenta': {
        'value': '#FF00FF',
        'rgb': [255, 0, 255],
        'luminace': 1
    },
    'maroon': {
        'value': '#800000',
        'rgb': [128, 0, 0],
        'luminace': 1
    },
    'mediumaquamarine': {
        'value': '#66CDAA',
        'rgb': [102, 205, 170],
        'luminace': 1
    },
    'mediumblue': {
        'value': '#0000CD',
        'rgb': [0, 0, 205],
        'luminace': 1
    },
    'mediumorchid': {
        'value': '#BA55D3',
        'rgb': [186, 85, 211],
        'luminace': 1
    },
    'mediumpurple': {
        'value': '#9370DB',
        'rgb': [147, 112, 219],
        'luminace': 1
    },
    'mediumseagreen': {
        'value': '#3CB371',
        'rgb': [60, 179, 113],
        'luminace': 1
    },
    'mediumslateblue': {
        'value': '#7B68EE',
        'rgb': [123, 104, 238],
        'luminace': 1
    },
    'mediumspringgreen': {
        'value': '#00FA9A',
        'rgb': [0, 250, 154],
        'luminace': 1
    },
    'mediumturquoise': {
        'value': '#48D1CC',
        'rgb': [72, 209, 204],
        'luminace': 1
    },
    'mediumvioletred': {
        'value': '#C71585',
        'rgb': [199, 21, 133],
        'luminace': 1
    },
    'midnightblue': {
        'value': '#191970',
        'rgb': [25, 25, 112],
        'luminace': 1
    },
    'mintcream': {
        'value': '#F5FFFA',
        'rgb': [245, 255, 250],
        'luminace': 1
    },
    'mistyrose': {
        'value': '#FFE4E1',
        'rgb': [255, 228, 225],
        'luminace': 1
    },
    'moccasin': {
        'value': '#FFE4B5',
        'rgb': [255, 228, 181],
        'luminace': 1
    },
    'navajowhite': {
        'value': '#FFDEAD',
        'rgb': [255, 222, 173],
        'luminace': 1
    },
    'navy': {
        'value': '#000080',
        'rgb': [0, 0, 128],
        'luminace': 1
    },
    'oldlace': {
        'value': '#FDF5E6',
        'rgb': [253, 245, 230],
        'luminace': 1
    },
    'olive': {
        'value': '#808000',
        'rgb': [128, 128, 0],
        'luminace': 1
    },
    'olivedrab': {
        'value': '#6B8E23',
        'rgb': [107, 142, 35],
        'luminace': 1
    },
    'orange': {
        'value': '#FFA500',
        'rgb': [255, 165, 0],
        'luminace': 1
    },
    'orangered': {
        'value': '#FF4500',
        'rgb': [255, 69, 0],
        'luminace': 1
    },
    'orchid': {
        'value': '#DA70D6',
        'rgb': [218, 112, 214],
        'luminace': 1
    },
    'palegoldenrod': {
        'value': '#EEE8AA',
        'rgb': [238, 232, 170],
        'luminace': 1
    },
    'palegreen': {
        'value': '#98FB98',
        'rgb': [152, 251, 152],
        'luminace': 1
    },
    'paleturquoise': {
        'value': '#AFEEEE',
        'rgb': [175, 238, 238],
        'luminace': 1
    },
    'palevioletred': {
        'value': '#DB7093',
        'rgb': [219, 112, 147],
        'luminace': 1
    },
    'papayawhip': {
        'value': '#FFEFD5',
        'rgb': [255, 239, 213],
        'luminace': 1
    },
    'peachpuff': {
        'value': '#FFDAB9',
        'rgb': [255, 218, 185],
        'luminace': 1
    },
    'peru': {
        'value': '#CD853F',
        'rgb': [205, 133, 63],
        'luminace': 1
    },
    'pink': {
        'value': '#FFC0CB',
        'rgb': [255, 192, 203],
        'luminace': 1
    },
    'plum': {
        'value': '#DDA0DD',
        'rgb': [221, 160, 221],
        'luminace': 1
    },
    'powderblue': {
        'value': '#B0E0E6',
        'rgb': [176, 224, 230],
        'luminace': 1
    },
    'purple': {
        'value': '#800080',
        'rgb': [128, 0, 128],
        'luminace': 1
    },
    'rebeccapurple': {
        'value': '#663399',
        'rgb': [102, 51, 153],
        'luminace': 1
    },
    'red': {
        'value': '#FF0000',
        'rgb': [255, 0, 0],
        'luminace': 1
    },
    'rosybrown': {
        'value': '#BC8F8F',
        'rgb': [188, 143, 143],
        'luminace': 1
    },
    'royalblue': {
        'value': '#4169E1',
        'rgb': [65, 105, 225],
        'luminace': 1
    },
    'saddlebrown': {
        'value': '#8B4513',
        'rgb': [139, 69, 19],
        'luminace': 1
    },
    'salmon': {
        'value': '#FA8072',
        'rgb': [250, 128, 114],
        'luminace': 1
    },
    'sandybrown': {
        'value': '#F4A460',
        'rgb': [244, 164, 96],
        'luminace': 1
    },
    'seagreen': {
        'value': '#2E8B57',
        'rgb': [46, 139, 87],
        'luminace': 1
    },
    'seashell': {
        'value': '#FFF5EE',
        'rgb': [255, 245, 238],
        'luminace': 1
    },
    'sienna': {
        'value': '#A0522D',
        'rgb': [160, 82, 45],
        'luminace': 1
    },
    'silver': {
        'value': '#C0C0C0',
        'rgb': [192, 192, 192],
        'luminace': 1
    },
    'skyblue': {
        'value': '#87CEEB',
        'rgb': [135, 206, 235],
        'luminace': 1
    },
    'slateblue': {
        'value': '#6A5ACD',
        'rgb': [106, 90, 205],
        'luminace': 1
    },
    'slategray': {
        'value': '#708090',
        'rgb': [112, 128, 144],
        'luminace': 1
    },
    'slategrey': {
        'value': '#708090',
        'rgb': [112, 128, 144],
        'luminace': 1
    },
    'snow': {
        'value': '#FFFAFA',
        'rgb': [255, 250, 250],
        'luminace': 1
    },
    'springgreen': {
        'value': '#00FF7F',
        'rgb': [0, 255, 127],
        'luminace': 1
    },
    'steelblue': {
        'value': '#4682B4',
        'rgb': [70, 130, 180],
        'luminace': 1
    },
    'tan': {
        'value': '#D2B48C',
        'rgb': [210, 180, 140],
        'luminace': 1
    },
    'teal': {
        'value': '#008080',
        'rgb': [0, 128, 128],
        'luminace': 1
    },
    'thistle': {
        'value': '#D8BFD8',
        'rgb': [216, 191, 216],
        'luminace': 1
    },
    'tomato': {
        'value': '#FF6347',
        'rgb': [255, 99, 71],
        'luminace': 1
    },
    'turquoise': {
        'value': '#40E0D0',
        'rgb': [64, 224, 208],
        'luminace': 1
    },
    'violet': {
        'value': '#EE82EE',
        'rgb': [238, 130, 238],
        'luminace': 1
    },
    'wheat': {
        'value': '#F5DEB3',
        'rgb': [245, 222, 179],
        'luminace': 1
    },
    'white': {
        'value': '#FFFFFF',
        'rgb': [255, 255, 255],
        'luminace': 1
    },
    'whitesmoke': {
        'value': '#F5F5F5',
        'rgb': [245, 245, 245],
        'luminace': 1
    },
    'yellow': {
        'value': '#FFFF00',
        'rgb': [255, 255, 0],
        'luminace': 1
    },
    'yellowgreen': {
        'value': '#9ACD32',
        'rgb': [154, 205, 50],
        'luminace': 1
    }
});
exports.REGEXP = (() => RegExp(`(?:,| |\\(|:)(${Object.keys(exports.COLORS).map((color) => `(?:${color.toLowerCase()})`).join('|')})(?:$|,| |;|\\)|\\r|\\n)`, 'i'))();
// export const REGEXP_ONE = (() => RegExp(`^(?:,| |\\(|:)(${Object.keys(COLORS).map((color) => `(?:${color.toLowerCase()})`).join('|')})(?:$|,| |;|\\)|\\r|\\n)`, 'i'))();
// Checking for beginning beginning allow to catch stylus var value
exports.REGEXP_ONE = (() => RegExp(`^(?:^|,|\s|\\(|:)(${Object.keys(exports.COLORS).map((color) => `(?:${color.toLowerCase()})`).join('|')})(?:$|,| |;|\\)|\\r|\\n)`, 'i'))();
class BrowsersColorExtractor {
    constructor() {
        this.name = 'BROWSERS_COLORS_EXTRACTOR';
    }
    extractColors(text, fileName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = null;
            let colors = [];
            let position = 0;
            while ((match = text.match(exports.REGEXP)) !== null) {
                position += match.index + 1;
                colors.push(new color_1.default(match[1], position, 1, exports.COLORS[match[1]].rgb));
                text = text.slice(match.index + 1 + match[1].length);
                position += match[1].length;
            }
            return colors;
        });
    }
    extractColor(text) {
        let match = text.match(exports.REGEXP_ONE);
        if (match) {
            return new color_1.default(match[1], match.index, 1, exports.COLORS[match[1]].rgb);
        }
        return null;
    }
}
color_extractor_1.default.registerExtractor(new BrowsersColorExtractor());
exports.default = BrowsersColorExtractor;
//# sourceMappingURL=browser-extractor.js.map