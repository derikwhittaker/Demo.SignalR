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
                
                self.CurrentQuiz.Answers.removeAll();
                self.CurrentQuiz.Question("");
                
                if (question != undefined) {
                    self.CurrentQuiz.Question(question.Text);
                    _.each(question.Answers, function(answer) {
                        var newAnswer = new Answer(answer.Id, answer.Text);
                        self.CurrentQuiz.Answers.push(newAnswer);
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
            this.Question = ko.observable("");
            this.Answers = ko.observableArray([]);
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
