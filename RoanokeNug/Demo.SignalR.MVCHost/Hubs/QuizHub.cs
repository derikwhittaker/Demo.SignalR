using Demo.SignalR.MVCHost.Services;
using Microsoft.AspNet.SignalR;

namespace Demo.SignalR.MVCHost.Hubs
{
    public class QuizHub : Hub
    {
        private QuizService _quizService;

        public QuizHub()
        {
            // no IoC for simplicity sake
            _quizService = new QuizService();    
        }

        public void SubmitAnswer(string questionId, string answerId)
        {
            var connectionId = Context.ConnectionId;

            var submissionResult = _quizService.SubmitAnswer(questionId, answerId, connectionId);

            Clients.Caller.submittedAnswerResult(submissionResult);
        }

        public void SubmitAnswerResults()
        {
            
        }

        public void AskNewQuestion()
        {
            var nextQuestion = _quizService.NextQuestion();
            
            Clients.All.receiveNewQuestion(nextQuestion);
        }
    }
}