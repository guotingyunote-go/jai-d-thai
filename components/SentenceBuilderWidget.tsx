import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DICTIONARY } from '../constants/Dictionary';
import { LOGICAL_OBJECTS, PRONOUNS, SentencePart, VERBS } from '../constants/Sentences';
import { useVibe } from '../context/VibeContext';

export default function SentenceBuilderWidget() {
    const { mode, userGender, fontType, femaleParticle, toggleFemaleParticle } = useVibe() as any;
    const isFaith = mode === 'faith';
    const accentColor = isFaith ? '#7851A9' : '#14B886';
    const thaiFont = fontType === 'headed' ? 'Sarabun_700Bold' : 'Kanit_600SemiBold';

    const [selection, setSelection] = useState(() => {
        const verbs = getFilteredVerbs();
        const v = verbs[0] || VERBS[0];
        const pronouns = getFilteredPronouns();
        const p = pronouns[0] || PRONOUNS[0];
        return {
            p: p,
            v: v,
            o: (LOGICAL_OBJECTS[v.zhTW] || LOGICAL_OBJECTS[v.thai])?.[0]
        };
    });

    const [pickerType, setPickerType] = useState<'p' | 'v' | 'o' | null>(null);
    const [showParticleInfo, setShowParticleInfo] = useState(false);

    function getFilteredPronouns() {
        return PRONOUNS.filter(p => {
            if (p.thai === 'ผม' && userGender !== 'male') return false;
            if (p.thai === 'ฉัน' && userGender !== 'female') return false;
            if (p.category && p.category !== 'both' && p.category !== mode) return false;
            return true;
        });
    }

    function getFilteredVerbs() {
        return VERBS.filter(v => !v.category || v.category === 'both' || v.category === mode);
    }

    function getFilteredObjects(currentVerb: SentencePart) {
        // 1. 獲取邏輯建議
        const logical = LOGICAL_OBJECTS[currentVerb.zhTW] || LOGICAL_OBJECTS[currentVerb.thai] || [];

        // 2. 從全局字典中自動抓取相關詞彙作為補充 (排除動詞類別，抓取名詞/生活類)
        const dictAdditions = DICTIONARY.filter(entry => {
            // 排除掉已經在邏輯清單中的
            if (logical.some(l => l.thai === entry.thai)) return false;
            // 模式過濾
            if (entry.mode !== 'common' && entry.mode !== mode) return false;
            // 分類過濾 (排除動詞、疑問詞、數字等不適合作為受詞的)
            const invalidCategories = ['萬用動詞', '疑問詞', '數字與時間'];
            return !invalidCategories.includes(entry.category);
        }).map(entry => ({
            thai: entry.thai,
            phonetic: entry.phonetic,
            zhTW: entry.zhTW,
            category: entry.category as any
        }));

        const combined = [...logical, ...dictAdditions];

        // ✨ [防錯邏輯] 避免雙重否定：如果動詞選了「不 (ไม่)」，則過濾掉本身已帶有「不」的受詞
        const filtered = combined.filter(o => {
            if (currentVerb.thai === 'ไม่' && o.thai.startsWith('ไม่')) return false;
            return true;
        });

        return filtered.filter(o => !o.category || o.category === 'both' || o.category === mode);
    }

    // ✨ 性別同步邏輯：當外部性別切換時，自動更換代名詞
    React.useEffect(() => {
        if (selection.p.thai === 'ผม' && userGender === 'female') {
            const chan = PRONOUNS.find(p => p.thai === 'ฉัน');
            if (chan) setSelection(prev => ({ ...prev, p: chan }));
        } else if (selection.p.thai === 'ฉัน' && userGender === 'male') {
            const pom = PRONOUNS.find(p => p.thai === 'ผม');
            if (pom) setSelection(prev => ({ ...prev, p: pom }));
        }
    }, [userGender]);

    const randomize = () => {
        try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch (e) { }
        const fv = getFilteredVerbs();
        const rv = fv[Math.floor(Math.random() * fv.length)];
        const fo = getFilteredObjects(rv);
        const fp = getFilteredPronouns();

        setSelection({
            p: fp[Math.floor(Math.random() * fp.length)],
            v: rv,
            o: fo[Math.floor(Math.random() * fo.length)] || (LOGICAL_OBJECTS[rv.zhTW] || LOGICAL_OBJECTS[rv.thai])[0]
        });
    };

    const playSound = async (text: string) => {
        try {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch (e) { }
            let voiceId = undefined;
            const voices = await Speech.getAvailableVoicesAsync();
            const thaiVoices = voices.filter(v => v.language.toLowerCase().startsWith('th'));
            if (thaiVoices.length > 0) {
                let genderVoice = thaiVoices.find(v => {
                    const name = v.name.toLowerCase();
                    if (userGender === 'male') return name.includes('male') || name.includes('narat') || name.includes('man');
                    return name.includes('female') || name.includes('kanya') || name.includes('woman');
                });
                if (!genderVoice) genderVoice = thaiVoices.find(v => v.quality === 'Enhanced') || thaiVoices[0];
                voiceId = genderVoice?.identifier;
            }
            Speech.speak(text, { language: 'th-TH', rate: 0.8, voice: voiceId });
        } catch (err) { }
    };

    const shouldShowParticle = () => {
        // 1. 如果主詞是「對神自稱」的 ลูก，代表是在禱告，不放人間的禮貌助詞
        if (selection.p.thai === 'ลูก') return false;

        // 2. 如果受詞是「營會指令」分類，通常是高能量喊話，省略助詞更道地
        if ((selection.o?.category as string) === '營會指令') return false;

        return true;
    };

    const speak = async () => {
        const showP = shouldShowParticle();
        const suffix = showP ? (userGender === 'male' ? 'ครับ' : (femaleParticle === 'khâ' ? 'ค่ะ' : 'เจ้า')) : '';
        const fullText = `${selection.p.thai}${selection.v.thai}${selection.o.thai} ${suffix}`;
        playSound(fullText);
    };

    const Chip = ({ part, type, onPress }: { part: SentencePart, type: string, onPress: () => void }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.chip, { backgroundColor: accentColor + '08', borderColor: accentColor + '20' }]}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.chipLabel}>{type}</Text>
                <TouchableOpacity onPress={() => playSound(part.thai)}>
                    <Text style={{ fontSize: 10 }}>🔊</Text>
                </TouchableOpacity>
            </View>
            <Text style={[styles.chipThai, { color: accentColor, fontFamily: thaiFont }]}>{part.thai}</Text>
            <Text style={styles.chipPhonetic}>{part.phonetic}</Text>
            <Text style={styles.chipZh}>{part.zhTW}</Text>
            <View style={{ marginTop: 4, opacity: 0.3 }}>
                <Text style={{ fontSize: 8 }}>✎ 點擊修改</Text>
            </View>
        </TouchableOpacity>
    );

    const ParticleChip = () => {
        const isMale = userGender === 'male';
        const isKha = femaleParticle === 'khâ';
        const thai = isMale ? 'ครับ' : (isKha ? 'ค่ะ' : 'เจ้า');
        const phonetic = isMale ? 'kráp' : (isKha ? 'khâ' : 'jâo');
        const zh = isMale ? '先生/男聲' : (isKha ? '標準女聲' : '泰北女聲');

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    if (isMale) playSound(thai);
                    else toggleFemaleParticle();
                }}
                style={[styles.chip, styles.particleChip, { backgroundColor: accentColor + '15', borderColor: accentColor }]}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.chipLabel, { color: accentColor }]}>語助詞</Text>
                    <TouchableOpacity onPress={(e) => { e.stopPropagation(); setShowParticleInfo(true); }}>
                        <Text style={{ fontSize: 13, color: accentColor }}>ⓘ</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.chipThai, { color: accentColor, fontFamily: thaiFont }]}>{thai}</Text>
                <Text style={styles.chipPhonetic}>{phonetic}</Text>
                <Text style={[styles.chipZh, { color: accentColor, opacity: 0.8 }]}>{zh}</Text>
                {!isMale && (
                    <View style={{ marginTop: 4, opacity: 0.6 }}>
                        <Text style={{ fontSize: 9, color: accentColor }}>⇄ 點擊切換</Text>
                    </View>
                )}
                {isMale && (
                    <View style={{ marginTop: 4, opacity: 0.3 }}>
                        <Text style={{ fontSize: 9, color: accentColor }}>🔊 點擊發音</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderParticleInfo = () => (
        <Modal transparent animationType="fade" visible={showParticleInfo}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>💡 語助詞使用指南</Text>
                        <TouchableOpacity onPress={() => setShowParticleInfo(false)}>
                            <Text style={styles.closeBtn}>✕ 關閉</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ maxHeight: 500 }}>
                        <Text style={styles.infoText}>
                            在泰語中，每句話的結尾通常會加上<Text style={styles.bold}>「性別語助詞」</Text>來表示禮貌：{'\n\n'}
                            👨 <Text style={styles.bold}>男生：ครับ (kráp)</Text>{'\n'}
                            唯一的禮貌用語。口語中常把 r 吃掉唸成「kap」。{'\n\n'}
                            👩 <Text style={styles.bold}>女生：分為兩種！</Text>{'\n'}
                            • <Text style={styles.bold}>ค่ะ (khâ)</Text>：標準泰語。適用於全泰國、曼谷、正式場合。{'\n'}
                            • <Text style={styles.bold}>เจ้า (Jao)</Text>：泰北方言(蘭納語)。在清邁、清萊市集或部落使用，會讓當地人覺得超級親切、零距離！{'\n\n'}
                            <Text style={{ color: '#888', fontSize: 13 }}>*(當你選取女聲時，可以直接點擊語助詞按鈕進行模式切換)</Text>
                        </Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // 選項渲染
    const renderPicker = () => {
        if (!pickerType) return null;
        let items: SentencePart[] = [];
        let title = '';

        if (pickerType === 'p') { items = getFilteredPronouns(); title = '選擇代名詞'; }
        else if (pickerType === 'v') { items = getFilteredVerbs(); title = '選擇動詞'; }
        else { items = getFilteredObjects(selection.v); title = '選擇受詞'; }

        return (
            <Modal transparent animationType="fade" visible={!!pickerType}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={() => setPickerType(null)}>
                                <Text style={styles.closeBtn}>✕ 關閉</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 400 }}>
                            {items.map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.pickerItem}
                                    onPress={() => {
                                        if (pickerType === 'p') setSelection({ ...selection, p: item });
                                        else if (pickerType === 'v') {
                                            const newObjs = getFilteredObjects(item);
                                            setSelection({ ...selection, v: item, o: newObjs[0] });
                                        }
                                        else setSelection({ ...selection, o: item });
                                        setPickerType(null);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                >
                                    <View>
                                        <Text style={[styles.pickerThai, { fontFamily: thaiFont }]}>{item.thai}</Text>
                                        <Text style={styles.pickerSub}>{item.phonetic} - {item.zhTW}</Text>
                                    </View>
                                    {((pickerType === 'p' && selection.p === item) ||
                                        (pickerType === 'v' && selection.v === item) ||
                                        (pickerType === 'o' && selection.o === item)) &&
                                        <Text style={{ color: accentColor }}>✓</Text>
                                    }
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.title, { color: accentColor }]}>句型工作坊 🧱</Text>
                    <Text style={styles.subtitle}>
                        點擊下方色塊可自行更換單字，打造你的專屬句子。結語助詞將根據你的性別自動切換。
                    </Text>
                </View>
                <TouchableOpacity style={[styles.randomBtn, { backgroundColor: accentColor }]} onPress={randomize}>
                    <Text style={styles.randomBtnText}>🎲 隨機</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.slotContainer}>
                <Chip part={selection.p} type="主語" onPress={() => setPickerType('p')} />
                <View style={styles.connector}><Text style={{ color: accentColor }}>+</Text></View>
                <Chip part={selection.v} type="動詞" onPress={() => setPickerType('v')} />
                <View style={styles.connector}><Text style={{ color: accentColor }}>+</Text></View>
                <Chip part={selection.o} type="受詞" onPress={() => setPickerType('o')} />
                <View style={styles.connector}><Text style={{ color: accentColor }}>+</Text></View>
                {shouldShowParticle() ? <ParticleChip /> : (
                    <View style={[styles.chip, { backgroundColor: '#F8F8F8', borderColor: '#EEE', opacity: 0.5 }]}>
                        <Text style={styles.chipLabel}>語助詞</Text>
                        <Text style={[styles.chipThai, { color: '#CCC' }]}>-</Text>
                        <Text style={styles.chipZh}>無需結尾</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity style={[styles.mainSpeakBtn, { backgroundColor: accentColor }]} onPress={speak}>
                <Text style={styles.mainSpeakText}>🔊 播放完整句子</Text>
            </TouchableOpacity>

            {renderPicker()}
            {renderParticleInfo()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%', marginBottom: 24, backgroundColor: '#FFF', padding: 20, borderRadius: 24,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    title: { fontFamily: 'Prompt_700Bold', fontSize: 20 },
    subtitle: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA', lineHeight: 20, marginTop: 6, flex: 1, paddingRight: 8 },
    randomBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
    randomBtnText: { color: '#FFF', fontFamily: 'Kanit_600SemiBold', fontSize: 16 },
    slotContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    chip: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    chipLabel: { fontFamily: 'Kanit', fontSize: 12, color: '#BBB' },
    chipThai: { fontSize: 28, letterSpacing: 0.5 },
    chipPhonetic: { fontFamily: 'Kanit', fontSize: 13, color: '#AAA' },
    chipZh: { fontFamily: 'Prompt_500Medium', fontSize: 14, color: '#777', marginTop: 4 },
    connector: { paddingHorizontal: 1 },
    particleChip: { borderWidth: 2, borderStyle: 'dashed' },
    mainSpeakBtn: { marginTop: 24, width: '100%', height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    mainSpeakText: { color: '#FFF', fontFamily: 'Kanit_600SemiBold', fontSize: 18 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 50 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' },
    modalTitle: { fontFamily: 'Prompt_700Bold', fontSize: 22 },
    closeBtn: { color: '#666', fontSize: 16 },
    pickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    pickerThai: { fontSize: 28, color: '#333', letterSpacing: 0.5 },
    pickerSub: { fontSize: 16, color: '#888', marginTop: 4 },
    infoText: { fontFamily: 'Kanit', fontSize: 16, color: '#444', lineHeight: 28 },
    bold: { fontWeight: 'bold', color: '#111' }
});
