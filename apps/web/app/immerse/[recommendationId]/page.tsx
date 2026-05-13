import { seedRecommendations } from "@yapper/shared";
import { ImmerseClient } from "./client";

export function generateStaticParams() {
  return seedRecommendations.map((rec) => ({
    recommendationId: rec.id
  }));
}

export default function ImmersePage() {
  return <ImmerseClient />;
}
