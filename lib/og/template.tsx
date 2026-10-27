import { brand } from "@/lib/brand";
import { PERSON } from "@/lib/site";
import { ImageResponse } from "next/og";
import { loadOgFonts } from "./fonts";

export const ogSize = {
  width: 1200,
  height: 630,
} as const;

export const ogContentType = "image/png";

type OgImageProps = {
  title: string;
  subtitle?: string;
};

export async function createOgImage({
  title,
  subtitle,
}: OgImageProps): Promise<ImageResponse> {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: brand.bg,
          border: `1px solid ${brand.line}`,
          padding: 64,
          fontFamily: "Space Grotesk",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: brand.accent,
              }}
            />
            <span
              style={{
                fontFamily: "JetBrains Mono",
                fontSize: 22,
                color: brand.textMuted,
                letterSpacing: "0.04em",
              }}
            >
              {PERSON.brand}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: title.length > 48 ? 52 : 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: brand.text,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: brand.textBody,
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "JetBrains Mono",
            fontSize: 18,
            color: brand.accent,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: brand.accent,
            }}
          />
          {PERSON.shortName}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        {
          name: "Space Grotesk",
          data: fonts.display,
          style: "normal",
          weight: 700,
        },
        {
          name: "JetBrains Mono",
          data: fonts.mono,
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
