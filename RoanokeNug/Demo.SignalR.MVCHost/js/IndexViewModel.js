var MVCHost;
(function (MVCHost) {
    // Class
    var IndexViewModel = (function() {

        function IndexViewModel() {
            this.CurrentQuiz = new Quiz();
            this.Users = ko.observableArray([]);
            this.QuizHub = this.setupHubConnection();
        }

        IndexViewModel.prototype.setupHubConnection = function () {
            var self = this;
            var quizHub = $.connection.quizHub;

            quizHub.client.receiveNewQuestion = function (question) {
                console.log(question);
                
                self.CurrentQuiz.answers.removeAll();
                self.CurrentQuiz.results.removeAll();
                self.CurrentQuiz.question("");
                
                if (question != undefined) {
                    self.CurrentQuiz.question(question.Text);
                    _.each(question.Answers, function(answer) {
                        var newAnswer = new Answer(answer.Id, answer.Text);
                        self.CurrentQuiz.answers.push(newAnswer);
                    });
                } 

            };

            quizHub.client.userRegistered = function(connectionId, userName) {
                console.log("User Registered: ID: " + connectionId + " UserName: " + userName);

                self.Users.push({
                    UserName: userName
                });
            };
            
            quizHub.client.userUnregistered = function (connectionId, userName) {
                console.log("User UnrRegistered: ID: " + connectionId + " UserName: " + userName);

                var foundUser = _.find(self.Users(), function(user) {
                    return user.UserName == userName;
                });
                
                if (foundUser) {
                    self.Users.pop(foundUser);
                }
            };

            quizHub.client.tallySubmittedAnser = function(submittedAnswer) {
                console.log("User Submitted Answer: " + submittedAnswer);

                var result = {
                    wasCorrect: submittedAnswer.WasCorrect,
                    submittedAnswerId: submittedAnswer.SubmittedAnswerId,
                    correctAnswerId: submittedAnswer.CorrectAnswerId
                };

                self.CurrentQuiz.results.push(result);
            };

            $.connection.hub.start()
                .done(function() {
                    console.log("Connected to SignalR Quiz Hub");

                    quizHub.server.registerAdmin();
                });

            return quizHub;
        };

        IndexViewModel.prototype.sendNextQuestion = function() {
            this.QuizHub.server.askNewQuestion();
        };
        
        return IndexViewModel;
    })();
    MVCHost.IndexViewModel = IndexViewModel;

    var Quiz = (function () {
        function Quiz() {
            var self = this;
            this.question = ko.observable("");
            this.answers = ko.observableArray([]);
            this.results = ko.observableArray([]);

            this.correctCount = ko.computed(function () {

                var count = _.filter(self.results(), function(result) {
                    return result.wasCorrect === true;
                }).length;

                return count;
            });
            
            this.incorrectCount = ko.computed(function () {

                var count = _.filter(self.results(), function (result) {
                    return result.wasCorrect === false;
                }).length;

                return count;
            });
        }
        return Quiz;
    })();
    MVCHost.Quiz = Quiz;

    var Answer = (function () {
        function Answer(id, text) {
            this.Id = ko.observable(id);
            this.Text = ko.observable(text);
        }
        return Answer;
    })();
    MVCHost.Answer = Answer;

})(MVCHost || (MVCHost = {}));
