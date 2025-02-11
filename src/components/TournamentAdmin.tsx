
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash, ArrowUp, ArrowDown } from "lucide-react";
import { TournamentCard } from "./TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tournament } from "@/types/database.types";
import { toast } from "sonner";

const fetchTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) throw error;
  return data as Tournament[];
};

export const TournamentAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  
  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success("Tournament deleted successfully");
    } catch (error) {
      console.error('Error deleting tournament:', error);
      toast.error("Failed to delete tournament");
    }
  };

  const moveItem = async (index: number, direction: 'up' | 'down') => {
    if (!tournaments) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tournaments.length) return;
    
    const updatedTournaments = [...tournaments];
    const temp = updatedTournaments[index];
    updatedTournaments[index] = updatedTournaments[newIndex];
    updatedTournaments[newIndex] = temp;

    // Update the start dates to reflect the new order
    try {
      const updates = updatedTournaments.map((tournament, idx) => ({
        id: tournament.id,
        start_date: new Date(tournament.start_date).toISOString(),
      }));

      const { error } = await supabase
        .from('tournaments')
        .upsert(updates);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success("Tournament order updated");
    } catch (error) {
      console.error('Error updating tournament order:', error);
      toast.error("Failed to update tournament order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-500">Error loading tournaments</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Tournaments</CardTitle>
          <button
            onClick={() => setSelectedTournament(null)}
            className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
            aria-label="Add new tournament"
          >
            <Plus className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {tournaments?.map((tournament, index) => (
              <div key={tournament.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <TournamentCard 
                    banner={tournament.banner_url}
                    title={tournament.title}
                    status={tournament.status}
                    participants={{
                      current: tournament.current_participants,
                      max: tournament.max_participants
                    }}
                    prizePool={`$${tournament.prize_pool.toLocaleString()}`}
                    startDate={new Date(tournament.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === (tournaments?.length ?? 0) - 1}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedTournament(tournament)}
                    className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                    aria-label="Edit tournament"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tournament.id)}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                    aria-label="Delete tournament"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
