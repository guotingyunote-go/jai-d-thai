import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LESSONS } from '../constants/lessons';
import { useVibe } from '../context/VibeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function CharacterLabWidget() {
    const { mode, fontType } = useVibe() as any;
    const [index, setIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'card' | 'guide'>('card');

    const isFaith = mode === 'faith';
    const accentColor = isFaith ? '#7851A9' : '#14B886';
    const currentLesson = LESSONS[index % LESSONS.length];
    const thaiFont = fontType === 'headed' ? 'Sarabun_700Bold' : 'Kanit_600SemiBold';

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
            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>✍️ 泰文書寫核心規則</Text>
                <Text style={styles.guideText}>
                    • <Text style={styles.bold}>從「圓圈」開始</Text>：絕大多數泰文字母都有一個小圓圈（頭），書寫時必須先從圓圈下筆，順時針或逆時針繞行。{'\n'}
                    • <Text style={styles.bold}>一筆畫完成</Text>：泰文字母設計上通常是一筆到底，中間不抬筆。{'\n'}
                    • <Text style={styles.bold}>無頭字母例外</Text>：少數字母（如 ก 和 ธ）沒有圓圈，則從左下角或底部開始書寫。
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>🧩 字母組合邏輯</Text>
                <Text style={styles.guideText}>
                    泰文字母不是由左至右單純排列，而是以<Text style={styles.highlight}>輔音</Text>為核心，元音（母音）會出現在輔音的<Text style={styles.bold}>上下左右</Text>。{'\n'}
                    書寫順序通常是：前加元音 → 輔音 → 上/下元音 → 尾音。
                </Text>
            </View>
        </ScrollView>
    );

    const renderCard = () => (
        <View style={styles.cardWrapper}>
            <View style={styles.mainCard}>
                {/* 頂部字母展示區 */}
                <View style={[styles.charSection, { backgroundColor: accentColor + '05' }]}>
                    <TouchableOpacity onPress={() => playSound(currentLesson.nameThai)} style={styles.letterBox}>
                        <Text style={[styles.bigChar, { color: accentColor, fontFamily: thaiFont }]}>
                            {currentLesson.letter}
                        </Text>
                        <Text style={styles.pronounceHint}>🔊 {currentLesson.letterLabel}</Text>
                    </TouchableOpacity>

                    {/* 書寫方向示意圖 (SVG) */}
                    <View style={styles.directionSection}>
                        <Text style={styles.sectionLabel}>書寫方向指南 🧭</Text>
                        <View style={styles.svgContainer}>
                            <Svg height="100" width="100" viewBox="0 0 100 100">
                                {/* 底色路徑 */}
                                <Path
                                    d={currentLesson.svgPath}
                                    fill="none"
                                    stroke="#EEE"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                />
                                {/* 主要路徑 */}
                                <Path
                                    d={currentLesson.svgPath}
                                    fill="none"
                                    stroke={accentColor}
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    opacity={0.8}
                                />
                                {/* 起點標示 */}
                                <Circle
                                    cx={currentLesson.startPoint.cx}
                                    cy={currentLesson.startPoint.cy}
                                    r="5"
                                    fill="#FF6B6B"
                                />
                                <Circle
                                    cx={currentLesson.startPoint.cx}
                                    cy={currentLesson.startPoint.cy}
                                    r="8"
                                    fill="#FF6B6B"
                                    opacity={0.3}
                                />
                            </Svg>
                            <Text style={styles.startHint}>🔴 為起點</Text>
                        </View>
                    </View>
                </View>

                {/* 底部範例單字區 */}
                <View style={styles.examplesSection}>
                    <Text style={[styles.sectionLabel, { marginBottom: 12 }]}>單字範例應用 💡</Text>
                    <View style={styles.exampleRow}>
                        <View style={[styles.exampleItem, { borderLeftColor: '#14B886' }]}>
                            <Text style={styles.exampleTag}>生活模式</Text>
                            <Text style={styles.exampleThai}>{currentLesson.street.thai}</Text>
                            <Text style={styles.examplePhonetic}>{currentLesson.street.phonetic}</Text>
                            <Text style={styles.exampleZh}>{currentLesson.street.zhTW}</Text>
                        </View>
                        <View style={[styles.exampleItem, { borderLeftColor: '#7851A9' }]}>
                            <Text style={styles.exampleTag}>信仰模式</Text>
                            <Text style={styles.exampleThai}>{currentLesson.faith.thai}</Text>
                            <Text style={styles.examplePhonetic}>{currentLesson.faith.phonetic}</Text>
                            <Text style={styles.exampleZh}>{currentLesson.faith.zhTW}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* 切換控制 */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.navBtn} onPress={prevChar}>
                    <Text style={styles.navBtnText}>上一個</Text>
                </TouchableOpacity>
                <View style={styles.progressCounter}>
                    <Text style={[styles.progressText, { color: accentColor }]}>
                        {index + 1} / {LESSONS.length}
                    </Text>
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
                <Text style={styles.headerSubtitle}>掌握泰語 44 個輔音根基</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'card' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('card')}
                >
                    <Text style={[styles.tabText, activeTab === 'card' ? { color: '#FFF' } : { color: '#AAA' }]}>單字卡</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'guide' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('guide')}
                >
                    <Text style={[styles.tabText, activeTab === 'guide' ? { color: '#FFF' } : { color: '#AAA' }]}>書寫規則</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'card' ? renderCard() : renderGuide()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 32 },
    header: { marginBottom: 16 },
    title: { fontFamily: 'Prompt_700Bold', fontSize: 24, marginBottom: 4 },
    headerSubtitle: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA' },
    tabContainer: { 
        flexDirection: 'row', 
        backgroundColor: '#F5F5F7', 
        borderRadius: 16, 
        padding: 5, 
        marginBottom: 20 
    },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
    tabText: { fontFamily: 'Kanit_600SemiBold', fontSize: 15 },
    
    // Card Styles
    cardWrapper: { width: '100%' },
    mainCard: { 
        backgroundColor: '#FFF', 
        borderRadius: 24, 
        overflow: 'hidden',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 10 }, 
        shadowOpacity: 0.08, 
        shadowRadius: 20, 
        elevation: 5 
    },
    charSection: { 
        flexDirection: 'row', 
        padding: 24, 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0'
    },
    letterBox: { flex: 1, alignItems: 'center' },
    bigChar: { fontSize: 80, marginBottom: 8 },
    pronounceHint: { fontFamily: 'Kanit', fontSize: 16, color: '#666' },
    
    directionSection: { flex: 1, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#F0F0F0', paddingLeft: 20 },
    sectionLabel: { fontFamily: 'Prompt_700Bold', fontSize: 13, color: '#BBB', textTransform: 'uppercase', letterSpacing: 1 },
    svgContainer: { marginTop: 15, alignItems: 'center' },
    startHint: { fontFamily: 'Kanit', fontSize: 11, color: '#FF6B6B', marginTop: 8, fontWeight: '700' },
    
    examplesSection: { padding: 24 },
    exampleRow: { flexDirection: 'row', gap: 12 },
    exampleItem: { flex: 1, padding: 12, backgroundColor: '#F9F9F9', borderRadius: 16, borderLeftWidth: 4 },
    exampleTag: { fontFamily: 'Kanit', fontSize: 10, color: '#AAA', marginBottom: 4 },
    exampleThai: { fontFamily: 'Prompt_700Bold', fontSize: 18, color: '#333' },
    examplePhonetic: { fontFamily: 'Kanit', fontSize: 12, color: '#888' },
    exampleZh: { fontFamily: 'Prompt_500Medium', fontSize: 13, color: '#555', marginTop: 2 },
    
    controls: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginTop: 20,
        paddingHorizontal: 4
    },
    navBtn: { 
        paddingHorizontal: 20, 
        paddingVertical: 12, 
        backgroundColor: '#F0F0F0', 
        borderRadius: 14 
    },
    navBtnText: { fontFamily: 'Kanit_600SemiBold', fontSize: 15, color: '#555' },
    progressCounter: { alignItems: 'center' },
    progressText: { fontFamily: 'Prompt_700Bold', fontSize: 18 },
    classLabel: { fontFamily: 'Kanit', fontSize: 12, color: '#BBB' },

    // Guide Styles
    guideContainer: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, maxHeight: 500 },
    guideCard: { backgroundColor: '#F9F9FB', padding: 20, borderRadius: 18, marginBottom: 16 },
    guideTitle: { fontFamily: 'Prompt_700Bold', fontSize: 18, color: '#333', marginBottom: 12 },
    guideText: { fontFamily: 'Kanit', fontSize: 15, color: '#666', lineHeight: 26 },
    bold: { fontWeight: '700', color: '#111' },
    highlight: { color: '#000', backgroundColor: '#FFEBB5', paddingHorizontal: 4, fontWeight: '600' }
});
