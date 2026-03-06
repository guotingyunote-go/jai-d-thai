import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LESSONS } from '../constants/lessons';
import { useVibe } from '../context/VibeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function CharacterLabWidget() {
    const { mode } = useVibe();
    const [index, setIndex] = useState(0);
    const [isLoopless, setIsLoopless] = useState(false);
    const [activeTab, setActiveTab] = useState<'tracing' | 'guide'>('guide');
    const progress = useRef(new Animated.Value(0)).current;
    const emojiOpacity = useRef(new Animated.Value(1)).current;

    const isFaith = mode === 'faith';
    const accentColor = isFaith ? '#7851A9' : '#14B886';
    const currentLesson = LESSONS[index % LESSONS.length];

    useEffect(() => {
        if (activeTab === 'tracing') {
            startTracing();
        }
    }, [index, activeTab]);

    const startTracing = () => {
        progress.setValue(0);
        emojiOpacity.setValue(1);

        Animated.sequence([
            // 停頓一下讓使用者先看到 emoji
            Animated.delay(300),
            // Emoji 淡出，同時筆畫開始畫
            Animated.parallel([
                Animated.timing(emojiOpacity, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(progress, {
                    toValue: 1,
                    duration: 2500,
                    easing: Easing.bezier(0.4, 0, 0.2, 1),
                    useNativeDriver: true,
                })
            ])
        ]).start();
    };

    const nextChar = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIndex(prev => prev + 1);
    };

    const renderGuide = () => (
        <ScrollView style={styles.guideContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>1. 泰文字母系統組成 🧩</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.bold}>輔音 (44個)</Text>：決定聲調走向的關鍵。{'\n'}
                    • <Text style={styles.highlight}>中輔音 (9個)</Text>：聲調規則最規整，如 ก, จ, ด, ต, บ, ป, อ。建議從這裡起步！{'\n'}
                    • <Text style={styles.highlight}>高輔音 (11個)</Text>：多為送氣音，如 ข, ฉ, ฐ, ถ, ผ, ฝ, ศ, ษ, ส, ห。{'\n'}
                    • <Text style={styles.highlight}>低輔音 (24個)</Text>：包含所有鼻音與半元音。
                </Text>
                <Text style={[styles.guideText, { marginTop: 8 }]}>
                    <Text style={styles.bold}>元音 (32個)</Text>：寫在輔音的上下左右，分長短音。{'\n'}
                    <Text style={styles.bold}>聲調 (5個調)</Text>：只有 4 個符號 (่, ้, ๊, ๋)；中平調沒有符號。
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>2. 聲調與拼讀步驟 🪜</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.step}>第一步</Text>：記住輔音字母與它的<Text style={styles.highlight}>類別(中/高/低)</Text>，這決定了單字的聲調。{'\n'}
                    <Text style={styles.step}>第二步</Text>：分辨元音長短與尾音（死音/活音）。「輔音類別 + 元音長短 + 尾音」決定最終聲調。{'\n'}
                    <Text style={styles.step}>第三步</Text>：實戰分析。例如：「狗」หมา (高輔音 ห + 低輔音 ม + 長元音 า) → 第五聲。
                </Text>
            </View>

            <View style={[styles.guideCard, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
                <Text style={styles.guideTitle}>3. 書寫與發音的落差 ⚠️</Text>
                <Text style={styles.guideText}>
                    <Text style={styles.bold}>省略子音</Text>：男生語助詞 <Text style={styles.highlight}>ครับ (Krap)</Text>，口語常省略 r 音唸成 <Text style={styles.highlight}>Kap</Text>。{'\n'}
                    <Text style={styles.bold}>前導字元不發音</Text>：例如前導 <Text style={styles.highlight}>ห</Text> 出現在低輔音前方時不發音（如 หมา），但會把該音節的聲調規則「拔高」成高輔音規則！
                </Text>
            </View>
        </ScrollView>
    );

    const renderTracing = () => (
        <View>
            <View style={styles.canvasContainer}>
                <View style={styles.fontPreviewBox}>
                    <Text style={[
                        styles.charDisplay,
                        { color: accentColor + '20' },
                        { fontFamily: isLoopless ? 'Kanit' : 'Sarabun' }
                    ]}>
                        {currentLesson.letter}
                    </Text>
                    <Text style={styles.fontNameHint}>
                        {isLoopless ? 'Loopless (Kanit)' : 'Headed (Sarabun)'}
                    </Text>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={startTracing} style={styles.svgOverlay}>
                    {/* 背景 emoji -- 將淡出 */}
                    <Animated.Text style={[styles.bgEmoji, { opacity: emojiOpacity }]}>
                        {currentLesson.emoji}
                    </Animated.Text>

                    {/* SVG 字母本身 */}
                    <Svg height="140" width="140" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
                        <Path
                            d={currentLesson.svgPath}
                            fill="none"
                            stroke="#F0F0F0"
                            strokeWidth="8"
                            strokeLinecap="round"
                        />
                        <AnimatedPath
                            d={currentLesson.svgPath}
                            fill="none"
                            stroke={accentColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={currentLesson.pathLength}
                            strokeDashoffset={progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [currentLesson.pathLength, 0]
                            })}
                        />
                        <Circle
                            cx={currentLesson.startPoint.cx}
                            cy={currentLesson.startPoint.cy}
                            r="5"
                            fill={accentColor}
                        />
                    </Svg>
                    <Text style={styles.tapToReplay}>點擊重新描寫</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: accentColor + '15' }]} onPress={nextChar}>
                <Text style={[styles.nextText, { color: accentColor }]}>下一個字母 ({index + 1}/44) →</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: accentColor }]}>Character Lab 🖊️</Text>
                {activeTab === 'tracing' && (
                    <View style={styles.toggleRow}>
                        <Text style={[styles.toggleLabel, !isLoopless && { color: accentColor }]}>有頭</Text>
                        <Switch
                            value={isLoopless}
                            onValueChange={setIsLoopless}
                            trackColor={{ false: '#DDD', true: accentColor + '60' }}
                            thumbColor={isLoopless ? accentColor : '#FFF'}
                            ios_backgroundColor="#EEE"
                            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                        />
                        <Text style={[styles.toggleLabel, isLoopless && { color: accentColor }]}>無頭</Text>
                    </View>
                )}
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'guide' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('guide')}
                >
                    <Text style={[styles.tabText, activeTab === 'guide' ? { color: '#FFF' } : { color: '#AAA' }]}>讀寫指南</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'tracing' ? { backgroundColor: accentColor } : {}]}
                    onPress={() => setActiveTab('tracing')}
                >
                    <Text style={[styles.tabText, activeTab === 'tracing' ? { color: '#FFF' } : { color: '#AAA' }]}>描寫練習</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'guide' ? renderGuide() : renderTracing()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 32 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontFamily: 'Prompt_700Bold', fontSize: 18 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 4, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
    tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    tabText: { fontFamily: 'Kanit_600SemiBold', fontSize: 14 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    toggleLabel: { fontFamily: 'Kanit', fontSize: 12, color: '#AAA' },
    canvasContainer: {
        height: 200,
        backgroundColor: '#FFF',
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    fontPreviewBox: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#F0F0F0' },
    charDisplay: { fontSize: 72 },
    fontNameHint: { fontFamily: 'Kanit', fontSize: 10, color: '#CCC', marginTop: 8 },
    svgOverlay: { flex: 1.5, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    bgEmoji: { position: 'absolute', fontSize: 100 },
    tapToReplay: { fontFamily: 'Kanit', fontSize: 11, color: '#DDD', marginTop: 140 },
    nextBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
    nextText: { fontFamily: 'Kanit_600SemiBold', fontSize: 14 },

    // Guide Styles
    guideContainer: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, maxHeight: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    guideCard: { backgroundColor: '#F9F9F9', padding: 16, borderRadius: 12, marginBottom: 16 },
    guideTitle: { fontFamily: 'Prompt_700Bold', fontSize: 15, color: '#333', marginBottom: 8 },
    guideText: { fontFamily: 'Kanit', fontSize: 14, color: '#555', lineHeight: 22 },
    bold: { fontWeight: '700', color: '#111' },
    highlight: { color: '#000', backgroundColor: '#FFEBB5', fontWeight: '600' },
    step: { fontWeight: '700', color: '#FFF', backgroundColor: '#999', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontSize: 12 }
});
