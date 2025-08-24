import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

function ScreenContainer({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{title}</Text>
    </View>
  );
}

function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text>{t('home.welcome')}</Text>
      <Pressable
        onPress={() => navigation.navigate('Language')}
        style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#0a7', borderRadius: 6 }}
      >
        <Text style={{ color: 'white' }}>{t('language.change_button')}</Text>
      </Pressable>
    </View>
  );
}

function WeatherScreen() {
  const { t } = useTranslation();
  return <ScreenContainer title={t('weather.title')} />;
}

function SHCScreen() {
  const { t } = useTranslation();
  return <ScreenContainer title={t('shc.title')} />;
}

function CropsScreen() {
  const { t } = useTranslation();
  return <ScreenContainer title={t('crops.title')} />;
}

function MarketScreen() {
  const { t } = useTranslation();
  return <ScreenContainer title={t('market.title')} />;
}

function HelpScreen() {
  const { t } = useTranslation();
  return <ScreenContainer title={t('help.title')} />;
}

function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'bn', label: 'বাংলা' },
  ];

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>{t('language.select_label')}</Text>
      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          onPress={() => i18n.changeLanguage(lang.code)}
          style={{ paddingVertical: 12, paddingHorizontal: 14, backgroundColor: '#eee', borderRadius: 8 }}
        >
          <Text>{lang.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Weather" component={WeatherScreen} options={{ title: t('tabs.weather') }} />
      <Tab.Screen name="SHC" component={SHCScreen} options={{ title: t('tabs.shc') }} />
      <Tab.Screen name="Crops" component={CropsScreen} options={{ title: t('tabs.crops') }} />
      <Tab.Screen name="Market" component={MarketScreen} options={{ title: t('tabs.market') }} />
      <Tab.Screen name="Help" component={HelpScreen} options={{ title: t('tabs.help') }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Language" component={LanguageScreen} options={{ title: t('language.title') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}