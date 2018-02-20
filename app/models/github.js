const fetch = require('node-fetch');
exports.github  =  async () => {
	const userName = 'mpsdantas';
  	const url = 'https://api.github.com/users';
  	const reposResponse = await fetch(`${url}/${userName}/repos`);
  	const userRepos = await reposResponse.json();
  	return userRepos;
};