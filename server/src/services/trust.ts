/**
 * Exponential decay multiplier based on age.
 * @param createdAt ISO timestamp or Date when the item was created
 * @param halfLifeHours number of hours after which weight halves (default 24)
 * @returns multiplier between 0 and 1 (1 = brand new, ~0 = very old)
 */
export function decayWeight(
  createdAt: string | Date,
  halfLifeHours: number = 24
): number {
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const ageMs = now.getTime() - created.getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  const lambda = Math.log(2) / halfLifeHours;
  return Math.exp(-lambda * ageHours);
}

/**
 * Composite trust score for a SafeStop.
 * Combines confirmation count, recency of the last confirmation, and OSM verification.
 *
 * @param confirmationsCount number of confirmations
 * @param lastConfirmedAt ISO timestamp of the most recent confirmation (optional)
 * @param osmVerified whether the stop is verified via OSM
 * @returns a trust score (0–10 scale)
 */
export function computeTrustScore(
  confirmationsCount: number,
  lastConfirmedAt?: string | Date,
  osmVerified: boolean = false
): number {
  // Base score from confirmations (logarithmic, max ~7 from 50 confirmations)
  const confirmationScore = Math.min(7, Math.log2(confirmationsCount + 1) * 2);

  // Recency bonus: up to 2 points for a confirmation within the last 24 hours
  let recencyBonus = 0;
  if (lastConfirmedAt) {
    const weight = decayWeight(lastConfirmedAt, 24);
    recencyBonus = weight * 2;
  }

  // OSM verification bonus: 1 point
  const osmBonus = osmVerified ? 1 : 0;

  // Combine and clamp to 0–10
  const raw = confirmationScore + recencyBonus + osmBonus;
  return Math.min(10, Math.max(0, Math.round(raw * 10) / 10));
}
