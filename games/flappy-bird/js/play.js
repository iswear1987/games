var maxScoreEl = null;
var play_state = {
	
	//  No more 'preload' function, since it is already done in the 'load' state
	
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.jump, this);
		this.game.input.onDown.add(this.jump, this);
		
		this.pipes = game.add.group();
		
		this.pipes.enableBody = true;
		
		this.pipes.createMultiple(20, 'pipe');
		this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);
		
		this.bird = this.game.add.sprite(100, 245, 'bird');
		this.bird.enableBody = true;
		game.physics.arcade.enable(this.bird);
		
		this.bird.anchor.setTo(-0.2, 0.5);
		this.bird.body.gravity.y = 1000;
		
		//  No 'this.score', but just 'score'
		score = 0;
		var style = {font: '30px Arial', fill: '#FFFFFF'};
		this.label_score = this.game.add.text(20, 20, '0', style);
		this.jump_sound = this.game.add.audio('jump');
		
		maxScoreEl = document.getElementById('maxScore');
		
	},
	
	update: function(){
		if(this.bird.inWorld === false){
			this.restart_game();
		}
		if(this.bird.angle < 20){
			this.bird.angle += 1;
		}
		this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit_pipe, null, this);
	},
	
	jump: function(){
		if(this.bird.alive === false){
			return;
		}
		this.bird.body.velocity.y = -350;
		this.game.add.tween(this.bird).to({angle: -20}, 100).start();
		this.jump_sound.play();
	},
	
	hit_pipe: function(){
		if(this.bird.alive === false){
			return;
		}
		this.bird.alive = false;
		this.game.time.events.remove(this.timer);
		
		this.pipes.forEachAlive(function(p){
			p.body.velocity.x = 0;
		}, this);
		
		var maxScore = Number(sessionStorage.getItem('game_bird_maxScore'));
		if(score > maxScore){
			sessionStorage.setItem('game_bird_maxScore', score);
			maxScoreEl.innerHTML = score;
		}
		
	},
	
	restart_game: function(){
		this.game.time.events.remove(this.Timer);
		
		//  This time we go back to the 'menu' state
		this.game.state.start('menu');
	},
	
	add_one_pipe: function(x, y){
		var pipe = this.pipes.getFirstDead();
		pipe.reset(x, y);
		pipe.body.velocity.x = -200;
		
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	
	add_row_of_pipes: function(){
		var hole = Math.floor(Math.random() * 5) + 1;
		
		for(var i = 0; i < 8; i++){
			if(i != hole && i != hole + 1){
				this.add_one_pipe(400, i * 60 + 10);
			}
		}
		
		//  No 'this.score', but just 'score'
		score += 1;
		this.label_score.text = score;
	}
}
