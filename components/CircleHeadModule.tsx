import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LESSONS } from '../constants/lessons';
import { useVibe } from '../context/VibeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function CircleHeadModule() {
    const { mode } = useVibe();
    const isFaith = mode === 'faith';
    const progressAnim = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasTraced, setHasTraced] = useState(false);

    const lesson = LESSONS[currentIndex];
    const wordContext = isFaith ? lesson.faith : lesson.street;
    const accentColor = isFaith ? '#7851A9' : '#2E8B6E';
    const accentLight = isFaith ? '#F0EBF9' : '#E6F5F0';

    const startTracing = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setHasTraced(false);
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3000, // 慢速：3秒完成筆畫
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
        }).start(() => {
            setHasTraced(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        });
    };

    const handlePronounce = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsSpeaking(true);
        Speech.speak(wordContext.thai, {
            language: 'th-TH',
            rate: 0.8,
            onDone: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    const navigate = (direction: 'prev' | 'next') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Speech.stop();
        setIsSpeaking(false);
        setHasTraced(false);
        progressAnim.setValue(0);
        setCurrentIndex((prev) =>
            direction === 'next'
                ? (prev + 1) % LESSONS.length
                : (prev - 1 + LESSONS.length) % LESSONS.length
        );
    };

    return (
        <View style={styles.card}>
            {/* 課程進度列 */}
            <View style={styles.progressBar}>
                {LESSONS.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.progressSegment,
                            {
                                backgroundColor:
                                    i <= currentIndex ? accentColor : '#E0E0E0',
                            },
                        ]}
                    />
                ))}
            </View>

            {/* 標題區 */}
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.lessonCount}>
                        第 {currentIndex + 1} 課，共 {LESSONS.length} 課
                    </Text>
                    <View style={styles.letterNameRow}>
                        <Text style={styles.letterNameText}>{lesson.letterLabel} </Text>
                        <Text style={styles.letterNameChar}>{lesson.letter}</Text>
                    </View>
                </View>
                <View style={[styles.classBadge, { backgroundColor: accentLight }]}>
                    <Text style={[styles.classText, { color: accentColor }]}>
                        {lesson.letterClass}
                    </Text>
                </View>
            </View>

            {/* 字母大顯示 */}
            <Text style={[styles.letterPreview, { color: accentColor }]}>
                {lesson.letter}
            </Text>
            <Text style={styles.letterRomanName}>{lesson.id.replace(/-/g, ' ').toUpperCase()}</Text>

            {/* SVG 筆畫描繪區 */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={startTracing}
                style={[styles.svgContainer, { borderColor: accentColor + '30' }]}
            >
                <Svg height="140" width="140" viewBox="0 0 100 100">
                    <Path
                        d={lesson.svgPath}
                        fill="none"
                        stroke="#EBEBEB"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <AnimatedPath
                        d={lesson.svgPath}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={lesson.pathLength}
                        strokeDashoffset={progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [lesson.pathLength, 0],
                        })}
                    />
                    <Circle
                        cx={lesson.startPoint.cx}
                        cy={lesson.startPoint.cy}
                        r="5"
                        fill={accentColor}
                        opacity={0.9}
                    />
                </Svg>
                <Text style={[styles.tapPrompt, hasTraced && { color: accentColor }]}>
                    {hasTraced ? '✓ 太棒了！再試一次' : '👆 點擊開始筆畫描繪'}
                </Text>
            </TouchableOpacity>

            {/* 上/下一字導覽 */}
            <View style={styles.navRow}>
                <TouchableOpacity
                    onPress={() => navigate('prev')}
                    style={[styles.navBtn, { borderColor: accentColor + '50' }]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.navBtnText, { color: accentColor }]}>
                        ‹ 上一字
                    </Text>
                </TouchableOpacity>

                <View style={styles.dotRow}>
                    {LESSONS.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === currentIndex && {
                                    backgroundColor: accentColor,
                                    width: 16,
                                },
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => navigate('next')}
                    style={[styles.navBtn, { borderColor: accentColor + '50' }]}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.navBtnText, { color: accentColor }]}>
                        下一字 ›
                    </Text>
                </TouchableOpacity>
            </View>

            {/* 單詞卡 */}
            <View
                style={[
                    styles.vocabularyCard,
                    { borderColor: accentColor + '35', backgroundColor: accentLight },
                ]}
            >
                <View style={styles.vocabHeader}>
                    <View style={styles.vocabMain}>
                        <Text style={styles.vocabWord}>{wordContext.thai}</Text>
                        <Text style={styles.vocabPhonetic}>[{wordContext.phonetic}]</Text>
                    </View>
                    <TouchableOpacity
                        onPress={handlePronounce}
                        style={[
                            styles.pronounceBtn,
                            { backgroundColor: accentColor, opacity: isSpeaking ? 0.7 : 1 },
                        ]}
                        activeOpacity={0.75}
                    >
                        <Text style={styles.pronounceBtnText}>
                            {isSpeaking ? '⏹ 停止' : '🔊 發音'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.divider, { backgroundColor: accentColor + '25' }]} />

                <Text style={styles.vocabZhTW}>{wordContext.zhTW}</Text>
                <Text style={styles.vocabNote}>📝 {wordContext.note}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 22,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
        width: '100%',
    },
    progressBar: {
        flexDirection: 'row',
        width: '100%',
        gap: 4,
        marginBottom: 16,
    },
    progressSegment: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: '100%',
        marginBottom: 4,
    },
    lessonCount: {
        fontFamily: 'Kanit',
        fontSize: 17,
        color: '#AAA',
        letterSpacing: 0.5,
    },
    letterNameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 2,
    },
    letterNameText: {
        fontFamily: 'Kanit_600SemiBold',
        fontSize: 19,
        color: '#333',
    },
    letterNameChar: {
        fontFamily: 'Kanit_600SemiBold',
        fontSize: 24,
        color: '#333',
    },
    letterRomanName: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: '#CCC',
        letterSpacing: 2,
        marginTop: -8,
        marginBottom: 8,
    },
    classBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    classText: {
        fontFamily: 'Kanit',
        fontSize: 17,
        fontWeight: '600',
    },
    letterPreview: {
        fontFamily: 'Kanit_600SemiBold',
        fontSize: 84,
        marginVertical: 4,
    },
    svgContainer: {
        alignItems: 'center',
        marginVertical: 12,
        borderWidth: 1.5,
        borderRadius: 20,
        padding: 12,
        backgroundColor: '#FAFAFA',
    },
    tapPrompt: {
        fontFamily: 'Kanit',
        fontSize: 17,
        color: '#BBB',
        marginTop: 6,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 14,
    },
    navBtn: {
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    navBtnText: {
        fontFamily: 'Kanit',
        fontSize: 18,
        fontWeight: '600',
    },
    dotRow: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#DDD',
    },
    vocabularyCard: {
        width: '100%',
        padding: 18,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    vocabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    vocabMain: {
        flex: 1,
    },
    vocabWord: {
        fontFamily: 'Prompt_700Bold',
        fontSize: 40,
        color: '#222',
        lineHeight: 44,
    },
    vocabPhonetic: {
        fontFamily: 'Kanit',
        fontSize: 19,
        color: '#888',
        letterSpacing: 0.5,
    },
    pronounceBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        marginLeft: 12,
    },
    pronounceBtnText: {
        fontFamily: 'Kanit_600SemiBold',
        fontSize: 19,
        color: '#FFF',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 12,
    },
    vocabZhTW: {
        fontFamily: 'Prompt_500Medium',
        fontSize: 26,
        color: '#333',
        marginBottom: 8,
    },
    vocabNote: {
        fontFamily: 'Kanit',
        fontSize: 17,
        color: '#777',
        lineHeight: 20,
    },
});
