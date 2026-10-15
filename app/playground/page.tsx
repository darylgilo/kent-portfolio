import type { Metadata } from "next"
import { PlaygroundPage } from "@/components/playground-page"

export const metadata: Metadata = {
  title: "Playground - Kent Daryl M. Gilo",
  description: "Dev Playground — interactive web development lessons and coding playground.",
}

export default function Playground() {
  return <PlaygroundPage />
}
