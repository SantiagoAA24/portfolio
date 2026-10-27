import { brand } from "@/lib/brand";
import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  const square = 100;
  const offset = (size.width - square) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: brand.bg,
        }}
      >
        <div
          style={{
            width: square,
            height: square,
            backgroundColor: brand.accent,
            position: "absolute",
            left: offset,
            top: offset,
          }}
        />
      </div>
    ),
    { ...size },
  );
}