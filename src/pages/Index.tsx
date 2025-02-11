
import { TournamentList } from "@/components/TournamentList";
import { TournamentAdmin } from "@/components/TournamentAdmin";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TournamentList />
      <TournamentAdmin />
    </div>
  );
};

export default Index;
