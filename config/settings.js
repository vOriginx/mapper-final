var production = false;
var address = '';

if (production === true) {
	//public IPv4 address
	address = '35.176.80.114';
} else {
	address = 'http://localhost';
}

module.exports = address;