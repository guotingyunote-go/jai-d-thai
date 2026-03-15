import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LESSONS } from '../constants/lessons';
import { useVibe } from '../context/VibeContext';

export default function CharacterLabWidget() {
    const { mode, fontType } = useVibe() as any;
    const [index, setIndex] = useState(0);
    const [isLoopless, setIsLoopless] = useState(false);
    const [activeTab, setActiveTab] = useState<'card' | 'guide'>('card');

    const isFaith = mode === 'faith';
    const accentColor = isFaith ? '#7851A9' : '#14B886';
    const currentLesson = LESSONS[index % LESSONS.length];
    
    // 根據 Toggle 決定主顯示字體
    const thaiFont = isLoopless ? 'Kanit_600SemiBold' : 'Sarabun_700Bold';

    const playSound = async (text: string) => {
        try {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) { }
            let voiceId = undefined;
            const voices = await Speech.getAvailableVoicesAsync();
            const thaiVoices = voices.filter(v => v.language.toLowerCase().startsWith('th'));
            if (thaiVoices.length > 0) {
                let bestVoice = thaiVoices.find(v => v.quality === 'Enhanced' && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('kanya')));
                if (!bestVoice) bestVoice = thaiVoices[0];
                voiceId = bestVoice?.identifier;
            }
            Speech.speak(text, { language: 'th-TH', rate: 0.8, voice: voiceId });
        } catch (err) { }
    };

    const nextChar = () => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) { }
        setIndex(prev => (prev + 1) % LESSONS.length);
    };

    const prevChar = () => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) { }
        setIndex(prev => (prev - 1 + LESSONS.length) % LESSONS.length);
    };

    const renderGuide = () => (
        <ScrollView style={styles.guideContainer} showsVerticalScrollIndicator={false}>
            {/* 恢復原有的三個說明區塊 */}
            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>1. 泰文字母系統組成 🧩</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.bold}>輔音 (44個)</Text>：決定聲調走向的關鍵。{'\n'}
                    • <Text style={styles.highlight}>中輔音 (9個)</Text>：聲調最規整，如 ก, จ, ด, ต, บ, ป, อ。{'\n'}
                    • <Text style={styles.highlight}>高輔音 (11個)</Text>：多為送氣音，如 ข, ฉ, ฐ, ถ, ผ, ฝ, ศ, ษ, ส, ห。{'\n'}
                    • <Text style={styles.highlight}>低輔音 (24個)</Text>：包含所有鼻音與半元音。
                </Text>
                <Text style={[styles.guideText, { marginTop: 8 }]}>
                    <Text style={styles.bold}>元音 (32個)</Text>：寫在輔音的上下左右，分長短音。{'\n'}
                    <Text style={styles.bold}>聲調 (5個調)</Text>：只有 4 個符號（ ่　 ้　 ๊　 ๋ ）；中平調沒有符號。
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>2. 聲調與拼讀步驟 🪜</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.step}>第一步</Text>：記住輔音類別 (中/高/低)，這決定了初始聲調。{'\n'}
                    <Text style={styles.step}>第二步</Text>：辨識元音長短與尾音性質。{'\n'}
                    <Text style={styles.step}>第三步</Text>：綜合判定。例如：「狗」หมา = 高輔音 ห 前導 + 低輔音 ม + 長元音 า → 第五聲。
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>3. 書寫與發音的落差 ⚠️</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.bold}>省略子音</Text>：如 ครับ (Krap)，口語常省略 r 音唸成 Kap。{'\n'}
                    <Text style={styles.bold}>前導字元</Text>：前導 <Text style={styles.highlight}>ห</Text> 出現在低輔音前方時不發音，但會改變該音節的聲調規則！
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>✍️ 書寫核心規則 (新增)</Text>
                <Text style={styles.guideText}>
                    • <Text style={styles.bold}>圓圈下筆</Text>：泰文通常由小圓圈（頭）開始，一筆完成。{'\n'}
                    • <Text style={styles.bold}>無頭例外</Text>：如 ก 或 ธ 則從底部起筆。
                </Text>
            </View>
        </ScrollView>
    );

    const renderCard = () => (
        <View style={styles.cardWrapper}>
            <View style={styles.mainCard}>
                {/* 頂部字母展示區：包含左側字體預覽說明 */}
                <View style={[styles.charSection, { backgroundColor: accentColor + '05' }]}>
                    <View style={styles.fontPreviewSide}>
                        <Text style={styles.sectionLabel}>字體樣式</Text>
                        <View style={styles.previewBox}>
                            <Text style={[styles.previewChar, { fontFamily: 'Sarabun_700Bold' }]}>{currentLesson.letter}</Text>
                            <Text style={styles.previewLabel}>Headed</Text>
                        </View>
                        <View style={styles.previewBox}>
                            <Text style={[styles.previewChar, { fontFamily: 'Kanit_600SemiBold' }]}>{currentLesson.letter}</Text>
                            <Text style={styles.previewLabel}>Loopless</Text>
                        </View>
                        
                        <View style={styles.toggleInCard}>
                            <Switch
                                value={isLoopless}
                                onValueChange={setIsLoopless}
                                trackColor={{ false: '#DDD', true: accentColor + '60' }}
                                thumbColor={isLoopless ? accentColor : '#FFF'}
                                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                            />
                            <Text style={styles.toggleHint}>{isLoopless ? '切換有頭' : '切換無頭'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => playSound(currentLesson.letter)} style={styles.letterBox}>
                        <Text style={[styles.bigChar, { color: accentColor, fontFamily: thaiFont }]}>
                            {currentLesson.letter}
                        </Text>
                        <Text style={styles.pronounceHint}>🔊 {currentLesson.nameThai.split(' ')[0]}</Text>
                    </TouchableOpacity>
                </View>

                {/* 底部範例單字區 */}
                <View style={styles.examplesSection}>
                    <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>單字範例應用 💡</Text>
                    <View style={styles.exampleRow}>
                        <TouchableOpacity style={[styles.exampleItem, { borderLeftColor: '#14B886' }]} onPress={() => playSound(currentLesson.street.thai)}>
                            <Text style={styles.exampleTag}>生活模式 (Street)</Text>
                            <Text style={[styles.exampleThai, { color: '#14B886' }]}>{currentLesson.street.thai}</Text>
                            <Text style={styles.examplePhonetic}>{currentLesson.street.phonetic}</Text>
                            <Text style={styles.exampleZh}>{currentLesson.street.zhTW}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.exampleItem, { borderLeftColor: '#7851A9' }]} onPress={() => playSound(currentLesson.faith.thai)}>
                            <Text style={styles.exampleTag}>信仰模式 (Faith)</Text>
                            <Text style={[styles.exampleThai, { color: '#7851A9' }]}>{currentLesson.faith.thai}</Text>
                            <Text style={styles.examplePhonetic}>{currentLesson.faith.phonetic}</Text>
                            <Text style={styles.exampleZh}>{currentLesson.faith.zhTW}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 切換控制 */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.navBtn} onPress={prevChar}>
                    <Text style={styles.navBtnText}>上一個</Text>
                </TouchableOpacity>
                <View style={styles.progressCounter}>
                    <Text style={[styles.progressText, { color: accentColor }]}>{index + 1} / {LESSONS.length}</Text>
                    <Text style={styles.classLabel}>{currentLesson.letterClass}</Text>
                </View>
                <TouchableOpacity style={[styles.navBtn, { backgroundColor: accentColor }]} onPress={nextChar}>
                    <Text style={[styles.navBtnText, { color: '#FFF' }]}>下一個</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: accentColor }]}>Character Lab 🖊️</Text>
                <Text style={styles.headerSubtitle}>泰語輔音與書寫核心</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'card' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('card')}
                >
                    <Text style={[styles.tabText, activeTab === 'card' ? { color: '#FFF' } : { color: '#AAA' }]}>字母卡</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'guide' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('guide')}
                >
                    <Text style={[styles.tabText, activeTab === 'guide' ? { color: '#FFF' } : { color: '#AAA' }]}>讀寫指南</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'card' ? renderCard() : renderGuide()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 32 },
    header: { marginBottom: 16 },
    title: { fontFamily: 'Prompt_700Bold', fontSize: 28 },
    headerSubtitle: { fontFamily: 'Kanit', fontSize: 17, color: '#AAA' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#F5F5F7', borderRadius: 16, padding: 5, marginBottom: 20 },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    tabText: { fontFamily: 'Kanit_600SemiBold', fontSize: 18, fontWeight: 'bold' },
    
    cardWrapper: { width: '100%' },
    mainCard: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 5 },
    
    charSection: { flexDirection: 'row', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    
    // 左側說明區 (恢復並優化)
    fontPreviewSide: { width: 80, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#F0F0F0', marginRight: 15 },
    previewBox: { alignItems: 'center', marginBottom: 12 },
    previewChar: { fontSize: 28, color: '#999' },
    previewLabel: { fontSize: 14, color: '#CCC', fontFamily: 'Kanit' },
    toggleInCard: { alignItems: 'center', marginTop: 5 },
    toggleHint: { fontSize: 14, color: '#AAA', fontFamily: 'Kanit', marginTop: -4 },

    letterBox: { flex: 1, alignItems: 'center' },
    bigChar: { fontSize: 84, marginBottom: 4 },
    pronounceHint: { fontFamily: 'Kanit', fontSize: 18, color: '#666' },
    sectionLabel: { fontFamily: 'Prompt_700Bold', fontSize: 14, color: '#BBB', textTransform: 'uppercase', marginBottom: 5 },
    
    examplesSection: { padding: 20 },
    exampleRow: { flexDirection: 'row', gap: 10 },
    exampleItem: { flex: 1, padding: 12, backgroundColor: '#F9F9F9', borderRadius: 16, borderLeftWidth: 4 },
    exampleTag: { fontFamily: 'Kanit', fontSize: 15, color: '#AAA', marginBottom: 4 },
    exampleThai: { fontFamily: 'Sarabun_700Bold', fontSize: 22, marginBottom: 2 },
    examplePhonetic: { fontFamily: 'Kanit', fontSize: 16, color: '#888' },
    exampleZh: { fontFamily: 'Prompt_500Medium', fontSize: 17, color: '#555' },
    
    controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 4 },
    navBtn: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#F0F0F0', borderRadius: 14 },
    navBtnText: { fontFamily: 'Kanit_600SemiBold', fontSize: 18, color: '#555', fontWeight: 'bold' },
    progressCounter: { alignItems: 'center' },
    progressText: { fontFamily: 'Prompt_700Bold', fontSize: 22 },
    classLabel: { fontFamily: 'Kanit', fontSize: 14, color: '#BBB' },

    guideContainer: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, maxHeight: 500 },
    guideCard: { backgroundColor: '#F9F9FB', padding: 20, borderRadius: 18, marginBottom: 16 },
    guideTitle: { fontFamily: 'Prompt_700Bold', fontSize: 20, color: '#333', marginBottom: 12, lineHeight: 28 },
    guideText: { fontFamily: 'Kanit', fontSize: 17, color: '#666', lineHeight: 28 },
    bold: { fontWeight: '700', color: '#111' },
    highlight: { color: '#000', backgroundColor: '#FFEBB5', paddingHorizontal: 4, fontWeight: '600' },
    step: { fontWeight: '700', color: '#FFF', backgroundColor: '#999', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontSize: 16, marginRight: 5 }
});
