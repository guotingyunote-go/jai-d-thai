import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DICTIONARY, DictionaryEntry } from '../constants/Dictionary';
import { useVibe } from '../context/VibeContext';

export default function WordMasterWidget() {
    const { mode, userGender, fontType } = useVibe() as any;
    const [word, setWord] = useState<DictionaryEntry | null>(null);
    const [isLoopless, setIsLoopless] = useState(fontType === 'loopless');
    const flipAnim = React.useRef(new Animated.Value(fontType === 'loopless' ? 1 : 0)).current;

    const isFaith = mode === 'faith';
    const accentColor = isFaith ? '#7851A9' : '#14B886';

    useEffect(() => {
        refreshWord();
    }, [mode]);

    // ✨ 同步全域字體切換
    useEffect(() => {
        const toValue = fontType === 'loopless' ? 1 : 0;
        Animated.spring(flipAnim, {
            toValue,
            useNativeDriver: true
        }).start();
        setIsLoopless(fontType === 'loopless');
    }, [fontType]);

    const refreshWord = () => {
        // 修正：依據 mode 過濾分類，如果沒找到就抓全部
        const filtered = DICTIONARY.filter(e => e.category.includes(mode) || e.mode === mode || e.mode === 'common');
        const random = filtered.length > 0
            ? filtered[Math.floor(Math.random() * filtered.length)]
            : DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)];
        setWord(random);
    };

    const toggleFont = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const toLoopless = !isLoopless;
        const toValue = toLoopless ? 1 : 0;
        Animated.spring(flipAnim, {
            toValue,
            useNativeDriver: true
        }).start();
        setIsLoopless(toLoopless);
    };

    const speak = async (customText?: string) => {
        if (!word && !customText) return;
        const textToSpeak = customText || word?.thai || '';
        try {
            // Haptics safe fail
            try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (e) { }

            // Fetch voices but don't crash
            let voiceId = undefined;
            try {
                const voices = await Speech.getAvailableVoicesAsync();
                const thaiVoices = voices.filter(v => v.language.toLowerCase().startsWith('th'));
                if (thaiVoices.length > 0) {
                    let genderVoice = thaiVoices.find(v => {
                        const name = v.name.toLowerCase();
                        if (userGender === 'male') {
                            return name.includes('male') || name.includes('narat') || name.includes('man');
                        } else {
                            return name.includes('female') || name.includes('kanya') || name.includes('woman');
                        }
                    });
                    if (!genderVoice) genderVoice = thaiVoices.find(v => v.quality === 'Enhanced') || thaiVoices[0];
                    voiceId = genderVoice?.identifier;
                }
            } catch (e) {
                console.warn('Speech voices failed', e);
            }

            Speech.speak(textToSpeak, {
                language: 'th-TH',
                rate: 0.8,
                voice: voiceId
            });
        } catch (err) {
            console.error('Speak failed', err);
        }
    };

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg']
    });

    if (!word) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: accentColor }]}>今日學字 📖</Text>
                <TouchableOpacity onPress={refreshWord}>
                    <Text style={styles.refresh}>↻ 換一個</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                <TouchableOpacity activeOpacity={0.9} onPress={toggleFont} style={styles.flipWrapper}>
                    <View style={styles.cardContainer}>
                        <Animated.View style={[styles.card, { transform: [{ rotateY: frontInterpolate }], backfaceVisibility: 'hidden' }]}>
                            <Text style={[styles.thaiText, { color: accentColor, fontFamily: 'Sarabun_700Bold' }]}>{word.thai}</Text>
                            <Text style={styles.fontLabel}>Headed (有頭體)</Text>
                        </Animated.View>
                        <Animated.View style={[styles.card, styles.backCard, { transform: [{ rotateY: backInterpolate }], backfaceVisibility: 'hidden' }]}>
                            <Text style={[styles.thaiText, { color: accentColor, fontFamily: 'Kanit_600SemiBold' }]}>{word.thai}</Text>
                            <Text style={styles.fontLabel}>Loopless (無頭體)</Text>
                        </Animated.View>
                    </View>
                </TouchableOpacity>

                <View style={styles.infoSide}>
                    <Text style={styles.zhTW}>{word.zhTW}</Text>
                    <Text style={styles.phonetic}>[{word.phonetic}]</Text>
                    <TouchableOpacity style={[styles.playBtn, { backgroundColor: accentColor }]} onPress={() => {
                        if (word) speak(word.thai);
                    }}>
                        <Text style={styles.playIcon}>🔊 發音</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontFamily: 'Prompt_700Bold', fontSize: 18 },
    refresh: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA' },
    mainContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        gap: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    flipWrapper: { flex: 1.2 },
    cardContainer: { height: 120, width: '100%' },
    card: {
        position: 'absolute', width: '100%', height: '100%',
        backgroundColor: '#F8F9FA', borderRadius: 16,
        alignItems: 'center', justifyContent: 'center'
    },
    backCard: { backgroundColor: '#F0F9F5' },
    thaiText: { fontSize: 36, textAlign: 'center' },
    fontLabel: { fontFamily: 'Kanit', fontSize: 10, color: '#BBB', marginTop: 4 },
    infoSide: { flex: 1, justifyContent: 'center' },
    zhTW: { fontFamily: 'Prompt_700Bold', fontSize: 24, color: '#333' },
    phonetic: { fontFamily: 'Kanit', fontSize: 14, color: '#888', marginBottom: 12 },
    playBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, alignSelf: 'flex-start' },
    playIcon: { color: '#FFF', fontFamily: 'Kanit_600SemiBold', fontSize: 12 }
});
