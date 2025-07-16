import { Suspense } from "react";
import IssuePage from "./IssuePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading Issue Page...</div>}>
      <IssuePage />
    </Suspense>
  );
}
