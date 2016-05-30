var models = require('../models/models.js');

// Autoload - factoriza el c�digo si ruta incluye :quizid
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(
		function(quiz) {
			if(quiz){
				req.quiz = quiz;
				next();
			} else { 
				next(new Error('No existe quizId=' + quizId)); 
			}
		}
	).catch(function(error) { next(error); });
};

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(
		function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz, errors: [] });
	});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/nuevo
exports.nuevo = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", errors: []}
	);
	
	res.render('quizes/nuevo', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );
	
	quiz.validate().then(
		function(err) {
			if(err) {
				res.render('quizes/nuevo', {quiz: quiz, errors: err.errors});
			} else {
				// guardar en DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function() { res.redirect('/quizes'); }); // Redirecci�n HTTP (URL relativo) lista de preguntas
			}
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var quiz = req.quiz;	// autoload de instancia de quiz
	
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate()
	.then(
		function(err) {
			if(err){
				res.render('quizes/edit', { quiz:req.quiz, errors: err.errors});
			}else{
				req.quiz
				.save( {fields: ["pregunta","respuesta"]} )
				.then( function() { res.redirect('/quizes'); });
			}
		}
	);
};

exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

