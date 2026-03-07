import { Kanit_400Regular, Kanit_600SemiBold } from '@expo-google-fonts/kanit';
import { Prompt_400Regular, Prompt_500Medium, Prompt_700Bold } from '@expo-google-fonts/prompt';
import { Sarabun_400Regular, Sarabun_700Bold } from '@expo-google-fonts/sarabun';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
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
            <Head>
                <title>Jai-D Thai | 泰好心學習 app</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Jai-D Thai" />
                <meta name="description" content="最道地的泰語學習 app，支援泰北口音與屬靈宣教模式。" />
                <link rel="icon" href="/favicon.png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta property="og:title" content="Jai-D Thai" />
                <meta property="og:description" content="讓學習泰語變得充滿愛與驚喜！" />
                <meta property="og:image" content="/og-image.png" />
            </Head>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
        </VibeProvider>
    );
}
