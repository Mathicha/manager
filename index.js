const Command = require('command');
module.exports = function ModulesManager(dispatch) {
	const command = Command(dispatch);

	command.add('modules', m => {
		message(`Commands list:
/8 modules - Show help & current loaded modules.
/8 load - Load a module.
/8 unload - Unload a module.
/8 reload - Reload a module.`);
		message(`Loaded modules: ${Array.from(dispatch.base.modules.keys()).join(', ')}`);
	});

	command.add('load', m => {
		if (dispatch.base.modules.has(m)) {
			message(`Cannot load already loaded module '${m}'.
Try the reload command.`);
			return;
		}

		if (load(m)) {
			message(`Module '${m}' successfully loaded.`);
		}
	});

	command.add('unload', m => {
		if (m === (dispatch.moduleName || 'command')) {
			message('Sorry but u cannot unload core module.');
			return;
		} else if (!dispatch.base.modules.has(m)) {
			message(`Cannot unload non-loaded module '${m}'.`);
			return;
		}

		if (unload(m)) {
			message(`Module '${m}' successfully unloaded.`);
		}
	});

	command.add('reload', m => {
		if (m === (dispatch.moduleName || 'command')) {
			message('Sorry but u cannot reload core module.');
			return;
		} else if (!dispatch.base.modules.has(m)) {
			message(`Cannot unload non-loaded module '${m}'.`);
			return;
		}

		if (unload(m)) {
			if (load(m)) {
				message(`Module '${m}' successfully reloaded.`);
			}
		}
	});

	function load(m) {
		if (dispatch.load(m, module) !== null) {
			return true;
		}
		return false;
	}

	function unload(m) {
		if (dispatch.unload(m) === true) {
			delete require.cache[require.resolve(m)];
			return true;
		}
		return false;
	}

	function message(msg) {
		command.message(`<FONT COLOR="#FFFFFF">${msg}</FONT>`);
	}

	this.destructor = () => {
		command.remove('load');
		command.remove('unload');
		command.remove('reload');
	};
};
