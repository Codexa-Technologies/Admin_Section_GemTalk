import React, { useEffect, useState } from 'react';
import { getAdminQuestions, deleteAdminAnswer, deleteAdminQuestion } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/manage-questions.css';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const ManageQuestionsPage = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await getAdminQuestions(token);
        if (!isMounted) return;
        setQuestions(response.data || []);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load questions');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteAdminQuestion(token, id);
      setQuestions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  const handleAnswerDelete = async (questionId, answerId) => {
    try {
      setAnswerError('');
      const response = await deleteAdminAnswer(token, questionId, answerId);
      setQuestions((prev) =>
        prev.map((item) => (item._id === questionId ? response.data : item))
      );
      if (selectedQuestion?._id === questionId) {
        setSelectedQuestion(response.data);
      }
    } catch (err) {
      setAnswerError(err.message || 'Failed to delete answer');
    }
  };

  return (
    <div className="manage-questions">
      <div className="manage-questions__header">
        <div>
          <h1 className="manage-questions__title">Manage Q & A</h1>
          <p className="manage-questions__subtitle">Review all user questions and answers.</p>
        </div>
      </div>

      {loading ? (
        <div className="manage-questions__state">Loading questions...</div>
      ) : error ? (
        <div className="manage-questions__state error">{error}</div>
      ) : questions.length === 0 ? (
        <div className="manage-questions__state">No questions found.</div>
      ) : (
        <div className="manage-questions__grid">
          {questions.map((item) => (
            <div key={item._id} className="question-card">
              <div className="question-card__meta">
                <span className="question-card__date">{fmtDate(item.createdAt)}</span>
                <span className="question-card__count">{item.answers?.length || 0} answers</span>
              </div>
              <p className="question-card__title">{item.question}</p>
              <p className="question-card__by">Asked by {item.askedBy?.name || 'User'}</p>
              <div className="question-card__actions">
                <button className="btn-outline" onClick={() => setSelectedQuestion(item)}>
                  View
                </button>
                <button className="btn-danger" onClick={() => setPendingDelete(item)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedQuestion && (
        <div className="question-modal" role="dialog" aria-modal="true" onClick={() => setSelectedQuestion(null)}>
          <div className="question-modal__content" onClick={(event) => event.stopPropagation()}>
            <div className="question-modal__header">
              <h2>Question Details</h2>
              <button className="icon-btn" onClick={() => setSelectedQuestion(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="question-modal__question">{selectedQuestion.question}</p>
            <p className="question-modal__meta">Asked by {selectedQuestion.askedBy?.name || 'User'}</p>

            <div className="question-modal__answers">
              {selectedQuestion.answers?.length ? (
                selectedQuestion.answers.map((answer) => (
                  <div key={answer._id || answer.text} className="answer-card">
                    <div className="answer-card__row">
                      <p>{answer.text}</p>
                      <button
                        className="answer-card__delete"
                        onClick={() => handleAnswerDelete(selectedQuestion._id, answer._id)}
                        title="Delete answer"
                        aria-label="Delete answer"
                      >
                        ✕
                      </button>
                    </div>
                    <span>Answered by {answer.answeredBy?.name || 'User'}</span>
                  </div>
                ))
              ) : (
                <p className="question-modal__empty">No answers yet.</p>
              )}
            </div>
            {answerError && <div className="question-modal__error">{answerError}</div>}
          </div>
        </div>
      )}

      {pendingDelete && (
        <div className="question-modal" role="dialog" aria-modal="true" onClick={() => setPendingDelete(null)}>
          <div className="question-modal__content" onClick={(event) => event.stopPropagation()}>
            <div className="question-modal__header">
              <h2>Delete Question</h2>
              <button className="icon-btn" onClick={() => setPendingDelete(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <p className="question-modal__question">Are you sure you want to delete this question?</p>
            <p className="question-modal__meta">{pendingDelete.question}</p>
            <div className="question-modal__actions">
              <button className="btn-outline" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={async () => {
                  const id = pendingDelete._id;
                  setPendingDelete(null);
                  await handleDelete(id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestionsPage;
