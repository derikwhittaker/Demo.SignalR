using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR.Client;
using Newtonsoft.Json;

namespace Demo.SignalR.CMDAdminClient
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Admin Console Starting up...");
            ////public SignalRHost = "http://signalrmvchost.azurewebsites.net/signalr";
            

            var hubHost = new HubHost();
            hubHost.Connect("http://localhost:26482/signalr").Wait();
            Console.WriteLine("Connected to Hub");

            hubHost.QuizHubProxy.RegisterAdmin();

            Console.ReadLine();
        }
    }

    public class HubHost
    {
        public async Task Connect(string url)
        {
            Connection = new HubConnection(url);
            var quizHub = Connection.CreateHubProxy("QuizHub");

            QuizHubProxy = new QuizHubProxy(quizHub);

            await Connection.Start();
        }

        public HubConnection Connection { get; set; }
        public QuizHubProxy QuizHubProxy { get; set; }
    }

    public class QuizHubProxy
    {
        private readonly IHubProxy _quizHubProxy;

        public QuizHubProxy(IHubProxy quizHubProxy)
        {
            _quizHubProxy = quizHubProxy;

            SetupProxy();

        }

        private void SetupProxy()
        {
            _quizHubProxy.On("receiveNewQuestion", HandleReceiveNewQuestion);
        }

        private void HandleReceiveNewQuestion(object data)
        {
            var question = JsonConvert.DeserializeObject<Question>(data.ToString());
            Console.WriteLine("[New Question]");
            Console.WriteLine("");

            Console.WriteLine("Question: {0}", question.Text);
            Console.WriteLine("Possible Answers:");

            foreach (var answer in question.Answers)
            {
                Console.WriteLine(answer.Text);
            }

            Console.WriteLine("");
        }

        public void RegisterAdmin()
        {
            _quizHubProxy.Invoke("RegisterAdmin");
        }
    }

    public class Question
    {
        public Question()
        {
            Id = Guid.NewGuid().ToString();
            Answers = new List<Answer>();
            Submissions = new List<Submission>();
        }

        public string Id { get; set; }
        public string Text { get; set; }
        public IList<Answer> Answers { get; set; }
        public IList<Submission> Submissions { get; set; }
        public bool BeenAsked { get; set; }
    }

    public class Answer
    {
        public Answer(string text, bool isCorrect)
        {
            Id = Guid.NewGuid().ToString();
            Text = text;
            IsCorrect = isCorrect;
        }

        public string Id { get; set; }
        public string Text { get; set; }
        public bool IsCorrect { get; set; }
    }

    public class Submission
    {
        public string ConnectionId { get; set; }
        public string AnswerId { get; set; }
        public bool WasCorrect { get; set; }
    }
}
