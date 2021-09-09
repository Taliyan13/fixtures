const csv = require("csv-parser");
const e = require("express");
const fs = require("fs").promises;
const path = require("path");
const dirPath = path.join("assets/matches");

const matchesDataToObject = (query, data, matchStatus) => {
  const matches = [];
  // Split to rows and remove headers 
  const rows = data.split('\n').slice(1, data.split('\n').length);
  const filterBy = Object.keys(query);

  rows.forEach(row => {
    const splittedRow = row.split(',');
    if (matchStatus === 'upcoming') {
      matches.push({
        homeTeam: splittedRow[0],
        awayTeam: splittedRow[1],
        tournament: splittedRow[2],
        date: `${splittedRow[3]}, ${splittedRow[4].trim()}`  
      });
    }
    else if (matchStatus === 'played') {
      matches.push({
        homeTeam: splittedRow[0],
        awayTeam: splittedRow[2],
        tournament: splittedRow[4],
        score: `${splittedRow[1]}-${splittedRow[3]}`,
        date: splittedRow[5].replace('\r', '')
      });
    }
  })
  return matches.filter((match) =>
  filterBy[0] === 'tournament'
  ? match.tournament.toLowerCase() === query.tournament.toLowerCase()
      : match.homeTeam.toLowerCase() === query.team.toLowerCase() ||
        match.awayTeam.toLowerCase() === query.team.toLowerCase()
  );
};

const fetchMatchesData = async (query, matchStatus) => {
  const matches = [];
  const files = await fs.readdir(dirPath, (err, files) => {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    return files;
  });

  //listing all files using forEach
   if (files) {
     if (!matchStatus) {
      for (const file of files) {
        const status = file.includes('upcoming') ? 'upcoming' : 'played';
        const data = await fs.readFile(`${dirPath}/${file}`, 'utf8', (err) => {
          if (err) {
            return console.log("Unable to read file: " + err);
          }
        });
        matches.push(...matchesDataToObject(query, data, status));
       }
       return matches;
     }
    const file = files.find(file => file.includes(matchStatus));
    if (file) {
      const data = await fs.readFile(`${dirPath}/${file}`, 'utf8', (err, data) => {
        if (err) {
          return console.log("Unable to read file: " + err);
        }
      });
      if (data) {
        return matchesDataToObject(query, data, matchStatus);
      }  
    }
    return null;
  }
   return null; 
};

module.exports = {
  getAllTeamMatches(team) {
    const query = {team}
    return fetchMatchesData(query);
  },
  getFilteredTeamMatches(team, matchStatus) {
    const query = {team}
    return fetchMatchesData(query, matchStatus);
  },
  getAllTournamentMatches(tournament) {
    const query = {tournament}
    return fetchMatchesData(query);
  },
  getFilteredTournamentMatches(tournament, matchStatus) {
    const query = {tournament}
    return fetchMatchesData(query, matchStatus);
  },
};
