import { DateTime } from 'luxon';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

/**
 * Fetches today's accepted submissions for a LeetCode user
 * @param {string} username - LeetCode username
 * @returns {Promise<Array>} Array of today's submissions
 */
export async function fetchTodayAcSubmissions(username) {
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

    try {
        console.log(`Fetching recent submissions for: ${username}`);
        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { username, limit: 15 },
                operationName: 'recentAcSubmissions'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`LeetCode API error (${response.status}) for ${username}:`, errorText);
            throw new Error(`LeetCode API returned status ${response.status}`);
        }

        const { data } = await response.json();
        if (!data || !data.recentAcSubmissionList) {
            console.warn(`No submission data returned for ${username}`);
            return [];
        }

        const now = DateTime.utc();
        // Filter for submissions from today
        const todayStart = now.startOf('day').toSeconds();

        const subs = data?.recentAcSubmissionList || [];
        return subs
            .filter(sub => Number(sub.timestamp) >= todayStart)
            .map(sub => ({
                title: sub.title,
                time: DateTime.fromSeconds(Number(sub.timestamp), { zone: 'Asia/Kolkata' }).toFormat('HH:mm:ss'),
                submissionId: sub.id,
                titleSlug: sub.titleSlug
            }));
    } catch (error) {
        console.error(`Error in fetchTodayAcSubmissions for ${username}:`, error);
        throw error;
    }
}

/**
 * Fetches total solved problem counts for a LeetCode user
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} Object with total problem counts by difficulty
 */
export async function fetchTotalSolvedCounts(username) {
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

    try {
        console.log(`Fetching solved counts for: ${username}`);
        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { userSlug: username },
                operationName: 'userProfileUserQuestionProgressV2'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`LeetCode API error (${response.status}) for ${username}:`, errorText);
            throw new Error(`LeetCode API returned status ${response.status}`);
        }

        const { data } = await response.json();

        if (!data || !data.userProfileUserQuestionProgressV2 || !data.userProfileUserQuestionProgressV2.numAcceptedQuestions) {
            console.warn(`No solved count data returned for ${username}`);
            return { easy: 0, medium: 0, hard: 0, total: 0 };
        }

        const counts = data.userProfileUserQuestionProgressV2.numAcceptedQuestions.reduce((acc, item) => {
            acc[item.difficulty.toLowerCase()] = item.count;
            acc.total += item.count;
            return acc;
        }, { easy: 0, medium: 0, hard: 0, total: 0 });

        return counts;
    } catch (error) {
        console.error(`Error in fetchTotalSolvedCounts for ${username}:`, error);
        throw error;
    }
}

// Default usernames for fallback
export const DEFAULT_USERNAMES = [
    // "omj000080",
    // "av__01",
    // "harshil_kiwi",
    // "Markio125",
    // "garuda_001",
    // "JoyBoyIsHere",
    // "pra_bhat_",
    // "luffy_98",
    // "Leet_vibhanshu"
];
