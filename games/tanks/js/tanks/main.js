function checkAngle(src, tar){
	var ALL = 360;
	
	var sa = [],
		ta = [],
		mid = Math.ceil(ALL/2);
	
	var tar_inx = null;
	for(var i = 0; i < ALL; i ++){
		sa.push(i);
	}
	for(var i = 0; i < sa.length; i++){
		ta[i] = sa[(src + i + mid) % sa.length];
		if(ta[i] === tar){
			tar_inx = i;
		}
	}
	
	return tar_inx - mid + 1;
}
//console.log(checkAngle(11, 5));
var EnemyTank = function(index, game, player, bullets){
	var x = game.world.randomX;
	var y = game.world.randomY;
	
	this.game = game;
	this.health = 3;
	this.player = player;
	this.bullets = bullets;
	this.fireRate = 1000;
	this.nextFire = 0;
	this.alive =true;
	
	this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
	this.tank = game.add.sprite(x, y, 'enemy', 'tank1');
	this.turret = game.add.sprite(x, y, 'enemy', 'turret');
	
	this.shadow.anchor.set(0.5);
	this.tank.anchor.set(0.5);
	this.turret.anchor.set(0.3, 0.5);
	
	this.tank.name = index.toString();
	game.physics.enable(this.tank, Phaser.Physics.ARCADE);
	this.tank.body.immovable = false;
	this.tank.body.collideWorldBounds = true;
	this.tank.body.bounce.setTo(1, 1);
	
	this.tank.angle = game.rnd.angle();
	
	game.physics.arcade.velocityFromRotation(this.tank.rotation, 100, this.tank.body.velocity);
	
}
EnemyTank.prototype.damage = function(){
	this.health -= 1;
	if(this.health <= 0){
		this.alive = false;
		
		this.shadow.kill();
		this.tank.kill();
		this.turret.kill();
		
		return true;
	}
	return false;
}
EnemyTank.prototype.update = function(){
	this.shadow.x = this.tank.x;
	this.shadow.y = this.tank.y;
	this.shadow.rotation = this.tank.rotation;
	
	this.turret.x = this.tank.x;
	this.turret.y = this.tank.y;
	
	//使得敌人的炮台，始终指向玩家本身
	this.turret.rotation = this.game.physics.arcade.angleBetween(this.tank, this.player);
	
	if(this.game.physics.arcade.distanceBetween(this.tank, this.player) < 300){
		if(this.game.time.now > this.nextFire && this.bullets.countDead() > 0){
			
			this.nextFire = this.game.time.now + this.fireRate;
			
			var bullet = this.bullets.getFirstDead();
			
			//???
			bullet.reset(this.turret.x, this.turret.y);
			
			//???
			bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, Math.random() * 300 + 200);
		}
	}
};

var land;

var shadow;
var tank;
var turret;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var explosions;

var currentSpeed = 0;
var cursors;

var bullets;
var fireRate = 100;
var nextFire = 0;

