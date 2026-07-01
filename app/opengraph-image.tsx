import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Brendan Cavazos — Sports & Broadcast Video Editor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bebasNeue = readFileSync(join(process.cwd(), "app/assets/BebasNeue.woff"));

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Bebas Neue",
            fontSize: 260,
            letterSpacing: 24,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          BC
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 10,
            color: "rgba(255,255,255,0.45)",
            marginTop: 26,
          }}
        >
          BRENDAN CAVAZOS
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 4,
            color: "#c41230",
            marginTop: 20,
          }}
        >
          SPORTS &amp; BROADCAST VIDEO EDITOR
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Bebas Neue",
          data: bebasNeue,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
