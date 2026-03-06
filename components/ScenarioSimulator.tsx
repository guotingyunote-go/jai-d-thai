import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useVibe } from '../context/VibeContext';

interface Scenario {
    id: string;
    location: string;
    text: string;
    thaiBody: string;
    correctParticle: 'ครับ' | 'เจ้า' | 'none' | 'conditional';
    category: 'street' | 'faith';
    icon: string;
    feedback: string;
}

const SCENARIOS: Scenario[] = [
    {
        id: 's1',
        location: '清邁夜市 (Street)',
        text: '這個多少錢？',
        thaiBody: 'อันนี้เท่าไหร่',
        correctParticle: 'conditional', // 會根據性別變化
        category: 'street',
        icon: '🛒',
        feedback: '太棒了！你聽起來就像道地的清邁在地人。',
    },
    {
        id: 's2',
        location: '主日崇拜後 (Faith)',
        text: '願神祝福你。',
        thaiBody: 'ขอพระเจ้าอวยพร',
        correctParticle: 'conditional',
        category: 'faith',
        icon: '⛪',
        feedback: '阿們！弟兄姊妹能感受到你的真誠與敬意。',
    },
    {
        id: 's3',
        location: '私下禱告 (Faith)',
        text: '主啊，謝謝祢。',
        thaiBody: 'ขอบคุณพระเจ้า',
        correctParticle: 'none',
        category: 'faith',
        icon: '🙏',
        feedback: '沒錯。在禱告中與上帝的關係是親密的，不需要正式語尾助詞。',
    },
];

export default function ScenarioSimulator() {
    const { userGender, gracePoints, addGracePoints, accentColor } = useVibe() as any;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const scenario = SCENARIOS[currentIndex];

    // 計算正確答案
    const getCorrect = () => {
        if (scenario.correctParticle === 'none') return 'none';
        return userGender === 'male' ? 'ครับ' : 'เจ้า';
    };

    const handleChoice = (choice: string) => {
        if (selected) return;

        const correct = getCorrect();
        setSelected(choice);

        if (choice === correct) {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (e) { }
            addGracePoints(34); // 三題答對剛好滿分

            // 語音播放完整句子
            const fullText = choice === 'none' ? scenario.thaiBody : `${scenario.thaiBody} ${choice}`;
            try {
                Speech.speak(fullText, { language: 'th-TH', rate: 0.85 });
            } catch (e) {
                console.warn('Speech.speak failed', e);
            }
        } else {
            try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch (e) { }
        }
        setShowFeedback(true);
    };

    const nextScenario = () => {
        setSelected(null);
        setShowFeedback(false);
        setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
    };

    const isCorrect = selected === getCorrect();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Text style={styles.location}>{scenario.icon} {scenario.location}</Text>
                    <Text style={styles.scenarioText}>「{scenario.text}」</Text>
                </View>

                <View style={styles.bubble}>
                    <Text style={styles.thaiMain}>{scenario.thaiBody} ...?</Text>
                </View>

                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={[styles.option, selected === 'ครับ' && (isCorrect ? styles.correct : styles.wrong)]}
                        onPress={() => handleChoice('ครับ')}
                    >
                        <Text style={styles.optionText}>ครับ (Male)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, selected === 'เจ้า' && (isCorrect ? styles.correct : styles.wrong)]}
                        onPress={() => handleChoice('เจ้า')}
                    >
                        <Text style={styles.optionText}>เจ้า (Female)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.option, selected === 'none' && (isCorrect ? styles.correct : styles.wrong)]}
                        onPress={() => handleChoice('none')}
                    >
                        <Text style={styles.optionText}>無需助詞</Text>
                    </TouchableOpacity>
                </View>

                {showFeedback && (
                    <View style={styles.feedbackBox}>
                        <Text style={styles.feedbackTitle}>{isCorrect ? '✅ 答對了！' : '❌ 要再加油喔'}</Text>
                        <Text style={styles.feedbackContent}>{isCorrect ? scenario.feedback : '記得確認目前的使用者性別設定與場合語法。'}</Text>
                        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: accentColor }]} onPress={nextScenario}>
                            <Text style={styles.nextText}>下一個情境</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Vibe Meter */}
            <View style={styles.meterContainer}>
                <View style={styles.meterLabelRow}>
                    <Text style={styles.meterLabel}>✨ Social Vibe Meter (Grace Points)</Text>
                    <Text style={styles.meterValue}>{gracePoints}%</Text>
                </View>
                <View style={styles.meterTrack}>
                    <Animated.View style={[styles.meterFill, { width: `${gracePoints}%`, backgroundColor: '#7851A9' }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', marginVertical: 16 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    header: { marginBottom: 16 },
    location: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA', marginBottom: 4 },
    scenarioText: { fontFamily: 'Prompt_500Medium', fontSize: 20, color: '#333' },
    bubble: {
        backgroundColor: '#F8F9FA',
        padding: 20,
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    thaiMain: { fontFamily: 'Kanit_600SemiBold', fontSize: 28, color: '#222' },
    optionsRow: { flexDirection: 'column', gap: 10 },
    option: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
    },
    optionText: { fontFamily: 'Kanit', fontSize: 16, fontWeight: '600', color: '#555' },
    correct: { backgroundColor: '#E1F5FE', borderColor: '#03A9F4', borderWidth: 2 },
    wrong: { backgroundColor: '#FFEBEE', borderColor: '#F44336', borderWidth: 2 },
    feedbackBox: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
    feedbackTitle: { fontFamily: 'Kanit_600SemiBold', fontSize: 18, marginBottom: 8 },
    feedbackContent: { fontFamily: 'Kanit', fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 16 },
    nextBtn: { padding: 14, borderRadius: 12, alignItems: 'center' },
    nextText: { color: '#FFF', fontWeight: 'bold' },
    meterContainer: { marginTop: 24 },
    meterLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    meterLabel: { fontFamily: 'Kanit', fontSize: 13, color: '#888' },
    meterValue: { fontFamily: 'Kanit_600SemiBold', fontSize: 13, color: '#7851A9' },
    meterTrack: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
    meterFill: { height: '100%', borderRadius: 5 },
});
