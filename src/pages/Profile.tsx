import { Header } from "../components/layout/Header";
import { useAuthStore } from "../stores/authStore";
import { GameCard } from "../components/game/GameCard";
import { useGames } from "../hooks/useGames";
import { User, Mail, Calendar, Award, Star, Users } from "lucide-react";

export function Profile() {
  const { user } = useAuthStore();
  const { games } = useGames();
  const myGames = games.filter((game) => game.creator === user?.id);
  const totalPlayers = myGames.reduce((acc, game) => acc + (game.players || 0), 0);
  const averageRating =
    myGames.reduce((acc, game) => acc + (game.rating || 0), 0) / myGames.length || 0;

  const stats = [
    { icon: Award, label: "Games Created", value: myGames.length },
    { icon: Users, label: "Total Players", value: totalPlayers },
    { icon: Star, label: "Average Rating", value: averageRating.toFixed(1) },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Profile Header */}
        <div className="relative mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 " />
          <div className="absolute inset-0 backdrop-blur-3xl" />

          <div className="relative p-8  border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-32 h-32  border-4 border-blue-500/20 shadow-xl shadow-blue-500/10"
                  />
                ) : (
                  <div className="w-32 h-32  bg-blue-500/20 text-blue-500 flex items-center justify-center text-4xl font-bold border-4 border-blue-500/20">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500  shadow-lg shadow-green-500/30" />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
                <div className="space-y-2">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span>@{user?.username || "user"}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user?.created || "").toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center p-4  bg-gray-800/50 backdrop-blur-sm border border-gray-700/50"
                  >
                    <stat.icon className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Games */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">My Games</h2>
          {myGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGames.map((game, index) => (
                <GameCard key={game.id} game={game} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-700 ">
              <div className="text-gray-400 text-center">
                <p className="mb-2">You haven't created any games yet.</p>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  Create your first game →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
