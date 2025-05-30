
function fixDoubleEncoded(str) {
    try {
        // Turn escaped unicode into actual bytes
        const decoded = decodeURIComponent(escape(str));
        return decoded;
    } catch (e) {
        return str; // fallback in case of error
    }
}
async function loadLeaderboard() {

    const proxyURL = 'https://corsproxy.io/?url=';
    const apiURL = 'https://o76fno8oxh.execute-api.eu-central-1.amazonaws.com/api/leaderboard/a196bfec-a0e7-431d-8b2d-e11e7ad00bbc/rankings';

    const response = await fetch(proxyURL + encodeURIComponent(apiURL));
    var leaderboardData = await response.json();
    var leaderboardData = leaderboardData.data;
    var teams = require('./data.json')

    leaderboardData.forEach(entry => {
        const numberName = entry.attributes.number_name;
        const match = numberName.match(/^(\d+)\s*-/);

        if (match) {
            const teamNumber = match[1]; // Match formatting in teams object

            if (teams[teamNumber]) {
                teams[teamNumber].rank= entry.attributes.rank,
                teams[teamNumber].Scores = {
                    
                    highscore: entry.attributes.high_score,
                    scores: [
                        entry.attributes.match_1_score,
                        entry.attributes.match_2_score,
                        entry.attributes.match_3_score
                    ]
                };
            }
        }
    });

    const tbody = document.querySelector('#leaderboardTable tbody');
    tbody.innerHTML = ''; // Clear any existing rows
    teams =Object.entries(teams).sort(([, a], [, b]) => Number(a.rank) - Number(b.rank));
    for (let i = 0;i < teams.length; i++) {
        let teamInfo = teams[i][1]
        let scoreTexts = []
        for (let j = 0; j < 3; j++) {
            score = teamInfo.Scores.scores[j]
            if (score == 0) {
                scoreTexts.push(teamInfo.Rounds[j][0])
                continue
            }
            scoreTexts.push(score)
        }

        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${fixDoubleEncoded(teamInfo.Name)}<h5 style="margin: 0;">${fixDoubleEncoded(teamInfo.Home)}</h5></td>
      <td>${teamInfo.rank}</td>
      <td>${teamInfo.Scores.highscore}</td>
      <td>${scoreTexts[0]}</td>
      <td>${scoreTexts[1]}</td>
      <td>${scoreTexts[2]}</td>
    `;
        tbody.appendChild(row);
    }
}

// Load leaderboard on page load
window.onload = loadLeaderboard;