
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Tournament } from "@/types/database.types";

interface TournamentFormProps {
  tournament?: Tournament;
  onClose: () => void;
}

export const TournamentForm = ({ tournament, onClose }: TournamentFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: tournament || {
      title: "",
      banner_url: "",
      max_participants: 100,
      prize_pool: 0,
      status: "upcoming" as const,
      start_date: new Date().toISOString(),
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (tournament) {
        // Update existing tournament
        const { error } = await supabase
          .from('tournaments')
          .update({
            ...data,
            start_date: new Date(data.start_date).toISOString(),
          })
          .eq('id', tournament.id);

        if (error) throw error;
        toast.success("Tournament updated successfully");
      } else {
        // Create new tournament
        const { error } = await supabase
          .from('tournaments')
          .insert([{
            ...data,
            current_participants: 0,
            start_date: new Date(data.start_date).toISOString(),
          }]);

        if (error) throw error;
        toast.success("Tournament created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      onClose();
    } catch (error) {
      console.error('Error saving tournament:', error);
      toast.error("Failed to save tournament");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{tournament ? 'Edit Tournament' : 'New Tournament'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input {...register("title", { required: true })} />
            {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Banner URL</label>
            <Input {...register("banner_url", { required: true })} />
            {errors.banner_url && <span className="text-red-500 text-sm">Banner URL is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max Participants</label>
            <Input 
              type="number" 
              {...register("max_participants", { required: true, min: 1 })} 
            />
            {errors.max_participants && <span className="text-red-500 text-sm">Valid max participants is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prize Pool</label>
            <Input 
              type="number" 
              {...register("prize_pool", { required: true, min: 0 })} 
            />
            {errors.prize_pool && <span className="text-red-500 text-sm">Valid prize pool is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input 
              type="datetime-local" 
              {...register("start_date", { required: true })} 
            />
            {errors.start_date && <span className="text-red-500 text-sm">Start date is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              {...register("status")} 
              className="w-full border rounded-md p-2"
            >
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {tournament ? 'Update' : 'Create'} Tournament
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
