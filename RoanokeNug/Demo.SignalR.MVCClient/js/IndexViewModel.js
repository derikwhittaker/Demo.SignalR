var MVCClient;
(function (MVCClient) {
    // Class
    var IndexViewModel = (function () {
        function IndexViewModel() {
            this.UserName = ko.observable("");
            this.Quiz = ko.observable(new Quiz());
            this.QuizHub = this.connectToHub();
        }
        IndexViewModel.prototype.connectToHub = function () {
            var self = this;
            var quizHub = $.connection.quizHub;

            quizHub.client.receiveNewQuestion = function (question) {
                console.log(question);

                var tmpQuiz = new Quiz();
                tmpQuiz.Question(question.Text);

                _.each(question.Answers, function (answer) {
                    var tmpAnswer = new Answer(answer.Id, answer.Text);
                    tmpQuiz.Answers.push(tmpAnswer);
                });

                //tmpQuiz.Answers.push(new Answer(1, "Some Question 1", false));
                //tmpQuiz.Answers.push(new Answer(2, "Some Question 2", false));
                //tmpQuiz.Answers.push(new Answer(3, "Some Question 3", true));
                //tmpQuiz.Answers.push(new Answer(4, "Some Question 4", false));
                self.Quiz(tmpQuiz);
            };

            $.connection.hub.url = "http://localhost:26482/signalr";
            $.connection.hub.start().done(function () {
                console.log("Connected to SignalR Quiz Hub");
            });

            return quizHub;
        };

        IndexViewModel.prototype.startGame = function () {
            $("#signIn").hide();
            $("#playGame").show();
            //var tmpQuiz = new Quiz();
            //tmpQuiz.Question("Which Answer looks the best?");
            //tmpQuiz.Answers.push(new Answer(1, "Some Question 1", false));
            //tmpQuiz.Answers.push(new Answer(2, "Some Question 2", false));
            //tmpQuiz.Answers.push(new Answer(3, "Some Question 3", true));
            //tmpQuiz.Answers.push(new Answer(4, "Some Question 4", false));
            //this.Quiz(tmpQuiz);
        };
        return IndexViewModel;
    })();
    MVCClient.IndexViewModel = IndexViewModel;

    var Quiz = (function () {
        function Quiz() {
            this.Question = ko.observable("");
            this.Answers = ko.observableArray([]);
        }
        return Quiz;
    })();
    MVCClient.Quiz = Quiz;

    var Answer = (function () {
        function Answer(answerId, answerText) {
            this.Id = ko.observable("");
            this.Text = ko.observable("");
            this.IsCorrect = ko.observable(false);
            this.Id(answerId);
            this.Text(answerText);
        }
        return Answer;
    })();
    MVCClient.Answer = Answer;
})(MVCClient || (MVCClient = {}));
//# sourceMappingURL=IndexViewModel.js.map
