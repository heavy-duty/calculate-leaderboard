export interface Achievement {
  userId: string;
  points: number;
  date: Date;
}

export type Leaderboard = Array<{
  userId: string;
  points: number;
}>;

export function calculateLeaderboard(
  achievements: Array<Achievement>
): Leaderboard {
  const points: Record<number, string[]> = {};
  const users: Record<string, number> = {};

  // Iterate over the achievements to calculate points with the order in mind
  for (const achievement of achievements) {
    const user = users[achievement.userId];

    if (user === undefined) {
      users[achievement.userId] = achievement.points;
      points[achievement.points] = [
        ...(points[achievement.points] ?? []),
        achievement.userId,
      ];
    } else {
      const oldPoints = users[achievement.userId];
      const newPoints = oldPoints + achievement.points;

      points[oldPoints] = (points[oldPoints] ?? []).filter(
        (userId) => userId !== achievement.userId
      );

      if (points[oldPoints].length === 0) {
        delete points[oldPoints];
      }

      points[newPoints] = [...(points[newPoints] ?? []), achievement.userId];
      users[achievement.userId] = newPoints;
    }
  }

  // Flatten the points dictionary into an array
  const leaderboard: Leaderboard = [];

  for (const pointAmount of Object.keys(points)) {
    points[parseInt(pointAmount)]
      .map((userId: string) => ({
        points: parseInt(pointAmount),
        userId,
      }))
      .forEach((entry) => leaderboard.push(entry));
  }

  return [...leaderboard].sort((a, b) => b.points - a.points);
}
