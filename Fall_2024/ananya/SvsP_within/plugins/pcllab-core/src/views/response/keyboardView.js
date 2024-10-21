// Handler
const InputHandler = require('../../handlers/inputHandler')
const clearAllTimers = require("../../util").clearAllTimers
class KeyboardView {
    constructor($displayElement, coreInstance, dataInstance, stimulus, endRecall) {
        this.$displayElement = $displayElement
        this.coreInstance = coreInstance
        this.dataInstance = dataInstance
        this.stimulus = stimulus
        this.endRecall = endRecall
        this.responseContainers = []

        // Generator properties
        // this.sharedResponsePanelBody = $()
        // this.sharedResponsePanel = $()
        this.numResponseContainers = 0
    }

    render() {
        const onKeyDown = (event) => {
          if (event.key !== "z" && event.key !== "m") {
            return;
          }
          this.dataInstance.registerKeyPress();
          this.dataInstance.recordResponse(event.key);

          clearAllTimers();
          this.endRecall();

          document.removeEventListener("keydown", onKeyDown);
        };
        document.addEventListener("keydown", onKeyDown);
    }

    createHandler(nextButton) {
        return new InputHandler(nextButton)
    }
}

module.exports = KeyboardView