import React, { useState, useEffect } from 'react';
import { ViewTab } from './types';
import { storage } from './services/storage';
import { sound } from './services/audio';

import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { LessonLibrary } from './components/LessonLibrary';
import { TypingTestsView } from './components/TypingTestsView';
import { WeakKeyAnalyzer } from './components/WeakKeyAnalyzer';
import { GamesHub } from './components/GamesHub';
import { UserDashboard } from './components/UserDashboard';
import { LearnGuideView } from './components/LearnGuideView';
import { CertificateModal } from './components/CertificateModal';
import { Footer } from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>(undefined);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);

  // Profile preferences
  const [profile, setProfile] = useState(() => storage.getProfile());

  // Apply dark mode class to html document root
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  // Sync sound settings with audio service
  useEffect(() => {
    sound.setMuted(!profile.soundEnabled);
  }, [profile.soundEnabled]);

  const handleToggleDarkMode = () => {
    const updated = { 
      ...profile, 
      theme: (profile.theme === 'dark' ? 'light' : 'dark') as 'light' | 'dark' 
    };
    storage.saveProfile(updated);
    setProfile(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...profile, soundEnabled: !profile.soundEnabled };
    storage.saveProfile(updated);
    setProfile(updated);
    sound.setMuted(!updated.soundEnabled);
    if (updated.soundEnabled) {
      sound.playKeyClick();
    }
  };

  const handleStartLesson = (lessonId: number) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: ViewTab) => {
    setCurrentTab(tab);
    if (tab !== 'lessons') {
      setSelectedLessonId(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        isDark={profile.theme === 'dark'}
        onToggleTheme={handleToggleDarkMode}
        onOpenSettings={() => handleTabChange('dashboard')}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeHero
            onSelectTab={handleTabChange}
            onStartLesson={handleStartLesson}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonLibrary
            initialLessonId={selectedLessonId}
            onPracticeLesson={(lesson) => handleStartLesson(lesson.id)}
          />
        )}

        {currentTab === 'tests' && (
          <TypingTestsView
            onViewCertificate={() => setIsCertificateModalOpen(true)}
            onPracticeWeakKeys={() => handleTabChange('weak-keys')}
          />
        )}

        {currentTab === 'games' && <GamesHub />}

        {currentTab === 'weak-keys' && <WeakKeyAnalyzer />}

        {currentTab === 'dashboard' && (
          <UserDashboard
            onOpenCertificateModal={() => setIsCertificateModalOpen(true)}
            onNavigateToLessons={() => handleTabChange('lessons')}
          />
        )}

        {currentTab === 'learn' && <LearnGuideView />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={handleTabChange} />

      {/* Verifiable Certificate Modal */}
      {isCertificateModalOpen && (
        <CertificateModal onClose={() => setIsCertificateModalOpen(false)} />
      )}
    </div>
  );
}
