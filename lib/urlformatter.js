(function() {
	
	var url = require('url');
	
	module.exports = {
		
		format: function(address) {
			var pageUrl = url.parse(address, true),
				partitions = address.toString().split(/^((?:[a-z0-9-_]+\.)*[a-z0-9-_]+\.?)(?::([0-9]+))?(.*)$/i);
			
			// Protocol?		
			pageUrl.protocol = pageUrl.protocol || 'http';
			
			// Has hostname?
			pageUrl.host = pageUrl.host || partitions[1];
			
			// Path name.
			pageUrl.pathname = partitions[3];
			
			// Path?
			pageUrl.path = partitions[3];
			
			return url.format(pageUrl);
		},
		isValid: function isValid(url) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      		return regexp.test(url); 
		}
	};
})();