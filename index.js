const Command = require('command');
module.exports = function ModulesManager(dispatch) {
	const command = Command(dispatch);

	command.add('m', (c, m) => {
		switch (c) {
			case 'm':
			case 'modules':
				message(`Loaded modules: ${Array.from(dispatch.base.modules.keys()).join(', ')}`);
				break;

			case 'on':
			case 'l':
			case 'load':
				if (dispatch.base.modules.has(m)) {
					message(`Cannot load already loaded module '${m}'.
Try the reload command.`);
					break;
				}

				if (load(m)) {
					message(`Module '${m}' successfully loaded.`);
				} else {
					message(`Error loading module '${m}'.`);
				}
				break;

			case 'off':
			case 'u':
			case 'unload':
				if (m === (dispatch.moduleName || 'command')) {
					message('Sorry but u cannot unload core module.');
					break;
				} else if (!dispatch.base.modules.has(m)) {
					message(`Cannot unload non-loaded module '${m}'.`);
					break;
				}

				if (unload(m)) {
					message(`Module '${m}' successfully unloaded.`);
				} else {
					message(`Error unloading module '${m}'.`);
				}
				break;

			case 'rl':
			case 'reload':
				if (m === (dispatch.moduleName || 'command')) {
					message('Sorry but u cannot reload core module.');
					break;
				} else if (!dispatch.base.modules.has(m)) {
					message(`Cannot unload non-loaded module '${m}'.`);
					break;
				}

				if (unload(m)) {
					if (load(m)) {
						message(`Module '${m}' successfully reloaded.`);
					} else {
						message(`Error reloading module '${m}' (load step).`);
					}
				} else {
					message(`Error reloading module '${m}' (unload step).`);
				}
				break;

			case 'h':
			case 'help':
			default:
				message(`Commands list:
!m m / modules - Show current loaded modules.
!m on / l / load - Load a module.
!m off / o /unload - Unload a module.
!m rl / reload - reload a module.
!m h / help - show this help.`);
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
		command.message(`<FONT COLOR="#FFFFFF">[Modules Manager] - ${msg}</FONT>`);
	}

	this.destructor = () => {
		command.remove('m');
	};
};
