/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let provider1 = vscode.languages.registerCompletionItemProvider('sumo', {

        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

            // a simple completion item which inserts `Hello World!`
            const simpleCompletion = new vscode.CompletionItem('Hello World!');
            var aggregating = ['avg', 'count', 'count_distinct', 'count_frequent', 'fillmissing', 'first', 'min', 'max', 'last', 'most_recent', 'pct', 'least_recent', 'stddev', 'sum'];
            var maths = ['abs', 'acos', 'asin', 'atan', 'atan2', 'cbrt', 'ceil', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'hypot', 'log', 'log10', 'log1p', 'max', 'min', 'round', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'toDegrees', 'toRadians'];
            var parse = ['csv', 'JSON', 'keyvalue', 'parse', 'parse regex', 'split', 'xml'];
            var search = ['accum', 'backshift', 'base64Decode', 'base64Encode', 'bin', 'CIDR', 'concat', 'contains', 'decToHex', 'diff', 'fields', 'filter', 'format', 'formatDate', 'geo lookup', 'haversine', 'hexToDec', 'if', 'in', 'ipv4ToNumber', 'isBlank', 'isEmpty', 'isNull', 'isNumeric', 'isPrivateIP', 'isPublicIP', 'isValidIP', 'join', 'length', 'limit', 'logcompare', 'logreduce', 'lookup', 'luhn', 'matches', 'median', 'merge', 'now', 'num', 'outlier', 'parseHex', 'predict', 'replace', 'rollingstd', 'save', 'sessionize', 'smooth', 'sort', 'substring', 'timeslice', 'toUpperCase', 'toLowerCase', 'top', 'total', 'trace', 'transaction', 'transactionize', 'transpose', 'urldecode', 'urlencode', 'where'];
            var metadata = ['_collector', '_messageCount', '_messageTime', '_raw', '_receiptTime', '_size', '_source', '_sourceCategory', '_sourceHost', '_sourceName', '_format','_timeslice'];
            var other = ['and', 'or', 'not', 'in', '!', 'nodrop','as','by','from','on'];

            aggregating = aggregating.concat(maths);
            aggregating = aggregating.concat(parse);
            aggregating = aggregating.concat(search);
            aggregating = aggregating.concat(metadata);
            aggregating = aggregating.concat(other);
            
            // default word based completion does not work anymore, lets hack and append words
            // this code sitll needs work - it actually suggests the current word as autocomplete!
            const fullText = document.getText();
            var wordCompletion = fullText.match(/[a-zA-Z_0-9]{3,}/g);
            if (wordCompletion){
                var words = wordCompletion.join(' ');
                var wordsArray = words.split(' ');
                aggregating = aggregating.concat(wordsArray);
                
            };

            aggregating = aggregating.sort().filter(function(item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })

            var completionListItems: any = [new vscode.CompletionItem('Hello World!')];
            
            function compItems(item: string) {
                var compItem = new vscode.CompletionItem(item)
                return compItem
            }
            
            aggregating.forEach(item => completionListItems.push(compItems(item)));

            // a completion item that inserts its text as snippet,
            // the `insertText`-property is a `SnippetString` which will be
            // honored by the editor.
            const snippetCompletion = new vscode.CompletionItem('Good part of the day');
            snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
            snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

            // a completion item that can be accepted by a commit character,
            // the `commitCharacters`-property is set which means that the completion will
            // be inserted and then the character will be typed.
            const commitCharacterCompletion = new vscode.CompletionItem('console');
            commitCharacterCompletion.commitCharacters = ['.'];
            commitCharacterCompletion.documentation = new vscode.MarkdownString('Press `.` to get `console.`');

            // a completion item that retriggers IntelliSense when being accepted,
            // the `command`-property is set which the editor will execute after 
            // completion has been inserted. Also, the `insertText` is set so that 
            // a space is inserted after `new`
            const commandCompletion = new vscode.CompletionItem('new');
            commandCompletion.kind = vscode.CompletionItemKind.Keyword;
            commandCompletion.insertText = 'new ';
            commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

            var finalItems = [
                simpleCompletion,
                snippetCompletion,
                commitCharacterCompletion,
                commandCompletion
            ];
            finalItems = finalItems.concat(completionListItems);
            // return all completion items as array
            return finalItems;
        }
    });

    const provider2 = vscode.languages.registerCompletionItemProvider(
        'sumo',
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

                // get all text until the `position` and check if it reads `console.`
                // and if so then complete if `log`, `warn`, and `error`
                let linePrefix = document.lineAt(position).text.substr(0, position.character);
                if (!linePrefix.endsWith('console.')) {
                    return undefined;
                }

                return [
                    new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
                    new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
                    new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
                ];
            }
        },
        '.' // triggered whenever a '.' is being typed
    );

    context.subscriptions.push(provider1, provider2);
}