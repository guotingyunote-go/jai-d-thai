import { Kanit_400Regular, Kanit_600SemiBold } from '@expo-google-fonts/kanit';
import { Prompt_400Regular, Prompt_500Medium, Prompt_700Bold } from '@expo-google-fonts/prompt';
import { Sarabun_400Regular, Sarabun_700Bold } from '@expo-google-fonts/sarabun';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { VibeProvider } from '../context/VibeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Kanit: Kanit_400Regular,
        Kanit_600SemiBold,
        Prompt: Prompt_400Regular,
        Prompt_500Medium,
        Prompt_700Bold,
        Sarabun: Sarabun_400Regular,
        Sarabun_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <VibeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </VibeProvider>
    );
}
