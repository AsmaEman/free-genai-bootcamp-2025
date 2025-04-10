
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChartBar, BookOpen, Users, Calendar } from "lucide-react";

interface StudySession {
  id: string;
  words_studied: number;
  correct_answers: number;
  group_id: string;
  start_time: string;
  created_at: string;
  study_activities?: {
    name: string;
  };
}

interface DashboardStats {
  totalWords: number;
  masteredWords: number;
  scriptMastery: number;
  pronunciationMastery: number;
  successRate: number;
  totalSessions: number;
  activeGroups: number;
  streakDays: number;
  lastSession?: {
    activityName?: string;
    date: string;
    correctCount: number;
    totalCount: number;
    groupId: string;
  };
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Get last study session
      const { data: lastSessionData, error: sessionError } = await supabase
        .from('study_sessions')
        .select(`
          id,
          words_studied,
          correct_answers,
          group_id,
          start_time,
          created_at,
          study_activities (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('start_time', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sessionError) throw sessionError;

      // Get word mastery stats
      const { count: masteredWordsCount, error: masteredError } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .gte('proficiency_level', 8);

      if (masteredError) throw masteredError;

      // Get total words count
      const { count: totalWordsCount, error: totalError } = await supabase
        .from('vocabulary')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Get active groups count
      const { count: activeGroupsCount, error: groupError } = await supabase
        .from('word_groups')
        .select('*', { count: 'exact', head: true });

      if (groupError) throw groupError;

      // Get user profile for streak and study stats
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) throw profileError;

      // Calculate success rate from last 10 sessions
      const { data: recentSessions, error: recentError } = await supabase
        .from('study_sessions')
        .select('correct_answers, words_studied')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const successRate = recentSessions && recentSessions.length > 0
        ? (recentSessions.reduce((acc, session) => 
            acc + ((session.correct_answers || 0) / Math.max(session.words_studied || 1, 1) * 100), 0
          ) / recentSessions.length)
        : 0;

      return {
        totalWords: totalWordsCount || 0,
        masteredWords: masteredWordsCount || 0,
        scriptMastery: profile?.script_difficulty_level 
          ? (profile.script_difficulty_level / 10) * 100 
          : 0,
        pronunciationMastery: 
          recentSessions && recentSessions.length > 0
            ? (recentSessions.reduce((acc, session) => 
                acc + ((session.correct_answers || 0) / Math.max(session.words_studied || 1, 1)), 0
              ) / recentSessions.length) * 100
            : 0,
        successRate: parseFloat(successRate.toFixed(1)),
        totalSessions: recentSessions?.length || 0,
        activeGroups: activeGroupsCount || 0,
        streakDays: profile?.streak_count || 0,
        lastSession: lastSessionData ? {
          activityName: lastSessionData.study_activities?.name,
          date: new Date(lastSessionData.start_time).toLocaleDateString(),
          correctCount: lastSessionData.correct_answers || 0,
          totalCount: lastSessionData.words_studied || 0,
          groupId: lastSessionData.group_id
        } : undefined
      };
    },
    enabled: !!user
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Arabic pattern overlay */}
        <div className="absolute inset-0 bg-[url('/arabic-pattern.svg')] opacity-5"></div>
        
        {/* Floating Arabic letters animation with blue glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          {['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر'].map((letter, index) => (
            <div 
              key={index}
              className="absolute text-4xl text-sky-400 opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 2}s`,
                filter: 'blur(1px) drop-shadow(0 0 5px rgba(56, 189, 248, 0.5))'
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
          {/* Logo or icon */}
          <div className="mb-6 flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <span className="text-white text-4xl font-arabic">ع</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold tracking-tighter text-white">
            <span className="font-arabic">تعلم العربية</span>
            <span className="block mt-2">Welcome back</span>
          </h1>
          
          <p className="text-xl text-gray-300">
            Embark on a journey through the rich tapestry of Arabic language and culture
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
            <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl border border-sky-500/30 shadow-lg hover:shadow-sky-500/20 transition-all duration-300 group">
              <div className="text-sky-400 mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 18.5C15.5 18.5 18.5 15.5 18.5 12C18.5 8.5 15.5 5.5 12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 4.5L4.5 19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9C9 9 10 10 12 10C14 10 15 9 15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Interactive Lessons</h3>
              <p className="text-gray-300">Learn through conversation with native speakers</p>
            </div>
            
            <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl border border-sky-500/30 shadow-lg hover:shadow-sky-500/20 transition-all duration-300 group">
              <div className="text-sky-400 mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 10H7C4.79086 10 3 11.7909 3 14V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V14C21 11.7909 19.2091 10 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 15L11 16L12 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 15L17 16L16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4C12 4 9 4 8.5 6C8.5 6 8 7.2 8 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 9C16 9 16 7.2 15.5 6C15 4 12 4 12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Gamified Practice</h3>
              <p className="text-gray-300">Master Arabic through fun daily challenges</p>
            </div>
            
            <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl border border-sky-500/30 shadow-lg hover:shadow-sky-500/20 transition-all duration-300 group">
              <div className="text-sky-400 mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19V5C4 3.89543 4.89543 3 6 3H19.4C19.7314 3 20 3.26863 20 3.6V16.7143" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 8.77975C16 9.38118 15.7625 9.95883 15.3383 10.3861C14.3619 11.3701 13.415 12.3961 12.4021 13.3443C12.17 13.5605 11.8017 13.5589 11.5715 13.3407C10.5699 12.3952 9.64382 11.3701 8.67448 10.3886C8.24446 9.95212 8 9.36968 8 8.75498C8 7.50608 8.99473 6.5 10.2272 6.5C11.0611 6.5 11.7936 6.93533 12.2183 7.59339C12.4347 7.94581 12.9752 7.94581 13.1915 7.59339C13.6162 6.93533 14.3487 6.5 15.1826 6.5C16.4151 6.5 17.4098 7.50608 17.4098 8.75498C17.4098 8.76358 17.4096 8.77218 17.4092 8.78078" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 17L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 21L20 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 21C4.89543 21 4 20.1046 4 19C4 17.8954 4.89543 17 6 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">Cultural Immersion</h3>
              <p className="text-gray-300">Discover stories, music, and traditions</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Button 
              onClick={() => navigate('/auth')}
              className="px-8 py-3 text-lg font-medium bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white rounded-lg shadow-lg shadow-sky-500/20 transform transition hover:-translate-y-1"
            >
              Sign In
            </Button>
            
            <p className="text-gray-400 text-sm">
              Join over 1 student already learning Arabic with us
            </p>
          </div>
        </div>
        
        {/* Add global styles for the animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          .font-arabic {
            font-family: 'Noto Sans Arabic', sans-serif;
          }
          
          /* Add a modern glassmorphism effect to elements */
          .glassmorphism {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
        `}</style>
        
        {/* Don't have an account? Link */}
        <div className="absolute bottom-8 text-center">
          <p className="text-gray-400">
            Don't have an account? <a href="/signup" className="text-sky-400 hover:text-sky-300 font-medium">Sign up</a>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25} className="bg-card border-r">
          <Sidebar onSignOut={handleSignOut} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full">
            <Header />
            <main className="p-6 space-y-6">
              {/* Last Study Session */}
              {stats?.lastSession && (
                <Card className="bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Last Study Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">{stats.lastSession.activityName}</p>
                      <p className="text-sm text-muted-foreground">{stats.lastSession.date}</p>
                      <p className="text-foreground">
                        Score: {stats.lastSession.correctCount}/{stats.lastSession.totalCount} correct
                      </p>
                      <Button 
                        variant="link" 
                        onClick={() => navigate(`/groups/${stats.lastSession?.groupId}`)}
                      >
                        View Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Study Progress */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Study Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="mb-2 text-foreground">Total Words Mastered</p>
                    <Progress value={stats ? (stats.masteredWords / Math.max(stats.totalWords, 1)) * 100 : 0} />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stats?.masteredWords || 0}/{stats?.totalWords || 0} words
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-foreground">Script Recognition</p>
                    <Progress value={stats?.scriptMastery || 0} />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stats ? stats.scriptMastery.toFixed(1) : '0'}% mastery
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-foreground">Pronunciation</p>
                    <Progress value={stats?.pronunciationMastery || 0} />
                    <p className="mt-1 text-sm text-muted-foreground">
                      {stats ? stats.pronunciationMastery.toFixed(1) : '0'}% mastery
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Success Rate</CardTitle>
                    <ChartBar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats?.successRate || 0}%</div>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Study Sessions</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats?.totalSessions || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Active Groups</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats?.activeGroups || 0}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Study Streak</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats?.streakDays || 0} days</div>
                  </CardContent>
                </Card>
              </div>

              {/* Start Studying Button */}
              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => navigate('/study-activities')}
                >
                  Start Studying
                </Button>
              </div>
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
