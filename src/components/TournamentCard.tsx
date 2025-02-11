
import { FC } from "react";
import { Award, Calendar, Users } from "lucide-react";

interface TournamentCardProps {
  banner: string;
  title: string;
  status: "in-progress" | "closed" | "completed" | "upcoming";
  participants: {
    current: number;
    max: number;
  };
  prizePool: string;
  startDate: string;
}

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    className: "bg-status-progress text-secondary",
  },
  closed: {
    label: "Closed",
    className: "bg-status-closed text-destructive",
  },
  completed: {
    label: "Completed",
    className: "bg-status-completed text-green-700",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-status-upcoming text-blue-700",
  },
};

export const TournamentCard: FC<TournamentCardProps> = ({
  banner,
  title,
  status,
  participants,
  prizePool,
  startDate,
}) => {
  const progress = (participants.current / participants.max) * 100;
  const statusInfo = statusConfig[status];

  return (
    <div className="relative flex-shrink-0 w-[300px] rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative h-40 overflow-hidden">
        <img
          src={banner}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{title}</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">{prizePool}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{startDate}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{participants.current}/{participants.max} Players</span>
              </div>
              <span className="text-xs font-medium">{progress.toFixed(0)}%</span>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
