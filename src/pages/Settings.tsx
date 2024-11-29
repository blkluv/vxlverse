import { useMemo } from "react";
import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/authStore";
import { Bell, Shield, Palette, Monitor } from "lucide-react";
import { SettingItem } from "../components/settings/SettingItem";
import { ProfileSection } from "../components/settings/ProfileSection";

interface Setting {
  id: string;
  icon: typeof Bell;
  label: string;
  description: string;
  type: "toggle" | "select";
  value: boolean | string;
  options?: string[];
}

export function Settings() {
  const { user } = useAuthStore();

  const settings = useMemo<Setting[]>(
    () => [
      {
        id: "notifications",
        icon: Bell,
        label: "Notifications",
        description: "Receive notifications about your games and followers",
        type: "toggle",
        value: true,
      },
      {
        id: "privacy",
        icon: Shield,
        label: "Privacy",
        description: "Control who can see your profile and games",
        type: "select",
        value: "Public",
        options: ["Public", "Private", "Friends Only"],
      },
      {
        id: "theme",
        icon: Palette,
        label: "Theme",
        description: "Choose your preferred color theme",
        type: "select",
        value: "Dark",
        options: ["Dark", "Light", "System"],
      },
      {
        id: "display",
        icon: Monitor,
        label: "Display",
        description: "Adjust your display settings",
        type: "select",
        value: "High",
        options: ["Low", "Medium", "High"],
      },
    ],
    []
  );

  const handleSettingChange = (id: string, value: boolean | string) => {
    // TODO: Implement settings update
    console.log("Setting changed:", { id, value });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Profile Section */}
          <ProfileSection user={user} />

          {/* Settings Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Settings
            </h2>
            <div className="space-y-3">
              {settings.map((setting) => (
                <SettingItem
                  key={setting.id}
                  icon={setting.icon}
                  label={setting.label}
                  description={setting.description}
                  type={setting.type}
                  value={setting.value}
                  options={setting.options}
                  onChange={(value) => handleSettingChange(setting.id, value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
