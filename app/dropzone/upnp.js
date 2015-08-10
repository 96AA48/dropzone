var upnp = require('nat-upnp');
var config = require('./settings');

function check(callback) {
	var client = upnp.createClient();

	client.getMappings(function (err, map) {
		if (err) {
			console.error('Error: Something went wrong trying to check the upnp mappings :', err);
			callback(err, false);
		}
		else {
			for (i = 0; i < map.length; i++) {
				if (map[i].description.match(/dropzone/gi)) {
					callback(null, map[i]);
					return;
				};
			}

			callback(null, false);
		}
	});
}

function create_port(callback) {
	var client = upnp.createClient();

	client.portMapping({
		public: config.get().port,
		private: config.get().port,
		ttl: 0,
		description: 'Dropzone (TCP) port ' + config.get().port
	}, function (err) {
		if (err) {
			console.warn('ERROR: Something went wrong with getting a upnp port forward :', err);
			callback(err);
		}
		else {
			callback();
		}
	});
}

module.exports = {
	'create_port': create_port,
	'check': check
}
