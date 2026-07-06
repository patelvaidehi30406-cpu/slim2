import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
  options: { text: string; nextId: number | null; result?: string }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "What is your primary wellness goal today?",
    options: [
      { text: "Enhance Physical Performance & Strength", nextId: 2 },
      { text: "Weight Management & Metabolism", nextId: 3 },
      { text: "Hair, Skin & Dynamic Glow", nextId: 4 }
    ]
  },
  {
    id: 2, // Man Path
    text: "Which area needs the most focus?",
    options: [
      { text: "Daily Stress & Recovery", nextId: null, result: "ashwagandha" },
      { text: "Vitality & Natural Energy", nextId: null, result: "testosterone" },
      { text: "Focus & Cognitive Clarity", nextId: null, result: "brain_booster" }
    ]
  },
  {
    id: 3, // Slim Path
    text: "How would you describe your activity level?",
    options: [
      { text: "High Intensity / Keto Lifestyle", nextId: null, result: "keto" },
      { text: "Moderate / Looking for Balance", nextId: null, result: "slim_plus" },
      { text: "Sedentary / Digestive Focus", nextId: null, result: "metabolism" }
    ]
  },
  {
    id: 4, // Glow Path
    text: "What is your main beauty concern?",
    options: [
      { text: "Hair Strength & Thickness", nextId: null, result: "biotin" },
      { text: "Complete Hair Vitality", nextId: null, result: "hair_vitamins" },
      { text: "Radiant & Clear Complexion", nextId: null, result: "skin_radiance" }
    ]
  }
];

const productData: Record<string, { name: string; view: 'man' | 'slim' | 'glow'; image: string }> = {
  ashwagandha: { name: "Ashwagandha Premium", view: "man", image: "/ash_summary_fixed.jpg" },
  testosterone: { name: "Testosterone Booster", view: "man", image: "/testo_summary.jpg" },
  brain_booster: { name: "Brain Booster", view: "man", image: "/brain_summary.jpg" },
  keto: { name: "Keto Fat Burner", view: "slim", image: "/keto_summary.jpg" },
  slim_plus: { name: "Slim Plus", view: "slim", image: "/slim_plus_summary.jpg" },
  metabolism: { name: "Metabolism Support", view: "slim", image: "/meta.jpeg" },
  biotin: { name: "Biotin Premium", view: "glow", image: "/biotin.jpeg" },
  hair_vitamins: { name: "Hair Vitamins", view: "glow", image: "/hair_summary.jpg" },
  skin_radiance: { name: "Skin Radiance", view: "glow", image: "/skin_radiance_summary.jpg" }
};

interface WellnessQuizProps {
  onSelectProduct: (view: 'man' | 'slim' | 'glow', subProduct: any) => void;
}

const WellnessQuiz: React.FC<WellnessQuizProps> = ({ onSelectProduct }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleOptionClick = (option: { nextId: number | null; result?: string }) => {
    if (option.result) {
      setIsAnalyzing(true);
      setTimeout(() => {
        setResult(option.result!);
        setIsAnalyzing(false);
      }, 2000);
    } else if (option.nextId) {
      setCurrentStep(option.nextId);
    }
  };

  const currentQuestion = questions.find(q => q.id === currentStep);

  const resetQuiz = () => {
    setCurrentStep(1);
    setResult(null);
  };

  return (
    <section className="wellness-quiz">
      <div className="quiz-container glass-morphism">
        {isAnalyzing ? (
          <div className="analyzing-state">
            <div className="scanner-dot"></div>
            <h2 className="analyzing-text">Analyzing Your Bio-Profile...</h2>
            <p>Our algorithms are cross-referencing your goals with our Gold-Standard formulations.</p>
          </div>
        ) : !result ? (
          <div className="quiz-content">
            <span className="quiz-badge">Wellness Concierge</span>
            <h2 className="quiz-question">{currentQuestion?.text}</h2>
            <div className="options-grid">
              {currentQuestion?.options.map((option, idx) => (
                <button
                  key={idx}
                  className="quiz-option"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <div className="quiz-progress">
              Step {currentStep === 1 ? '1' : '2'} of 2
            </div>
          </div>
        ) : (
          <div className="quiz-result animate-fade-in">
            <span className="quiz-badge">Your Personalized Match</span>
            <h2>We found your perfect supplement!</h2>
            <div className="result-card">
              <img src={productData[result].image} alt={productData[result].name} />
              <div className="result-info">
                <h3>{productData[result].name}</h3>
                <p>Based on your answers, this precision-formula is the ideal catalyst for your goals.</p>
                <div className="result-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => onSelectProduct(productData[result].view, result)}
                  >
                    View Product Details
                  </button>
                  <button className="reset-btn" onClick={resetQuiz}>Retake Quiz</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .wellness-quiz {
          padding: 80px 5%;
          background: #f8fbf9;
          display: flex;
          justify-content: center;
        }

        .quiz-container {
          width: 100%;
          max-width: 800px;
          background: white;
          padding: 60px;
          border-radius: 30px;
          box-shadow: 0 20px 50px rgba(45, 74, 62, 0.08);
          border: 1px solid rgba(45, 74, 62, 0.05);
          text-align: center;
        }

        .quiz-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #e8f0ed;
          color: #2d4a3e;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 50px;
          margin-bottom: 30px;
        }

        .quiz-question {
          font-size: 32px;
          color: #2d4a3e;
          margin-bottom: 40px;
          font-weight: 800;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .quiz-option {
          padding: 18px 30px;
          background: #fff;
          border: 2px solid #f0f0f0;
          border-radius: 15px;
          font-size: 18px;
          font-weight: 500;
          color: #444;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .quiz-option:hover {
          border-color: #2d4a3e;
          background: #f9fbfb;
          transform: translateX(10px);
          color: #2d4a3e;
        }

        .quiz-progress {
          margin-top: 40px;
          font-size: 14px;
          color: #888;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .result-card {
          margin-top: 30px;
          display: flex;
          gap: 30px;
          align-items: center;
          text-align: left;
          background: #fdfdfd;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid #f0f0f0;
        }

        .result-card img {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 15px;
        }

        .result-info h3 {
          font-size: 24px;
          color: #2d4a3e;
          margin: 0 0 10px 0;
        }

        .result-info p {
          color: #666;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .result-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .action-btn.primary {
          padding: 12px 25px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .action-btn.primary:hover {
          background: #1f3329;
        }

        .reset-btn {
          background: none;
          border: none;
          color: #888;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        @media (max-width: 768px) {
          .quiz-container { padding: 30px; }
          .quiz-question { font-size: 24px; }
          .result-card { flex-direction: column; text-align: center; }
          .result-card img { width: 150px; height: 150px; }
          .result-actions { flex-direction: column; }
        }

        .analyzing-state {
          padding: 40px;
          animation: scanPulse 2s infinite ease-in-out;
        }

        .scanner-dot {
          width: 60px;
          height: 60px;
          border: 4px solid #2d4a3e;
          border-top-color: transparent;
          border-radius: 50%;
          margin: 0 auto 30px;
          animation: spin 1s linear infinite;
        }

        .analyzing-text {
          color: #2d4a3e;
          font-family: 'Outfit', sans-serif;
          margin-bottom: 15px;
        }

        @keyframes scanPulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.02); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default WellnessQuiz;
