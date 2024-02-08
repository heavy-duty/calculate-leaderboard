import {
  Achievement,
  Leaderboard,
  calculateLeaderboard,
} from './calculate-leaderboard';

describe('leaderboard', () => {
  it('should calculate a simple leaderboard.', () => {
    const achievements: Array<Achievement> = [
      {
        userId: '1',
        points: 10,
        date: new Date(Date.now()),
      },
      {
        userId: '2',
        points: 5,
        date: new Date(Date.now()),
      },
      {
        userId: '3',
        points: 1,
        date: new Date(Date.now()),
      },
    ];
    const leaderboard: Leaderboard = calculateLeaderboard(achievements);

    expect(leaderboard.length).toBe(3);
    expect(leaderboard[0].userId).toBe('1');
    expect(leaderboard[0].points).toBe(10);
    expect(leaderboard[1].userId).toBe('2');
    expect(leaderboard[1].points).toBe(5);
    expect(leaderboard[2].userId).toBe('3');
    expect(leaderboard[2].points).toBe(1);
  });

  it('should handle users with multiple entries.', () => {
    const achievements: Array<Achievement> = [
      {
        userId: '1',
        points: 10,
        date: new Date(Date.now()),
      },
      {
        userId: '1',
        points: 5,
        date: new Date(Date.now()),
      },
      {
        userId: '2',
        points: 10,
        date: new Date(Date.now()),
      },
    ];
    const leaderboard: Leaderboard = calculateLeaderboard(achievements);

    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0].userId).toBe('1');
    expect(leaderboard[0].points).toBe(15);
    expect(leaderboard[1].userId).toBe('2');
    expect(leaderboard[1].points).toBe(10);
  });

  it('should process achievements with the same points and date in the order they appear', () => {
    const now = Date.now();
    const achievements: Array<Achievement> = [
      {
        userId: '1',
        points: 10,
        date: new Date(now),
      },
      {
        userId: '2',
        points: 10,
        date: new Date(now + 1),
      },
    ];
    const leaderboard: Leaderboard = calculateLeaderboard(achievements);

    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0].userId).toBe('1');
    expect(leaderboard[0].points).toBe(10);
    expect(leaderboard[1].userId).toBe('2');
    expect(leaderboard[1].points).toBe(10);
  });

  it('should maintain chronological order for tied points across different users.', () => {
    const now = Date.now();
    const achievements: Array<Achievement> = [
      {
        userId: '1',
        points: 10,
        date: new Date(now),
      },
      {
        userId: '2',
        points: 10,
        date: new Date(now + 1),
      },
      {
        userId: '2',
        points: 5,
        date: new Date(now + 2),
      },
      {
        userId: '1',
        points: 5,
        date: new Date(now + 3),
      },
    ];
    const leaderboard: Leaderboard = calculateLeaderboard(achievements);

    expect(leaderboard.length).toBe(2);
    expect(leaderboard[0].userId).toBe('2');
    expect(leaderboard[0].points).toBe(15);
    expect(leaderboard[1].userId).toBe('1');
    expect(leaderboard[1].points).toBe(15);
  });

  it('should handle a large number of achievements efficiently', () => {
    const achievementsQuantity = 100_000;
    const achievements: Array<Achievement> = [];
    for (let i = 0; i < achievementsQuantity; i++) {
      achievements.push({
        userId: `user${i}`,
        points: i % 100,
        date: new Date(Date.now() + i),
      });
    }
    const startTime = performance.now();
    const leaderboard = calculateLeaderboard(achievements);
    const endTime = performance.now();

    expect(leaderboard.length).toBe(achievementsQuantity);
    expect(leaderboard[0].points).toBeGreaterThanOrEqual(leaderboard[1].points);
    expect(endTime - startTime).toBeLessThan(1000); // Example threshold, adjust based on expectations
  });

  it('should rigorously maintain chronological order with tight ties and simultaneous achievements', () => {
    const now = Date.now();
    const achievements: Array<Achievement> = [
      { userId: '1', points: 8, date: new Date(now) },
      { userId: '2', points: 15, date: new Date(now + 50) }, // User 2 leads
      { userId: '3', points: 7, date: new Date(now + 100) }, // User 3 starts
      { userId: '1', points: 7, date: new Date(now + 150) }, // User 1 increases but still behind User 2
      { userId: '4', points: 20, date: new Date(now + 200) }, // User 4 takes the lead
      { userId: '5', points: 20, date: new Date(now + 200) }, // User 5 ties with User 4 instantly
      { userId: '2', points: 6, date: new Date(now + 250) }, // User 2 increases
      { userId: '3', points: 14, date: new Date(now + 300) }, // User 3 jumps ahead
      { userId: '1', points: 10, date: new Date(now + 350) }, // User 1 now at 25
      { userId: '3', points: 1, date: new Date(now + 400) }, // User 3 increases
      { userId: '2', points: 9, date: new Date(now + 450) }, // User 2 now at 30, leading
      { userId: '4', points: 5, date: new Date(now + 500) }, // User 4 increases
      { userId: '5', points: 5, date: new Date(now + 500) }, // User 5 increases
      { userId: '6', points: 30, date: new Date(now + 550) }, // User 6 ties with User 2
      { userId: '2', points: 1, date: new Date(now + 600) }, // User 2 slightly increases
      { userId: '3', points: 2, date: new Date(now + 600) }, // User 3 increases
      { userId: '1', points: 3, date: new Date(now + 600) }, // User 1 increases
      { userId: '4', points: 1, date: new Date(now + 650) }, // User 4 slightly increases
      { userId: '5', points: 1, date: new Date(now + 650) }, // User 5 slightly increases
    ];
    const leaderboard = calculateLeaderboard(achievements);

    expect(leaderboard.length).toBe(6);
    expect(leaderboard[0].userId).toBe('2'); // First to reach 30 points
    expect(leaderboard[1].userId).toBe('6'); // Reached 30 points, but after User 2
    expect(leaderboard[2].userId).toBe('1'); // User 1 with 28 points
    expect(leaderboard[3].userId).toBe('4'); // User 4 with 26 points, tied with User 5 but listed first arbitrarily due to simultaneous last achievement
    expect(leaderboard[4].userId).toBe('5'); // User 5 with 26 points, tied with User 4
    expect(leaderboard[5].userId).toBe('3'); // User 3 with 24 points
  });
});
