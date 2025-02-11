
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TournamentCard } from "./TournamentCard";

const SCROLL_AMOUNT = 350;

// Sample data - replace with your actual data
const tournaments = [
  {
    id: 1,
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Spring Championship 2024",
    status: "in-progress" as const,
    participants: { current: 75, max: 100 },
    prizePool: "$10,000",
    startDate: "Apr 15, 2024",
  },
  {
    id: 2,
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Summer Invitational",
    status: "upcoming" as const,
    participants: { current: 25, max: 128 },
    prizePool: "$5,000",
    startDate: "Jun 1, 2024",
  },
  {
    id: 3,
    banner: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Winter Classic",
    status: "completed" as const,
    participants: { current: 64, max: 64 },
    prizePool: "$15,000",
    startDate: "Mar 1, 2024",
  },
  {
    id: 4,
    banner: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    title: "Pro League Season 5",
    status: "closed" as const,
    participants: { current: 45, max: 50 },
    prizePool: "$7,500",
    startDate: "Feb 15, 2024",
  },
];

export const TournamentList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="snap-start">
            <TournamentCard {...tournament} />
          </div>
        ))}
      </div>
    </div>
  );
};
