
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TournamentCard } from "./TournamentCard";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Tournament } from "@/types/database.types";

const SCROLL_AMOUNT = 350;

const fetchTournaments = async () => {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('start_date', { ascending: true });
  
  if (error) throw error;
  return data as Tournament[];
};

export const TournamentList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: tournaments, isLoading, error } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">Error loading tournaments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tournaments</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors duration-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {tournaments?.map((tournament) => (
          <div key={tournament.id} className="snap-start">
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
        ))}
      </div>
    </div>
  );
};
