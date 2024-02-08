/**
 * Interface representing an achievement with a user ID, points, and date.
 */
export interface Achievement {
  userId: string;
  points: number;
  date: Date;
}

/**
 * Type alias for a leaderboard, which is an array of objects containing a user ID and points.
 */
export type Leaderboard = Array<{
  userId: string;
  points: number;
}>;

/**
 * Validates an achievement object to ensure it has the correct structure and data types.
 *
 * @param {Achievement} achievement - The achievement to validate.
 * @returns {boolean} True if the achievement is valid, false otherwise.
 */
export function validateAchievement(achievement: Achievement): boolean {
  return (
    typeof achievement.userId === 'string' &&
    achievement.userId.trim() !== '' &&
    typeof achievement.points === 'number' &&
    achievement.date instanceof Date &&
    !isNaN(achievement.date.getTime())
  );
}

/**
 * Calculates or updates a leaderboard with a new set of achievements.
 * It starts from an existing leaderboard (which could be empty) and integrates incremental updates.
 *
 * @param {Leaderboard} oldLeaderboard - The existing leaderboard to update.
 * @param {Array<Achievement>} achievements - New achievements to process and integrate into the leaderboard.
 * @returns {Leaderboard} The updated leaderboard, incorporating the new achievements.
 * @throws {Error} If the input achievements array is not valid.
 */
export function calculateLeaderboard(
  oldLeaderboard: Leaderboard,
  achievements: Array<Achievement>
): Leaderboard {
  if (!Array.isArray(achievements)) {
    throw new Error('Invalid input: achievements must be an array');
  }

  // Convert the old leaderboard into a Map for easier updates
  const users = new Map<string, { points: number; latestDate: Date }>(
    oldLeaderboard.map((entry) => [
      entry.userId,
      { points: entry.points, latestDate: new Date(0) },
    ])
  );

  achievements.forEach((achievement) => {
    if (!validateAchievement(achievement)) {
      throw new Error('Invalid input: achievement interface is wrong');
    }

    const userData = users.get(achievement.userId) || {
      points: 0,
      latestDate: new Date(0),
    };
    userData.points += achievement.points;

    // Update the latestDate to the most recent achievement's date if necessary
    if (userData.latestDate < achievement.date) {
      userData.latestDate = achievement.date;
    }

    users.set(achievement.userId, userData);
  });

  // Convert the users Map back into an array for sorting
  const updatedLeaderboard = Array.from(
    users,
    ([userId, { points, latestDate }]) => ({
      userId,
      points,
      latestDate,
    })
  );

  // Sort the updated leaderboard by points (descending) and then by latestDate (ascending)
  updatedLeaderboard.sort(
    (a, b) =>
      b.points - a.points || a.latestDate.getTime() - b.latestDate.getTime()
  );

  // Transform back to the expected Leaderboard format, excluding the latestDate
  return updatedLeaderboard.map(({ userId, points }) => ({ userId, points }));
}
