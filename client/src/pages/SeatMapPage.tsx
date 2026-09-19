import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { createBooking, getSeats } from '../api';
import { useUser } from '../context/useUser';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Seat } from '../types';

export const SeatMapPage = () => {
  const { showtimeId } = useParams();
  const queryClient = useQueryClient();
  const { users, selectedUserId } = useUser();
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [bookedSeats, setBookedSeats] = useState<Seat[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => getSeats(showtimeId!),
  });

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats', showtimeId] });
      setConfirmOpen(false);
      setSuccessOpen(true);
      setSelectedSeatIds([]);
    },
    onError: (error) => {
      alert(error.message);
      setConfirmOpen(false);
    },
  });

  if (isLoading) return <p className="text-stone">Loading...</p>;
  if (error) return <p className="text-destructive">Something went wrong</p>;

  const rows = (data ?? []).reduce<Record<string, Seat[]>>((acc, seat) => {
    (acc[seat.row_label] ??= []).push(seat);
    return acc;
  }, {});
  const rowLabels = Object.keys(rows).sort();
  const selectedUserEmail = users.find((u) => u.id === selectedUserId)?.email;

  function toggleSeat(seat: Seat) {
    if (seat.booking_id !== null) return;
    setSelectedSeatIds((prev) =>
      prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  }

  function openConfirm() {
    const seats = (data ?? []).filter((s) => selectedSeatIds.includes(s.id));
    setBookedSeats(seats);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    bookingMutation.mutate({
      showtime_id: showtimeId!,
      seat_ids: selectedSeatIds,
      user_id: selectedUserId!,
      idempotency_key: crypto.randomUUID(),
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Select your seats
      </h1>

      <div className="mt-8 overflow-x-auto">
        <div className="mx-auto w-fit min-w-full sm:min-w-0">
          <div className="mx-auto mb-8 h-2 w-3/4 max-w-md rounded-full bg-ink/80 shadow-[0_8px_24px_-4px_rgba(30,37,48,0.4)] sm:h-3" />
          <p className="mb-8 text-center text-xs text-stone sm:text-sm">screen</p>

          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {rowLabels.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-2 sm:gap-3">
                <span className="w-5 text-right text-xs font-medium text-stone sm:w-6 sm:text-sm">
                  {rowLabel}
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  {rows[rowLabel]
                    .sort((a, b) => a.seat_number - b.seat_number)
                    .map((seat) => {
                      const isOccupied = seat.booking_id !== null;
                      const isSelected = selectedSeatIds.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          disabled={isOccupied}
                          onClick={() => toggleSeat(seat)}
                          className={`h-7 w-7 rounded-sm border text-[10px] transition-colors sm:h-9 sm:w-9 sm:text-xs ${
                            isOccupied
                              ? 'cursor-not-allowed border-stone/20 bg-stone/20 text-stone/40'
                              : isSelected
                              ? 'border-garnet bg-garnet text-surface'
                              : 'border-stone/40 bg-surface text-ink hover:border-garnet'
                          }`}
                        >
                          {seat.seat_number}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4 text-xs text-stone sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm border border-stone/40 bg-surface" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-garnet" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-stone/20" /> Occupied
        </span>
      </div>

      {selectedSeatIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 border-t border-stone/20 bg-surface px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="text-sm text-ink">
              {selectedSeatIds.length} seat{selectedSeatIds.length > 1 ? 's' : ''} selected
            </span>
            <Button onClick={openConfirm} className="bg-garnet hover:bg-garnet/90">
              Review booking
            </Button>
          </div>
        </div>
      )}

      {/* Are-you-sure dialog, shown BEFORE booking */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Confirm your booking</DialogTitle>
            <DialogDescription>Review the details before booking.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 border-t border-dashed border-stone/40 pt-4">
            <div>
              <p className="text-xs text-stone">Booking as</p>
              <p className="text-sm text-ink">{selectedUserEmail}</p>
            </div>
            <div>
              <p className="text-xs text-stone">Seats</p>
              <p className="text-sm text-ink">
                {bookedSeats
                  .map((s) => `Row ${s.row_label}, Seat ${s.seat_number}`)
                  .join(' · ')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setConfirmOpen(false)}
              className="bg-surface text-ink border border-stone/40 hover:bg-paper"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={bookingMutation.isPending}
              className="bg-garnet hover:bg-garnet/90"
            >
              {bookingMutation.isPending ? 'Booking...' : 'Confirm booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog, shown AFTER booking */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Booking confirmed</DialogTitle>
            <DialogDescription>{selectedUserEmail}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1 border-t border-dashed border-stone/40 pt-4">
            {bookedSeats.map((s) => (
              <p key={s.id} className="text-sm text-ink">
                Row {s.row_label}, Seat {s.seat_number}
              </p>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)} className="bg-garnet hover:bg-garnet/90">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};