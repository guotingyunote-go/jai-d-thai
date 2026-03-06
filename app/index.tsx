import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CharacterLabWidget from '../components/CharacterLabWidget';
import DictionaryCard from '../components/DictionaryCard';
import SentenceBuilderWidget from '../components/SentenceBuilderWidget';
import VibeToggle from '../components/VibeToggle';
import WordMasterWidget from '../components/WordMasterWidget';
import { DICTIONARY, DictionaryEntry } from '../constants/Dictionary';
import { useVibe } from '../context/VibeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Home() {
    const { mode, accentColor, userGender } = useVibe() as any;
    const isFaith = mode === 'faith';

    const accentLight = isFaith ? '#F0EBF9' : '#E6F5F0';
    const bgColor = isFaith ? '#F4F0FB' : '#F0F9F5';
    const subtitleText = isFaith ? '泰文宣教・營會活動' : '北泰日常・清邁生活';
    const subtitleEmoji = isFaith ? '🌏' : '🌿';

    const [selectedCategory, setSelectedCategory] = useState<string>('全部');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // ── 當模式切換時，重置所選分類 ──
    React.useEffect(() => {
        setSelectedCategory('全部');
    }, [mode]);

    // 定義各模式應顯示的分類白名單
    const STREET_CATEGORIES = ['禮貌與生存', '萬用動詞', '疑問詞', '數字與時間', '購物與生活'];
    const MISSION_CATEGORIES = ['祝禱與宣告', '教會生活', '屬靈生命', '敬拜讚美', '營會指令'];

    // 取得當前模式下的所有可用分類清單 (根據白名單過濾)
    const availableCategories = isFaith ? MISSION_CATEGORIES : STREET_CATEGORIES;
    const categories = ['全部', ...availableCategories];

    // 取得當前模式下的所有單字（包含 common）
    const currentModeItems = DICTIONARY.filter(e => {
        if (isFaith) return (e.mode === 'faith' || e.mode === 'common') && MISSION_CATEGORIES.includes(e.category);
        return (e.mode === 'street' || e.mode === 'common') && STREET_CATEGORIES.includes(e.category);
    });

    const filteredDict = currentModeItems.filter(item =>
        selectedCategory === '全部' || item.category === selectedCategory
    );

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleSelectCategory = (cat: string) => {
        setSelectedCategory(cat);
        setIsDropdownOpen(false);
    };

    // ✨ 禮貌語助詞自動補完：根據模式與性別自動修正顯示內容
    const renderDictionaryCard = (entry: DictionaryEntry) => {
        const isMale = userGender === 'male';
        const particle = isMale ? 'ครับ' : 'เจ้า';
        const particlePhonetic = isMale ? 'kráp' : 'jâo';

        let displayEntry = { ...entry };

        // [禮貌語助詞自動補完] 規則：
        // 1. 如果是街市模式 (street) 的內容
        // 2. 或者是特定需要補完的通用問候語 (common)
        const genderSensitiveIds = ['cv-1', 'cv-4', 'cv-8', 'cv-10', 'ft-1', 'ft-2', 'ft-17', 'ft-20'];
        const shouldAddParticle = entry.mode === 'street' || genderSensitiveIds.includes(entry.id);

        if (shouldAddParticle) {
            // 如果原本沒有包含助詞，則加上去
            if (!entry.thai.includes('ครับ') && !entry.thai.includes('เจ้า')) {
                displayEntry.thai = `${entry.thai} ${particle}`;
                displayEntry.phonetic = `${entry.phonetic} ${particlePhonetic}`;
            }
        }

        return (
            <DictionaryCard
                key={entry.id}
                entry={displayEntry}
                accentColor={accentColor}
                accentLight={accentLight}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                // 必須設定，否則 zIndex 在 Android 上無效
                removeClippedSubviews={false}
            >
                {/* ── 品牌標題 ── */}
                <View style={styles.header}>
                    <View style={styles.appBrand}>
                        <Text style={[styles.appNameThai, { color: accentColor }]}>ใจดี</Text>
                        <Text style={styles.appNameZH}>學泰語 Jai-D</Text>
                    </View>
                    <View style={[styles.modeBadge, { backgroundColor: accentColor + '18' }]}>
                        <Text style={[styles.modeBadgeText, { color: accentColor }]}>
                            {subtitleEmoji} {subtitleText}
                        </Text>
                    </View>
                </View>

                {/* ── 模式與性別切換 ── */}
                <View style={{ zIndex: 1000 }}>
                    <VibeToggle />
                </View>

                {/* ── Tier 1: Word Master 📖 ── */}
                <WordMasterWidget />

                {/* ── Tier 2: Sentence Builder 🧱 ── */}
                <SentenceBuilderWidget />

                {/* ── 下拉式分類字典庫 📚 ── */}
                {/* 使用 zIndex 確保下拉選單在最上層 */}
                <View style={[styles.sectionWrapper, { zIndex: 5000 }]}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionDot, { backgroundColor: accentColor }]} />
                        <Text style={[styles.sectionTitle, { color: accentColor }]}>詞彙庫分類查詢 🔍</Text>
                    </View>

                    <View style={styles.dropdownContainer}>
                        <TouchableOpacity
                            style={[styles.dropdownHeader, { borderColor: accentColor + '40' }]}
                            onPress={toggleDropdown}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.dropdownHeaderText}>{selectedCategory}</Text>
                            <Text style={{ color: accentColor, fontSize: 12 }}>{isDropdownOpen ? '▲' : '▼'}</Text>
                        </TouchableOpacity>

                        {isDropdownOpen && (
                            <View style={styles.dropdownList}>
                                <ScrollView style={{ maxHeight: 280 }} nestedScrollEnabled={true}>
                                    {categories.map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.dropdownItem,
                                                selectedCategory === cat && { backgroundColor: accentColor + '10' }
                                            ]}
                                            onPress={() => handleSelectCategory(cat)}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                selectedCategory === cat && { color: accentColor, fontWeight: '700' }
                                            ]}>
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </View>

                {/* 單字清單：這裡 zIndex 設低一點 */}
                <View style={[styles.listContainer, { zIndex: 1 }]}>
                    {filteredDict.map(renderDictionaryCard)}
                </View>

                {/* ── Tier 3: Character Lab 🖊️ 放到最後 ── */}
                <View style={{ marginTop: 40, paddingBottom: 20 }}>
                    <CharacterLabWidget />
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    appBrand: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    appNameThai: { fontFamily: 'Kanit_600SemiBold', fontSize: 34, letterSpacing: 1 },
    appNameZH: { fontFamily: 'Kanit_600SemiBold', fontSize: 18, color: '#888' },
    modeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    modeBadgeText: { fontFamily: 'Kanit', fontSize: 13, fontWeight: '600' },
    sectionWrapper: { marginTop: 28 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    sectionDot: { width: 8, height: 8, borderRadius: 4 },
    sectionTitle: { fontFamily: 'Prompt_700Bold', fontSize: 18, letterSpacing: 0.5 },
    dropdownContainer: { position: 'relative', marginBottom: 20 },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1.5,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    dropdownHeaderText: { fontFamily: 'Kanit_600SemiBold', fontSize: 16, color: '#333' },
    dropdownList: {
        position: 'absolute',
        top: 62,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20,
        elevation: 10,
        zIndex: 9999
    },
    dropdownItem: { padding: 12, borderRadius: 10 },
    dropdownItemText: { fontFamily: 'Kanit', fontSize: 15, color: '#555' },
    listContainer: { gap: 0, marginTop: 10 },
});
