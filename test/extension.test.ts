import {
  assert
} from 'chai';

import { describe, it } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as colorize from '../src/extension';
import * as path from 'path';

const ext: vscode.Extension<colorize.ColorizeContext> = vscode.extensions.getExtension('kamikillerto.vscode-colorize');
let fixtureSourcePath = path.join(__dirname, '..', '..', 'test', 'fixtures');

describe('Extension', () => {
  it('is activated successfully upon opening a scss file', async() => {
    const fileName = `${fixtureSourcePath}/style.scss`;
    await vscode.workspace.openTextDocument(fileName);
    assert.equal(ext.isActive, true);
  });

  it('Successfully extract colors in visible textEditor', async() => {
    const fileName = `${fixtureSourcePath}/style.scss`;
    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><
    assert.equal(vscode.window.visibleTextEditors.length, 1);

    assert.equal(ext.exports.nbLine, 3);
    assert.equal(ext.exports.editor, editor);
    assert.equal(ext.exports.deco.size, 1);
  });

  it('Generate decorations for all colors in the document', async() => {
    const fileName = `${fixtureSourcePath}/long_style.scss`;

    const config = vscode.workspace.getConfiguration('colorize');
    await config.update('colorize_only_visible_beta', false, true); // Should be at false by default (need to find a way to clean local settings)

    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><
    assert.equal(vscode.window.visibleTextEditors.length, 1);

    assert.equal(ext.exports.nbLine, 200);
    assert.equal(ext.exports.editor, editor);
    assert.equal(ext.exports.deco.size, 2);
  });


  it('Only generate decorations for visible part of the document when "setting colorize_only_visible_beta" is true', async() => {
    const fileName = `${fixtureSourcePath}/long_style.scss`;

    const config = vscode.workspace.getConfiguration('colorize');
    await config.update('colorize_only_visible_beta', true, true);

    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><
    assert.equal(vscode.window.visibleTextEditors.length, 1);

    assert.equal(ext.exports.nbLine, 200);
    assert.equal(ext.exports.editor, editor);
    assert.equal(ext.exports.deco.size, 1);
  });
});
