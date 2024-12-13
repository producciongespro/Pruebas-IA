import { Scene } from 'phaser';
import handleInit, {users} from "../utils/access"

export default  class MainGame extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');        
        this.load.image('wonderwoman', 'wonderwoman.png');
        this.load.image('hulk', 'hulk.png');
        this.load.image('door', 'door.png');
        
    }

    create ()
    {
               
        
        this.add.text(512, 50, 'Iniciar', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ff0000',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
        .setOrigin(0.5)
        .setDepth(100)
        .setInteractive({cursor:"pointer"})
        .on("pointerdown", ()=> handleInit()  );

        this.door = this.add.image(512,200, "door")
        
    }

    update () {
        console.log(users.wonderwoman);

        if (users.wonderwoman > 0.99) {
            this.door.setTexture("wonderwoman")
        }

        if (users.empty > 0.9) {
            this.door.setTexture("door")            
        }

        if (users.hulk > 0.9) {
            this.door.setTexture("hulk")            
        }
        
    }






}
