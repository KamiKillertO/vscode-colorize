"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require("vscode");
const path = require("path");
const isWin = /^win/.test(process.platform);
const ext = vscode.extensions.getExtension('kamikillerto.vscode-colorize');
let fixtureSourcePath = path.join(__dirname, '..', '..', 'fixtures');
describe('Extension', () => {
    // it('is activated successfully upon opening a css file', done => {
    //   vscode.workspace.openTextDocument(`${fixtureSourcePath}/styles.sass`)
    //     .then(() => {
    //       assert.equal(ext.isActive, true);
    //     })
    //     .then(() => done(), e => done(new Error(e)));
    // });
});
// describe('Activated extension', () => {
//   before(done => {
//     vscode.workspace.openTextDocument(`${sampleFileUri}.css`)
//       .then(() => done(), e => done(new Error(e)));
//   });
//   // it('', done => {
//     // extension.
//   // });
// });
//# sourceMappingURL=extension.test.js.map