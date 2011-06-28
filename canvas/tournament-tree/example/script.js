var tournament;

(function () {
    var ps = [
            new Tournament.Player('Monsterous', 
                'images/england.png',
                'images/terran.png'
            ),
            new Tournament.Player('Covereths', 
                'images/sweden.png', 
                'images/protoss.png'
            ),
            new Tournament.Player('Siretu', 
                'images/sweden.png', 
                'images/zerg.png'
            ),
            new Tournament.Player('pixel', 
                'images/spain.png', 
                'images/terran.png'
            ),
            new Tournament.Player('Vestras',
                'images/denmark.png',
                'images/zerg.png'
            ),
            new Tournament.Player('S3rius',
                'images/germany.png',
                'images/terran.png'
            ),
            new Tournament.Player('Bloodcount',
                'images/bulgaria.png',
                'images/zerg.png'
            ),
            new Tournament.Player('Speedlink',
                'images/estonia.png',
                'images/protoss.png'
            )
        ];
    
    tournament = new Tournament(document.getElementById('tree'));
    
    // Add rounds.
    new Tournament.Round(tournament, { winsRequired: 2 });
    new Tournament.Round(tournament, { winsRequired: 2 });
    new Tournament.Round(tournament, { winsRequired: 3 });
    
    // Register matches.
    new Tournament.Match(tournament.rounds[0], { 
        players: [ps[0], ps[1]],
        scores: [2, 0]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[2], ps[3]],
        scores: [0, 2]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[4], ps[5]],
        scores: [1, 2]
    });
    new Tournament.Match(tournament.rounds[0], {
        players: [ps[6], ps[7]],
        scores: [0, 2]
    });
    
    new Tournament.Match(tournament.rounds[1], {
        scores: [1, 2]
    });
    new Tournament.Match(tournament.rounds[1], {
        scores: [1, 0],
    }).winner = 0;
    
    new Tournament.Match(tournament.rounds[2], {
        scores: [0, 3]
    });
    
    tournament.calculate();
    // Draw the tournament.
    tournament.draw(0);
})();
