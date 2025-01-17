"use client";

import NextError from "next/error";
import { useEffect } from "react";

import { reportError } from "@/actions/site/errors";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    reportError(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* This is the default Next.js error component but it doesn't allow omitting the statusCode property yet. */}
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        <NextError statusCode={500} />
      </body>
    </html>
  );
}
