import {
  RootCardName, RootCorvidSpecial, RootEyrieLeaderSpecial, RootFaction, RootItem,
  RootMap, RootPieceType, RootRiverfolkPriceSpecial, RootSuit, RootVagabondCharacterSpecial
} from '@seiyria/rootlog-parser';

export function change(str:string){
  return String.fromCharCode(str.charCodeAt(0)+200)
}
export function invChange(str:string){
  return String.fromCharCode(str.charCodeAt(0)-200)
}
export interface RootClearing {
  warriors: Partial<Record<RootFaction, number>>;
  buildings: Partial<Record<string, number>>;
  tokens: Partial<Record<string, number>>;
}

export interface RootGameState {
  factionVP: Partial<Record<RootFaction, number>>;
  clearings: RootClearing[];
  craftedItems: Partial<Record<RootItem, number>>;
  forests: Record<string, RootClearing>;
}

export interface FormattedAction {
  changeTurn?: RootFaction;
  combat?: { attacker: RootFaction, defender: RootFaction, clearing: number };
  gainVP?: { faction: RootFaction, vp: number };
  moves?: Array<{
    num: number;
    faction: RootFaction;
    piece: string;
    pieceType: RootPieceType;
    start?: number|string;
    startForest?: string;
    destination?: number|string;
    destinationForest?: string;
  }>;

  craftItem?: RootItem;

  currentState?: RootGameState;
  currentTurn: RootFaction;
  description: string;
}

export const forestPositions: Record<RootMap, Record<string, [number, number]>> = {
  [RootMap.Fall]: {
    '1_2_5_10':       [130, 65],
    '1_9_10_12':      [110, 155],
    '2_6_10_11_12':   [260, 155],
    '3_7_11_12':      [240, 275],
    '3_6_11':         [360, 295],
    '4_9_12':         [60,  245],
    '4_7_8_12':       [130, 325],
  },
  [RootMap.Winter]: {
    '1_2_5_6_11_12':  [210, 130],
    '1_10_11':        [80,  130],
    '2_7_12':         [360, 145],
    '3_7_12':         [365, 270],
    '3_8_12':         [310, 270],
    '4_10_11':        [90,  230],
    '4_9_11':         [130, 300],
    '8_9_11_12':      [220, 270],
  },
  [RootMap.Mountain]: {
    //'1_5_9':          [150, 75],
    '1_8_9':          [75,  125],
    '2_5_11':         [320, 125],
    '2_6_11':         [370, 165],
    '3_7_11_12':      [260, 330],
    '3_6_11':         [370, 300],
    '4_8_9_12':       [70,  250],
    //'4_7_12':         [140, 330],
    '5_9_10':         [220, 120],
    '5_10_11':        [265, 120],
    '9_10_12':        [185, 200],
    '10_11_12':       [225, 240],
  },
  [RootMap.Lake]: {
    '1_9_12':         [270, 320],
    '1_5_11':         [350, 260],
    '2_7_10':         [130, 80],
    '2_8_10':         [90,  120],
    '3_8_10_12':      [110, 240],
    '3_9_12':         [150, 340],
    '4_5_6_11':       [350, 140],
    '6_7_11':         [250, 110],
    '7_10_11':        [200, 125],
  }
};
export const pathPositions: Record<RootMap, Record<string, [number, number]>> = {
  [RootMap.Fall]: {
    "1_1_5":    [160,40],
    "1_1_9":    [27,95],
    "1_1_10":   [107,87],
    "2_2_5":    [320,76],
    "2_2_6":    [383,170],
    "2_2_10":   [280,114],
    "3_3_6":    [405,310],
    "3_3_7":    [330,365],
    "3_3_11":   [335,300],
    "4_4_8":    [100,365],
    "4_4_9":    [20,240],
    "4_4_12":   [90,295],
    "6_6_11":   [340,220],
    "7_7_8":    [220,367],
    "7_7_12":   [200,295],
    "9_9_12":   [90,195],
    "10_10_12":  [175,180],
    "11_11_12":  [215,230],
  },
  [RootMap.Winter]: {
    "1_1_5":[105,37],
    "1_1_10":[38,112],
    "1_1_11":[102,103],
    "2_2_6":[332,46],
    "2_2_7":[401,120],
    "2_2_12":[338,111],
    "3_3_7":[402,282],
    "3_3_8":[339,346],
    "3_3_12":[337,277],
    "4_4_9":[112,356],
    "4_4_10":[40,253],
    "4_4_11":[108,261],
    "5_5_6":[220,50],
    "8_8_9":[234,354],
    "8_8_12":[287,259],
    "9_9_11":[175,281],
  },
  [RootMap.Mountain]: {
    "1_1_8":[43,118],
    "1_1_9":[92,90],
    "2_2_6":[410,137],
    "2_2_11":[342,148],
    "3_3_6":[410,299],
    "3_3_11":[344,321],
    "4_4_8":[42,269],
    "4_4_12":[104,296],
    "5_5_10":[244,113],
    "5_5_11":[288,170],
    "7_7_12":[188,320],
    "9_9_10":[193,162],
    "9_9_12":[150,208],
    "10_10_11":[261,221],
    "10_10_12":[199,219],
  },
  [RootMap.Lake]: {
    "1_1_5":[400,280],
    "1_1_9":[325,362],
    "2_2_7":[124,35],
    "2_2_8":[39,108],
    "2_2_10":[101,91],
    "3_3_8":[39,257],
    "3_3_9":[160,369],
    "3_3_12":[109,302],
    "4_4_5":[406,119],
    "4_4_6":[353,42],
    "5_5_11":[355,200],
    "6_6_7":[249,49],
    "6_6_11":[305,129],
    "7_7_10":[178,100],
    "7_7_11":[237,124],
    "8_8_10":[105,175],
    "9_9_12":[227,330],
  }
};

