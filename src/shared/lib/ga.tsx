"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

export default function GA() {
  return (
    <GoogleAnalytics trackPageViews gaMeasurementId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
  );
}
