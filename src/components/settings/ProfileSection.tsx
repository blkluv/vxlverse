import { Mail, User } from "lucide-react";
import { User as UserType } from "../../types";

interface ProfileSectionProps {
  user: UserType | null;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-6 p-6  bg-white/5 border border-white/10 backdrop-blur-sm">
      {user.avatar && (
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-20 h-20  object-cover" />
          <div className="absolute inset-0  ring-1 ring-inset ring-white/10" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{user.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
