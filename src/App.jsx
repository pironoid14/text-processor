import  { useState, useRef } from 'react';
import { Send } from 'lucide-react';


const App = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const outputAreaRef = useRef(null);


  const languages = {
    en: 'English',
    pt: 'Portuguese',
    es: 'Spanish',
    ru: 'Russian',
    tr: 'Turkish',
    fr: 'French',
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };
  
  const languageTagToHumanReadable = (tag, defaultLanguage) => {
    const languageNames = {
      en: 'English',
      pt: 'Portuguese',
      es: 'Spanish',
      ru: 'Russian',
      tr: 'Turkish',
      fr: 'French',
    };
    return languageNames[tag] || defaultLanguage;
  };

  const detector = {
    detect: async (text) => {
       text='en';
      return { detectedLanguage: text, confidence: 0.99 };
    },
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') {
      alert("input cannot be empty")
      return;
    }

    const newOutput = {
      text: inputText,
      language: '',
      summary: '',
      translation: '',
    };

    const localInputText = inputText; // Store input text locally
    setOutputText([...outputText, newOutput]);
    setInputText(''); // Clear input field

      
    setTimeout(async () => {
      const trimmedText = localInputText.trim();
    
      if (!trimmedText) {
        alert('Please enter some text to detect its language.');
        return;
      }
    
      try {
        const { detectedLanguage, confidence } = await detector.detect(trimmedText);
        
    
        const newOutputLanguage = `${(confidence * 100).toFixed(1)}% sure that this is ${languageTagToHumanReadable(detectedLanguage, 'en')}`;
    
        setOutputText([...outputText, { ...newOutput, language: newOutputLanguage }]);
      } catch (error) {
        console.error('Error detecting language:', error);
        alert('Failed to detect language. Please try again.');
      }
    }, 100);
  };
    

  

  const handleTranslate = async (index) => {
    const currentOutput = { ...outputText[index] };
    const sourceLanguage = 'en'; // Set the source language
    const targetLanguage = selectedLanguage; // Use the selected language

    setTimeout(async () => {
      const translator = await createTranslator(sourceLanguage, targetLanguage);
      currentOutput.translation = await translator.translate(currentOutput.text);
      setOutputText(outputText.map((item, i) => (i === index ? currentOutput : item)));
    }, 200);
  };

  const createTranslator = async (sourceLanguage, targetLanguage) => {
    const translator = await self.ai.translator.create({
      sourceLanguage,
      targetLanguage,
    });
    return {
      translate: async (text) => {
        const translatedText = await translator.translate(text);
        return translatedText;
      },
    };
  };

  return (
    <>
    
    <div className="max-w-2xl mx-auto p-4 bg-blue-700 rounded-lg shadow-lg h-screen flex flex-col">
  <div className="flex-1 overflow-auto space-y-4" ref={outputAreaRef}>
    {outputText.map((message, index) => (
      <div key={index} className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-gray-800">{message.text}</p>
        <p className="text-sm text-[rgba(8,9,29,0.71)]">Detected Language: {message.language || 'Detecting...'}</p>

        

        <div className="mt-2 md:flex items-center space-x-2">
          <select 
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-2 py-1 border rounded-lg"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <button 
            onClick={() => handleTranslate(index)}
            className="px-3 py-1 text-white bg-[rgba(8,9,29,0.71)] rounded hover:bg-[rgba(120,95,184,0.64)]"
          >
            Translate
          </button>
        </div>

       
        {message.translation && <p className="mt-2 text-gray-700 font-semibold">Translation: {message.translation}</p>}
      </div>
    ))}
  </div>

  <div className="mt-auto flex items-center space-x-2 p-4 bg-white rounded-t-lg shadow-md">
    <textarea 
    id='inputTextArea'
      value={inputText} 
      onChange={handleInputChange} 
      placeholder="Type your text here..." 
      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
    />
    <button 
      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      onClick={handleSendMessage}
    >
      <Send/>
      
    </button>
  </div>
</div>

    </>
  );
};


export default App;
