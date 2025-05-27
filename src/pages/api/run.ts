import type { NextApiRequest, NextApiResponse } from "next";
import { runAllTests } from "@/utils/executeAllTests";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { code, tests, spreadable } = req.body;

  try {
    const results = runAllTests(code, tests, spreadable);
    res.status(200).json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
