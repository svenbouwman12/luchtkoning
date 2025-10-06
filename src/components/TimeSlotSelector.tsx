// Tijdslot selector component met live beschikbaarheid
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { TimeSlotAvailability } from '@/types/database.types';
import { getDateAvailability, getStatusColor, getStatusLabel } from '@/lib/availability';

interface TimeSlotSelectorProps {
  selectedDate: Date | null;
  selectedStartTime: string;
  selectedEndTime: string;
  onTimeSelect: (startTime: string, endTime: string) => void;
  itemId?: string;
}

export default function TimeSlotSelector({
  selectedDate,
  selectedStartTime,
  selectedEndTime,
  onTimeSelect,
  itemId,
}: TimeSlotSelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlotAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate, itemId]);

  const loadTimeSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const availability = await getDateAvailability(selectedDate, itemId);
      setTimeSlots(availability.timeSlots);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeClick = (time: string) => {
    if (selectingStart) {
      // Selecteer starttijd
      onTimeSelect(time, selectedEndTime);
      setSelectingStart(false);
    } else {
      // Selecteer eindtijd
      if (time > selectedStartTime) {
        onTimeSelect(selectedStartTime, time);
      } else {
        // Als eindtijd eerder is dan starttijd, reset
        onTimeSelect(time, '');
        setSelectingStart(true);
      }
    }
  };

  const resetSelection = () => {
    onTimeSelect('', '');
    setSelectingStart(true);
  };

  if (!selectedDate) {
    return (
      <Alert severity="info">
        Selecteer eerst een datum om tijdslots te zien.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Selecteer tijdslot voor {format(selectedDate, 'dd MMMM yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
          <Chip
            label={
              selectedStartTime
                ? `Van: ${selectedStartTime}`
                : 'Kies starttijd'
            }
            color={selectedStartTime ? 'primary' : 'default'}
            variant={selectingStart ? 'filled' : 'outlined'}
          />
          {selectedStartTime && (
            <Chip
              label={
                selectedEndTime ? `Tot: ${selectedEndTime}` : 'Kies eindtijd'
              }
              color={selectedEndTime ? 'primary' : 'default'}
              variant={!selectingStart ? 'filled' : 'outlined'}
            />
          )}
          {selectedStartTime && (
            <Chip
              label="Reset"
              size="small"
              onClick={resetSelection}
              sx={{ cursor: 'pointer' }}
            />
          )}
        </Box>
      </Box>

      <Grid container spacing={1}>
        {timeSlots.map((slot) => {
          const isStartTime = slot.time === selectedStartTime;
          const isEndTime = slot.time === selectedEndTime;
          const isSelected = isStartTime || isEndTime;
          const isDisabled = slot.status !== 'available';

          // Check of tijd tussen start en eind ligt
          const isBetween =
            selectedStartTime &&
            selectedEndTime &&
            slot.time > selectedStartTime &&
            slot.time < selectedEndTime;

          const bgColor = isDisabled
            ? getStatusColor(slot.status)
            : isSelected || isBetween
            ? '#1976d2'
            : '#fff';

          const textColor = isDisabled || isSelected || isBetween ? '#fff' : '#000';

          return (
            <Grid item xs={6} sm={4} md={3} key={slot.time}>
              <Paper
                onClick={() => !isDisabled && handleTimeClick(slot.time)}
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  bgcolor: bgColor,
                  color: textColor,
                  border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                  opacity: isDisabled ? 0.6 : 1,
                  transition: 'all 0.2s',
                  '&:hover': !isDisabled
                    ? {
                        transform: 'scale(1.05)',
                        boxShadow: 2,
                      }
                    : {},
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {slot.time}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                  {isDisabled ? getStatusLabel(slot.status) : 'Beschikbaar'}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {timeSlots.length === 0 && (
        <Alert severity="warning">
          Geen tijdslots beschikbaar voor deze datum. Deze dag is gesloten of volledig geboekt.
        </Alert>
      )}
    </Box>
  );
}

