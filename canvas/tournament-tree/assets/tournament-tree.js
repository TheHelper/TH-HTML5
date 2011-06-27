// Crockford
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
// /Crockford

var Tournament;
(function () {
    Tournament = function (canvas, options) {
        var c = canvas.getContext('2d'),
            self = this;
        
        // Defaults.
        this.rounds = [];
        options = options || {};
        this.options = {};
        
        this.options.width = options.width || 140;
        this.options.height = options.height || 16;
        this.options.xspacing = options.xspacing || 10;
        this.options.yspacing = options.yspacing || 10;
        this.options.padding = options.padding || 1;
        
        this.options.fontStyle = options.fontStyle || '10px sans-serif';
        this.options.fontSize = options.fontSize || 10;
        this.options.strokeStyle = options.strokeStyle || 'black';
        this.options.fillStyle = options.fillStyle || 'black';
        this.options.undecidedStyle = options.undecidedStyle || '#333333';
        this.options.winGradientStart = options.winGradientStart || '#aaffaa';
        this.options.winGradientEnd = options.winGradientEnd || '#99cc99';
        this.options.loseGradientStart = options.loseGradientStart || '#ffaaaa';
        this.options.loseGradientEnd = options.loseGradientEnd || '#cc9999';
        this.options.neutralGradientStart =
            options.neutralGradientStart || '#aaccff';
        this.options.neutralGradientEnd =
            options.neutralGradientEnd || '#77aacc';
        
        /** <Tournament>.draw method
         *
         * Draws the tournament tree.
         * 
         ** Arguments
         * 
         * maxRound
         *      The last round to be drawn completed. Defaults
         *      to <Tournament>.rounds.length.
         *      
         *      For example if maxRound is 0, the first round
         *      will be drawn, all scores being 0 and no match
         *      completed. The other rounds will be drawn with
         *      undefined players and scores.
         *
         *      If maxRound is 1, the first round is drawn
         *      completely, meaning all matches are drawn
         *      according to given data, scores displayed
         *      and winner highlighted.
         *          The second round is drawn with scores
         *      0, but players according to given (or
         *      calculated) data. The rest of the rounds
         *      are drawn with undefined players and scores.
         *
         *      If maxRound is <Tournament>.rounds.length,
         *      all rounds are drawn according to given and
         *      calculated data.
         */
        this.draw = function (maxRound) {
            var x = 0.5,
                y,
                i,
                j,
                r,
                o,
                
                lineX,
                
                matches,
                match,
                
                totalHeight = self.rounds[0].matches.length *
                    (2 * self.options.height + self.options.yspacing) +
                    self.options.yspacing,
                totalWidth = self.rounds.length *
                    (self.options.width + self.options.xspacing) +
                    self.options.xspacing;
            
            function drawMatch(m) {
                var w = self.options.width,
                    h = self.options.height;
                
                function drawPlayer(p, score, x, y) {
                    if (p && p._toLoad !== 0) {
                        // Images haven't been loaded, draw the player later.
                        p._whenLoaded.push(function () {
                            drawPlayer(p, score, x, y);
                        });
                        return;
                    }
                    
                    if (!p) {
                        // Player is undefined.
                        c.font = self.options.fontStyle;
                        c.fillStyle = self.options.undecidedStyle;
                        c.fillText('0', x + w - 10, y + self.options.fontSize + 1);
                        c.fillText('Undecided', x + self.options.padding,
                            y + self.options.fontSize + 1
                        );
                        c.fillStyle = self.options.fillStyle;
                        return;
                    }
                    
                    // http://diveintohtml5.org/canvas.html#pixel-madness
                    x += 0.5;
                    y += 0.5;
                    
                    c.font = self.options.fontStyle;
                    // Draw score to the right.
                    c.fillText(score, x + w - self.options.fontSize, 
                        y + self.options.fontSize + 1
                    );
                    
                    // Draw the flag.
                    if (p.flag) {
                        c.drawImage(p.flag, x, y);
                        x += self.options.padding + p.flag.width;
                    }
                    
                    // Draw the extra image.
                    if (p.extraImg) {
                        c.drawImage(p.extraImg, x, y + 1);
                        x += self.options.padding + p.extraImg.width;
                    }
                    
                    // Draw the player's name.
                    x += self.options.padding;
                    c.fillText(p.name, x, y + self.options.fontSize + 1);
                }
                
                c.strokeRect(m.x, m.y, w, h);
                c.strokeRect(m.x, m.y + h, w, h);
                
                // Set gradient colors.
                if (m.completed) {
                    // Winner is decided, make him get the biwinning colors.
                    m.grads[m.winner].addColorStop(0,
                        self.options.winGradientStart
                    );
                    m.grads[m.winner].addColorStop(1,
                        self.options.winGradientEnd
                    );
                    
                    // And the loser gets the other colors.
                    // !m.winner gets the opposite of winner,
                    // and + casts it to an integer.
                    m.grads[+!m.winner].addColorStop(0,
                        self.options.loseGradientStart
                    );
                    m.grads[+!m.winner].addColorStop(1,
                        self.options.loseGradientEnd
                    );
                } else {
                    // Winner hasn't been decided yet,
                    // use neutral colors for both.
                    m.grads[0].addColorStop(0,
                        self.options.neutralGradientStart
                    );
                    m.grads[0].addColorStop(1,
                        self.options.neutralGradientEnd
                    );
                    
                    m.grads[1].addColorStop(0,
                        self.options.neutralGradientStart
                    );
                    m.grads[1].addColorStop(1,
                        self.options.neutralGradientEnd
                    );
                }
                
                // Fill the gradients.
                c.fillStyle = m.grads[0];
                c.fillRect(m.x + 1, m.y + 1, w - 2, h - 2);
                c.fillStyle = m.grads[1];
                c.fillRect(m.x + 1, m.y + h + 1, w - 2, h - 2);
                
                // Draw the players.
                c.fillStyle = self.options.fillStyle;
                drawPlayer(m.players[0], m.scores[0], m.x, m.y);
                drawPlayer(m.players[1], m.scores[1], m.x, m.y + h);
            }
            
            if (maxRound === undefined) {
                maxRound = self.rounds.length;
            }
            
            canvas.height = totalHeight;
            canvas.width = totalWidth;
            
            c.font = self.options.fontStyle;
            c.beginPath(); // For drawing the lines between rounds and matches.
            c.strokeStyle = self.options.strokeStyle;
            
            for (i = 0; i < self.rounds.length; i++) {
                matches = self.rounds[i].matches;
                y = 0.5;
                x += self.options.xspacing;
                
                for (j = 0; j < matches.length; j++) {
                    match = matches[j];
                    
                    // Generate the ys for the first round,
                    // calculate the rest from the previous round.
                    if (i === 0) {
                        y += self.options.yspacing;
                        match.y = y;
                    } else {
                        r = self.rounds[i - 1].matches; // Previous round.
                        match.y = (r[j * 2].y + r[j * 2 + 1].y) / 2;
                    }
                    
                    match.x = x;
                    
                    // Create the gradients.
                    match.grads = [];
                    match.grads[0] = c.createLinearGradient(match.x, match.y,
                        match.x, match.y + self.options.height
                    );
                    match.grads[1] = c.createLinearGradient(match.x,
                        match.y + self.options.height,
                        match.x, match.y + self.options.height * 2
                    );
                    
                    // Consider maxRound.
                    if (i >= maxRound) {
                        // We cannot modify match directly,
                        // as those changes would delete data needed
                        // when all matches are to be drawn.
                        // Therefore, we create a new object whose
                        // prototype is match and make the new object
                        // have the fields we want to override.
                        // The other fields aren't found in the new
                        // object, so they are searched for in the
                        // prototype (i.e. the "real" object).
                        o = Object.create(match);
                        o.completed = false;
                        o.scores = [0, 0];
                        
                        if (i > maxRound) {
                            o.players = [undefined, undefined];
                        }
                        
                        drawMatch(o);
                    } else {
                        drawMatch(match);
                    }
                    
                    // Draw connecting lines.
                    if (i !== 0) {
                        // Line to previous round.
                        c.moveTo(x, match.y + self.options.height);
                        c.lineTo(x - self.options.xspacing / 2,
                            match.y + self.options.height
                        );
                    }
                    
                    if (i !== self.rounds.length - 1) {
                        // Line to next round.
                        lineX = x + self.options.width + 
                            self.options.xspacing / 2;
                        c.moveTo(x + self.options.width,
                            match.y + self.options.height
                        );
                        c.lineTo(lineX, match.y + self.options.height);
                        
                        // Connect the horizontal lines with vertical ones.
                        if (j % 2 === 1) {
                            c.moveTo(lineX, match.y + self.options.height);
                            c.lineTo(lineX,
                                matches[j - 1].y + self.options.height
                            );
                        }
                    }
                    
                    y += self.options.height * 2;
                } // for
                
                x += self.options.width;
            } // for
            
            // Actually draw the lines.
            c.stroke();
        };
        
        this.calculate = function () {
            var l = self.rounds.length - 1,
                i,
                j,
                m,
                matches;
            
            for (i = 0; i < l; i++) {
                matches = self.rounds[i].matches;
                
                for (j = 0; j < matches.length; j += 2) {
                    // rounds[1].matches[0] gets its players
                    // from rounds[0]'s matches[0] and matches[1].
                    // rounds[1].matches[1] gets its players
                    // from rounds[0]'s matches[2] and matches[3].
                    m = self.rounds[i + 1].matches[j / 2];
                    
                    // Add first match's winner.
                    m.players = matches[j].completed
                        ? [matches[j].players[matches[j].winner]]
                        : [undefined];
                    
                    // Add second match's winner.
                    m.players.push(matches[j + 1].completed
                        ? matches[j + 1].players[matches[j + 1].winner]
                        : undefined
                    );
                }
            }
        };
    };

    Tournament.Player = function (name, flag, extraImg, prevRank) {
        var self = this;
        
        function onload() {
            var i;
            self._toLoad--;
            
            if (self._toLoad === 0) {
                // All images have been loaded.
                for (i = 0; i < self._whenLoaded.length; i++) {
                    self._whenLoaded[i]();
                }
            }
        }
        
        function makeImage(a, b) {
            self[a] = new Image();
            self[a].src = b;
        }
        
        this.name = name;
        this.prevRank = prevRank;
        this._toLoad = 0;
        this._whenLoaded = [];
        
        if (typeof extraImg === 'string') {
            makeImage('extraImg', extraImg);
        } else {
            this.extraImg = extraImg;
        }
        
        if (typeof flag === 'string') {
            makeImage('flag', flag);
        } else {
            this.flag = flag;
        }
        
        this._toLoad = 2;
        this.extraImg.onload = onload;
        this.flag.onload = onload;
    };

    /** Tournament.Round Object
     *
     ** Arguments
     *
     * options.winsRequired
     *      How many wins are required to win a match on
     *      this round.
     *
     ** Members
     * 
     * <Tournament.Round>.tournament
     *      Tournament this round belongs to.
     *
     * <Tournament.Round>.matches
     *      Matches in this round.
     *
     * <Tournament.Round>.winsRequired
     *      How many wins are required to win on this round.
     */
    Tournament.Round = function (tournament, options) {
        options = options || {};
        
        this.tournament = tournament;
        tournament.rounds.push(this);
        
        this.matches = [];
        this.winsRequired = options.winsRequired;
    };

    /** Tournament.Match Object
     *
     ** Arguments
     *
     * round
     *      The round this match is a part of.
     *
     * options.players
     *      List of players in this match. If present, must have
     *      a length of 2. Defaults to [undefined, undefined].
     *
     * options.scores
     *      List of scores. scores[0] is score for players[0],
     *      and scores[1] for players[1]. Defaults to [0, 0].
     *
     * options.completed
     *      Whether the match is completed or not.
     *
     * options.winner
     *      0 or 1.
     *
     ** Members
     *
     * <Tournament.Match>.players
     * <Tournament.Match>.scores
     * <Tournament.Match>.completed
     * <Tournament.Match>.winner
     *      Important to set especially if all matches weren't played.
     *
     */
    Tournament.Match = function (round, options) {
        options = options || {};
        this.round = round;
        this.round.matches.push(this);
        
        this.players = options.players || [undefined, undefined];
        this.scores = options.scores || [0, 0];
        
        this.__defineSetter__('completed', function (val) {
            this._completed = val;
        });
        this.__defineGetter__('completed', function () {
            return this._completed || 
                (Math.max(this.scores[0], this.scores[1]) 
                === this.round.winsRequired);
        });
        
        this.__defineSetter__('winner', function (val) {
            this._winner = val;
            this._completed = true;
        });
        this.__defineGetter__('winner', function () {
            if (this._winner) {
                return this._winner;
            }
            
            if (this.completed) {
                // boolean -> integer
                return +(this.scores[0] < this.scores[1]);
            }
            
            // Winner hasn't been defined.
            return undefined;
        });
    };
}());