export const mapData: Record<RootMap, Record<number,Record<string,any>>> = {
  "Fall": {
      1:  { "slots": 1, "adjacent": [5,9,10],       "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [18, 18], "opposite":3,},
      2:  { "slots": 2, "adjacent": [5,6,10],       "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [358, 89], "opposite":4,},
      3:  { "slots": 1, "adjacent": [6,7,11],       "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [362, 367], "opposite":1,},
      4:  { "slots": 1, "adjacent": [8,9,12],       "corner": true,  "edge": true,  "river": true,  "ruins": false, "position": [15, 320], "opposite":2,},
      5:  { "slots": 2, "adjacent": [1,2],          "corner": false, "edge": true,  "river": true,  "ruins": false, "position": [233, 23], "opposite":"",},
      6:  { "slots": 2, "adjacent": [2,3,11],       "corner": false, "edge": true,  "river": false, "ruins": true,  "position": [368, 206], "opposite":"",},
      7:  { "slots": 2, "adjacent": [3,8,12],       "corner": false, "edge": true,  "river": true,  "ruins": false, "position": [248, 318], "opposite":"",},
      8:  { "slots": 2, "adjacent": [4,7],          "corner": false, "edge": true,  "river": false, "ruins": false, "position": [140, 364], "opposite":"",},
      9:  { "slots": 2, "adjacent": [1,4,12],       "corner": false, "edge": true,  "river": false, "ruins": false, "position": [18, 134], "opposite":"",},
      10: { "slots": 2, "adjacent": [1,2,12],       "corner": false, "edge": false, "river": true,  "ruins": true,  "position": [157, 87], "opposite":"",},
      11: { "slots": 3, "adjacent": [3,6,12],       "corner": false, "edge": false, "river": true,  "ruins": true,  "position": [264, 192], "opposite":"",},
      12: { "slots": 2, "adjacent": [4,7,8,9,11],   "corner": false, "edge": false, "river": false, "ruins": true,  "position": [124, 227], "opposite":"",},
  },
  [RootMap.Winter]: {
      1:  { "slots": 1, "adjacent": [5,10,11],      "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [18, 10], "opposite":3,},
      2:  { "slots": 1, "adjacent": [6,7,12],       "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [363, 7], "opposite":4,},
      3:  { "slots": 2, "adjacent": [7,8,12],       "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [363, 336], "opposite":1,},
      4:  { "slots": 2, "adjacent": [9,10,11],      "corner": true,  "edge": true,  "river": false, "ruins": false, "position": [21, 301], "opposite":2,},
      5:  { "slots": 2, "adjacent": [1,6],          "corner": false, "edge": true,  "river": false, "ruins": false, "position": [137, 18], "opposite":"",},
      6:  { "slots": 2, "adjacent": [2,5],          "corner": false, "edge": true,  "river": false, "ruins": false, "position": [243, 38], "opposite":"",},
      7:  { "slots": 1, "adjacent": [2,3],          "corner": false, "edge": true,  "river": true,  "ruins": false, "position": [367, 180], "opposite":"",},
      8:  { "slots": 2, "adjacent": [3,9,12],       "corner": false, "edge": true,  "river": false, "ruins": true,  "position": [251, 294], "opposite":"",},
      9:  { "slots": 2, "adjacent": [4,8,11],       "corner": false, "edge": true,  "river": false, "ruins": true,  "position": [144, 340], "opposite":"",},
      10: { "slots": 1, "adjacent": [1,4],          "corner": false, "edge": true,  "river": true,  "ruins": false, "position": [12, 159], "opposite":"",},
      11: { "slots": 3, "adjacent": [1,4,9],        "corner": false, "edge": false, "river": true,  "ruins": true,  "position": [145, 164], "opposite":"",},
      12: { "slots": 3, "adjacent": [2,3,8],        "corner": false, "edge": false, "river": true,  "ruins": true,  "position": [262, 170], "opposite":"",},
  },
  [RootMap.Lake]: {
      1:  { "slots": 2, "adjacent": [5,9],          "corner": true,   "edge": true,  "river": true,  "ruins": false, "position": [353, 319], "opposite":2,},
      2:  { "slots": 1, "adjacent": [7,8,10],       "corner": true,   "edge": true,  "river": false, "ruins": false, "position": [24, 10], "opposite":1,},
      3:  { "slots": 1, "adjacent": [8,9,12],       "corner": true,   "edge": true,  "river": false, "ruins": false, "position": [25, 307], "opposite":4,},
      4:  { "slots": 1, "adjacent": [5,6],          "corner": true,   "edge": true,  "river": false, "ruins": false, "position": [366, 7], "opposite":3,},
      5:  { "slots": 3, "adjacent": [1,4,11],       "corner": false,  "edge": true,  "river": false, "ruins": true,  "position": [370, 181], "opposite":"",},
      6:  { "slots": 2, "adjacent": [4,7,11],       "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [267, 39], "opposite":"",},
      7:  { "slots": 1, "adjacent": [2,6,10,11],    "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [163, 19], "opposite":"",},
      8:  { "slots": 1, "adjacent": [2,3,10],       "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [16, 161], "opposite":"",},
      9:  { "slots": 1, "adjacent": [1,3,12],       "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [230, 342], "opposite":"",},
      10: { "slots": 3, "adjacent": [2,7,8],        "corner": false,  "edge": false, "river": true,  "ruins": true,  "position": [135, 136], "opposite":"",},
      11: { "slots": 3, "adjacent": [5,6,7],        "corner": false,  "edge": false, "river": true,  "ruins": true,  "position": [267, 171], "opposite":"",},
      12: { "slots": 3, "adjacent": [3,9],          "corner": false,  "edge": false, "river": true,  "ruins": true,  "position": [152, 260], "opposite":"",},
  },
  [RootMap.Mountain]: {
      1:  { "slots": 2, "adjacent": [8,9],          "corner": true,   "edge": true,  "river": false, "ruins": false, "position": [22, 15], "opposite":3, "closedAdjacent":[],},
      2:  { "slots": 2, "adjacent": [6,11],         "corner": true,   "edge": true,  "river": true,  "ruins": false, "position": [362, 16], "opposite":4, "closedAdjacent":[5],},
      3:  { "slots": 2, "adjacent": [6,11],         "corner": true,   "edge": true,  "river": false, "ruins": false, "position": [364, 350], "opposite":1, "closedAdjacent":[7],},
      4:  { "slots": 2, "adjacent": [8,12],         "corner": true,   "edge": true,  "river": true,  "ruins": false, "position": [26, 310], "opposite":2, "closedAdjacent":[],},
      5:  { "slots": 1, "adjacent": [10,11],        "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [227, 26], "opposite":"", "closedAdjacent":[2,9],},
      6:  { "slots": 1, "adjacent": [2,3],          "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [367, 191], "opposite":"", "closedAdjacent":[11],},
      7:  { "slots": 1, "adjacent": [12],           "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [189, 348], "opposite":"", "closedAdjacent":[3],},
      8:  { "slots": 1, "adjacent": [1,4],          "corner": false,  "edge": true,  "river": false, "ruins": false, "position": [16, 165], "opposite":"", "closedAdjacent":[9],},
      9:  { "slots": 3, "adjacent": [1,10,12],      "corner": false,  "edge": true,  "river": false, "ruins": true,  "position": [117, 126], "opposite":"", "closedAdjacent":[5,8],},
      10: { "slots": 2, "adjacent": [5,9,11,12],    "corner": false,  "edge": false, "river": true,  "ruins": true,  "position": [204, 143], "opposite":"", "closedAdjacent":[],},
      11: { "slots": 3, "adjacent": [2,3,5,10],     "corner": false,  "edge": false, "river": false, "ruins": true,  "position": [253, 232], "opposite":"", "closedAdjacent":[6,12],},
      12: { "slots": 3, "adjacent": [4,7,9,10],     "corner": false,  "edge": true,  "river": false, "ruins": true,  "position": [124, 228], "opposite":"", "closedAdjacent":[11],},
  },
};

export const clearingPositions: Record<RootMap, Array<[number, number]>> = {
  [RootMap.Fall]: [
    [18, 18],
    [358, 89],
    [362, 367],
    [16, 320],
    [233, 23],
    [370, 206],
    [248, 320],
    [140, 364],
    [19, 134],
    [157, 87],
    [264, 192],
    [124, 227]
  ],
  [RootMap.Winter]: [
    [18, 10],
    [370, 8],
    [370, 343],
    [22, 308],
    [140, 19],
    [247, 40],
    [375, 184],
    [256, 301],
    [150, 347],
    [12, 162],
    [150, 168],
    [269, 175]
  ],
  [RootMap.Lake]: [
    [364, 330],
    [24, 10],
    [27, 318],
    [377, 7],
    [381, 188],
    [275, 39],
    [169, 19],
    [18, 166],
    [238, 353],
    [140, 141],
    [275, 176],
    [158, 269]
  ],
  [RootMap.Mountain]: [
    [24, 17],
    [378, 18],
    [381, 365],
    [27, 324],
    [237, 28],
    [384, 200],
    [197, 363],
    [17, 173],
    [123, 132],
    [213, 148],
    [264, 242],
    [131, 238]
  ]
};
export const factionTraits: Record<RootFaction, Array<string>> = {
  [RootFaction.Corvid]:     ['Gamble',      'Backup plans', 'Mastermind', 'Vendetta'],
  [RootFaction.Cult]:       ['Spiteful',    'Erratic',      'Fanatics',   'Martyrs'],
  [RootFaction.Duchy]:      ['Foundations', 'Investors',    'Overwhelm',  'Invaders'],
  [RootFaction.Eyrie]:      ['Nobility',    'Relentless',   'Swoop',      'War tax'],
  [RootFaction.Marquise]:   ['Hospitals',   'Iron will',    'Blitz',      'Fortified'],
  [RootFaction.Riverfolk]:  ['Greedy',      'Involved',     'Garrison',   'Ferocious'],
  [RootFaction.Vagabond]:   ['Helper',      'Marksman',     'Adventurer', 'Berserker'],
  [RootFaction.Vagabond2]:  ['Helper',      'Marksman',     'Adventurer', 'Berserker'],
  [RootFaction.Woodland]:   ['Veterans',    'Popularity',   'Wildfire',   'Informants'],
}
export const actualFactions: Record<RootFaction, string> = {
  [RootFaction.Corvid]: 'corvid',
  [RootFaction.Cult]: 'cult',
  [RootFaction.Duchy]: 'duchy',
  [RootFaction.Eyrie]: 'eyrie',
  [RootFaction.Marquise]: 'marquise',
  [RootFaction.Riverfolk]: 'riverfolk',
  [RootFaction.Vagabond]: 'vagabond',
  [RootFaction.Vagabond2]: 'vagabond2',
  [RootFaction.Woodland]: 'woodland',
  ['K' as RootFaction]: 'keepers',
  ['H' as RootFaction]: 'hundreds',
}
export const outsidersFactions: Record<any, string> = {
  ['B' as RootFaction]: 'bones',
  ['F' as RootFaction]: 'frogs',
  ['T' as RootFaction]: 'oldman',
  ['Y' as RootFaction]: 'order',
  ['N' as RootFaction]: 'colonies',
  ['W' as RootFaction]: 'winged',
}

export const actualMaps: Record<RootMap, string> = {
  [RootMap.Mountain]: 'Mountain',
  [RootMap.Lake]: 'Lake',
  [RootMap.Fall]: 'Fall',
  [RootMap.Winter]: 'Winter',
}
export const actualLandmarks: Record<string, string> ={
  't': 'Tower',
  't_m': 'Market',
  't_c': 'City',
  't_f': 'Ferry',
  't_k': 'Forge',
  't_r': 'Treetop'
}
export const actualBots: Record<any, string> = {
  ['c' as RootFaction]: 'marquiseBot',
  ['e' as RootFaction]: 'eyrieBot',
  ['a' as RootFaction]: 'woodlandBot',
  ['v' as RootFaction]: 'vagabondBot',
  ['p' as RootFaction]: 'corvidBot',
  ['l' as RootFaction]: 'cultBot',
  ['d' as RootFaction]: 'duchyBot',
  ['o' as RootFaction]: 'riverfolkBot',
}
export const actualClasses: Record<any, string> = {
  ['Ạ' as RootFaction]: 'adventurer',
  ['Å' as RootFaction]: 'arbiter',
  ['Ä' as RootFaction]: 'harrier',
  ['Ả' as RootFaction]: 'ranger',
  ['Ḁ' as RootFaction]: 'ronin',
  ['Ấ' as RootFaction]: 'scoundrel',
  ['Ầ' as RootFaction]: 'thief',
  ['Ẩ' as RootFaction]: 'tinker',
  ['Ȃ' as RootFaction]: 'vagrant',
}
export const actualHirelings: Record<any, string> = {
  [change('P') as RootFaction]: 'spies',
  [change('L') as RootFaction]: 'prophets',
  [change('D') as RootFaction]: 'expedition',
  [change('E') as RootFaction]: 'dynasty',
  [change('C') as RootFaction]: 'patrol',
  [change('O') as RootFaction]: 'flotilla',
  [change('V') as RootFaction]: 'exile',
  [change('A') as RootFaction]: 'uprising',
  [change('K') as RootFaction]: 'vaultkeepers',
  [change('H') as RootFaction]: 'flamebearers',
  [change('B') as RootFaction]: 'band',
  [change('N')as RootFaction]: 'bandits',
  [change('R') as RootFaction]: 'protector',
}
export const factionNames: Record<RootFaction, string> = {
  [RootFaction.Corvid]: 'corvid',
  [RootFaction.Cult]: 'cult',
  [RootFaction.Duchy]: 'duchy',
  [RootFaction.Eyrie]: 'eyrie',
  [RootFaction.Marquise]: 'marquise',
  [RootFaction.Riverfolk]: 'riverfolk',
  [RootFaction.Vagabond]: 'vagabond',
  [RootFaction.Vagabond2]: 'vagabond2',
  [RootFaction.Woodland]: 'woodland',
  ['K' as RootFaction]: 'keepers',
  ['H' as RootFaction]: 'hundreds',
  ['M' as RootFaction]: 'deck',
  ['c' as RootFaction]: 'marquiseBot',
  ['e' as RootFaction]: 'eyrieBot',
  ['a' as RootFaction]: 'woodlandBot',
  ['v' as RootFaction]: 'vagabondBot',
  ['p' as RootFaction]: 'corvidBot',
  ['l' as RootFaction]: 'cultBot',
  ['d' as RootFaction]: 'duchyBot',
  ['o' as RootFaction]: 'riverfolkBot',
  ['Ạ' as RootFaction]: 'adventurer',
  ['Å' as RootFaction]: 'arbiter',
  ['Ä' as RootFaction]: 'harrier',
  ['Ả' as RootFaction]: 'ranger',
  ['Ḁ' as RootFaction]: 'ronin',
  ['Ấ' as RootFaction]: 'scoundrel',
  ['Ầ' as RootFaction]: 'thief',
  ['Ẩ' as RootFaction]: 'tinker',
  ['Ȃ' as RootFaction]: 'vagrant',
  ['å' as RootFaction]: 'arbiter',
  ['ả' as RootFaction]: 'ranger',
  ['ấ' as RootFaction]: 'scoundrel',
  ['ầ' as RootFaction]: 'thief',
  ['ẩ' as RootFaction]: 'tinker',
  ['ȃ' as RootFaction]: 'vagrant',
  [change('P') as RootFaction]: 'spies',
  [change('L') as RootFaction]: 'prophets',
  [change('D') as RootFaction]: 'expedition',
  [change('E') as RootFaction]: 'dynasty',
  [change('C') as RootFaction]: 'patrol',
  [change('O') as RootFaction]: 'flotilla',
  [change('V') as RootFaction]: 'exile',
  [change('A') as RootFaction]: 'uprising',
  [change('K') as RootFaction]: 'vaultkeepers',
  [change('H') as RootFaction]: 'flamebearers',
  [change('B') as RootFaction]: 'band',
  [change('N')as RootFaction]: 'bandits',
  [change('R') as RootFaction]: 'protector',
  ['B' as RootFaction]: 'bones',
  ['F' as RootFaction]: 'frogs',
  ['T' as RootFaction]: 'oldman',
  ['Y' as RootFaction]: 'order',
  ['N' as RootFaction]: 'colonies',
  ['W' as RootFaction]: 'winged',
};

export const factionProperNames: Record<RootFaction, string> = {
  [RootFaction.Corvid]: 'Corvid Conspiracy',
  [RootFaction.Cult]: 'Lizard Cult',
  [RootFaction.Duchy]: 'Underground Duchy',
  [RootFaction.Eyrie]: 'Eyrie Dynasties',
  [RootFaction.Marquise]: 'Marquise de Cat',
  [RootFaction.Riverfolk]: 'Riverfolk Company',
  [RootFaction.Vagabond]: 'Vagabond',
  [RootFaction.Vagabond2]: '2nd Vagabond',
  [RootFaction.Woodland]: 'Woodland Alliance',
  ['K' as RootFaction]: 'Keepers in Iron',
  ['H' as RootFaction]: 'Lord of the Hundreds',
  ['c' as RootFaction]: 'Mechanical Marquise 2.0',
  ['e' as RootFaction]: 'Electric Eyrie',
  ['a' as RootFaction]: 'Automated Alliance',
  ['v' as RootFaction]: 'Vagabot',
  ['p' as RootFaction]: 'Contraption Conspiracy',
  ['l' as RootFaction]: 'Cogwheel Cult',
  ['d' as RootFaction]: 'Dummy Duchy',
  ['o' as RootFaction]: 'Rivetfolk',
  ['Ạ' as RootFaction]: 'Adventurer',
  ['Å' as RootFaction]: 'Arbiter',
  ['Ä' as RootFaction]: 'Harrier',
  ['Ả' as RootFaction]: 'Ranger',
  ['Ḁ' as RootFaction]: 'Ronin',
  ['Ấ' as RootFaction]: 'Scoundrel',
  ['Ầ' as RootFaction]: 'Thief',
  ['Ẩ' as RootFaction]: 'Tinker',
  ['Ȃ' as RootFaction]: 'Vagrant',
  ['å' as RootFaction]: 'Arbiter',
  ['ả' as RootFaction]: 'Ranger',
  ['ấ' as RootFaction]: 'Scoundrel',
  ['ầ' as RootFaction]: 'Thief',
  ['ẩ' as RootFaction]: 'Tinker',
  ['ȃ' as RootFaction]: 'Vagrant',
  [change('P')]: 'Corvid Spies,Raven Sentries',
  [change('L') as RootFaction]: 'Warm Sun Prophets,Lizard Envoys',
  [change('D') as RootFaction]: 'Sunward Expedition,Mole Artisans',
  [change('E') as RootFaction]: 'Last Dynasty,Bluebird Nobles',
  [change('C') as RootFaction]: 'Forest Patrol,Feline Physicians',
  [change('O') as RootFaction]: 'Riverfolk Flotilla,Otter Divers',
  [change('V') as RootFaction]: 'The Exile,The Brigand',
  [change('A') as RootFaction]: 'Spring Uprising,Rabbit Scouts',
  [change('K') as RootFaction]: 'Vault Keepers,Badger Bodyguards',
  [change('H') as RootFaction]: 'Flame Bearers,Rat Smugglers',
  [change('B') as RootFaction]: 'Popular Band,Street Band',
  [change('N') as RootFaction]: 'Highway Bandits,Bandit Gangs',
  [change('R') as RootFaction]: 'Furious Protector,Stoic Protector',
  ['B' as RootFaction]: 'Bone Patrol',
  ['F' as RootFaction]: 'Croakers Coven',
  ['T' as RootFaction]: 'Old Man Tinker',
  ['Y' as RootFaction]: 'Order of the Forest',
  ['N' as RootFaction]: 'Twelve Colonies',
  ['W' as RootFaction]: 'Winged Menace',
};

export const suitNames: Record<RootSuit, string> = {
  [RootSuit.Bird]: 'bird',
  [RootSuit.Fox]: 'fox',
  [RootSuit.Mouse]: 'mouse',
  [RootSuit.Rabbit]: 'rabbit',
};

export const pieceNames: Record<RootPieceType, string> = {
  [RootPieceType.Building]: 'building',
  [RootPieceType.Pawn]: 'pawn',
  [RootPieceType.Raft]: 'raft',
  [RootPieceType.Token]: 'token',
  [RootPieceType.Warrior]: 'warrior'
};

export const vagabondCharacterNames: Record<RootVagabondCharacterSpecial, string> = {
  [RootVagabondCharacterSpecial.Adventurer]: 'Adventurer',
  [RootVagabondCharacterSpecial.Arbiter]: 'Arbiter',
  [RootVagabondCharacterSpecial.Harrier]: 'Harrier',
  [RootVagabondCharacterSpecial.Ranger]: 'Ranger',
  [RootVagabondCharacterSpecial.Ronin]: 'Ronin',
  [RootVagabondCharacterSpecial.Scoundrel]: 'Scoundrel',
  [RootVagabondCharacterSpecial.Thief]: 'Thief',
  [RootVagabondCharacterSpecial.Tinker]: 'Tinker',
  [RootVagabondCharacterSpecial.Vagrant]: 'Vagrant',
};
export const eyrieLeaderNames: Record<RootEyrieLeaderSpecial, string> = {
  [RootEyrieLeaderSpecial.Builder]: 'Builder',
  [RootEyrieLeaderSpecial.Charismatic]: 'Charismatic',
  [RootEyrieLeaderSpecial.Commander]: 'Commander',
  [RootEyrieLeaderSpecial.Despot]: 'Despot'
};
export const cardNames: Record<RootCardName, string> = {
  [RootCardName.Ambush]: 'Ambush',
  [RootCardName.AmbushFullName]: 'Ambush',
  [RootCardName.Anvil]: 'Anvil',
  [RootCardName.Armor]: 'Armorers',
  [RootCardName.ArmorFullName]: 'Armorers',
  [RootCardName.ArmsTrader]: 'Arms Trader',
  [RootCardName.BakeSale]: 'Bake Sale',
  [RootCardName.BetterBurrowBank]: 'Better Burrow Bank',
  [RootCardName.BetterBurrowBankFullName]: 'Better Burrow Bank',
  [RootCardName.BirdyBindle]: 'Birdy Bindle',
  [RootCardName.Boat]: 'Boat Builders',
  [RootCardName.BoatFullName]: 'Boat Builders',
  [RootCardName.BrutalTactics]: 'Brutal Tactics',
  [RootCardName.BrutalTacticsFullName]: 'Brutal Tactics',
  [RootCardName.CharmOffensive]: 'Charm Offensive',
  [RootCardName.CharmOffensiveFullName]: 'Charm Offensive',
  [RootCardName.Cob]: 'Cobbler',
  [RootCardName.CobFullName]: 'Cobbler',
  [RootCardName.Codebreakers]: 'Codebreakers',
  [RootCardName.CodebreakersFullName]: 'Codebreakers',
  [RootCardName.CoffinMakers]: 'Coffin Makers',
  [RootCardName.CoffinMakersFullName]: 'Coffin Makers',
  [RootCardName.CommandWarren]: 'Command Warren',
  [RootCardName.CommandWarrenFullName]: 'Command Warren',
  [RootCardName.CorvidPlans]: 'Corvid Planners',
  [RootCardName.CorvidPlansFullName]: 'Corvid Planners',
  [RootCardName.Crossbow]: 'Crossbow',
  [RootCardName.Dominance]: 'Dominance',
  [RootCardName.DominanceFullName]: 'Dominance',
  [RootCardName.Engrave]: 'Master Engravers',
  [RootCardName.EngraveFullName]: 'Master Engravers',
  [RootCardName.EyrieEmigre]: 'Eyrie Émigré',
  [RootCardName.EyrieEmigreFullName]: 'Eyrie Émigré',
  [RootCardName.FalseOrders]: 'False Orders',
  [RootCardName.FalseOrdersFullName]: 'False Orders',
  [RootCardName.FoxFavor]: 'Favor of the Foxes',
  [RootCardName.FoxFavorFullName]: 'Favor of the Foxes',
  [RootCardName.FoxPartisans]: 'Fox Partisans',
  [RootCardName.FoxPartisansFullName]: 'Fox Partisans',
  [RootCardName.FoxfolkSteel]: 'Foxfolk Steel',
  [RootCardName.GenericFavor]: 'Favor',
  [RootCardName.FoxPartisans]: 'Favor',
  [RootCardName.GentlyUsedKnapsack]: 'Gently Used Knapsack',
  [RootCardName.Informers]: 'Informers',
  [RootCardName.InformersFullName]: 'Informers',
  [RootCardName.Investments]: 'Investments',
  [RootCardName.LeagueOfExtraordinaryMice]: 'League of Extraordinary Mice',
  [RootCardName.LeagueOfExtraordinaryMiceFullName]: 'League of Extraordinary Mice',
  [RootCardName.MouseFavor]: 'Favor of the Mice',
  [RootCardName.MouseFavorFullName]: 'Favor of the Mice',
  [RootCardName.MouseInASack]: 'Mouse in a Sack',
  [RootCardName.MousePartisans]: 'Mouse Partisans',
  [RootCardName.MousePartisansFullName]: 'Mouse Partisans',
  [RootCardName.MurineBroker]: 'Murine Broker',
  [RootCardName.MurineBrokerFullName]: 'Murine Broker',
  [RootCardName.PropagandaBureau]: 'Propaganda Bureau',
  [RootCardName.PropagandaBureauFullName]: 'Propaganda Bureau',
  [RootCardName.ProtectionRacket]: 'Protection Racket',
  [RootCardName.RabbitFavor]: 'Favor of the Rabbits',
  [RootCardName.RabbitFavorFullName]: 'Favor of the Rabbits',
  [RootCardName.RabbitPartisans]: 'Rabbit Partisans',
  [RootCardName.RabbitPartisansFullName]: 'Rabbit Partisans',
  [RootCardName.RootTea]: 'Root Tea',
  [RootCardName.Royal]: 'Royal Claim',
  [RootCardName.RoyalFullName]: 'Royal Claim',
  [RootCardName.Saboteurs]: 'Saboteurs',
  [RootCardName.SaboteursFullName]: 'Saboteurs',
  [RootCardName.Sappers]: 'Sappers',
  [RootCardName.SappersFullName]: 'Sappers',
  [RootCardName.Scout]: 'Scout',
  [RootCardName.ScoutFullName]: 'Scout',
  [RootCardName.SmugglersTrail]: 'Smuggler\'s Trail',
  [RootCardName.SoupKitchens]: 'Soup Kitchens',
  [RootCardName.SoupKitchensFullName]: 'Soup Kitchens',
  [RootCardName.StandAndDeliver]: 'Stand and Deliver',
  [RootCardName.StandAndDeliverFullName]: 'Stand and Deliver',
  [RootCardName.SwapMeet]: 'Swap Meet',
  [RootCardName.SwapMeetFullName]: 'Swap Meet',
  [RootCardName.Sword]: 'Sword',
  [RootCardName.Tax]: 'Tax Collector',
  [RootCardName.TaxFullName]: 'Tax Collector',
  [RootCardName.TravelGear]: 'Travel Gear',
  [RootCardName.Tun]: 'Tunnels',
  [RootCardName.TunFullName]: 'Tunnels',
  [RootCardName.WoodlandRunners]: 'Woodland Runners',
};

export const itemNames: Record<RootItem, string> = {
  [RootItem.Sword]: 'sword',
  [RootItem.Bag]: 'bag',
  [RootItem.Coin]: 'coin',
  [RootItem.Crossbow]: 'crossbow',
  [RootItem.Hammer]: 'hammer',
  [RootItem.Tea]: 'tea',
  [RootItem.Torch]: 'torch',
  [RootItem.Boot]: 'boot',
};

export const riverfolkCostNames: Record<RootRiverfolkPriceSpecial, string> = {
  [RootRiverfolkPriceSpecial.HandCard]: 'hand cards',
  [RootRiverfolkPriceSpecial.Mercenaries]: 'mercenaries',
  [RootRiverfolkPriceSpecial.Riverboats]: 'riverboats'
};

export const corvidPlotNames: Record<RootCorvidSpecial, string> = {
  [RootCorvidSpecial.BombPlot]: 'bomb plot',
  [RootCorvidSpecial.ExtortionPlot]: 'extortion',
  [RootCorvidSpecial.RaidPlot]: 'raid',
  [RootCorvidSpecial.SnarePlot]: 'snare',
  [RootCorvidSpecial.Plot]: 'plot'
};

export const buildingTokenNames: Record<string, string> = {
  a_b_f: 'fox base',
  a_b_m: 'mouse base',
  a_b_r: 'rabbit base',
  c_b_r: 'recruiter',
  c_b_s: 'sawmill',
  c_b_w: 'workshop',
  d_b_c: 'citadel',
  d_b_m: 'market',
  e_b: 'roost',
  l_b_f: 'fox garden',
  l_b_m: 'mouse garden',
  l_b_r: 'rabbit gaden',

  a_t: 'sympathy',
  c_t_k: 'keep',
  c_t: 'wood',
  o_t_f: 'fox trade post',
  o_t_m: 'mouse trade post',
  o_t_r: 'rabbit trade post',
  d_t: 'tunnel',
  p_t_b: 'bomb plot',
  p_t_e: 'extortion plot',
  p_t_r: 'raid plot',
  p_t_s: 'snare plot',
  p_t: 'facedown plot',
  m_t: 'the tower',
  m_t_n: 'the forge',
};
