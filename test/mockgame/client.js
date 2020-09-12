const Axios = require('axios');

const url = 'http://localhost:3000/p';

const axios = Axios.create({
	baseURL: url
});

function createSocket(data) {
	return axios.post('/poll/121212', data);
}

(async () => {
	try {
		console.log((await createSocket()).data);
	}
	catch(err) {
		console.log(err);
	}
})();