
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Trophy, Calendar, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    daily_goal: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setFormData({
          display_name: data.display_name || "",
          daily_goal: data.daily_goal || 10,
        });
      } catch (error: any) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          daily_goal: formData.daily_goal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
      // Refresh profile data
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-foreground">Streak</h4>
              </div>
              <p className="text-3xl font-bold text-foreground">{profile?.streak_count || 0} days</p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-foreground">Last Study</h4>
              </div>
              <p className="text-lg text-foreground">
                {profile?.last_study_date 
                  ? new Date(profile.last_study_date).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <h4 className="font-medium text-foreground">Daily Goal</h4>
              </div>
              <p className="text-3xl font-bold text-foreground">{profile?.daily_goal || 0} words</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-foreground">Profile Information</h3>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Display Name
                  </label>
                  <Input
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      display_name: e.target.value
                    }))}
                    placeholder="Enter your display name"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Daily Goal (words)
                  </label>
                  <Input
                    type="number"
                    value={formData.daily_goal}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      daily_goal: parseInt(e.target.value) || 10
                    }))}
                    min="1"
                    max="100"
                    className="bg-background"
                  />
                </div>
                <Button type="submit">
                  Save Changes
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Display Name
                  </label>
                  <p className="text-lg text-foreground">
                    {profile?.display_name || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Email
                  </label>
                  <p className="text-lg text-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
