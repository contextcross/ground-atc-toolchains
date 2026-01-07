/**
 * 翻译规则配置文件
 * 
 * 结构说明:
 * - dictionaries: 公共字典库，所有类型共享
 * - types: 每个类型定义使用哪些字典
 */
const TRANSLATION_RULES = {
    // 公共字典库
    "dictionaries": {
        "digits": {
            "zh": { "0": "冻", "1": "幺", "2": "两", "3": "三", "4": "四", "5": "五", "6": "六", "7": "拐", "8": "八", "9": "九" },
            "en": { "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner" }
        },
        "airlines": {
            "zh": { "CCA": "国航", "CES": "东方", "CSN": "南方", "CHH": "海南", "CDG": "山东", "CSC": "四川", "CXA": "白鹭", "CQH": "春秋", "CSZ": "深圳", "CJX": "仙鹤", "UEA": "锦绣" },
            "en": { "AAL": "American", "AFR": "AirFrance", "DAL": "Delta", "ASA": "Alaska", "JBU": "JetBlue", "BAW": "Speedbird", "AVA": "Avianca", "VIR": "Virgin" }
        },
        "underscore": {
            "zh": { "_": "点" },
            "en": { "_": "decimal" }
        },
        "phonetic": {
            "zh": { "A": "Alpha", "B": "Bravo", "C": "Charlie", "D": "Delta", "E": "Echo", "F": "Foxtrot", "G": "Golf", "H": "Hotel", "I": "India", "J": "Juliet", "K": "Kilo", "L": "Lima", "M": "Mike", "N": "November", "O": "Oscar", "P": "Papa", "Q": "Quebec", "R": "Romeo", "S": "Sierra", "T": "Tango", "U": "Uniform", "V": "Victor", "W": "Whiskey", "X": "X-ray", "Y": "Yankee", "Z": "Zulu" },
            "en": { "A": "Alpha", "B": "Bravo", "C": "Charlie", "D": "Delta", "E": "Echo", "F": "Foxtrot", "G": "Golf", "H": "Hotel", "I": "India", "J": "Juliet", "K": "Kilo", "L": "Lima", "M": "Mike", "N": "November", "O": "Oscar", "P": "Papa", "Q": "Quebec", "R": "Romeo", "S": "Sierra", "T": "Tango", "U": "Uniform", "V": "Victor", "W": "Whiskey", "X": "X-ray", "Y": "Yankee", "Z": "Zulu" }
        },
        "windPrefix": {
            "zh": { "地面风": "地面风." },
            "en": { "Wind": "Wind-" }
        },
        "runwayPrefix": {
            "zh": { "RWY": "跑道", "RUNWAY": "跑道" },
            "en": { "RWY": "runway ", "RUNWAY": "runway ", "Runway": "runway " }
        }
    },

    // 类型规则：定义使用哪些字典
    "types": {
        "AircraftCallSign": { "useDictionaries": ["airlines", "digits"] },
        "Constant": { "useDictionaries": ["underscore", "digits"] },
        "TaxiRoute": { "useDictionaries": ["runwayPrefix", "phonetic", "digits"] },
        "WindDynamic": { "useDictionaries": ["windPrefix", "digits"] },
        "Runway": { "useDictionaries": ["runwayPrefix", "phonetic", "digits"] },
        "Spot": { "useDictionaries": ["digits"] },
        "HoldingPoint": { "useDictionaries": ["digits", "phonetic"] },
        "TurnDirection": { "useDictionaries": [] },
        "PushbackHeading": { "useDictionaries": [] },
        "NavigationPoint": { "useDictionaries": [] }
    }
};
