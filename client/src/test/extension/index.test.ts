import { assert } from 'chai';

import { describe, it, beforeEach } from 'mocha';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import type * as colorize from '../../extension';
import { getDocUri } from '../helper';

const ext = vscode.extensions.getExtension(
  'kamikillerto.vscode-colorize',
) as vscode.Extension<colorize.ColorizeContext>;

describe('Extension', () => {
  beforeEach(async () => {
    const settings = vscode.workspace.getConfiguration('colorize');
    await settings.update('exclude', [], true);
    await settings.update('include', [], true);
  });
  it('is activated successfully upon opening a scss file', async () => {
    const fileName = getDocUri('style.scss');
    await vscode.workspace.openTextDocument(fileName);
    assert.equal(ext?.isActive, true);
  });

  it('Successfully extract colors in visible textEditor', async () => {
    const fileName = getDocUri('style.scss');
    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><
    assert.equal(vscode.window.visibleTextEditors.length, 1);

    assert.equal(ext.exports.nbLine, 3);
    assert.equal(ext.exports.editor, editor);
    assert.equal(ext.exports.deco.size, 1);
  });

  it('Only generate decorations for visible part of the document', async () => {
    const fileName = getDocUri('long_style.scss');

    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><
    assert.equal(vscode.window.visibleTextEditors.length, 1);

    assert.equal(ext.exports.nbLine, 200);
    assert.equal(ext.exports.editor, editor);
    assert.equal(ext.exports.deco.size, 1);
  });

  it('Can use "exclude" setting to not colorize file', async () => {
    const settings = vscode.workspace.getConfiguration('colorize');
    await settings.update('exclude', ['**/long_style.scss'], true);
    const fileName = getDocUri('long_style.scss');

    const doc = await vscode.workspace.openTextDocument(fileName);
    await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><

    assert.isUndefined(ext.exports.editor);
  });
  it('Can use "include" setting to colorize file', async () => {
    const fileName = getDocUri('file.other');

    const doc = await vscode.workspace.openTextDocument(fileName);
    const editor = await vscode.window.showTextDocument(doc);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><

    assert.isUndefined(ext.exports.editor);

    const settings = vscode.workspace.getConfiguration('colorize');
    await settings.update('include', ['**/*.other'], true);
    await new Promise((resolve) => setTimeout(resolve, 200)); // mandatory because of the queue ><

    assert.equal(ext.exports.editor, editor);
  });
});
