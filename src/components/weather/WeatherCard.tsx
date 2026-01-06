'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye, 
  Snowflake,
  CloudSnow 
} from 'lucide-react';
import { CurrentWeather, getWeatherIcon } from '@/lib/weather-data';

interface WeatherCardProps {
  weather: CurrentWeather;
  compact?: boolean;
}

export default function WeatherCard({ weather, compact = false }: WeatherCardProps) {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 glass rounded-lg">
        <span className="text-2xl">{getWeatherIcon(weather.condition)}</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">{weather.temperature}°F</span>
          <span className="text-[var(--color-muted-foreground)]">{weather.description}</span>
          <div className="flex items-center gap-1 text-[var(--color-teal)]">
            <Snowflake className="w-3 h-3" />
            <span>{weather.snowfallTotal}" today</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="glass border-[var(--color-border)] overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSnow className="w-5 h-5 text-[var(--color-teal)]" />
            Current Conditions
          </div>
          <span className="text-xs font-normal text-[var(--color-muted-foreground)]">
            Updated {formatTime(weather.lastUpdated)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Temperature Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{getWeatherIcon(weather.condition)}</span>
            <div>
              <div className="text-4xl font-bold">{weather.temperature}°F</div>
              <div className="text-sm text-[var(--color-muted-foreground)]">
                Feels like {weather.feelsLike}°F
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{weather.description}</div>
            <div className="text-sm text-[var(--color-muted-foreground)]">Truckee, CA</div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <Snowflake className="w-4 h-4 text-[var(--color-teal)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Snowfall Rate</div>
              <div className="font-semibold">{weather.snowfallRate}"/hr</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <CloudSnow className="w-4 h-4 text-[var(--color-glacier)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Total Today</div>
              <div className="font-semibold">{weather.snowfallTotal}"</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <Wind className="w-4 h-4 text-[var(--color-amber)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Wind</div>
              <div className="font-semibold">{weather.windSpeed} mph {weather.windDirection}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-secondary)]/50">
            <Eye className="w-4 h-4 text-[var(--color-muted-foreground)]" />
            <div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Visibility</div>
              <div className="font-semibold">{weather.visibility} mi</div>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Droplets className="w-4 h-4" />
          <span>Humidity: {weather.humidity}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

