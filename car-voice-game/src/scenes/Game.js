import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  init(data) {
    this.idioma = data.idioma;
    this.directSpeed = 2;
    this.direccion = 0;
    this.transcript = "";
    this.lastTranscript = "";
    this.center = {
      x: this.game.config.width / 2,
      y: this.game.config.height / 2,
    };
    this.setupRecognition(data.idioma);
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000);

    this.add
      .image(this.center.x, this.center.y, "street")
      .setOrigin(0.5)
      .setScale(0.3);

    this.add
      .image(50, 50, "btnMenu")
      .setOrigin(0.5)
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.scene.start("MainMenu"));

    this.switchRecognition = this.add
      .image(this.center.x, 20, "switchOn")
      .setOrigin(0.5)
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.startRecognition());

    this.add
      .text(50, 100, this.idioma, {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);


      this.txtEstadoPuertas = this.add
      .text(this.center.x + 200, 20,"", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ff0000",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.auto = this.physics.add
      .image(this.center.x + 295, this.center.y + 250, "car")
      .setOrigin(0.5)
      .setScale(0.5)
      .setCollideWorldBounds(true);
    this.auto.abierto = false;

    this.startRecognition();
  }

  update() {
    this.commit = false;
    console.log("this.direccion", this.direccion);
    if (!this.auto.abierto) {
      this.moverAdelante();
      this.moverAtras();
      this.txtEstadoPuertas.setText("")
    } else {
        this.txtEstadoPuertas.setText( `${ this.idioma === "es-ES" ? "Puertas abiertas" : "Doors open"   }`   )
    }

    this.detenerAuto();
  }

  startRecognition() {
    this.recognition.start();
    this.switchRecognition.setTexture("switchOn");
  }

  setupRecognition(idioma) {
    console.log(idioma);

    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = idioma; // Configurar el idioma para español
    this.recognition.interimResults = true; // Mostrar resultados parciales
    this.recognition.continuous = true; // Permitir que el reconocimiento siga funcionando sin detenerse
    this.recognition.maxAlternatives = 1; // Mostrar solo una alternativa de transcripción
    this.recognition.onresult = (e) => this.handleTranscript(e);
    this.recognition.onend = (e) => {
      this.switchRecognition.setTexture("switchOff");
    };
  }

  handleTranscript(e) {
    const lastResultIndex = e.results.length - 1;
    const lastResult = e.results[lastResultIndex];
    const lastTranscript = lastResult[0].transcript.trim();
    const words = lastTranscript.split(/\s+/);
    const lastWord = words[words.length - 1];
    this.transcript = lastWord;

    if (this.lastTranscript != lastWord) {
      this.lastTranscript = lastWord;
      console.log("Nuevo comando:", this.transcript);
      this.girarAuto();
      this.togglePuertas();
    }
  }

  girarAuto() {
    if (this.transcript === "derecha" || this.transcript === "right") {
      this.direccion += 90;
      this.auto.setAngle(this.direccion);
    }

    if (this.transcript === "izquierda" || this.transcript === "left") {
      this.direccion -= 90;
      this.auto.setAngle(this.direccion);
    }
  }

  moverAdelante() {
    if (this.transcript === "adelante" || this.transcript === "forward") {
      if (this.direccion === 0 || this.direccion === 360) {
        this.auto.y -= this.directSpeed;
      }

      if (this.direccion === -90 || this.direccion === 270) {
        this.auto.x -= this.directSpeed;
      }

      if (this.direccion === 90 || this.direccion === 450) {
        this.auto.x += this.directSpeed;
      }

      if (this.direccion === 180 || this.direccion === -180) {
        this.auto.y += this.directSpeed;
      }
    }
  }

  moverAtras() {
    if (
      this.transcript === "reversa" ||
      this.transcript === "backward" ||
      this.transcript === "reverse"
    ) {
      if (this.direccion === 0 || this.direccion === 360) {
        this.auto.y += this.directSpeed;
      }

      if (this.direccion === -90 || this.direccion === 270) {
        this.auto.x += this.directSpeed;
      }

      if (this.direccion === 90 || this.direccion === 450) {
        this.auto.x -= this.directSpeed;
      }

      if (this.direccion === 180 || this.direccion === -180) {
        this.auto.y -= this.directSpeed;
      }
    }
  }

  detenerAuto() {
    if (this.transcript === "detener" || this.transcript === "stop") {
      this.auto.x = this.auto.x;
      this.auto.y = this.auto.y;
    }
  }

  togglePuertas() {
    if (this.transcript === "puertas" || this.transcript === "doors") {
      if (this.auto.abierto) {
        this.auto.setTexture("car");
        this.auto.abierto = false;
      } else {
        this.auto.setTexture("odCar");
        this.auto.abierto = true;
      }
    }

    
  }
}
