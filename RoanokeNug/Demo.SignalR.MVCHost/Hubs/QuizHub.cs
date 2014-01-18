using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
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

        public override Task OnConnected()
        {
            Debug.WriteLine(Context.ConnectionId);

            return base.OnConnected();
        }

        public override Task OnDisconnected()
        {
            var connectionId = Context.ConnectionId;

            var foundUser = _quizService.Users.FirstOrDefault(x => x.ConnectionId == connectionId);

            if (foundUser != null && !string.IsNullOrEmpty(_quizService.AdminConnectionId))
            {
                Clients.Client(_quizService.AdminConnectionId).userUnregistered(connectionId, foundUser.Name);
            }

            return base.OnDisconnected();
        }

        public void SubmitAnswer(string questionId, string answerId)
        {
            var connectionId = Context.ConnectionId;

            var submissionResult = _quizService.SubmitAnswer(questionId, answerId, connectionId);

            Clients.Caller.submittedAnswerResult(submissionResult);

            Clients.Client(_quizService.AdminConnectionId).tallySubmittedAnser(submissionResult);
        }

        public void SubmitAnswerResults()
        {
            
        }

        public void RegisterUser(string userName)
        {
            var connectionId = Context.ConnectionId;

            _quizService.RegisterUser(connectionId, userName);

            if (!string.IsNullOrEmpty(_quizService.AdminConnectionId))
            {
                Clients.Client(_quizService.AdminConnectionId).userRegistered(connectionId, userName);
            }
        }

        public void RegisterAdmin()
        {
            var connectionId = Context.ConnectionId;

            _quizService.RegisterAdmin(connectionId);

        }

        public void AskNewQuestion()
        {
            var nextQuestion = _quizService.NextQuestion();
            
            Clients.All.receiveNewQuestion(nextQuestion);
        }
    }
}