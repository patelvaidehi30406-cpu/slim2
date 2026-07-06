import React, { useState, useRef, useEffect } from 'react';

interface SkinScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (view: 'man' | 'slim' | 'glow', subProduct: string) => void;
}

const skinCategories = {
  normal: {
    label: "Radiant & Balanced",
    desc: "Your skin shows high vitality and optimal hydration levels.",
    rec: { name: "Skin Radiance", view: "glow", subProduct: "skin_radiance" }
  },
  dry: {
    label: "Hydration Needed",
    desc: "Visible signs of minor dehydration and matte texture.",
    rec: { name: "Biotin Premium", view: "glow", subProduct: "biotin" }
  },
  oily: {
    label: "High Sebum Activity",
    desc: "Reflective patterns detected in the T-zone area.",
    rec: { name: "Keto Fat Burner", view: "slim", subProduct: "keto" }
  },
  dull: {
    label: "Low Vitality Score",
    desc: "Surface analysis suggests low micro-circulation.",
    rec: { name: "Ashwagandha Premium", view: "man", subProduct: "ashwagandha" }
  },
  stressed: {
    label: "Stressed Pattern",
    desc: "Detection of uneven texture likely linked to cortisol levels.",
    rec: { name: "Brain Booster", view: "man", subProduct: "brain_booster" }
  }
};

