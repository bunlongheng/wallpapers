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

async function locate(signal: AbortSignal) {
  const city = cityFromTimezone();
  if (!city) return null;
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(city)}`,
    { signal },
  );
  if (!res.ok) return null;
  return (await res.json())?.results?.[0] ?? null;
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

export function DemoClock({ unit }: { unit: "c" | "f" }) {
  const [now, setNow] = useState(() => new Date());
  const [city, setCity] = useState<string | null>(() => cityFromTimezone());
  const [weather, setWeather] = useState<Weather | null>(null);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const stop = new AbortController();
    (async () => {
      const place = await locate(stop.signal);
      if (!place) return;
      setCity(place.name);
      setWeather(await forecast(place.latitude, place.longitude, stop.signal));
    })().catch(() => {
      /* offline, blocked, or rate-limited - city and clock stand on their own */
    });
    return () => stop.abort();
  }, []);

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
