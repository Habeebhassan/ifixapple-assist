"use client";

import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("@/components/chat/ChatInterface"), {
  ssr: false,
});

export default function ChatMount() {
  return <ChatInterface />;
}
