import { motion } from "framer-motion";
import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/authStore";
import { Settings as SettingsIcon, Bell, Shield, Palette, Monitor, User, Mail } from "lucide-react";
import { useState } from "react";

interface Setting {
  id: string;
  label: string;
  description: string;
  type: "toggle" | "input" | "select";
  value?: any;
  options?: string[];
}

const sections = [
  {
    icon: Bell,
    title: "Notifications",
    settings: [
      {
        id: "email_notifications",
        label: "Email Notifications",
        description: "Receive email notifications about game updates",
        type: "toggle",
        value: true,
      },
      {
        id: "push_notifications",
        label: "Push Notifications",
        description: "Receive push notifications in your browser",
        type: "toggle",
        value: false,
      },
    ],
  },
  {
    icon: Shield,
    title: "Privacy",
    settings: [
      {
        id: "profile_visibility",
        label: "Profile Visibility",
        description: "Who can see your profile",
        type: "select",
        value: "public",
        options: ["Public", "Friends", "Private"],
      },
      {
        id: "game_visibility",
        label: "Game Visibility",
        description: "Default visibility for new games",
        type: "select",
        value: "public",
        options: ["Public", "Unlisted", "Private"],
      },
    ],
  },
  {
    icon: Palette,
    title: "Appearance",
    settings: [
      {
        id: "theme",
        label: "Theme",
        description: "Choose your preferred theme",
        type: "select",
        value: "dark",
        options: ["Dark", "Light", "System"],
      },
    ],
  },
];

export function Settings() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState("Notifications");

  const handleSettingChange = (settingId: string, value: any) => {
    console.log("Setting changed:", settingId, value);
    // TODO: Implement settings update
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl bg-blue-500/20 text-blue-400"
          >
            <SettingsIcon className="w-6 h-6" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Profile Summary */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-xl border-2 border-blue-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{user?.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>@{user?.username || "user"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {sections.map((section) => (
              <motion.button
                key={section.title}
                whileHover={{ x: 4 }}
                onClick={() => setActiveSection(section.title)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.title
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="md:col-span-3 space-y-8">
            {sections
              .filter((section) => section.title === activeSection)
              .map((section) => (
                <div key={section.title} className="space-y-6">
                  {section.settings.map((setting) => (
                    <motion.div
                      key={setting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">
                            {setting.label}
                          </h3>
                          <p className="text-sm text-gray-400">{setting.description}</p>
                        </div>
                        {setting.type === "toggle" ? (
                          <button
                            onClick={() => handleSettingChange(setting.id, !setting.value)}
                            className={`relative w-12 h-6 transition-colors rounded-full ${
                              setting.value ? "bg-blue-500" : "bg-gray-700"
                            }`}
                          >
                            <div
                              className={`absolute top-1 left-1 w-4 h-4 transition-all rounded-full bg-white ${
                                setting.value ? "translate-x-6" : ""
                              }`}
                            />
                          </button>
                        ) : setting.type === "select" ? (
                          <select
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                            className="px-3 py-1.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                          >
                            {setting.options?.map((option) => (
                              <option key={option} value={option.toLowerCase()}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
