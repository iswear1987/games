//  Initlize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

//  Create out 'main' state that will contain the game
var mainState = {
	preload: function(){
		//  This function will be executed at the beginning
		//  That's where we load the game's assets
		
		//  Change the background color of the game
		game.stage.backgroundColor = '#71C5CF';
		
		//  Load the bird sprite
		game.load.image('bird', 'assets/bird.png');
		game.load.image('pipe', 'assets/pipe.png');
		game.load.audio('jump', 'assets/jump.wav');
	},
	
	create: function(){
		//  This function is called after the perload function
		//  Here we set up the game, display sprites, etc.
		
		//  Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//  Display the bird on the screen
		this.bird = this.game.add.sprite(100, 245, 'bird');
		this.bird.width = 50;
		this.bird.height = 50;
		this.bird.anchor.setTo(-0.2, 0.5);
		
		//  Add gravity to the bird to make it fall
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;
		
		//  Call the 'jump' function when the spacekey is hit
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);
		
		//  Create a group
		this.pipes = game.add.group();
		
		//  Add physics to the group
		this.pipes.enableBody = true;
		
		//  Create 20 pipes
		this.pipes.createMultiple(20, 'pipe');
		
		//  Create pipe
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
		
		this.lastJump = Date.now();
		
		//  Create score
		this.score = 0;
		this.labelScore = game.add.text(20, 20, '0', { font: '30px Arial', fill: '#FFFFFF'});
		
		//  Init sound
		this.jumpSound = game.add.audio('jump');
		
	},
	
	update: function(){
		//This function is called 60 times per second
		//It contains the game's logic
		if(this.bird.inWorld === false){
			return this.restartGame();
		}
		
		if(game.input.activePointer.isDown){
			if(Date.now() - this.lastJump > 100){
				this.jump();
				console.log('jump--');
				this.lastJump = Date.now();
			}
		}
		
		if (this.bird.angle < 20){  
    		this.bird.angle += 1;
    	}
    		
		game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
	},
	
	jump: function(){
		//  Add a vertical velocity to the bird
		if(this.bird.alive === false){
			return;
		}
		this.jumpSound.play();
		this.bird.body.velocity.y = -350;
		
		var animation = game.add.tween(this.bird).to({angle: -20}, 100).start();
	},
	
	//  Restart the Game
	restartGame: function(){
		//  Start the 'main' state, which restarts the game
		game.state.start('main');
	},
	
	addOnePipe: function(x, y){
		//  Get the first dead pipe of out group
		var pipe = this.pipes.getFirstDead();
		
		//  Set the new position of the pipe
		pipe.reset(x, y)
		
		//  Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;
		
		//  Kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},
	
	addRowOfPipes: function(){
		
		//  set the Score
		this.score += 1;
		this.labelScore.text = this.score;
		var maxEl = document.getElementById('maxScore');
		var max = Number(maxEl.innerHTML);
		maxEl.innerHTML = this.score > max ? this.score: max;
		//  Pick where the hole will be
		var hole = Math.floor(Math.random() * 5) + 1;
		
		//  Add the 6 pipes
		for(var i = 0; i < 8; i++){
			if(i != hole && i != hole + 1)
				this.addOnePipe(400, i * 60 + 10);
		}
	},
	
	hitPipe: function(){
		//  If the bird has already hit a pipe, we have nothing to do
		if(this.bird.alive === false){
			return;
		}
		
		//  Set the alive property of the bird to false
		this.bird.alive = false;
		
		//Prevent new pipes from appearing
		game.time.events.remove(this.timer);
		
		//Go through all the pipes, and stop thire movement
		this.pipes.forEachAlive(function(p){
			p.body.velocity.x = 0;
		}, this);
	}
};


//  Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');