var main_state = {
	preload: function(){
		
	},
	create: function(){
		
//		var start = game.add.text(game.world.centerX, game.world.centerY, 'Game start', largeTxtStyle);
//		start.anchor.set(0.5);
		
		game.world.setBounds(-1000, -1000, 2000, 2000);
		
		land = game.add.tileSprite(0, 0, 800, 600, 'grass');
		land.fixedToCamera = true;
		
		//  The base of out tank
		tank = game.add.sprite(0, 0, 'tank', 'tank1');
		tank.anchor.setTo(0.5, 0.5);
		tank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);
		
		//  This will force it to decelerate and limit its speed
		game.physics.enable(tank, Phaser.Physics.ARCADE);
		
		//???
		tank.body.drag.set(0.2);
		
		tank.body.maxVelocity.setTo(400, 400);
		tank.body.collideWorldBounds = true;
		
		//  Finally the turret that we place on-top of the tank body
		turret = game.add.sprite(0, 0, 'tank', 'turret');
		turret.anchor.setTo(0.3, 0.5);
		
		//  The enemies bullet group
		enemyBullets = game.add.group();
		enemyBullets.enableBody = true;
		enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
		enemyBullets.createMultiple(100, 'bullet');
		
		enemyBullets.setAll('anchor.x', 0.5);
		enemyBullets.setAll('anchor.y', 0.5);
		enemyBullets.setAll('outOfBoundsKill', true);
		enemyBullets.setAll('checkWorldBounds', true);
		
		//  Create some baddies to waste :)
		enemies = [];
		
		enemiesTotal = 20;
		enemiesAlive = 20;
		
		for(var i = 0; i < enemiesTotal; i++){
			enemies.push(new EnemyTank(i, game, tank, enemyBullets));
		}
		
		//  A shadow below out tank
		shadow = game.add.sprite(0, 0, 'tank', 'shadow');
		shadow.anchor.setTo(0.5, 0.5);
		
		//  Our bullet group
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet', 0, false);
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		
		//  Explosion pool
		explosions = game.add.group();
		
		for(var i = 0; i < 10; i++){
			//???
			var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
			explosionAnimation.anchor.set(0.5, 0.5);
			explosionAnimation.animations.add('kaboom');
		}
		
		tank.bringToTop();
		turret.bringToTop();
		
		game.camera.follow(tank);
		game.camera.deadzon = new Phaser.Rectangle(150, 150, 500, 300);
		//???
		game.camera.focusOnXY(0, 0);
		
		cursors = game.input.keyboard.createCursorKeys();
		
		this.wasd = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.W),
			right: game.input.keyboard.addKey(Phaser.Keyboard.D),
			down: game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: game.input.keyboard.addKey(Phaser.Keyboard.A),
		}
		
	},
	render: function(){
		game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
		game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 64);
	},
	update: function(){
		game.physics.arcade.overlap(enemyBullets, tank, bulletHitPlayer, null, this);
		enemiesAlive = 0;
		for(var i = 0; i < enemies.length; i++){
			if(enemies[i].alive){
				enemiesAlive ++;
				game.physics.arcade.collide(tank, enemies[i].tank);
				game.physics.arcade.overlap(bullets, enemies[i].tank, bulletHitEnemy, null, this);
				enemies[i].update();
				
				for(var j = i + 1; j < enemies.length; j++){
					game.physics.arcade.collide(enemies[i].tank, enemies[j].tank);
				}
			}
		}
		
		tank.angle = Math.round(tank.angle);
		var angle = (tank.angle + 180) % 360;
		
		var ANGLE,
			offset,
			inputed = false;
		if(this.wasd.up.isDown && this.wasd.left.isDown){
			ANGLE = 45;
			inputed = true;
		}else if(this.wasd.up.isDown && this.wasd.right.isDown){
			ANGLE = 135;
			inputed = true;
		}else if(this.wasd.down.isDown && this.wasd.right.isDown){
			ANGLE = 225;
			inputed = true;
		}else if(this.wasd.down.isDown && this.wasd.left.isDown){
			ANGLE = 315;
			inputed = true;
		}else if(this.wasd.left.isDown){
			ANGLE = 0;
			inputed = true;
	    }else if(this.wasd.up.isDown){
	    	ANGLE = 90;
	    	inputed = true;
	    }else if(this.wasd.right.isDown){
	    	ANGLE = 180;
	    	inputed = true;
	    }else if(this.wasd.down.isDown){
	    	ANGLE = 270;
	    	inputed = true;
	    }
	    
	    if(inputed){
	    	
	    	var MIN = 8;
			var result = checkAngle(angle, ANGLE);
			
			if(result > 0){
				offset = MIN;
			}else if(result < 0){
				offset = 0 - MIN;
			}else{
				offset = 0;
			}
			if(Math.abs(angle - ANGLE) > MIN){
				tank.angle += offset;
			}else{
				tank.angle = ANGLE - 180;
			}
			currentSpeed = 300;
		}else{
			if (currentSpeed > 0){
	            currentSpeed -= 4;
	        }
		}
		
		
		if(currentSpeed > 0){
			game.physics.arcade.velocityFromRotation(tank.rotation, currentSpeed, tank.body.velocity);
		}
		
		land.tilePosition.x = -game.camera.x;
		land.tilePosition.y = -game.camera.y;
		
		//  Position all the parts and align rotations
		
		shadow.x = tank.x;
		shadow.y = tank.y;
		shadow.rotation = tank.rotation;
		
		turret.x = tank.x;
		turret.y = tank.y;
		
		turret.rotation = game.physics.arcade.angleToPointer(turret);
		
		if(game.input.activePointer.isDown){
			fire();
		}
		
	}
};

function bulletHitPlayer(tank, bullet){
	bullet.kill();
}
function bulletHitEnemy(tank, bullet){
	bullet.kill();
	
	var destroyed = enemies[tank.name].damage();
	
	if(destroyed){
		var explosionAnimation = explosions.getFirstExists(false);
		explosionAnimation.reset(tank.x, tank.y);
		explosionAnimation.play('kaboom', 30, false, true);
	}
}

function fire(){
	if(game.time.now > nextFire && bullets.countDead() > 0){
		nextFire = game.time.now + fireRate;
		
		var bullet = bullets.getFirstExists(false);
		
		bullet.reset(turret.x, turret.y); 
		
		bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
	}
}