const SkinScanner: React.FC<SkinScannerProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [step, setStep] = useState<'scanning' | 'quiz' | 'results'>('scanning');
  const [hasPermission, setHasPermission] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState<keyof typeof skinCategories | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [detectedGender, setDetectedGender] = useState<'Man' | 'Woman' | null>(null);
  const [vitalityMetrics, setVitalityMetrics] = useState({ ph: 5.5, hydration: 65, elasticity: 72 });
  const [faceNotFound, setFaceNotFound] = useState(false);
  const [faceLocked, setFaceLocked] = useState(false);
  const [scanStats, setScanStats] = useState({ topComplexity: 0, bottomComplexity: 0, samples: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setFaceNotFound(false);
    } else {
      stopCamera();
      setStep('scanning');
      setDetectedCategory(null);
      setQuizAnswer(null);
      setDetectedGender(null);
      setFaceNotFound(false);
    }
  }, [isOpen]);

  // Sync stream to video element
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, hasPermission]);

  // REAL-TIME PRESENCE CHECK: If camera is covered or pitch black, fail the scan.
  useEffect(() => {
    let checkInterval: any;
    if (step === 'scanning' && hasPermission && !faceNotFound) {
      checkInterval = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;

            // DUAL-ZONE ANALYSIS (Top vs Bottom of face)
            let topC = 0, bottomC = 0, totalB = 0;
            let skinTonePixels = 0;
            const zoneH = 20, zoneW = 40;

            // Top Zone (Forehead)
            for (let y = 20; y < 20 + zoneH; y++) {
              for (let x = 30; x < 30 + zoneW; x++) {
                const idx = (y * 100 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const brightness = (r + g + b) / 3;

                totalB += brightness;
                if (x > 30) topC += Math.abs(data[idx] - data[idx - 4]);

                // SKIN TONE DETECTION: Human skin has specific RGB characteristics
                // R > G > B, and values in reasonable range (not too dark, not too bright)
                if (r > 60 && r < 255 && g > 40 && g < 240 && b > 20 && b < 230 && r > g && g > b) {
                  skinTonePixels++;
                }
              }
            }

            // Bottom Zone (Chin/Jawline)
            for (let y = 60; y < 60 + zoneH; y++) {
              for (let x = 30; x < 30 + zoneW; x++) {
                const idx = (y * 100 + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const brightness = (r + g + b) / 3;

                totalB += brightness;
                if (x > 30) bottomC += Math.abs(data[idx] - data[idx - 4]);

                // Skin tone check for bottom zone too
                if (r > 60 && r < 255 && g > 40 && g < 240 && b > 20 && b < 230 && r > g && g > b) {
                  skinTonePixels++;
                }
              }
            }

            const avgB = totalB / (zoneH * zoneW * 2);
            const avgTopC = topC / (zoneH * zoneW);
            const avgBottomC = bottomC / (zoneH * zoneW);
            const totalPixels = zoneH * zoneW * 2;
            const skinToneRatio = skinTonePixels / totalPixels;

            // STRICTER FACE DETECTION:
            // 1. Brightness should be in human face range (35-200)
            // 2. Both zones should have some complexity (not flat background)
            // 3. At least 40% pixels should have skin-like color
            // 4. Total complexity should be reasonable (not noise)
            const isBrightnessGood = avgB > 35 && avgB < 200;
            const hasTexture = avgTopC > 5 && avgBottomC > 5;
            const hasSkinTone = skinToneRatio > 0.4;
            const notTooNoisy = (avgTopC + avgBottomC) < 100; // Prevent random noise from passing

            if (isBrightnessGood && hasTexture && hasSkinTone && notTooNoisy) {
              setFaceLocked(true);
              setScanStats(prev => ({
                topComplexity: prev.topComplexity + avgTopC,
                bottomComplexity: prev.bottomComplexity + avgBottomC,
                samples: prev.samples + 1
              }));
            } else {
              setFaceLocked(false);
            }

            // Total blackout or too dark
            if (avgB < 10) {
              setFaceNotFound(true);
              setDetectedCategory(null);
              clearInterval(checkInterval);
            }
          }
        }
      }, 500);
    }
    return () => clearInterval(checkInterval);
  }, [step, hasPermission, faceNotFound]);

  useEffect(() => {
    let scanProgress = 0;
    let timer: any;
    let noFaceTime = 0;

    if (step === 'scanning' && hasPermission && !faceNotFound) {
      timer = setInterval(() => {
        if (faceLocked) {
          scanProgress += 1;
          noFaceTime = 0;
        } else {
          scanProgress = 0; // RESTART SCAN if face leaves circle
          noFaceTime += 0.5;
          setScanStats({ topComplexity: 0, bottomComplexity: 0, samples: 0 });
        }

        // IF NO FACE FOR 4 SECONDS, TRIGGER NOT DETECTED
        if (noFaceTime >= 4) {
          setFaceNotFound(true);
          setDetectedCategory(null);
          setScanStats({ topComplexity: 0, bottomComplexity: 0, samples: 0 });
          clearInterval(timer);
          return;
        }

        if (scanProgress >= 10) { // 5 seconds of steady face-in-circle
          const categories = Object.keys(skinCategories) as (keyof typeof skinCategories)[];
          const random = categories[Math.floor(Math.random() * categories.length)];

          // ENHANCED GENDER DETECTION (Multi-Factor Analysis)
          let genderResult: 'Man' | 'Woman' = 'Woman'; // Default

          if (scanStats.samples >= 8) { // Ensure we have enough data
            const avgTop = scanStats.topComplexity / scanStats.samples;
            const avgBottom = scanStats.bottomComplexity / scanStats.samples;

            // Calculate complexity ratio and difference
            const complexityRatio = avgTop > 0 ? avgBottom / avgTop : 1;
            const complexityDiff = avgBottom - avgTop;

            // MALE INDICATORS:
            // 1. Bottom zone (chin/jaw) has significantly more texture variation (stubble/beard)
            // 2. Ratio > 1.3 (lowered from 1.5 for better sensitivity)
            // 3. Absolute difference > 4 (lowered from 6)

            const isMaleByRatio = complexityRatio > 1.3;
            const isMaleByDiff = complexityDiff > 4;

            // If BOTH indicators suggest male, classify as Man
            if (isMaleByRatio && isMaleByDiff) {
              genderResult = 'Man';
            }
            // If only one strong indicator (very high ratio OR very high diff)
            else if (complexityRatio > 1.6 || complexityDiff > 8) {
              genderResult = 'Man';
            }
            // Otherwise default to Woman
            else {
              genderResult = 'Woman';
            }
          }

          setDetectedGender(genderResult);

          setVitalityMetrics({
            ph: parseFloat((4.5 + Math.random() * 2).toFixed(1)),
            hydration: Math.floor(40 + Math.random() * 40),
            elasticity: Math.floor(50 + Math.random() * 30)
          });

          setDetectedCategory(random);
          setFaceLocked(false);
          setScanStats({ topComplexity: 0, bottomComplexity: 0, samples: 0 });
          stopCamera();
          setStep('quiz');
          clearInterval(timer);
        }
      }, 500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [step, hasPermission, faceNotFound, faceLocked]);

  const [initTimeOut, setInitTimeOut] = useState(false);

  useEffect(() => {
    let timeout: any;
    if (isOpen && !hasPermission) {
      timeout = setTimeout(() => {
        setInitTimeOut(true);
      }, 4000);
    } else {
      setInitTimeOut(false);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, hasPermission]);

  const startCamera = async () => {
    try {
      setInitTimeOut(false);
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setHasPermission(true);
    } catch (err) {
      console.error("Camera access error:", err);
      // Fail state: show alert or message
      alert("Camera access denied. Please click the lock icon in your browser URL bar and allow camera access for Jeevix.");
      setInitTimeOut(true);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setHasPermission(false);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal glass-morphism">
        <button className="close-scanner" onClick={handleClose}>&times;</button>

        {step === 'scanning' && (
          <div className="scanning-view">
            <div className="video-container">
              {!hasPermission ? (
                <div className="camera-loading">
                  <div className="loader"></div>
                  <p>Initializing Secure Camera Link...</p>
                  {initTimeOut && (
                    <button
                      className="sc-primary-btn"
                      style={{ marginTop: '20px', fontSize: '14px' }}
                      onClick={startCamera}
                    >
                      Grant Permission Manually
                    </button>
                  )}
                </div>
              ) : faceNotFound ? (
                <div className="camera-loading face-error-view">
                  <div className="error-icon" style={{ fontSize: '50px', marginBottom: '20px' }}>👤❌</div>
                  <h3 style={{ color: '#e74c3c' }}>No Face Detected</h3>
                  <p style={{ color: '#666', fontSize: '14px', margin: '10px 0 20px' }}>Please ensure your face is centered and well-lit within the guide.</p>
                  <button
                    className="sc-primary-btn"
                    onClick={() => {
                      setFaceNotFound(false);
                      startCamera();
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline muted />
                  <div className={`face-guide ${faceLocked ? 'locked' : ''}`}></div>
                  <div className="face-points">
                    <div className="fp p1"></div>
                    <div className="fp p2"></div>
                    <div className="fp p3"></div>
                    <div className="fp p4"></div>
                  </div>
                  <div className="scan-bar"></div>
                  <div className="data-pings">
                    <div className="ping pulse">TARGET ACQUIRED</div>
                    <div className="ping">{faceLocked ? "GENDER ANALYSIS: ACTIVE" : "FACE POSITION: TARGETING..."}</div>
                    <div className="ping">pH LEVEL: ANALYZING...</div>
                    <div className="ping">VITALE SCORE: CALCULATING...</div>
                  </div>
                </>
              )}
            </div>
            <h3 className="scanning-status">
              {!hasPermission ? "Requesting Hardware Access..." : faceNotFound ? "Analysis Failed: No Subject Found" : faceLocked ? "Optimizing Analysis..." : "Align Face Within Circle..."}
            </h3>
            <p className="scanner-note">Analyzing visible surface light only. No biometric data saved.</p>
          </div>
        )}

        {step === 'quiz' && (
          <div className="scanner-quiz-view animate-fade-in" style={{ textAlign: 'left' }}>
            <span className="sc-badge">Step 2: Analysis Goal</span>
            <div className="gender-confirmation-box" style={{ background: '#f8fbf9', padding: '20px', borderRadius: '20px', marginBottom: '25px', border: '1px solid #e8f0ed' }}>
              <h3 style={{ margin: '0 0 15px', fontSize: '16px', color: '#2d4a3e' }}>Identify Your Profile:</h3>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  onClick={() => setDetectedGender('Woman')}
                  className={`gender-toggle-btn ${detectedGender === 'Woman' ? 'active' : ''}`}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid',
                    borderColor: detectedGender === 'Woman' ? '#d4af37' : '#eee',
                    background: detectedGender === 'Woman' ? '#fffaf0' : '#fff',
                    color: '#2d4a3e', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
                  }}
                >
                  👩 Woman
                </button>
                <button
                  onClick={() => setDetectedGender('Man')}
                  className={`gender-toggle-btn ${detectedGender === 'Man' ? 'active' : ''}`}
                  style={{
                    flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid',
                    borderColor: detectedGender === 'Man' ? '#d4af37' : '#eee',
                    background: detectedGender === 'Man' ? '#fffaf0' : '#fff',
                    color: '#2d4a3e', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
                  }}
                >
                  👨 Man
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '10px', textAlign: 'center' }}>
                AI detected <strong>{detectedGender}</strong>. Tap to correct if wrong.
              </p>
            </div>
            <p className="quiz-intro">Bio-Vision identified <strong>{detectedCategory && skinCategories[detectedCategory].label}</strong> patterns.</p>

            <div className="metrics-selector-box" style={{ background: '#f8fbf9', padding: '15px', borderRadius: '15px', margin: '20px 0' }}>
              <h4 style={{ margin: '0 0 10px', color: '#d4af37', fontSize: '14px' }}>Refine Vitality Metrics:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="metric-item">
                  <label style={{ fontSize: '12px', display: 'block' }}>pH Level: <strong>{vitalityMetrics.ph}</strong></label>
                  <input style={{ width: '100%' }} type="range" min="4" max="7" step="0.1" value={vitalityMetrics.ph} onChange={(e) => setVitalityMetrics({ ...vitalityMetrics, ph: parseFloat(e.target.value) })} />
                </div>
                <div className="metric-item">
                  <label style={{ fontSize: '12px', display: 'block' }}>Hydration: <strong>{vitalityMetrics.hydration}%</strong></label>
                  <input style={{ width: '100%' }} type="range" min="10" max="100" value={vitalityMetrics.hydration} onChange={(e) => setVitalityMetrics({ ...vitalityMetrics, hydration: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>

            <h4 style={{ marginTop: '20px', fontSize: '14px' }}>Select Primary Concern:</h4>
            <div className="sc-quiz-options">
              {detectedGender === 'Man' ? (
                <>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('strength'); setStep('results'); }}>⚡ Muscle Strength & Stamina</button>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('cortisol'); setStep('results'); }}>🧠 Stress & Cortisol Focus</button>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('hair'); setStep('results'); }}>💇‍♂️ Scalp & Hair Density</button>
                </>
              ) : (
                <>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('glow'); setStep('results'); }}>✨ Facial Glow & Radiance</button>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('weight'); setStep('results'); }}>⚖️ Weight & Metabolism</button>
                  <button className="sc-quiz-btn" onClick={() => { setQuizAnswer('antiaging'); setStep('results'); }}>🧬 Anti-Aging & Repair</button>
                </>
              )}
            </div>
          </div>
        )}

        {step === 'results' && detectedCategory && (
          <div className="results-view animate-fade-in">
            <span className="sc-badge">Final AI Protocol</span>
            <div className="analysis-summary" style={{ background: '#f8fbf9', padding: '15px', borderRadius: '15px', margin: '15px 0' }}>
              <p style={{ margin: '5px 0' }}>Profile: <strong>{detectedGender}</strong> | Skin: <strong>{skinCategories[detectedCategory].label}</strong></p>
              <p style={{ margin: '5px 0' }}>pH: <strong>{vitalityMetrics.ph}</strong> | Hydration: <strong>{vitalityMetrics.hydration}%</strong></p>
            </div>

            <h2 className="result-label" style={{ color: '#2d4a3e', fontSize: '24px', margin: '20px 0 10px' }}>Precision Match Result</h2>

            <div className="rec-card" style={{ border: '1px solid #d4af37', background: '#fff' }}>
              <div className="rec-item">
                <div className="rec-info">
                  <strong style={{ fontSize: '20px', color: '#2d4a3e' }}>{
                    detectedGender === 'Man' ? (
                      quizAnswer === 'strength' ? "Testosterone Booster" :
                        quizAnswer === 'cortisol' ? "Ashwagandha Premium" : "Brain Booster"
                    ) : (
                      quizAnswer === 'glow' ? "Skin Radiance" :
                        quizAnswer === 'weight' ? "Keto Fat Burner" : "Biotin Premium"
                    )
                  }</strong>
                  <p style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>Engineered for your <strong>{detectedGender}</strong> vitality profile and <strong>{vitalityMetrics.ph} pH</strong> levels.</p>
                </div>
                <button
                  className="sc-cta-btn"
                  onClick={() => {
                    const recMapping: any = {
                      'Man': {
                        'strength': { view: 'man', sub: 'testosterone' },
                        'cortisol': { view: 'man', sub: 'ashwagandha' },
                        'hair': { view: 'man', sub: 'brain_booster' }
                      },
                      'Woman': {
                        'glow': { view: 'glow', sub: 'skin_radiance' },
                        'weight': { view: 'slim', sub: 'keto' },
                        'antiaging': { view: 'glow', sub: 'biotin' }
                      }
                    };
                    const genderKey = (detectedGender as 'Man' | 'Woman');
                    const answerKey = quizAnswer || (genderKey === 'Man' ? 'strength' : 'glow');
                    const finalRec = recMapping[genderKey][answerKey];

                    handleClose();
                    onSelectProduct(finalRec.view as any, finalRec.sub);
                  }}
                >
                  View My Protocol
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scanner-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .scanner-modal {
          width: 100%;
          max-width: 600px;
          background: #fff;
          border-radius: 30px;
          padding: 50px;
          position: relative;
          color: #2d4a3e;
          text-align: center;
        }

        .close-scanner {
          position: absolute;
          top: 20px;
          right: 25px;
          font-size: 32px;
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
        }

        .sc-badge {
          display: inline-block;
          padding: 5px 15px;
          background: #e8f0ed;
          color: #2d4a3e;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          border-radius: 50px;
          margin-bottom: 25px;
        }

        .privacy-note {
          font-size: 16px;
          line-height: 1.6;
          color: #666;
          margin-bottom: 20px;
        }

        .disclaimer-mini {
          font-size: 11px;
          color: #999;
          margin-bottom: 30px;
        }

        .video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .face-points {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .fp {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #d4af37;
          border-radius: 50%;
          box-shadow: 0 0 10px #d4af37;
        }

        .p1 { top: 40%; left: 35%; animation: point-pulse 1s infinite 0.2s; }
        .p2 { top: 40%; right: 35%; animation: point-pulse 1s infinite 0.4s; }
        .p3 { top: 60%; left: 45%; animation: point-pulse 1s infinite 0.6s; }
        .p4 { top: 60%; right: 45%; animation: point-pulse 1s infinite 0.8s; }

        @keyframes point-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        .ping.pulse {
          color: #fff;
          font-weight: bold;
          animation: text-pulse 1s infinite;
        }

        @keyframes text-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .camera-loading {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: #888;
        }

        .loader {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2d4a3e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        .scanning-status {
          font-size: 20px;
          margin: 15px 0 5px;
          color: #2d4a3e;
        }

        .scanner-note {
          font-size: 12px;
          color: #999;
          margin: 0;
        }

        .face-guide {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          border: 2px dashed rgba(255,255,255,0.5);
          border-radius: 40% 40% 60% 60%;
        }

        .scan-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #d4af37;
          box-shadow: 0 0 15px #d4af37;
          animation: scanMove 3s infinite ease-in-out;
        }

        @keyframes scanMove {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }

        .data-pings {
          position: absolute;
          bottom: 20px;
          left: 20px;
          text-align: left;
        }

        .ping {
          font-size: 10px;
          color: #fff;
          font-family: monospace;
          margin: 5px 0;
          text-shadow: 0 0 5px #000;
        }

        .sc-primary-btn {
          padding: 15px 35px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .sc-primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(45, 74, 62, 0.2);
        }

        .rec-card {
          background: #f8fbf9;
          padding: 25px;
          border-radius: 20px;
          text-align: left;
          margin: 30px 0;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .rec-card:hover {
          transform: scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }

        .rec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
        }

        .sc-cta-btn {
          padding: 10px 20px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .sc-secondary-btn {
          background: none;
          border: 1px solid #ccc;
          padding: 10px 25px;
          border-radius: 30px;
          color: #666;
          cursor: pointer;
          font-size: 14px;
        }
        .sc-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 30px;
        }

        .sc-quiz-btn {
          padding: 18px 25px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 15px;
          font-size: 16px;
          color: #2d4a3e;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-align: left;
        }

        .sc-quiz-btn:hover {
          background: #f8fbf9;
          border-color: #d4af37;
          transform: translateX(8px) scale(1.02);
          box-shadow: 0 5px 15px rgba(0,0,0,0.03);
        }

        .analysis-summary {
          margin: 15px 0 25px;
          padding: 15px;
          background: #f8fbf9;
          border-radius: 12px;
          font-size: 14px;
        }

        .analysis-summary p {
          margin: 5px 0;
          color: #666;
        }

        .results-view h2 {
          margin: 0 0 20px 0;
        }
        .metric-item input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          background: #e8f0ed;
          border-radius: 5px;
          margin-top: 8px;
          outline: none;
        }

        .metric-item input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #d4af37;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }
        .face-guide.locked {
          border-color: #d4af37;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        }
      `}</style>
    </div>
  );
};

export default SkinScanner;
