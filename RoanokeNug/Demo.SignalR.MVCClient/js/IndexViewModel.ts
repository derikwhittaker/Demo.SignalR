
interface SignalR {
    quizHub: HubProxy;
}

interface HubProxy {
    client: IQuizHubClient;
    server: IQuizHubServer;
}

interface IQuizHubClient {
    receiveNewQuestion(question: any);
}

interface IQuizHubServer {
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
                tmpQuiz.Question(question.Text);

                _.each(question.Answers, (answer) => {
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
            $.connection.hub.start()
                .done(() => {
                    console.log("Connected to SignalR Quiz Hub");
                });

            return quizHub;
        }

        public startGame() {

            $("#signIn").hide();
            $("#playGame").show();

            //var tmpQuiz = new Quiz();
            //tmpQuiz.Question("Which Answer looks the best?");
            //tmpQuiz.Answers.push(new Answer(1, "Some Question 1", false));
            //tmpQuiz.Answers.push(new Answer(2, "Some Question 2", false));
            //tmpQuiz.Answers.push(new Answer(3, "Some Question 3", true));
            //tmpQuiz.Answers.push(new Answer(4, "Some Question 4", false));

            //this.Quiz(tmpQuiz);
        }
    }

    export class Quiz {
        public Question: KnockoutObservable<string> = ko.observable("");
        public Answers: KnockoutObservableArray<Answer> = ko.observableArray([]);

    }

    export class Answer {
        public Id: KnockoutObservable<string> = ko.observable("");
        public Text: KnockoutObservable<string> = ko.observable("");
        public IsCorrect: KnockoutObservable<boolean> = ko.observable(false);

        constructor(answerId: string, answerText: string) {
            this.Id(answerId);
            this.Text(answerText);
        }
    }
}