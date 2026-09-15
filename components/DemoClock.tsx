"use client";

import { useEffect, useState } from "react";

/**
 * Lock-screen furniture for demo mode: city, the real local time, and the real current
 * weather where it can be worked out.
 *
 * Location comes from the browser's IANA timezone (`America/Phoenix` -> "Phoenix"),
 * geocoded by Open-Meteo. That needs no permission prompt, which matters because this
 * usually runs inside someone else's iframe where a prompt would be hostile.
 *
 * The three degrade independently: the clock always renders, the city falls back to the
 * timezone's own name if geocoding fails, and the weather is simply omitted rather than
 * invented.
 */

type Weather = { tempC: number; code: number };

/** The city segment of an IANA timezone, which is a usable label on its own. */
function cityFromTimezone(): string | null {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tail = zone?.split("/").pop()?.replace(/_/g, " ");
  return tail || null;
}

/** WMO weather codes, collapsed to the handful of states worth showing. */
function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Mostly clear";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Storm";
}

export type Place = {
  /** Search term. Falls back to the browser timezone's own city. */
  city?: string;
  /** Disambiguates a name that exists in several states - "Pelham" is in six. */
  region?: string;
  lat?: number;
  lon?: number;
};

async function locate(place: Place, signal: AbortSignal) {
  const name = place.city ?? cityFromTimezone();
  if (!name) return null;
  // Ask for several, because the first hit for a common name is rarely the right one.
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?count=10&name=${encodeURIComponent(name)}`,
    { signal },
  );
  if (!res.ok) return null;
  const hits: { name: string; admin1?: string; latitude: number; longitude: number }[] =
    (await res.json())?.results ?? [];
  if (!hits.length) return null;
  if (!place.region) return hits[0];
  const want = place.region.toLowerCase();
  return hits.find((h) => h.admin1?.toLowerCase().includes(want)) ?? hits[0];
}

async function forecast(lat: number, lon: number, signal: AbortSignal): Promise<Weather | null> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`,
    { signal },
  );
  if (!res.ok) return null;
  const now = (await res.json())?.current;
  if (typeof now?.temperature_2m !== "number") return null;
  return { tempC: now.temperature_2m, code: now.weather_code ?? 0 };
}

export function DemoClock({ unit, place }: { unit: "c" | "f"; place: Place }) {
  const [now, setNow] = useState(() => new Date());
  const [city, setCity] = useState<string | null>(() => place.city ?? cityFromTimezone());
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const { city: pin, region, lat, lon } = place;
  useEffect(() => {
    const stop = new AbortController();
    (async () => {
      // Explicit coordinates skip the lookup entirely - nothing to get wrong.
      if (lat !== undefined && lon !== undefined) {
        setWeather(await forecast(lat, lon, stop.signal));
        return;
      }
      const found = await locate({ city: pin, region }, stop.signal);
      if (!found) return;
      setCity(found.name);
      setWeather(await forecast(found.latitude, found.longitude, stop.signal));
    })().catch(() => {
      /* offline, blocked, or rate-limited - city and clock stand on their own */
    });
    return () => stop.abort();
  }, [pin, region, lat, lon]);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  const sky = weather && describe(weather.code);
  const temp =
    weather && Math.round(unit === "f" ? (weather.tempC * 9) / 5 + 32 : weather.tempC);

  return (
    <div className="demo-clock">
      {city && <p className="demo-city">{city}</p>}
      <p className="demo-time">{time}</p>
      <p className="demo-date">{date}</p>
      {sky && (
        <p className="demo-weather">
          {temp}&deg;{unit.toUpperCase()} &middot; {sky}
        </p>
      )}
    </div>
  );
}
