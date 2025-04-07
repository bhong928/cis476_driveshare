// /src/lib/passwordRecoveryChain.js
class RecoveryHandler {
    constructor(question, correctAnswer) {
      this.question = question;
      this.correctAnswer = correctAnswer;
      this.nextHandler = null;
    }
  
    setNext(handler) {
      this.nextHandler = handler;
      return handler;
    }
  
    // Validates a single answer for this handler
    validate(answer) {
      return answer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase();
    }
  }
  
  // For demonstration purposes, we'll use static correct answers.
  // In a production app, these should be stored per user.
  export function validateSecurityAnswers(answers) {
    // The security questions are the same as in your sign‑up page:
    // 1. "What year did you graduate Highschool?"
    // 2. "What is your first pets name?"
    // 3. "How many siblings do you have?"
    // For testing, we'll assume the correct answers are "2010", "Fluffy", and "2"
    const handler1 = new RecoveryHandler("What year did you graduate Highschool?", "2010");
    const handler2 = new RecoveryHandler("What is your first pets name?", "Fluffy");
    const handler3 = new RecoveryHandler("How many siblings do you have?", "2");
  
    // Validate each answer:
    const valid1 = handler1.validate(answers.answer1);
    const valid2 = handler2.validate(answers.answer2);
    const valid3 = handler3.validate(answers.answer3);
  
    return valid1 && valid2 && valid3;
  }