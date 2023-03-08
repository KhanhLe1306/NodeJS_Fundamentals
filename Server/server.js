const http = require("http");
const fs = require("fs");

const routes = (req, res) => {
	const url = req.url;
	const method = req.method;
	//console.log(method);
	if (method === "GET") {
		if (url === "/") {
			res.setHeader("Content-Type", "text/plain");
			res.write("Welcome to my app!");
			res.end();
		} else if (url === "/users") {
			fs.readFile("users.txt", "utf-8", (err, data) => {
				console.log(data);
				res.setHeader("Content-Type", "text/plain");
				res.write(data);
				res.end();
			});
		} else if (url === "/create-user") {
			res.setHeader("Content-Type", "text/html");
			res.write(
				"<html><head><title>My wonderful app!</title></head><body><form action='/create-user' method='POST'><input type='text' name='message'/><button>Save</button></form></body></html>"
			);
			res.end();
		}
	} else if (method === "POST") {
		console.log("inside post create-user");
		if (url === "/create-user") {
			const body = [];
			req.on("data", (chunk) => {
				console.log(chunk);
				body.push(chunk);
			});
			req.on("end", () => {
				const parsedBody = Buffer.concat(body).toString();
				const message = parsedBody.split("=")[1];
				fs.readFile("users.txt", "utf-8", (err, data) => {
                    const newData = data + '\n' + message;
                    fs.writeFileSync('users.txt', newData);
				});
            });
            res.statusCode = 302;
            res.setHeader('Location', '/users')
            return res.end();
		}
	} else {
		res.setHeader("Content-Type", "text/plain");
		res.write("No routes set up!");
		res.end();
	}
};

const server = http.createServer(routes);

server.listen(8000);
