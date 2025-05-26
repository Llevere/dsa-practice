import type { NextApiRequest, NextApiResponse } from "next";
import { getTestKeys } from "@/lib/loadTests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keys = await getTestKeys();
  res.status(200).json(keys);
}
