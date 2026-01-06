'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Snowflake, CloudRain } from 'lucide-react';
import { ForecastDay, getWeatherIcon } from '@/lib/weather-data';

interface ForecastWidgetProps {
  forecast: ForecastDay[];
  compact?: boolean;
}

export default function ForecastWidget({ forecast, compact = false }: ForecastWidgetProps) {
  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {forecast.slice(0, 4).map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center min-w-[60px] p-2 rounded-lg bg-[var(--color-secondary)]/50"
          >
            <span className="text-xs text-[var(--color-muted-foreground)]">{day.dayName}</span>
            <span className="text-xl my-1">{getWeatherIcon(day.condition)}</span>
            <span className="text-xs font-medium">{day.high}°/{day.low}°</span>
            {day.snowfallExpected > 0 && (
              <span className="text-xs text-[var(--color-teal)]">{day.snowfallExpected}"</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="glass border-[var(--color-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--color-glacier)]" />
          5-Day Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecast.map((day, index) => (
            <div
              key={day.date}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20'
                  : 'bg-[var(--color-secondary)]/50'
              }`}
            >
              {/* Day & Icon */}
              <div className="flex items-center gap-3 min-w-[120px]">
                <span className="text-2xl">{getWeatherIcon(day.condition)}</span>
                <div>
                  <div className="font-semibold">{day.dayName}</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">
                    {day.description}
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="text-center min-w-[80px]">
                <span className="font-bold text-lg">{day.high}°</span>
                <span className="text-[var(--color-muted-foreground)]"> / {day.low}°</span>
              </div>

              {/* Precipitation */}
              <div className="flex items-center gap-4 min-w-[120px] justify-end">
                <div className="flex items-center gap-1 text-sm">
                  <CloudRain className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <span className="text-[var(--color-muted-foreground)]">{day.precipChance}%</span>
                </div>
                {day.snowfallExpected > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <Snowflake className="w-4 h-4 text-[var(--color-teal)]" />
                    <span className="font-medium text-[var(--color-teal)]">
                      {day.snowfallExpected}"
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Total Expected Snowfall */}
        <div className="mt-4 p-3 rounded-lg bg-[var(--color-teal)]/10 border border-[var(--color-teal)]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-[var(--color-teal)]" />
              <span className="font-medium">Total Expected Snowfall (5 days)</span>
            </div>
            <span className="text-xl font-bold text-[var(--color-teal)]">
              {forecast.reduce((sum, day) => sum + day.snowfallExpected, 0)}"
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

