
interface SignalR {
    quizHub: HubProxy;
}

interface HubProxy {
    client: IQuizHubClient;
    server: IQuizHubServer;
}

interface IQuizHubClient {
    receiveNewQuestion(question: any);
    submittedAnswerResult(submissionResult: any);
}

interface IQuizHubServer {
    submitAnswer(questionId: string, answerId: string);
}

module MVCClient {

    // Class
    export class IndexViewModel {
        public QuizHub: HubProxy;
        public UserName: KnockoutObservable<string> = ko.observable("");
        public Quiz: KnockoutObservable<Quiz> = ko.observable(new Quiz());

        constructor() {
            this.QuizHub = this.connectToHub();
        }

        public connectToHub() {
            var self = this;
            var quizHub = $.connection.quizHub;

            quizHub.client.receiveNewQuestion = (question) => {
                console.log(question);

                var tmpQuiz = new Quiz();
                tmpQuiz.Id(question.Id);
                tmpQuiz.Question(question.Text);

                _.each(question.Answers, (answer) => {
                    var tmpAnswer = new Answer(answer.Id, answer.Text);
                    tmpQuiz.Answers.push(tmpAnswer);
                });
                               
                self.Quiz(tmpQuiz);
                
            };

            quizHub.client.submittedAnswerResult = (submissionResult) => {
                console.log("Submisson Result " + submissionResult);
                var quiz = self.Quiz();
                _.each(quiz.Answers(), (answer) => {

                    if (answer.Id() === submissionResult.CorrectAnswerId) {
                        if (answer.SelectedAnswer() === submissionResult.CorrectAnswerId) {
                            answer.Status("correctlyAnswered"); // got it right
                        }
                        else if (answer.SelectedAnswer() === false) {
                            answer.Status("expectedAnswer"); // we got it wrong, this should have been the answer
                        }
                    }
                    else {
                        if (answer.SelectedAnswer() !== false) {
                            answer.Status("incorrectAnswer"); // we got it wrong, this is what we selected
                        }
                    }
                });
            };

            $.connection.hub.url = "http://localhost:26482/signalr";
            $.connection.hub.start()
                .done(() => {
                    console.log("Connected to SignalR Quiz Hub");
                });

            return quizHub;
        }

        public submitAnswer() {

            var quiz = this.Quiz();
            var questionId = quiz.Id();
            var selectedAnswer = _.find(quiz.Answers(), function (answer) { return answer.SelectedAnswer() != false; });
            var selectedAnswerId = selectedAnswer.Id();

            this.QuizHub.server.submitAnswer(questionId, selectedAnswerId);
        }

        public startGame() {

            $("#signIn").hide();
            $("#playGame").show();

        }
    }

    export class Quiz {
        public Id: KnockoutObservable<string> = ko.observable("");
        public Question: KnockoutObservable<string> = ko.observable("");
        public Answers: KnockoutObservableArray<Answer> = ko.observableArray([]);

    }

    export class Answer {
        public Id: KnockoutObservable<string> = ko.observable("");
        public Text: KnockoutObservable<string> = ko.observable("");
        public Status: KnockoutObservable<string> = ko.observable("");
        public SelectedAnswer: KnockoutObservable<boolean> = ko.observable(false);

        public StatusCSS: KnockoutComputed<string>;

        constructor(answerId: string, answerText: string) {
            this.Id(answerId);
            this.Text(answerText);

            this.StatusCSS = ko.computed(() => {
                if (this.Status() == "correctlyAnswered") {
                    return "correct-answer";
                }
                else if (this.Status() == "expectedAnswer") {
                    return "correct-answer";
                }
                else if (this.Status() == "incorrectAnswer") {
                    return "wrong-answer";
                }

                return "";
            });
        }
    }
}