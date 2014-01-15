using System;
using System.Collections.Generic;
using System.Linq;

namespace Demo.SignalR.MVCHost.Services
{
    public class QuizService
    {
        // i know, i know, i know... but it for a demo
        private static IList<Question> _questions;

        static QuizService()
        {
            BuildQuestions();
        }

        public Question NextQuestion()
        {
            var nextQuestion = _questions.FirstOrDefault(x => !x.BeenAsked);

            if (nextQuestion != null)
            {
                _questions[_questions.IndexOf(nextQuestion)].BeenAsked = true;
                nextQuestion.BeenAsked = true;                
            }
            
            return nextQuestion;
        }

        public void SubmitAnswer(string questionId, Submission submission, Answer answer)
        {
            
        }

        #region Qustion Builder

        private static void BuildQuestions()
        {
            _questions = new List<Question>();
            var q1 = new Question
            {
                Text = "Which is a name of a Mars Rover?",
                Answers = new List<Answer>
                {
                    new Answer("Zues", false),
                    new Answer("Opportunity", true),
                    new Answer("Bush", false),
                    new Answer("Failure", false)
                }
            };

            var q2 = new Question
            {
                Text = "What year did the iPhone debut?",
                Answers = new List<Answer>
                {
                    new Answer("2004", false),
                    new Answer("2006", false),
                    new Answer("2007", true),
                    new Answer("2009", false)
                }
            };

            var q3 = new Question
            {
                Text = "What is the name of the 2nd biggest planet in our solar system?",
                Answers = new List<Answer>
                {
                    new Answer("Earth", false),
                    new Answer("Mars", false),
                    new Answer("Saturn", true),
                    new Answer("Pluto", false)
                }
            };

            var q4 = new Question
            {
                Text = "Is SignalR Cool?",
                Answers = new List<Answer>
                {
                    new Answer("Yes", true),
                    new Answer("No", false),
                }
            };

            _questions.Add(q1);
            _questions.Add(q2);
            _questions.Add(q3);
            _questions.Add(q4);
        }

        #endregion
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