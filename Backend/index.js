import express from 'express';
import cors from 'cors';
import { DateTime } from 'luxon';

const app = express();
app.use(cors());

const PORT = 3001;

const usernames = [
  "omj000080",
  "av__01",
  "harshil_kiwi",
  "Markio125",
  "garuda_001", 
  "JoyBoyIsHere", 
  // "harshdalmia20212081", 
  "pra_bhat_"
];

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

async function fetchTodayAcSubmissions(username) {
  const query = `
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { username, limit: 15 },
      operationName: 'recentAcSubmissions'
    })
  });

  const { data } = await response.json();
  const now = DateTime.utc();
  const todayStart = now.startOf('day').toSeconds();

  const subs = data?.recentAcSubmissionList || [];
  return subs
    .filter(sub => Number(sub.timestamp) >= todayStart)
    .map(sub => ({
      title: sub.title,
      time: DateTime.fromSeconds(Number(sub.timestamp), { zone: 'utc' }).toFormat('HH:mm:ss'),
    }));
}

async function fetchTotalSolvedCounts(username) {
  const query = `
    query userProfileUserQuestionProgressV2($userSlug: String!) {
      userProfileUserQuestionProgressV2(userSlug: $userSlug) {
        numAcceptedQuestions {
          count
          difficulty
        }
      }
    }
  `;

  const response = await fetch(LEETCODE_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { userSlug: username },
      operationName: 'userProfileUserQuestionProgressV2'
    })
  });

  const { data } = await response.json();
  const counts = data?.userProfileUserQuestionProgressV2?.numAcceptedQuestions || [];

  const result = { easy: 0, medium: 0, hard: 0 };
  counts.forEach(({ count, difficulty }) => {
    result[difficulty.toLowerCase()] = count;
  });

  return result;
}

// 👇 API Route
app.get('/api/report', async (req, res) => {
  const result = [];

  for (const username of usernames) {
    try {
      const todaySubs = await fetchTodayAcSubmissions(username);
      const totals = await fetchTotalSolvedCounts(username);

      result.push({
        username,
        todaySubs,
        totals
      });
    } catch (error) {
      result.push({
        username,
        error: error.toString(),
      });
    }
  }

  res.json({ reportGeneratedAt: DateTime.utc().toISO(), data: result });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
