const vscode = require("vscode");
const luamin = require("./luamin.js");

let Options = [
	{
		label: "Rename Variables",
		description: "Rename variable names (eg. `iIiiIi` into `L_1`)",
		picked: true
	},
	{
		label: "Rename Globals",
		description: "Rename global names (eg. `iIiiIi` into `G_1`) (not recommened)",
		picked: false
	},
	{
		label: "Solve Math",
		description: "Automatically solves math (eg. `1 + 3 + 4` into `8`)",
		picked: true
	}
];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let command = vscode.commands.registerCommand('luamin.luamin', async function () {
		let Editor = vscode.window.activeTextEditor;
		let Script = Editor.document.getText();

		if (!Script.length) return vscode.window.showErrorMessage("No script content in current file");

		let Type = await vscode.window.showQuickPick([ "Beautify", "Minify", "Uglify" ]);
		if (!Type) return;

		let Selected = await vscode.window.showQuickPick(Options, { canPickMany: true, placeHolder: "Pick options" });
		if (!Selected) return;

		let ParsedOptions = {};
		Selected = Selected.forEach(o => ParsedOptions[o.label.split(" ").join("")] = true) // JUSt Use ReGex brO

		let Output;
		try {
			Output = luamin[Type](Script, ParsedOptions);
		} catch (er) {
			console.log(er);
			return vscode.window.showErrorMessage(`Failed to ${Type}`);
		}

		let Range = new vscode.Range(Editor.document.positionAt(0), Editor.document.positionAt(Script.length));
		await Editor.edit((e) => e.replace(Range, Output));
		vscode.window.showInformationMessage("Completed!");
	});
	
	let Luamin = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	Luamin.text = "Luamin";
	Luamin.command = "luamin.luamin";
	Luamin.tooltip = "Lua Formatter";
	Luamin.show();

	context.subscriptions.push(command, Luamin);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
