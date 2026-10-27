"use client";

import dynamic from "next/dynamic";
import styles from "./home.module.css";

const AiDemoChat = dynamic(
  () =>
    import("@/components/home/AiDemoChat").then((mod) => mod.AiDemoChat),
  {
    ssr: false,
    loading: () => <div className={styles.terminal} aria-hidden />,
  },
);

type Props = {
  maxInputChars: number;
};

export function AiDemoChatLazy({ maxInputChars }: Props) {
  return <AiDemoChat maxInputChars={maxInputChars} />;
}
