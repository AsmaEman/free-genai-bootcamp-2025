
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/integrations/supabase/types";

type StudySession = Database['public']['Tables']['study_sessions']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export const ProgressTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch user's study sessions
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false })
          .limit(10);

        if (sessionsError) throw sessionsError;

        // Fetch user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setSessions(sessionsData);
        setProfile(profileData);
      } catch (error: any) {
        toast({
          title: "Error fetching progress data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  if (isLoading) {
    return <div>Loading progress...</div>;
  }

  const todayWords = sessions
    .filter(session => {
      const sessionDate = new Date(session.start_time);
      const today = new Date();
      return (
        sessionDate.getDate() === today.getDate() &&
        sessionDate.getMonth() === today.getMonth() &&
        sessionDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((total, session) => total + (session.words_studied || 0), 0);

  const dailyGoalProgress = profile?.daily_goal
    ? Math.min((todayWords / profile.daily_goal) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-medium mb-2">Today's Progress</h4>
        <Progress value={dailyGoalProgress} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {todayWords} / {profile?.daily_goal || 0} words
        </p>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-medium mb-4">Recent Sessions</h4>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No study sessions yet</p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {new Date(session.start_time).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.words_studied} words studied
                  </p>
                </div>
                <p className="text-sm">
                  {session.correct_answers} correct
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
