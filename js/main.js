var juego = new Phaser.Game(800, 600, Phaser.CANVAS, 'bloque_juego');
var fondo;
var player;
var enemies;
var bullets;
var bullet;
var sonido;
var cursors;
var bulletTime = 0;

var mainState = {

	preload: function(){
		juego.load.image('fondo', 'assets/space.png');
		juego.load.image('player', 'assets/nave.png');
		juego.load.spritesheet('enemy', 'assets/enemy32X32.png', 32, 32);
		juego.load.spritesheet('bullet', 'assets/bullet.png', 16, 16);
		juego.load.audio('sonido', 'assets/laserfire.ogg');

		juego.forceSingleUpdate = true;

	},

	create: function(){

		fondo = juego.add.tileSprite(0, 0, 2048, 1536, 'fondo');
		sonido = juego.add.audio('sonido');

		player = juego.add.sprite(400, 500, 'player');
		player.scale.setTo(0.3);

		juego.physics.enable(player, Phaser.Physics.ARCADE);

		player.body.collideWorldBounds = true;
		

		//Creamos grupo de enemigos
		enemies = juego.add.group();
		enemies.enableBody = true;
		enemies.createMultiple(100, 'enemy');
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		enemies.callAll('animations.add', 'animations', 'caminar',
			[0, 1, 2], 10 ,true);
		enemies.callAll('animations.play', 'animations', 'caminar');
		createEnemies();

		bullets = juego.add.group();
		bullets.enableBody = true;
		bullets.createMultiple(30, 'bullet');
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

	},

	update: function(){

		fondo.tilePosition.y += 3;
		player.body.velocity.x = 0;


		if (juego.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){

			fireBullet();

		}if(juego.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){

			player.body.velocity.x = 300;

		}if(juego.input.keyboard.isDown(Phaser.Keyboard.LEFT)){

			player.body.velocity.x = -300;

		}

		juego.physics.arcade.overlap(enemies, bullets, destroyEnemy, null, this);

}
}

	function createEnemies(){
		for(var y=0; y<4; y++){
			for(var x=0; x<12; x++){
				var enemy = enemies.create(x*48, y*50, 'enemy');
				enemy.anchor.setTo(0.5);

			}
		}

		enemies.x = 40;
		enemies.y = 90;


		var tween = juego.add.tween(enemies).to({x:230}, 2000, Phaser.Easing.Linear.None,
		true, 0, 1000, true);

		tween.onLoop.add(descend , this);
	}		

	function descend(enemy){
		enemies.y += 10;
	}

	function fireBullet(){
		if(juego.time.now > bulletTime){
			bullet = bullets.getFirstExists(false);

			if(bullet){
				sonido.play();
				bullet.reset(player.x, player.y);
				bullet.body.velocity.y = -400;
				bulletTime = juego.time.now + 200;
			}

		}
		
	}

	function destroyEnemy(bullet, enemy){
		bullet.kill();
		enemy.kill();
	}


	juego.state.add('mainState', mainState);

	juego.state.start('mainState');
