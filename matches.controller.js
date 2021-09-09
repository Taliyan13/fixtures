  
const { getAllTeamMatches, getFilteredTeamMatches, getAllTournamentMatches, getFilteredTournamentMatches } = require("./matches.service");

module.exports = {
  async getMatches(req, res, next) {
    const { team, tournament, match_status} = req.query;
    console.log(req.query)
    // Call matches service
    if (team && match_status) {
      // Call Team's matches by status
      const results = await getFilteredTeamMatches(team, match_status);
      if(!results) {
        return res.status(400).json({message: 'Can`t find data'});
      }
      return res.status(200).json(results);
    }
    
    if (tournament && match_status) {
      // Call Tournament matches by status
      const results = await getFilteredTournamentMatches(tournament, match_status);
      if(!results) {
        return res.status(400).json({message: 'Can`t find data'});
      }
      return res.status(200).json(results);
    }

    if (team) {
      // Call Team's matches
      const results = await getAllTeamMatches(team);
      if(!results) {
        return res.status(400).json({message: 'Can`t find data'});
      }
      return res.status(200).json(results);
    }

    if (tournament) {
      // Call Tournament matches
      const results = await getAllTournamentMatches(tournament);
      if(!results) {
        return res.status(400).json({message: 'Can`t find data'});
      }
      return res.status(200).json(results);
    }

    return res.status(400).json({message: 'Inappropriate input'});
    // const result = await getStockRecord(next);
    // if (!result) {
    //   return;
    // }

    return res.status(200).json({message: "ok"});
  },
};
