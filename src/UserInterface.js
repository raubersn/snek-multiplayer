const blessed = require("blessed");
const ip = require("ip");
const fs = require("fs");

const { PORT, BG_COLOR } = require("./constants");

/**
 * @class UserInterface
 *
 * Interact with the input (keyboard directions) and output (creating screen and
 * drawing pixels to the screen). Currently this class is one hard-coded
 * interface, but could be made into an abstract and extended for multiple
 * interfaces - web, terminal, etc.
 */
class UserInterface {
  constructor() {
    // Blessed is the terminal library API that provides a screen, elements, and
    // event handling
    this.blessed = blessed;
    this.screen = blessed.screen();
    this.dumb = false;

    // Game title
    this.screen.title = "Snek.js";

    // Create the boxes
    this.gameBox = this.createGameBox();
    this.scoreBox = this.createScoreBox();

    this.gameContainer = this.blessed.box(this.gameBox);
    this.scoreContainer = this.blessed.box(this.scoreBox);
  }

  createGameBox() {
    return {
      parent: this.screen,
      top: 1,
      left: 0,
      width: "100%",
      height: "100%-1",
      style: {
        fg: BG_COLOR,
        bg: BG_COLOR,
      },
    };
  }

  createScoreBox() {
    return {
      parent: this.screen,
      top: 0,
      left: "left",
      width: "100%",
      height: 1,
      tags: true,
      style: {
        fg: "white",
        bg: "blue",
      },
    };
  }

  bindHandlers(keyPressHandler, quitHandler, enterHandler) {
    // Event to handle keypress i/o
    this.screen.on("keypress", keyPressHandler);
    this.screen.key(["escape", "q", "C-c"], quitHandler);
    this.screen.key(["enter"], enterHandler);
  }

  // Draw a pixel
  draw(coord, color) {
    this.blessed.box({
      parent: this.gameContainer,
      top: coord.y,
      left: coord.x,
      width: 1,
      height: 1,
      style: {
        fg: color,
        bg: color,
      },
    });
  }

  text(coord, msg, color) {
    this.blessed.text({
      content: msg,
      parent: this.gameContainer,
      top: coord.y,
      left: coord.x,
      style: {
        fg: color || "white",
      },
    });
  }

  // Keep track of how many dots have been consumed and write to the score box
  updateScore(score) {
    // this.scoreContainer.setLine(0, `{bold}Score:{/bold} ${score}`)
    this.scoreContainer.setLine(
      0,
      `{bold}IP:{/bold} ${ip.address()} {bold}PORT:{/bold} ${PORT}`
    );
  }

  // Set to initial screen
  clearScreen() {
    this.gameContainer.detach();
    this.gameContainer = this.blessed.box(this.gameBox);
  }

  // Creating a new score box to prevent old snake segments from appearing on it
  resetScore() {
    this.scoreContainer.detach();
    this.scoreContainer = this.blessed.box(this.scoreBox);
    this.updateScore(0);
  }

  render() {
    this.screen.render();
    // console.log(this.screen.screenshot());
    // if (!this.dumb) {
    //   const someList = [];
    //   for (let i = 0; i < this.screen.height; i++) {}
    //   this.dumb = true;
    // }
    const lol = this.screen.screenshot().toString().split("\n");
    fs.writeFileSync("./outputBob.json", JSON.stringify(lol), {
      encoding: "utf-8",
    });
    return {
      content: lol,
      width: this.screen.width,
      height: this.screen.height,
    };
    // fs.writeFileSync("./output.txt", this.screen.screenshot(), { encoding: "utf-8" });
    // const content = fs
    //   .readFileSync("./output.txt", { encoding: "utf-8" })
    //   .toString()
    //   .split("\n");
    // fs.writeFileSync("./output.json", JSON.stringify(content), { encoding: "utf-8" });
    // const line = this.screen.screenshot([0, this.screen.width, i, i+1]);

    // console.log(this.screen.width, this.screen.height);
  }
}

module.exports = { UserInterface };
