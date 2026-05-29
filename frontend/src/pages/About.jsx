import React, { useState, useEffect, useRef } from 'react';
import Lang from "../assets/lang.mp4";
// import HealthTips from '../components/HealthTips';

const MultilingualChecker = () => {
  const [symptom, setSymptom] = useState('');
  const [language, setLanguage] = useState('en');
  const [diagnosis, setDiagnosis] = useState(null);
  const [listening, setListening] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [ttsOption, setTtsOption] = useState('browser');
  const [ttsStatus, setTtsStatus] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const recognitionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Auto-scroll to diagnosis when it appears
  useEffect(() => {
    if (diagnosis && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    }
  }, [diagnosis, showDiagnosis]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptom,
          language,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // setDiagnosis(data);
      const predictedDisease = data.predictedDisease || data.diagnosis || data;
      // Set the predicted disease in the React state
      setDiagnosis(predictedDisease);
      setShowDiagnosis(true);
    } catch (err) {
      console.error('Diagnosis error:', err.message);
      setDiagnosis({
  patient_emotion_empathy: "Hey there, I know you're not feeling your best right now. Based on what you shared, it sounds like something manageable. You're not alone, and we'll get through this together. 💛",
  relief_tips: [
    "Get some good rest — your body needs time to heal.",
    "Drink warm fluids regularly to stay hydrated.",
    "You can take mild pain relief if needed, but dont stress too much."
  ],
  possible_causes: [
    "It might be a viral infection — quite common and usually passes.",
    "Sometimes stress can cause these symptoms — its okay.",
    "Weather changes can affect how you feel too."
  ],
  emergency_signs: [
    "If you get a high fever over 103°F, dont wait — get help.",
    "Trouble breathing or chest pain is serious — seek urgent care.",
    "If anything feels suddenly worse, dont ignore it."
  ],
  important_note: "This is just friendly guidance. Its important to check with a real doctor for proper advice. You matter, and your health does too. 🌱",
  references: [""]
});

      setShowDiagnosis(true);
    }
  };
  const getLanguageCode = (lang) => {
    const languageMap = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      ml: 'ml-IN',
    };
    return languageMap[lang] || 'en-US';
  };

  const startAdvancedVoiceInput = () => {
    if (!speechSupported) {
      setSpeechError('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    setSpeechError('');
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.lang = getLanguageCode(language);

    if (recognition.serviceURI) {
      recognition.serviceURI = 'wss://speech.googleapis.com/';
    }

    recognition.onstart = () => {
      setListening(true);
      setSpeechError('');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);
      console.error('Speech recognition error:', event.error);
      
      const errorMessages = {
        'network': 'Network error. Please check your internet connection.',
        'not-allowed': 'Microphone access denied. Please allow microphone access.',
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'service-not-allowed': 'Speech service not allowed. Please try again.',
        'bad-grammar': 'Speech not recognized. Please speak clearly.',
        'language-not-supported': `Language ${getLanguageCode(language)} not supported. Switching to English.`
      };

      const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
      setSpeechError(errorMessage);

      if (event.error === 'language-not-supported' && language !== 'en') {
        setTimeout(() => {
          setLanguage('en');
          startAdvancedVoiceInput();
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setSymptom(prev => prev + ' ' + finalTranscript.trim());
      }
    };

    recognition.onnomatch = () => {
      setSpeechError('Speech not recognized. Please speak clearly and try again.');
    };

    try {
      recognition.start();
    } catch (error) {
      setListening(false);
      setSpeechError('Failed to start speech recognition. Please try again.');
      console.error('Recognition start error:', error);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setListening(false);
  };

  const stopSpeech = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setTtsStatus('🛑 Speech stopped');
      setTimeout(() => setTtsStatus(''), 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, []);

  useEffect(() => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [diagnosis]);

  const speakDiagnosis = (diagnosisData) => {
    if (!diagnosisData) return;

    let fullText = diagnosisData.patient_message || '';
    if (diagnosisData.relief_tips?.length) {
      fullText += '. Relief tips: ' + diagnosisData.relief_tips.join(', ') + '.';
    }
    if (diagnosisData.possible_causes?.length) {
      fullText += ' Possible causes: ' + diagnosisData.possible_causes.join(', ') + '.';
    }
    if (diagnosisData.emergency_signs?.length) {
      fullText += ' Emergency signs: ' + diagnosisData.emergency_signs.join(', ') + '.';
    }
    if (diagnosisData.important_note) {
      fullText += ' Important note: ' + diagnosisData.important_note + '.';
    }

    if (ttsOption === 'browser') {
      browserTTS(fullText);
    } else if (ttsOption === 'copy') {
      copyToClipboard(fullText);
    } else if (ttsOption === 'external') {
      openExternalTTS(fullText);
    }
  };

  const browserTTS = (text) => {
    setTtsStatus('Trying browser TTS...');
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }

    const speakWithVoices = () => {
      const voices = speechSynthesis.getVoices();
      const targetLang = getLanguageCode(language);
      const langCode = targetLang.split('-')[0];
      
      // Prioritize female voices for softer tone
      let selectedVoice = voices.find(voice => 
        voice.lang === targetLang && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        voice.lang.startsWith(langCode) && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        voice.lang === targetLang
      ) || voices.find(voice => 
        voice.lang.startsWith(langCode)
      ) || voices.find(voice => 
        voice.lang.toLowerCase().includes(langCode)
      );

      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = targetLang;
      msg.rate = speechRate;
      // Adjust pitch and volume for softer, calmer voice
      msg.pitch = 0.9; // Slightly lower pitch for calmness
      msg.volume = 0.8; // Slightly lower volume for gentleness
      
      if (selectedVoice) {
        msg.voice = selectedVoice;
        setTtsStatus(`Using voice: ${selectedVoice.name} (Speed: ${speechRate}x)`);
      } else {
        setTtsStatus(`No ${getLanguageName(language)} voice found - using default (Speed: ${speechRate}x)`);
      }

      msg.onstart = () => {
        setIsSpeaking(true);
        setTtsStatus('🔊 Speaking with calm voice...');
      };
      
      msg.onend = () => {
        setIsSpeaking(false);
        setTtsStatus('✅ Finished speaking');
      };
      
      msg.onerror = (e) => {
        setIsSpeaking(false);
        setTtsStatus(`❌ Browser TTS failed: ${e.error}`);
        console.error('Speech synthesis error:', e.error);
      };

      // Add slight pauses for better comprehension in healthcare context
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        speechSynthesis.cancel();
        sentences.forEach((sentence, i) => {
          const utterance = new SpeechSynthesisUtterance(sentence.trim() + (i < sentences.length - 1 ? '.' : ''));
          Object.assign(utterance, {
            lang: msg.lang,
            voice: msg.voice,
            rate: msg.rate,
            pitch: msg.pitch,
            volume: msg.volume
          });
          speechSynthesis.speak(utterance);
          // Add a small pause between sentences
          if (i < sentences.length - 1) {
            speechSynthesis.pause();
            speechSynthesis.resume();
          }
        });
      } else {
        speechSynthesis.speak(msg);
      }
    };

    if (speechSynthesis.getVoices().length > 0) {
      speakWithVoices();
    } else {
      speechSynthesis.onvoiceschanged = speakWithVoices;
      setTimeout(() => speakWithVoices(), 1000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setTtsStatus('✅ Text copied! Paste it into Google Translate or your phone\'s TTS app');
      setTimeout(() => setTtsStatus(''), 3000);
    }).catch(() => {
      setTtsStatus('❌ Copy failed - please select and copy the text manually');
    });
  };

  const openExternalTTS = (text) => {
    const encodedText = encodeURIComponent(text);
    const langMap = {
      hi: 'hi',
      kn: 'kn', 
      mr: 'mr',
      ta: 'ta',
      te: 'te',
      bn: 'bn',
      gu: 'gu',
      ml: 'ml',
      en: 'en'
    };
    
    const googleTranslateUrl = `https://translate.google.com/?sl=${langMap[language] || 'en'}&tl=${langMap[language] || 'en'}&text=${encodedText}&op=translate`;
    
    setTtsStatus('🌐 Opening Google Translate - click the speaker icon there for better pronunciation');
    window.open(googleTranslateUrl, '_blank');
    
    setTimeout(() => setTtsStatus(''), 5000);
  };

  useEffect(() => {
    if (diagnosis) {
      speakDiagnosis(diagnosis);
    }
  }, [diagnosis, language]);

  const clearSymptom = () => {
    setSymptom('');
  };

  const getLanguageName = (code) => {
    const names = {
      en: 'English',
      hi: 'हिंदी (Hindi)',
      kn: 'ಕನ್ನಡ (Kannada)',
      mr: 'मराठी (Marathi)',
      ta: 'தமிழ் (Tamil)',
      te: 'తెలుగు (Telugu)',
      bn: 'বাংলা (Bengali)',
      gu: 'ગુજરાતી (Gujarati)',
      ml: 'മലയാളം (Malayalam)',
    };
    return names[code] || code;
  };

  return (
    <div 
      className="max-w-2xl mx-auto mt-2 p-3 bg-white rounded-lg shadow-md min-h-[80vh]"
      ref={scrollContainerRef}
    >
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
    🌐 Multilanguage Checker
  </h2>
      {scrollContainerRef.current?.scrollTop > 200 && (
        <button
          onClick={() => {
            scrollContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          style={{ transform: 'translateY(0)' }}
        >
          ↑ Top
        </button>
      )}

      <div className="max-w-xs mx-auto p-2 bg-white rounded-xl shadow-md flex justify-center">
        <video
          src={Lang}
          className="w-32 h-auto rounded-lg shadow-md"
          autoPlay
          loop
          muted
          playsInline
          poster="/placeholder-healthcare.jpg"
        />
      </div>

      <div className="flex justify-between align-center items-center mb-2 sticky top-0 bg-white z-10 pb-1 border-b border-gray-200">
        <h2 className="text-lg font-bold text-blue-600 text-center">
          🌍 Enhanced Multilanguage Symptom Checker
        </h2>

        <div className="flex gap-1">
          {(isSpeaking || speechSynthesis.speaking) && (
            <button
              onClick={stopSpeech}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full transition-colors"
              title="Stop text-to-speech"
            >
              🛑 Stop TTS
            </button>
          )}
        </div>
      </div>

      <div onSubmit={handleSubmit} className="space-y-2">
        <div>
          <label className="block text-gray-700 font-semibold mb-1 text-sm">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="en">{getLanguageName('en')}</option>
            <option value="hi">{getLanguageName('hi')}</option>
            <option value="kn">{getLanguageName('kn')}</option>
            <option value="mr">{getLanguageName('mr')}</option>
            <option value="ta">{getLanguageName('ta')}</option>
            <option value="te">{getLanguageName('te')}</option>
            <option value="bn">{getLanguageName('bn')}</option>
            <option value="gu">{getLanguageName('gu')}</option>
            <option value="ml">{getLanguageName('ml')}</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-1 text-sm">
            Describe your symptoms in {getLanguageName(language)}:
          </label>
          <div className="relative">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder={language === 'hi' ? "जैसे बुखार और शरीर में दर्द" : 
                          language === 'kn' ? "ಉದಾ: ಜ್ವರ ಮತ್ತು ದೇಹದ ನೋವು" :
                          language === 'mr' ? "उदा: ताप आणि शरीरदुखी" :
                          "e.g., fever and body pain"}
              required
              className="w-full p-1.5 pr-8 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {symptom && (
              <button
                type="button"
                onClick={clearSymptom}
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {speechError && (
          <div className="p-1.5 bg-red-100 border border-red-300 rounded text-red-700 text-xs">
            {speechError}
          </div>
        )}

        <div className="flex gap-1 flex-wrap">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={listening}
            className="bg-blue-600 text-white px-2 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            🩺 Check Symptoms
          </button>
          
          {speechSupported ? (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={listening ? stopVoiceInput : startAdvancedVoiceInput}
                className={`px-2 py-1.5 rounded text-white text-xs ${
                  listening 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {listening ? '🛑 Stop' : `🎤 Speak in ${getLanguageName(language)}`}
              </button>
            </div>
          ) : (
            <div className="px-2 py-1.5 bg-gray-200 text-gray-600 rounded text-xs">
              🎤 Voice input not supported in this browser
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <details className="p-1.5 bg-yellow-50 border border-yellow-200 rounded">
            <summary className="font-semibold text-yellow-800 cursor-pointer">⚠️ Important: Indian Language TTS Limitations</summary>
            <div className="space-y-1 text-yellow-700 mt-1">
              <div>• <strong>Browser TTS:</strong> Limited support for Hindi/Kannada/Marathi</div>
              <div>• <strong>Google Translate:</strong> Better pronunciation for Indian languages</div>
              <div>• <strong>Best Option:</strong> Copy text and paste into Google Translate mobile app</div>
            </div>
          </details>
          
          <div>💡 <strong>Voice Input Tip:</strong> Speak clearly in a quiet environment.</div>
          {language !== 'en' && (
            <div>🌐 <strong>Fallback:</strong> System will use English if your language isn't supported.</div>
          )}
        </div>
      </div>

      {diagnosis && (
        <div className="mt-2">
          <button
            onClick={() => setShowDiagnosis(!showDiagnosis)}
            className="text-blue-600 underline hover:text-blue-800 text-xs"
          >
            {showDiagnosis ? '👁️ Hide Diagnosis' : '👁️ Show Diagnosis'}
          </button>

          {showDiagnosis && (
            <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-md border border-blue-200 max-h-[200px] overflow-y-auto">
              <h3 className="text-sm font-bold mb-1 text-gray-700">🩺 Diagnosis Result</h3>
              
              <div className="space-y-1">
                <div className="p-1.5 bg-white rounded border-l-4 border-blue-500">
                  <p className="text-xs"><strong>🧑‍⚕️ Patient Message:</strong></p>
                  <p className="mt-0.5 text-gray-700 text-xs">{diagnosis.patient_message}</p>
                </div>
                
                {diagnosis.relief_tips && diagnosis.relief_tips.length > 0 && (
                  <div className="p-1.5 bg-white rounded border-l-4 border-green-500">
                    <p className="text-xs"><strong>💡 Relief Tips:</strong></p>
                    <ul className="mt-0.5 text-gray-700 list-disc list-inside text-xs">
                      {diagnosis.relief_tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {diagnosis.possible_causes && diagnosis.possible_causes.length > 0 && (
                  <div className="p-1.5 bg-white rounded border-l-4 border-yellow-500">
                    <p className="text-xs"><strong>🔍 Possible Causes:</strong></p>
                    <ul className="mt-0.5 text-gray-700 list-disc list-inside text-xs">
                      {diagnosis.possible_causes.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {diagnosis.emergency_signs && diagnosis.emergency_signs.length > 0 && (
                  <div className="p-1.5 bg-white rounded border-l-4 border-red-500">
                    <p className="text-xs"><strong>🚨 Emergency Signs:</strong></p>
                    <ul className="mt-0.5 text-gray-700 list-disc list-inside text-xs">
                      {diagnosis.emergency_signs.map((sign, index) => (
                        <li key={index}>{sign}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {diagnosis.important_note && (
                  <div className="p-1.5 bg-white rounded border-l-4 border-purple-500">
                    <p className="text-xs"><strong>📌 Important Note:</strong></p>
                    <p className="mt-0.5 text-gray-700 text-xs">{diagnosis.important_note}</p>
                  </div>
                )}
              </div>

              {/* TTS Options */}
              <div className="mt-2 p-2 bg-blue-50 rounded border">
                <h4 className="font-semibold mb-1 text-xs">🔊 Text-to-Speech Options:</h4>
                
                <div className="space-y-0.5 mb-2">
                  <label className="flex items-center space-x-1 text-xs">
                    <input 
                      type="radio" 
                      value="browser" 
                      checked={ttsOption === 'browser'} 
                      onChange={(e) => setTtsOption(e.target.value)}
                      className="form-radio"
                    />
                    <span>🌐 Browser TTS (Soft, calm voice)</span>
                  </label>
                  
                  <label className="flex items-center space-x-1 text-xs">
                    <input 
                      type="radio" 
                      value="external" 
                      checked={ttsOption === 'external'} 
                      onChange={(e) => setTtsOption(e.target.value)}
                      className="form-radio"
                    />
                    <span>🌍 Google Translate (Better pronunciation)</span>
                  </label>
                  
                  <label className="flex items-center space-x-1 text-xs">
                    <input 
                      type="radio" 
                      value="copy" 
                      checked={ttsOption === 'copy'} 
                      onChange={(e) => setTtsOption(e.target.value)}
                      className="form-radio"
                    />
                    <span>📋 Copy Text (Use with phone TTS app)</span>
                  </label>
                </div>

                {ttsOption === 'browser' && (
                  <div className="mb-2 p-1.5 bg-white rounded border">
                    <label className="block text-xs font-semibold mb-0.5">
                      🎛️ Speech Settings (Calm & Clear)
                    </label>
                    <div className="mb-1">
                      <label className="block text-xs mb-0.5">Speed: {speechRate}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                      </div>
                    </div>
                  </div>
                )}

                {ttsStatus && (
                  <div className="mb-1 p-1.5 bg-white rounded border text-xs">
                    <strong>Status:</strong> {ttsStatus}
                  </div>
                )}

                <div className="flex gap-1 flex-wrap">
                  <button
                    onClick={() => speakDiagnosis(diagnosis)}
                    disabled={isSpeaking}
                    className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {ttsOption === 'browser' && '🔊 Speak with Calm Voice'}
                    {ttsOption === 'external' && '🌍 Open Google Translate'}
                    {ttsOption === 'copy' && '📋 Copy Text'}
                  </button>
                  
                  {ttsOption === 'browser' && (
                    <button
                      onClick={stopSpeech}
                      disabled={!isSpeaking}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                    >
                      🛑 Stop Speech
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {diagnosis && showDiagnosis && (
        <button
          onClick={() => {
            scrollContainerRef.current.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          }}
          className="sticky bottom-2 left-0 right-0 mx-auto bg-blue-600 text-white px-3 py-1 rounded-full shadow-md text-xs hover:bg-blue-700 transition-colors"
        >
          ↓ See More
        </button>
      )} 
    {/* <div className="max-w-2xl mx-auto mt-6">
        <HealthTips />
      </div> */}
    </div>
    
  );
};
 
export default MultilingualChecker