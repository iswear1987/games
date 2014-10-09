var cursors;
var largeTxtStyle = {font: '58px Arial', fill: '#336699', align: 'center'},
	midTxtStyle = {font: '32px Arial,yahei,simhei', fill: '#336699'};
var load_state = {
	preload: function(){
		var logo = game.add.text(game.world.centerX, game.world.centerY - 30, 'Tanks War', largeTxtStyle);
		logo.alpha = 0;
		this.game.add.tween(logo).to({alpha: 1}, 2000, Phaser.Easing.Linear.None, true);
		logo.anchor.set(0.5);
		
	}, create: function(){
		
		var txt = game.add.text(game.world.centerX, game.world.centerY + 32, '-点击开始-', midTxtStyle);
		txt.alpha = 0;
		txt.anchor.set(0.5);
		this.game.stage.setBackgroundColor(0xFFFFFF);
		var _this = this;
		//setTimeout(function(){
			_this.game.add.tween(txt).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
			_this.game.input.onDown.addOnce(function(){
				this.game.state.start('menu_state');
			}, _this);
		//}, 2000);
	}, update: function(){
		
	}
};