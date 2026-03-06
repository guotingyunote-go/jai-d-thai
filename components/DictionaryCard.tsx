import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { DictionaryEntry } from '../constants/Dictionary';
import { useVibe } from '../context/VibeContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
    entry: DictionaryEntry;
    accentColor: string;
    accentLight: string;
}

export default function DictionaryCard({ entry, accentColor, accentLight }: Props) {
    const { userGender, fontType } = useVibe() as any;
    const thaiFont = fontType === 'headed' ? 'Sarabun_700Bold' : 'Kanit_600SemiBold';
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const toneProgress = useRef(new Animated.Value(0)).current;
    const toneOpacity = useRef(new Animated.Value(0)).current;

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // 簡單判斷聲調 (平、低、降、高、升)，如果不確定就用預設的平調
    const getTonePath = () => {
        // [x1, y1] to [x2, y2] ... y 越小越高
        const p = entry.phonetic.toLowerCase();
        if (p.includes('â') || p.includes('ô') || p.includes('ê') || p.includes('û') || p.includes('î')) return 'M 5,5 L 35,35'; // 降調 (ˋ) ↘
        if (p.includes('á') || p.includes('ó') || p.includes('é') || p.includes('ú') || p.includes('í')) return 'M 5,20 L 35,5';  // 高調 (´) ↗
        if (p.includes('ǎ') || p.includes('ǒ') || p.includes('ě') || p.includes('ǔ') || p.includes('ǐ')) return 'M 5,20 L 20,35 L 35,5'; // 升調 (ˇ) ↘↗
        if (p.includes('à') || p.includes('ò') || p.includes('è') || p.includes('ù') || p.includes('ì')) return 'M 5,30 L 35,35'; // 低調 ↘_
        return 'M 5,20 L 35,20'; // 平調 →
    };

    const tonePath = getTonePath();

    const springTo = (toValue: number) => {
        Animated.spring(scaleAnim, {
            toValue,
            friction: 4,
            tension: 160,
            useNativeDriver: true,
        }).start();
    };

    const handleCardPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded((v) => !v);
    };

    const speak = async () => {
        try {
            if (isSpeaking) {
                Speech.stop();
                setIsSpeaking(false);
                return;
            }

            // Haptics is safe to fail
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (hapticsError) {
                // Ignore haptics errors on unsupported platforms
            }

            setIsSpeaking(true);

            // 觸發聲調動畫
            toneProgress.setValue(0);
            toneOpacity.setValue(1);
            Animated.timing(toneProgress, {
                toValue: 1,
                // 設定一秒，大概是一個字發音的時間
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();

            // Fetch voices but don't let it crash the function
            let voiceIdentifier = undefined;
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                const thaiVoices = voices.filter(v => v.language.toLowerCase().startsWith('th'));

                if (thaiVoices.length > 0) {
                    // 1. 嘗試找性別匹配的聲音 (iOS: Narat 是男, Kanya 是女)
                    let genderVoice = thaiVoices.find(v => {
                        const name = v.name.toLowerCase();
                        if (userGender === 'male') {
                            return name.includes('male') || name.includes('narat') || name.includes('man');
                        } else {
                            return name.includes('female') || name.includes('kanya') || name.includes('woman');
                        }
                    });

                    // 2. 如果找不到性別配對，找品質最好的 Thai 聲音
                    if (!genderVoice) {
                        genderVoice = thaiVoices.find(v => v.quality === 'Enhanced') || thaiVoices[0];
                    }

                    voiceIdentifier = genderVoice?.identifier;
                }
            } catch (voiceError) {
                console.warn('Speech voices failed', voiceError);
            }

            Speech.speak(entry.thai, {
                language: 'th-TH',
                rate: 0.82,
                voice: voiceIdentifier,
                onDone: () => {
                    setIsSpeaking(false);
                    // 語音結束後淡出聲調線條
                    Animated.timing(toneOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                },
                onError: (err) => {
                    console.error('Speech.speak error:', err);
                    setIsSpeaking(false);
                    Animated.timing(toneOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
                },
            });
        } catch (globalError) {
            console.error('Speak function failed:', globalError);
            setIsSpeaking(false);
            Animated.timing(toneOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={() => springTo(0.97)}
            onPressOut={() => springTo(1)}
            onPress={handleCardPress}
        >
            <Animated.View
                style={[
                    styles.card,
                    { borderLeftColor: accentColor, transform: [{ scale: scaleAnim }] },
                ]}
            >
                <View style={styles.mainRow}>
                    <View style={styles.thaiBlock}>
                        <Text style={[styles.thaiWord, { color: accentColor, fontFamily: thaiFont }]}>
                            {entry.thai}
                        </Text>
                        <Text style={styles.phonetic}>[{entry.phonetic}]</Text>
                    </View>

                    <View style={styles.meaningBlock}>
                        <Text style={styles.zhTW}>{entry.zhTW}</Text>
                        <View style={[styles.toneBadge, { backgroundColor: accentLight }]}>
                            <Text style={[styles.toneText, { color: accentColor }]}>
                                {entry.tone}
                            </Text>
                        </View>

                        {/* 聲調動畫畫布 */}
                        <Animated.View style={{ height: 40, width: 40, opacity: toneOpacity, position: 'absolute', right: -45, top: 0 }}>
                            <Svg height="40" width="40" viewBox="0 0 40 40">
                                <AnimatedPath
                                    d={tonePath}
                                    fill="none"
                                    stroke={accentColor}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={100}
                                    strokeDashoffset={toneProgress.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0]
                                    })}
                                />
                            </Svg>
                        </Animated.View>
                    </View>

                    <TouchableOpacity
                        onPress={speak}
                        activeOpacity={0.7}
                        style={[styles.audioBtn, isSpeaking && { backgroundColor: accentColor }]}
                    >
                        <Text style={[styles.audioIcon, isSpeaking && { color: '#FFF' }]}>
                            {isSpeaking ? '⏹' : '🔊'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {expanded && entry.note && (
                    <View style={[styles.noteBox, { borderTopColor: accentColor + '25' }]}>
                        <Text style={styles.noteText}>{entry.note}</Text>
                    </View>
                )}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderLeftWidth: 4,
        marginBottom: 16,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    mainRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    thaiBlock: { flex: 2 },
    thaiWord: { fontFamily: 'Kanit_600SemiBold', fontSize: 28, letterSpacing: 3, lineHeight: 42 },
    phonetic: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA', marginTop: 4 },
    meaningBlock: { flex: 2, alignItems: 'flex-start', gap: 6 },
    zhTW: { fontFamily: 'Prompt_500Medium', fontSize: 18, color: '#333' },
    toneBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    toneText: { fontFamily: 'Kanit', fontSize: 13, fontWeight: '600' },
    audioBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
    audioIcon: { fontSize: 22, color: '#666' },
    noteBox: { marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
    noteText: { fontFamily: 'Kanit', fontSize: 16, color: '#666', lineHeight: 26 },
});
