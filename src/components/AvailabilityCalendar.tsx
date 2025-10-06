// Kalender component met live beschikbaarheid weergave
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { DateAvailability } from '@/types/database.types';
import { getDateAvailability, getStatusColor } from '@/lib/availability';

interface AvailabilityCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  itemId?: string;
}

export default function AvailabilityCalendar({
  selectedDate,
  onDateSelect,
  itemId,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DateAvailability>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonthAvailability();
  }, [currentMonth, itemId]);

  const loadMonthAvailability = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start, end });

      const availabilityMap = new Map<string, DateAvailability>();

      // Laad beschikbaarheid voor elke dag (parallel)
      await Promise.all(
        days.map(async (day) => {
          const avail = await getDateAvailability(day, itemId);
          availabilityMap.set(format(day, 'yyyy-MM-dd'), avail);
        })
      );

      setAvailability(availabilityMap);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(addDays(startOfMonth(currentMonth), -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addDays(endOfMonth(currentMonth), 1));
  };

  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Voeg lege dagen toe aan het begin
    const startDay = start.getDay();
    const emptyDays = startDay === 0 ? 6 : startDay - 1; // Maandag = 0

    return (
      <Grid container spacing={1}>
        {/* Dag headers */}
        {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, display: 'block', textAlign: 'center' }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {/* Lege dagen */}
        {Array.from({ length: emptyDays }).map((_, index) => (
          <Grid item xs={12 / 7} key={`empty-${index}`}>
            <Box sx={{ height: 60 }} />
          </Grid>
        ))}

        {/* Kalenderdagen */}
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayAvail = availability.get(dateKey);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isPast = isBefore(day, startOfDay(new Date()));
          const isCurrentDay = isToday(day);

          const bgColor = dayAvail
            ? getStatusColor(dayAvail.status)
            : '#e0e0e0';

          const canSelect = dayAvail?.isWorkingDay && !isPast;

          return (
            <Grid item xs={12 / 7} key={dateKey}>
              <Paper
                onClick={() => canSelect && onDateSelect(day)}
                sx={{
                  height: 60,
                  p: 0.5,
                  cursor: canSelect ? 'pointer' : 'not-allowed',
                  bgcolor: isPast ? '#f5f5f5' : bgColor,
                  opacity: isPast ? 0.5 : 1,
                  border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': canSelect
                    ? {
                        transform: 'scale(1.05)',
                        boxShadow: 2,
                      }
                    : {},
                  position: 'relative',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isCurrentDay ? 700 : 400,
                    color: isPast ? '#999' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                {dayAvail && canSelect && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 9,
                      color: '#fff',
                      textAlign: 'center',
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    {dayAvail.status === 'available' ? '✓' : dayAvail.status === 'pending' ? '◐' : '✗'}
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box>
      {/* Header met maand navigatie */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          onClick={handlePrevMonth}
          sx={{ cursor: 'pointer', userSelect: 'none', fontSize: 24 }}
        >
          ‹
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {format(currentMonth, 'MMMM yyyy', { locale: nl })}
        </Typography>
        <Typography
          onClick={handleNextMonth}
          sx={{ cursor: 'pointer', userSelect: 'none', fontSize: 24 }}
        >
          ›
        </Typography>
      </Box>

      {/* Legenda */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Chip
          label="Beschikbaar"
          size="small"
          sx={{ bgcolor: '#4caf50', color: '#fff' }}
        />
        <Chip
          label="In afwachting"
          size="small"
          sx={{ bgcolor: '#ff9800', color: '#fff' }}
        />
        <Chip
          label="Geboekt"
          size="small"
          sx={{ bgcolor: '#f44336', color: '#fff' }}
        />
      </Box>

      {/* Kalender */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderCalendar()
      )}
    </Box>
  );
}

