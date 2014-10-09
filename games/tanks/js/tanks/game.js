var game = new Phaser.Game(800, 600, 'game');


game.state.add('load_state', load_state);
game.state.add('menu_state', menu_state);
game.state.add('main_state', main_state);

game.state.start('load_state');
