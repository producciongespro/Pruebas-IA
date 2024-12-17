import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'car');

        this.add.text(512, 460, 'Start Game (English) ', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        .setOrigin(0.5)
        .setInteractive({cursor:"pointer"})
        .on("pointerdown", ()=> this.cargarJuego("en-US")  )


        this.add.text(512, 560, 'Iniciar Juego (Español) ', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        .setOrigin(0.5)
        .setOrigin(0.5)
        .setInteractive({cursor:"pointer"})
        .on("pointerdown", ()=> this.cargarJuego("es-ES")  )

        
    }

    cargarJuego (idioma) {
        this.scene.start('Game', {idioma} );
    }
}
