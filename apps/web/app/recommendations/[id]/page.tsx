import { seedRecommendations } from "@yapper/shared";
import { RecommendationDetailClient } from "./client";

export function generateStaticParams() {
  return seedRecommendations.map((rec) => ({
    id: rec.id
  }));
}

export default function RecommendationDetailPage() {
  return <RecommendationDetailClient />;
}
