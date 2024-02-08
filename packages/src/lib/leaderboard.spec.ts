import { Achievement, Leaderboard, calculateLeaderboard } from './leaderboard';

describe('leaderboard', () => {
  it('should calculate a simple leaderboard', () => {
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
});
