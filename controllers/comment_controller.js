var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.nuevo = function(req, res) {
	res.render('comments/nuevo.ejs', {quizId: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function (req, res) {
	var comment = models.Comment.build (
		{ texto: req.body.comment.texto, QuizId: req.params.quizId }
	);
	
	comment
	.validate()
	.then(
		function (err) {
			if(err) {
				res.render('/comments/nuevo.ejs', {comment: comment, errors: err.errors});
			} else {
				comment
				.save()
				.then( function(){ res.redirect('/quizes/' + req.params.quizId)})
			}
		}
	).catch(function(error){next(error)});
};