
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

  if (!user) return null;

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
