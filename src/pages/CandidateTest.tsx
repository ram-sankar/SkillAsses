import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAssignmentById, saveAnswerAndScore } from "services/assignmentService";
import { fetchTest } from "services/questionService";
import { Question } from "common/models/Question";
import { getResponseFromPrompt } from "services/genaiService";
import { toast } from "react-toastify";

import Button from "components/Button";
import SummaryView from "components/SummaryView";
import QuestionRenderer from "components/QuestionRenderer";

import "./styles/CandidateTest.scss";

const CandidateTest = () => {
  const { assignmentId } = useParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [testTitle, setTestTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ?.id] || "";

  useEffect(() => {
    const loadTest = async () => {
      if (!assignmentId) return toast.error("Assignment ID missing");
      try {
        setLoading(true);
        const assignment = await getAssignmentById(assignmentId);
        const test = await fetchTest(assignment?.testId);
        if (!assignment || !test) return toast.error("Invalid test or assignment");
        setQuestions(test.questions || []);
        setTestTitle(test.topic || "Test");
      } catch (err) {
        toast.error("Failed to load test");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [assignmentId]);

  const createScorePrompt = (questionText: string, userAnswer: string) =>
    `Score the following candidate answer out of 10 based on correctness and completeness.\nQuestion: ${questionText}\nCandidate answer: ${userAnswer}\nOnly provide a number between 0 and 10.`;

  const saveAnswerWithScore = async (qId: any, answer: string, score: number) => {
    if (!assignmentId) return;
    try {
      await saveAnswerAndScore(assignmentId, qId, answer, score, score / questions.length);
      setScores((prev) => ({ ...prev, [qId]: score }));
    } catch (err) {
      toast.error("Failed to save answer and score");
      console.error(err);
    }
  };

  const handleChangeAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQ.id]: value });
  };

  const handleSubmitAnswer = async (goToNext: boolean) => {
    if (!currentAnswer.trim()) return toast.warn("Please answer before proceeding.");
    setSaving(true);
    try {
      const prompt = createScorePrompt(currentQ.text, currentAnswer);
      const aiResponse = await getResponseFromPrompt(prompt);
      const parsedScore = parseFloat(aiResponse);
      const score = isNaN(parsedScore) ? 0 : Math.min(Math.max(parsedScore, 0), 10);
      await saveAnswerWithScore(currentQ.id, currentAnswer, score);
      goToNext ? setCurrentIndex((i) => i + 1) : setShowSummary(true);
    } catch (error) {
      toast.error("Error validating or saving the answer");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  if (loading) return <div className="loading">Loading test...</div>;
  if (!questions.length) return <div className="no-questions">No questions found.</div>;
  if (showSummary) {
    return <SummaryView questions={questions} scores={scores} answers={answers} />;
  }

  return (
    <div className="container">
      <h1 className="title">{testTitle}</h1>
      <h2 className="question-count">
        Question {currentIndex + 1} / {questions.length}
      </h2>
      <p className="question-text">{currentQ.text}</p>
      <QuestionRenderer question={currentQ} answer={currentAnswer} onChange={handleChangeAnswer} />
      <div className="actions">
        {currentIndex < questions.length - 1 && (
          <Button onClick={() => handleSubmitAnswer(true)} disabled={saving}>
            {saving ? "Saving..." : "Next"}
          </Button>
        )}
        {currentIndex === questions.length - 1 && allAnswered && (
          <Button onClick={() => handleSubmitAnswer(false)} disabled={saving}>
            {saving ? "Submitting..." : "Complete Test"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CandidateTest;
