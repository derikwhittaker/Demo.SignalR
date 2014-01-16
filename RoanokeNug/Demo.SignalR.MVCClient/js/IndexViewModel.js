var MVCClient;
(function (MVCClient) {
    // Class
    var IndexViewModel = (function () {
        function IndexViewModel() {
            //public SignalRHost = "http://signalrmvchost.azurewebsites.net/signalr";
            this.SignalRHost = "http://localhost:26482/signalr";
            this.UserName = ko.observable("");
            this.Quiz = ko.observable(new Quiz());
            this.IsConnected = ko.observable(null);
            this.QuizHub = this.connectToHub();
        }
        IndexViewModel.prototype.connectToHub = function () {
            var self = this;
            var quizHub = $.connection.quizHub;

            quizHub.client.receiveNewQuestion = function (question) {
                console.log(question);

                var tmpQuiz = new Quiz();
                tmpQuiz.Id(question.Id);
                tmpQuiz.Question(question.Text);

                _.each(question.Answers, function (answer) {
                    var tmpAnswer = new Answer(answer.Id, answer.Text);
                    tmpQuiz.Answers.push(tmpAnswer);
                });

                self.Quiz(tmpQuiz);
            };

            quizHub.client.submittedAnswerResult = function (submissionResult) {
                console.log("Submisson Result " + submissionResult);
                var quiz = self.Quiz();
                _.each(quiz.Answers(), function (answer) {
                    if (answer.Id() === submissionResult.CorrectAnswerId) {
                        if (answer.SelectedAnswer() === submissionResult.CorrectAnswerId) {
                            answer.Status("correctlyAnswered");
                        } else if (answer.SelectedAnswer() === false) {
                            answer.Status("expectedAnswer");
                        }
                    } else {
                        if (answer.SelectedAnswer() !== false) {
                            answer.Status("incorrectAnswer");
                        }
                    }
                });
            };

            $.connection.hub.url = self.SignalRHost;
            $.connection.hub.start().done(function () {
                console.log("Connected to SignalR Quiz Hub");
                self.IsConnected(true);
            }).fail(function () {
                self.IsConnected(false);
            });

            return quizHub;
        };

        IndexViewModel.prototype.submitAnswer = function () {
            var quiz = this.Quiz();
            var questionId = quiz.Id();
            var selectedAnswer = _.find(quiz.Answers(), function (answer) {
                return answer.SelectedAnswer() != false;
            });
            var selectedAnswerId = selectedAnswer.Id();
            quiz.submitted(true);

            this.QuizHub.server.submitAnswer(questionId, selectedAnswerId);
        };

        IndexViewModel.prototype.startGame = function () {
            $("#signIn").hide();
            $("#playGame").show();

            this.QuizHub.server.registerUser(this.UserName());
        };
        return IndexViewModel;
    })();
    MVCClient.IndexViewModel = IndexViewModel;

    var Quiz = (function () {
        function Quiz() {
            this.Id = ko.observable("");
            this.Question = ko.observable("");
            this.Answers = ko.observableArray([]);
            this.submitted = ko.observable(false);
        }
        return Quiz;
    })();
    MVCClient.Quiz = Quiz;

    var Answer = (function () {
        function Answer(answerId, answerText) {
            var _this = this;
            this.Id = ko.observable("");
            this.Text = ko.observable("");
            this.Status = ko.observable("");
            this.SelectedAnswer = ko.observable(false);
            this.Id(answerId);
            this.Text(answerText);

            this.StatusCSS = ko.computed(function () {
                if (_this.Status() == "correctlyAnswered") {
                    return "correct-answer";
                } else if (_this.Status() == "expectedAnswer") {
                    return "correct-answer";
                } else if (_this.Status() == "incorrectAnswer") {
                    return "wrong-answer";
                }

                return "";
            });
        }
        return Answer;
    })();
    MVCClient.Answer = Answer;
})(MVCClient || (MVCClient = {}));
//# sourceMappingURL=IndexViewModel.js.map
