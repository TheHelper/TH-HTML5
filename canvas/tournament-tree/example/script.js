var tournament;

(function () {
    var ps = [
            new Tournament.Player('iNsSiretu', 
                'images/sweden.png',
                'images/random.png'
            ),
            new Tournament.Player('iNsSevion', 
                'images/usa.png', 
                'images/zerg.png'
            ),
            new Tournament.Player('Bloodcount', 
                'images/bulgaria.png', 
                'images/protoss.png'
            ),
            new Tournament.Player('Theodor', 
                'images/denmark.png', 
                'images/terran.png'
            ),
            new Tournament.Player('usan00b',
                'images/usa.png',
                'images/random.png'
            ),
            new Tournament.Player('haxx0r',
                'images/usa.png',
                'images/zerg.png'
            ),
            new Tournament.Player('sweDe',
                'images/sweden.png',
                'images/terran.png'
            ),
            new Tournament.Player('dane',
                'images/denmark.png',
                'images/zerg.png'
            )
        ];
    
    tournament = new Tournament(document.getElementById('tree'));
    
    // Add rounds.
    new Tournament.Round(tournament, { winsRequired: 2 });
    new Tournament.Round(tournament, { winsRequired: 3 });
    new Tournament.Round(tournament, { winsRequired: 5 });
    
    // Register matches.
    new Tournament.Match(tournament.rounds[0], { 
        players: [ps[0], ps[7]],
        scores: [2, 1]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[1], ps[6]],
        scores: [2, 0]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[5], ps[2]],
        scores: [0, 2]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[3], ps[4]],
        scores: [2, 1]
    });
    
    new Tournament.Match(tournament.rounds[1], {
        players: [ps[0], ps[1]],
        scores: [1, 3]
    });
    new Tournament.Match(tournament.rounds[1], {
        players: [ps[2], ps[3]],
        scores: [2, 2]
    });
    
    new Tournament.Match(tournament.rounds[2], {
        players: [ps[1], undefined]
    });
    
    // Draw the tournament.
    tournament.draw();
})();
