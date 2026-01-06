/**
 * Voice Presets 配置文件
 * 
 * 结构说明:
 * - groups: 按 provider+lang 分组，定义公共属性
 * - presets: 各预设只需指定 group 和特定配置
 */
const VOICE_CONFIG = {
    // 分组定义
    "groups": {
        "minimax_zh": { provider: "minimax", lang: "zh" },
        "minimax_en": { provider: "minimax", lang: "en" },
        "elevenlabs_en": { provider: "elevenlabs", lang: "en" }
    },

    // 预设定义
    "presets": {
        // English - MiniMax
        "Christopher": { name: "Christopher", group: "minimax_en", config: { voiceId: "male-qn-domineering", speed: 1, vol: 1, pitch: 0, emotion: "neutral" } },
        "Fairy": { name: "Fairy", group: "minimax_en", config: { voiceId: "female-shaonv", speed: 1.2, vol: 1, pitch: 0, emotion: "neutral" } },
        "CN-Captain-Young-EN": { name: "CN-Captain-Young-EN", group: "minimax_en", config: { voiceId: "Chinese (Mandarin)_Radio_Host", speed: 1.2, vol: 0.5, pitch: 0, emotion: "neutral" } },
        "Hanser-EN": { name: "Hanser-EN", group: "minimax_en", config: { voiceId: "Chinese (Mandarin)_Crisp_Girl", speed: 1.35, vol: 1, pitch: 0, emotion: "neutral" } },

        // Chinese - MiniMax
        "Hanser": { name: "Hanser", group: "minimax_zh", config: { voiceId: "Chinese (Mandarin)_Crisp_Girl", speed: 1.35, vol: 1, pitch: 0, emotion: "neutral" } },
        "CN-Captain-Young": { name: "CN-Captain-Young", group: "minimax_zh", config: { voiceId: "Chinese (Mandarin)_Radio_Host", speed: 1.2, vol: 0.5, pitch: 0, emotion: "neutral" } },
        "CN-Captain-Middle-Aged": { name: "CN-Captain-Middle-Aged", group: "minimax_zh", config: { voiceId: "Chinese (Mandarin)_Reliable_Executive", speed: 1.2, vol: 0.5, pitch: -1, emotion: "neutral" } },

        // English - ElevenLabs
        "Aaron": { name: "Aaron", group: "elevenlabs_en", config: { voiceId: "eAAUCMkBhe6SAIBSsIUN", stability: 0.5, similarity_boost: 0.75, use_speaker_boost: false, style: 0.75, textPrompt: "[understated][professional][monotone][quietly]" } },
        "Yeager": { name: "Yeager", group: "elevenlabs_en", config: { voiceId: "G52gexP68W6oFZYn60ew", stability: 0.5, similarity_boost: 0.75, use_speaker_boost: false, style: 0.75, textPrompt: "[fast][understated][professional][monotone][quietly]" } },
        "KJFK-Male-ATC": { name: "KJFK-Male-ATC", group: "elevenlabs_en", config: { voiceId: "9NxA4p7VLrObJCLfsXnm", stability: 0.5, similarity_boost: 0.75, use_speaker_boost: false, style: 0.75, textPrompt: "[understated][professional][monotone][quietly]" } }
    }
};

// 展开为运行时数组 (兼容现有代码)
const VOICE_PRESETS = Object.entries(VOICE_CONFIG.presets).map(([id, preset]) => {
    const group = VOICE_CONFIG.groups[preset.group] || {};
    return {
        id: id,
        name: preset.name,
        lang: group.lang,
        provider: group.provider,
        config: preset.config
    };
});
