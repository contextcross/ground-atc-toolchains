/**
 * 翻译规则配置文件
 * 按 type 类型组织，支持扩展
 */
const TRANSLATION_RULES = {
    "AircraftCallSign": {
        "airlines": {
            "CCA": { "zh": "国航", "en": "Air China" },
            "CES": { "zh": "东方", "en": "China Eastern" },
            "CSN": { "zh": "南方", "en": "China Southern" },
            "CHH": { "zh": "海南", "en": "Hainan" },
            "CDG": { "zh": "山东", "en": "Shandong" },
            "CSC": { "zh": "四川", "en": "Sichuan" },
            "CXA": { "zh": "白鹭", "en": "Xiamen Air" },
            "CQH": { "zh": "春秋", "en": "Spring Air" },
            "CSZ": { "zh": "深圳", "en": "Shenzhen Air" },
            "CJX": { "zh": "仙鹤", "en": "Jiangxi Air" },
            "UEA": { "zh": "锦绣", "en": "United Eagle" }
        },
        "digits": {
            "zh": { "0": "洞", "1": "幺", "2": "两", "3": "三", "4": "四", "5": "五", "6": "六", "7": "拐", "8": "八", "9": "九" },
            "en": { "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four", "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine" }
        },
        "pattern": "^([A-Z]+)(\\d+.*)$"
    }
};
