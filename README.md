# MovableBox

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).


## Added Features covered
1. User gets to see a button to add a new box in the window. On clicking the button, a box is created with a unique number ID. Boxes are of fixed width and height.
2. Higher id boxes will have a higher z-index.
3. Users can add multiple boxes.
4. To select a box, click on it. Highlight the selected box.
5. Use W-A-S-D or arrow keys on the keyboard to move the selected box.
6. Use the ‘delete’ or 'backspace' key on the keyboard to remove the selected box.
7. A button to toggle keyboard control.(*no listener should be open when this button status
is off).
8. No external NPM library to achieve this behaviour.
9. Hardcoded custom rectangular fence and ensure all the boxes stay within the fence during movement
10. Optimized UI (event listeners are registered outside of the Zone and CSS3 based position translation happens inside of requestAnimationFrame) and modularized code.
