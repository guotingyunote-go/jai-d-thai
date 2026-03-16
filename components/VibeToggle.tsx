import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useVibe } from '../context/VibeContext';

export default function VibeToggle() {
    const { mode, userGender, fontType, toggleMode, toggleGender, toggleFont } = useVibe() as any;
    const isFaith = mode === 'faith';
    const isMale = userGender === 'male';
    const isHeaded = fontType === 'headed';

    const fadeAnim = useRef(new Animated.Value(isFaith ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isFaith ? 1 : 0,
            duration: 350,
            useNativeDriver: false,
        }).start();
    }, [isFaith]);

    const backgroundColor = fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#2E8B6E', '#7851A9'],
    });

    return (
        <View style={styles.outerContainer}>
            {/* 模式切換 */}
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <View style={styles.labelWrapper}>
                    <Text style={styles.emoji}>🛒</Text>
                    <Text style={[styles.label, !isFaith ? styles.activeText : styles.inactiveText]}>日常模式</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={toggleMode}
                    style={styles.customSwitch}
                >
                    <Animated.View style={[
                        styles.customThumb,
                        {
                            transform: [{
                                translateX: fadeAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [2, 20]
                                })
                            }]
                        }
                    ]} />
                </TouchableOpacity>
                <View style={styles.labelWrapper}>
                    <Text style={styles.emoji}>🌏</Text>
                    <Text style={[styles.label, isFaith ? styles.activeText : styles.inactiveText]}>宣教模式</Text>
                </View>
            </Animated.View>

            {/* 性別與字體切換 */}
            <View style={styles.controlsRow}>
                {/* 性別切換 */}
                <View style={styles.controlItem}>
                    <Text style={styles.controlLabel}>性別：</Text>
                    <TouchableOpacity
                        style={[styles.smallBtn, isMale && styles.btnActive]}
                        onPress={toggleGender}
                    >
                        <Text style={[styles.btnText, isMale && styles.btnTextActive]}>
                            {isMale ? '🙋‍♂️ 男' : '🙋‍♀️ 女'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 字體切換 */}
                <View style={styles.controlItem}>
                    <Text style={styles.controlLabel}>字體：</Text>
                    <TouchableOpacity
                        style={[styles.smallBtn, isHeaded && styles.btnActive]}
                        onPress={toggleFont}
                    >
                        <Text style={[styles.btnText, isHeaded && styles.btnTextActive]}>
                            {isHeaded ? '🖊️ 有頭' : '🖌️ 無頭'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: { gap: 10, marginVertical: 8 },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
    },
    labelWrapper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    emoji: { fontSize: 16 },
    customSwitch: { width: 44, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', marginHorizontal: 10 },
    customThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF', position: 'absolute' },
    label: { fontFamily: 'Kanit_600SemiBold', fontSize: 16 },
    activeText: { color: '#FFFFFF' },
    inactiveText: { color: 'rgba(255,255,255,0.5)' },
    controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
    controlItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    controlLabel: { fontFamily: 'Kanit', fontSize: 17, color: '#666' },
    smallBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#EEE',
        borderWidth: 1,
        borderColor: '#DDD'
    },
    btnActive: { backgroundColor: '#333', borderColor: '#333' },
    btnText: { fontFamily: 'Kanit_600SemiBold', fontSize: 16, color: '#666' },
    btnTextActive: { color: '#FFF' },
});
