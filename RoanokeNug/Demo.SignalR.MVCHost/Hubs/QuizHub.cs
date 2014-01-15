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

        public void SubmitAnswer()
        {
            
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