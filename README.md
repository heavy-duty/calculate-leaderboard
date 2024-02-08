# @heavy-duty/calculate-leaderboard

The `@heavy-duty/calculate-leaderboard` package provides a sophisticated yet easy-to-use TypeScript solution for dynamically calculating and updating leaderboards based on user achievements. It is designed to handle scenarios with incremental updates, ensuring that ties are resolved by the order in which achievements were earned. This package is perfect for applications that need to maintain an accurate leaderboard in real-time, such as gaming platforms, educational technology apps, and more.

## Features

- **Dynamic Leaderboard Updates**: Seamlessly integrates new achievements into an existing leaderboard.
- **Tie Resolution**: Prioritizes users who reached a points total first, ensuring a fair and chronological ranking.
- **Data Validation**: Includes a function to validate the structure and data types of achievement objects.
- **Scalability**: Efficiently processes a large volume of achievements, suitable for high-demand environments.

## Installation

To install the package, run the following command in your project directory:

```bash
npm install @heavy-duty/calculate-leaderboard
```

## Usage

To use this package, you'll first need to import the `calculateLeaderboard` function and the types it depends on:

```typescript
import {
  calculateLeaderboard,
  Achievement,
  Leaderboard,
} from '@heavy-duty/calculate-leaderboard';
```

Then, you can calculate or update a leaderboard as shown in the example below:

```typescript
// Existing leaderboard (can be empty)
const oldLeaderboard: Leaderboard = [
  // Pre-existing leaderboard entries, if any
];

// New achievements to be integrated
const newAchievements: Achievement[] = [
  { userId: 'user1', points: 100, date: new Date('2023-01-01T12:00:00Z') },
  { userId: 'user2', points: 150, date: new Date('2023-01-01T12:05:00Z') },
  // Add more achievements as needed
];

// Calculate the updated leaderboard
const updatedLeaderboard = calculateLeaderboard(
  oldLeaderboard,
  newAchievements
);

console.log(updatedLeaderboard);
```

## Contributing

Contributions are welcome! If you have a feature request, bug report, or a suggestion, please open an issue in the GitHub repository. Feel free to fork the repository and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file in the repository for more details.

## Contact

- **Name**: Dan
- **Twitter**: [@danm_t](https://twitter.com/danm_t)
- **GitHub Repository**: [https://github.com/heavy-duty/calculate-leaderboard](https://github.com/heavy-duty/calculate-leaderboard)

For more information or support, feel free to contact Dan through Twitter or open an issue in the GitHub repository.
