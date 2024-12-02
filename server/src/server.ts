import type {
  InitializeParams,
  InitializeResult,
} from 'vscode-languageserver/node.js';
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  DidChangeConfigurationNotification,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';

import { TextDocument } from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);
// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability: boolean = false;
let hasWorkspaceFolderCapability: boolean = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let hasDiagnosticRelatedInformationCapability: boolean = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  // Does the client support the `workspace/configuration` request?
  // If not, we fall back using global settings.
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
    },
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined,
    );
  }

  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen

// The example settings
type ColorizeSettings = Record<string, unknown>;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ColorizeSettings>> = new Map();

async function extractDocumentColors(textDocument: TextDocument) {
  await getDocumentSettings(textDocument.uri);
}

function getDocumentSettings(resource: string) {
  // if (!hasConfigurationCapability) {
  //   return Promise.resolve(globalSettings);
  // }
  let result = documentSettings.get(resource);
  if (!result) {
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'colorize',
    });
    documentSettings.set(resource, result);
  }
  return result;
}

connection.onDidChangeConfiguration((_change) => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings
    documentSettings.clear();
  } else {
    // globalSettings = <ColorizeSettings>(
    //   (change.settings.languageServerExample || defaultSettings)
    // );
  }

  // Revalidate all open text documents
  // documents.all().forEach(extractDocumentColors);
});

// Only keep settings for open documents
documents.onDidClose((e) => {
  documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((_changeEvent) => {
  // extractDocumentColors(changeEvent.document);
});

// connection.onDidOpenTextDocument
documents.onDidOpen(async (event) => {
  await extractDocumentColors(event.document);
});

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VS Code
  connection.console.log('We received a file change event');
});

// // This handler provides the initial list of the completion items.
// connection.onCompletion(
//   (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
//     // The pass parameter contains the position of the text document in
//     // which code complete got requested. For the example we ignore this
//     // info and always provide the same completion items.
//     // return [
//     //   {
//     //     label: 'TypeScript',
//     //     kind: CompletionItemKind.Text,
//     //     data: 1,
//     //   },
//     //   {
//     //     label: 'JavaScript',
//     //     kind: CompletionItemKind.Text,
//     //     data: 2,
//     //   },
//     // ];
//   },
// );

// This handler resolves additional information for the item selected in
// the completion list.
// connection.onCompletionResolve((_item: CompletionItem): CompletionItem => {
//   // if (item.data === 1) {
//   //   item.detail = 'TypeScript details';
//   //   item.documentation = 'TypeScript documentation';
//   // } else if (item.data === 2) {
//   //   item.detail = 'JavaScript details';
//   //   item.documentation = 'JavaScript documentation';
//   // }
//   // return item;
// });
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
