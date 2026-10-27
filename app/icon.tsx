import { brand } from "@/lib/brand";
import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  const square = 18;
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
