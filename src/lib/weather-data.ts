// Mock weather service for Truckee, CA

export type AlertSeverity = 'watch' | 'warning' | 'emergency';
export type WeatherCondition = 'clear' | 'cloudy' | 'light_snow' | 'heavy_snow' | 'blizzard';

export interface CurrentWeather {
  temperature: number; // Fahrenheit
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  humidity: number; // percentage
  windSpeed: number; // mph
  windDirection: string;
  visibility: number; // miles
  snowfallRate: number; // inches per hour
  snowfallTotal: number; // inches accumulated today
  lastUpdated: string;
}

export interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  description: string;
  precipChance: number; // percentage
  snowfallExpected: number; // inches
}

export interface StormAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  startTime: string;
  endTime: string;
  expectedSnowfall: number; // inches
  isActive: boolean;
}

export interface AutoDispatchTrigger {
  threshold: number; // inches of snowfall to trigger
  currentAccumulation: number;
  isTriggered: boolean;
  nextDispatchTime: string | null;
  message: string;
}

// Mock current weather for Truckee
export const getCurrentWeather = (): CurrentWeather => {
  const now = new Date();
  return {
    temperature: 28,
    feelsLike: 22,
    condition: 'heavy_snow',
    description: 'Heavy Snow',
    humidity: 85,
    windSpeed: 12,
    windDirection: 'NW',
    visibility: 2,
    snowfallRate: 1.5,
    snowfallTotal: 6.2,
    lastUpdated: now.toISOString(),
  };
};

// Mock 5-day forecast
export const getForecast = (): ForecastDay[] => {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return [
    {
      date: today.toISOString().split('T')[0],
      dayName: 'Today',
      high: 32,
      low: 18,
      condition: 'heavy_snow',
      description: 'Heavy Snow',
      precipChance: 95,
      snowfallExpected: 8,
    },
    {
      date: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
      dayName: days[(today.getDay() + 1) % 7],
      high: 30,
      low: 15,
      condition: 'light_snow',
      description: 'Light Snow',
      precipChance: 60,
      snowfallExpected: 3,
    },
    {
      date: new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0],
      dayName: days[(today.getDay() + 2) % 7],
      high: 35,
      low: 22,
      condition: 'cloudy',
      description: 'Cloudy',
      precipChance: 20,
      snowfallExpected: 0,
    },
    {
      date: new Date(today.getTime() + 86400000 * 3).toISOString().split('T')[0],
      dayName: days[(today.getDay() + 3) % 7],
      high: 38,
      low: 25,
      condition: 'clear',
      description: 'Mostly Clear',
      precipChance: 5,
      snowfallExpected: 0,
    },
    {
      date: new Date(today.getTime() + 86400000 * 4).toISOString().split('T')[0],
      dayName: days[(today.getDay() + 4) % 7],
      high: 33,
      low: 20,
      condition: 'light_snow',
      description: 'Snow Showers',
      precipChance: 70,
      snowfallExpected: 4,
    },
  ];
};

// Mock active storm alerts
export const getStormAlerts = (): StormAlert[] => {
  const now = new Date();
  const endTime = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now
  
  return [
    {
      id: 'alert-001',
      severity: 'warning',
      title: 'Winter Storm Warning',
      message: 'Heavy snow expected. 6-10 inches accumulation. Travel may become hazardous.',
      startTime: now.toISOString(),
      endTime: endTime.toISOString(),
      expectedSnowfall: 8,
      isActive: true,
    },
  ];
};

// Auto-dispatch logic
export const getAutoDispatchStatus = (): AutoDispatchTrigger => {
  const weather = getCurrentWeather();
  const threshold = 3; // Dispatch when 3+ inches accumulate
  const isTriggered = weather.snowfallTotal >= threshold;
  
  let nextDispatchTime: string | null = null;
  let message = '';
  
  if (isTriggered) {
    message = 'Auto-dispatch activated! Fleet deployed for snow removal.';
    nextDispatchTime = new Date().toISOString();
  } else {
    const remainingInches = threshold - weather.snowfallTotal;
    const hoursUntilTrigger = weather.snowfallRate > 0 
      ? remainingInches / weather.snowfallRate 
      : 999;
    
    if (hoursUntilTrigger < 24) {
      const triggerTime = new Date(Date.now() + hoursUntilTrigger * 60 * 60 * 1000);
      nextDispatchTime = triggerTime.toISOString();
      message = `Auto-dispatch will trigger at ${remainingInches.toFixed(1)}" more snowfall (est. ${hoursUntilTrigger.toFixed(1)} hours)`;
    } else {
      message = 'Snowfall below auto-dispatch threshold';
    }
  }
  
  return {
    threshold,
    currentAccumulation: weather.snowfallTotal,
    isTriggered,
    nextDispatchTime,
    message,
  };
};

// Weather condition icons mapping
export const getWeatherIcon = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'clear':
      return '☀️';
    case 'cloudy':
      return '☁️';
    case 'light_snow':
      return '🌨️';
    case 'heavy_snow':
      return '❄️';
    case 'blizzard':
      return '🌬️';
    default:
      return '🌡️';
  }
};

// Alert severity colors
export const getAlertColor = (severity: AlertSeverity): { bg: string; text: string; border: string } => {
  switch (severity) {
    case 'watch':
      return { bg: 'bg-amber-100 dark:bg-amber-950/30', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-500' };
    case 'warning':
      return { bg: 'bg-orange-100 dark:bg-orange-950/30', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-500' };
    case 'emergency':
      return { bg: 'bg-red-100 dark:bg-red-950/30', text: 'text-red-800 dark:text-red-200', border: 'border-red-500' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-500' };
  }
};

