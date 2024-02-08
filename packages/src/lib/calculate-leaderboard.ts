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
 * Calculates a leaderboard from an array of achievements. Achievements are aggregated by user,
 * and users are ranked by total points. In case of a tie, users are ranked by who reached the
 * total first.
 *
 * @param {Array<Achievement>} achievements - The array of achievements to process.
 * @returns {Leaderboard} The calculated leaderboard as an array of { userId, points } objects.
 * @throws {Error} If the input is not a valid array of achievements.
 */
export function calculateLeaderboard(
  achievements: Array<Achievement>
): Leaderboard {
  // Ensure the input is an array to prevent type-related errors.
  if (!Array.isArray(achievements)) {
    throw new Error('Invalid input: achievements must be an array');
  }

  // Initialize a Map to track both the total points and the latest achievement date for each user.
  const users = new Map<string, { points: number; latestDate: Date }>();

  achievements.forEach((achievement) => {
    // Validate each achievement; skip processing if invalid.
    if (!validateAchievement(achievement)) {
      throw new Error('Invalid input: achievement interface is wrong');
    }

    // Retrieve the current data for the user, or initialize it if this is their first achievement.
    const userData = users.get(achievement.userId) || {
      points: 0,
      latestDate: new Date(0), // Use the Unix epoch as the initial latest date.
    };
    // Update the user's total points.
    userData.points += achievement.points;

    // If this achievement's date is later than the current latestDate, update latestDate.
    if (userData.latestDate < achievement.date) {
      userData.latestDate = achievement.date;
    }
    // Store the updated user data back in the Map.
    users.set(achievement.userId, userData);
  });

  // Convert the users Map into an array for sorting. Include the latestDate for sorting logic.
  const leaderboard = Array.from(users, ([userId, { points, latestDate }]) => ({
    userId,
    points,
    latestDate,
  }));

  // Sort the leaderboard first by points (descending) and then by latestDate (ascending)
  // to resolve ties based on who reached their point total first.
  leaderboard.sort(
    (a, b) =>
      b.points - a.points || a.latestDate.getTime() - b.latestDate.getTime()
  );

  // Transform the sorted array to match the Leaderboard format, excluding the latestDate.
  return leaderboard.map(({ userId, points }) => ({ userId, points }));
}
