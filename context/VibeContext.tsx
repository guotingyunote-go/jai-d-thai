import * as Haptics from 'expo-haptics';
import { createContext, ReactNode, useContext, useState } from 'react';

export type VibeMode = 'street' | 'faith';
export type UserGender = 'male' | 'female';
export type FontType = 'headed' | 'loopless';
export type FemaleParticle = 'khâ' | 'jao';

interface VibeContextType {
    mode: VibeMode;
    userGender: UserGender;
    fontType: FontType;
    femaleParticle: FemaleParticle;
    gracePoints: number;
    toggleMode: () => void;
    toggleGender: () => void;
    toggleFont: () => void;
    toggleFemaleParticle: () => void;
    addGracePoints: (pts: number) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export function VibeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<VibeMode>('street');
    const [userGender, setUserGender] = useState<UserGender>('female');
    const [fontType, setFontType] = useState<FontType>('loopless');
    const [femaleParticle, setFemaleParticle] = useState<FemaleParticle>('jao');
    const [gracePoints, setGracePoints] = useState(0);

    const toggleMode = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setMode((prev) => (prev === 'street' ? 'faith' : 'street'));
    };

    const toggleGender = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setUserGender((prev) => (prev === 'male' ? 'female' : 'male'));
    };

    const toggleFont = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFontType((prev) => (prev === 'headed' ? 'loopless' : 'headed'));
    };

    const toggleFemaleParticle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFemaleParticle((prev) => (prev === 'jao' ? 'khâ' : 'jao'));
    };

    const addGracePoints = (pts: number) => {
        setGracePoints((prev) => Math.min(100, prev + pts));
    };

    return (
        <VibeContext.Provider value={{
            mode, userGender, fontType, femaleParticle, gracePoints,
            toggleMode, toggleGender, toggleFont, toggleFemaleParticle, addGracePoints
        }}>
            {children}
        </VibeContext.Provider>
    );
}

export function useVibe() {
    const context = useContext(VibeContext);
    if (context === undefined) {
        throw new Error('useVibe must be used within a VibeProvider');
    }
    return context;
}
