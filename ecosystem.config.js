module.exports = {
	apps: [
		{
			name: "my-node-app", // A friendly name for your application
			script: "server.js", // The file to execute
			// Environment variables for this specific application
			env: {
				NODE_ENV: "development",
				HOSTNAME: "localhost",
				PORT: 3000,
			},
			// You can define a production-specific environment here too
			env_production: {
				NODE_ENV: "production",
				HOSTNAME: "0.0.0.0", // Often used for production
				PORT: 80,
			},
		},
	],
};
