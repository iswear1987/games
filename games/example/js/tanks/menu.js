var menu_load,
	count = 0,
	loadTxt = 'Loading...',
	isLoaded = false;
var menu_state = {
	preload: function(){
		menu_load = game.add.text(game.world.centerX, game.world.centerY, loadTxt, midTxtStyle);
		menu_load.anchor.set(0.5);
		
		game.load.atlas('tank', 'assets/tanks/tanks.png', 'assets/tanks/tanks.json');
		game.load.atlas('enemy', 'assets/tanks/enemy-tanks.png', 'assets/tanks/tanks.json');
		game.load.image('bullet', 'assets/tanks/bullet.png');
		
		game.load.image('earth', 'assets/tanks/scorched_earth.png');
		game.load.image('grass', 'assets/tanks/light_grass.png');
		
		game.load.spritesheet('kaboom', 'assets/tanks/explosion.png', 64, 64, 23);
		
	},
	create: function(){
		isLoaded = true;
		menu_load.text = 'OK';
		game.add.tween(menu_load).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
		
		game.state.start('main_state');
	},
	update: function(){
		if(!isLoaded){
			count += 0.05;
			menu_load.text = loadTxt.substring(0, 8 + (Math.floor(count) % 3));
		}
	}
}
