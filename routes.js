var _ = require('lodash');

module.exports = function(app, middleware, db, sendgrid) {



	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	//GET /todos?completed=true&filter=house
	app.get('/api/todos', middleware.requireAuthentication, function (req, res) {
		var query = req.query,
				where = {
					userId: req.user.get('id')
				};

		where.completed = !!(query.hasOwnProperty('completed') && completed === 'true');

		if (query.hasOwnProperty('filter') && query.filter.length) {
			where.description = {
				$like: '%' + where.filter + '%'
			}
		}

		db.todo.findAll({where: where}).then(function (todos) {
			res.json(todos);
		}, function (error) {
			res.status(500).send(error);
		});

	});


//GET /todos/:id

	app.get('/api/todos/:id', middleware.requireAuthentication, function (req, res) {
		var where = {
			id: +req.params.id,
			userId: req.user.get('id')
		};
		console.log('userid: ', where);

		db.todo.findOne({where: where}).then(function (todo) {
			if (todo) {
				console.log('Todo: ', todo);
				res.json(todo);
			} else {
				res.status(404).send();
			}
		}, function (error) {
			res.status(500).json(error);
		});

	});

//GET /api/user

	app.get('/api/user', middleware.requireAuthentication, function (req, res) {
		var where = {
			id: req.user.get('id')
		};
		console.log('userid: ', where);

		db.user.findOne({where: where}).then(function (user) {
			if (user) {
				console.log('user: ', user);
				res.json(user);
			} else {
				res.status(404).send();
			}
		}, function (error) {
			res.status(500).json(error);
		});

	});



// POST /todos
	app.post('/api/todos', middleware.requireAuthentication, function (req, res) {
		var body = _.pick(req.body, 'completed', 'description', 'dueDate', 'priority', 'file', 'fileName');

		db.todo.create(body).then(function (todo) {
			req.user.addTodo(todo).then(function () {
				return todo.reload();
			}).then(function (todo) {
				res.json(todo.toJSON());
			});

		}, function (error) {
			res.status(400).json(error);
		});
	});

// Delete /todos/:id
	app.delete('/api/todos/:id', middleware.requireAuthentication, function (req, res) {

		db.todo.destroy({
			where: {
				id: +req.params.id,
				userId: req.user.get('id')
			}
		}).then(function (rowsDeleted) {
			if (!rowsDeleted) {
				res.status(400).json({"error": "No todo with that ID found!"});
			} else {
				res.status(200).send();
			}
		}, function (error) {
			res.status(500).json(error);
		});

	});


// PUT /todos/:id
	app.put('/api/todos/:id', middleware.requireAuthentication, function (req, res) {
		var body = _.pick(req.body, 'completed', 'description', 'dueDate', 'priority', 'file', 'fileName'),
			attributes = {},
			where = {
				id: +req.params.id,
				userId: req.user.get('id')
			};

		if (body.hasOwnProperty('completed')) {
			attributes.completed = body.completed;
		}

		if (body.hasOwnProperty('description')) {
			attributes.description = body.description;
		}

		if (body.hasOwnProperty('dueDate')) {
			attributes.dueDate = body.dueDate;
		}

		if (body.hasOwnProperty('priority')) {
			attributes.priority = body.priority;
		}

		if (body.hasOwnProperty('file')) {
			attributes.file = body.file;
		}

		if (body.hasOwnProperty('fileName')) {
			attributes.fileName = body.fileName;
		}

		console.log('Attrib', attributes);

		db.todo.findOne({where: where}).then(function (todo) {
			if (todo) {
				todo.update(attributes).then(function (todo) {
					res.json(todo.toJSON());
				}, function (error) {
					res.status(400).json(error);
				});
			} else {
				res.status(404).send();
			}
		}, function (error) {
			res.status(500).json(error);
		});

	});

//POST /user

	app.post('/api/user', function (req, res) {
		var body = _.pick(req.body, 'email', 'password', 'firstName', 'lastName', 'accountName');

		db.user.create(body).then(function (user) {
			res.json(user.toPublicJSON());
		}, function (error) {
			res.status(400).json(error);
		});
	});

//POST /users/login

	app.post('/api/users/login', function (req, res) {
		var body = _.pick(req.body, 'email', 'password'),
				userInstance;

		db.user.authenticate(body).then(function (user) {
			var token = user.generateToken('authentication');
			userInstance = user;

			return db.token.create({
				token: token
			});
		}).then(function (tokenInstance) {
			console.log('userInstance: ', userInstance);
			//res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
			var updatedUser = userInstance.toPublicJSON();
			updatedUser._token = tokenInstance.get('token');
			res.json(updatedUser);
		}).catch(function (e) {
			res.status(401).send();

		});
	});

//DELETE /logout

	app.post('/api/logout', function (req, res) {

		if (!req.token) {
			res.status(200).send();
		}

		req.token.destroy().then(function () {
			res.status(200).send();
		}).catch(function () {
			res.status(500).send();
		})

	});

//POST /user/sendemail TODO - add in send email functionality
	app.post('/user/send-email', middleware.requireAuthentication, function (req, res) {
		var body = _.pick(req.body, 'to', 'from', 'subject', 'text', 'sendAt'),
			email     = new sendgrid.Email({
				to:       body.to,
				from:     body.from,
				subject:  body.subject,
				text:     body.text,
				sendAt:	  body.sendAt
		});

		console.log('Body: ', body);

		sendgrid.send(email, function(error, json) {
			if (error) {
				console.log('Error: ', error);
				res.status(400).json(error);
			} else {
				res.status(200).send(json);
			}
		});

	});


	// frontend routes =========================================================
	// route to handle all angular requests

	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};