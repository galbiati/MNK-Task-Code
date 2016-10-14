var units = ['miners', 'armies', 'builders']
var props = ['miners', 'armies', 'builders', 'walls', 'ore'];
var wall_max = 20;



function Player(num) {
    var that = this;
    this.num = num;
    this.id = '#p' + String(num);

    for (i=0; i<props.length; i++) {
       that[props[i]] = parseInt($(that.id + ' .' + props[i]).text());
    }

    this.buy = function(item) {
        if (((units.includes(item))) && (parseInt(that.ore) > 0)) {
            that[item] ++;
            that.ore --;
            $(that.id + ' .' + item).text(that[item]);
            $(that.id + ' .ore').text(that.ore);
            
        } else {
            console.log("Can't do that!"); 
        }
    };
}

function Game() {
    var that = this;
    this.players = [new Player(0), new Player(1)];
    this.turn = 0;
    this.current_player = 0;

    this.end_turn = function(player_no) {
        p = that.players[player_no];
        o = that.players[(player_no+1)%2]
        $(p.id + ' button').prop('disabled', true);
        p.ore += p.miners;
        p.walls += p.builders;
        p.walls = p.walls > 50 ? 50 : p.walls;
        
        o.walls -= p.armies;
        o.walls = o.walls < 0 ? 0 : o.walls;
        o.miners = o.miners - Math.floor(p.armies/2);
        o.builders = o.builders - Math.floor(p.armies/2);
        o.miners = o.miners < 1 ? 1 : o.miners;
        o.builders = o.builders < 0 ? 0 : o.builders;

        p.armies = Math.ceil(p.armies/2);
        G.update(p);
        G.update(o);

        if ((o.walls > 0) && (p.walls < wall_max)) {
            that.turn ++;
            that.current_player = (that.current_player + 1) % that.players.length;
            $(o.id + ' .buy').prop('disabled', false);
        } else {
            alert('Player ' + String(p.num) + ' wins!')
        }
    }

    this.update = function(p) {
        for (i=0; i<props.length; i++) {
            $(p.id + ' .' + props[i]).text(p[props[i]])
        }
    }
}

$(document).ready(function() {
    G = new Game();

    $('.buy').prop('disabled', true).on('click', function() {
        u = $(this).attr('id').slice(4);
        p = $(this).parent().attr('id').slice(1);
        G.players[p].buy(u);
        if (G.players[p].ore == 0) {
            $(G.players[G.current_player].id + ' .endturn').prop('disabled', false);
            $('.buy').prop('disabled', true);
        }
    });

    $('.endturn').prop('disabled', true).on('click', function() {
        p = $(this).parent().attr('id').slice(1);
        G.end_turn(parseInt(p));
    })

    $(G.players[G.current_player].id + ' .buy').prop('disabled', false);
})