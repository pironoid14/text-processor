import { useState, useEffect,useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [detectedLanguage, setDetectedLanguage] = useState(null);
    const [translatedText, setTranslatedText] = useState('');
    const messageListRef = useRef(null);
  
    // Placeholder API calls - replace with actual API integration
    const detectLanguage = async (text) => {
      
      try {
        const response = await fetch('/api/detectLanguage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = await response.json();
        setDetectedLanguage(data.language);
        return data.language; // Return the detected language code
      } catch (error) {
        console.error("Error detecting language:", error);
        return null; // Return null if detection fails
      }
    };
  
    const translateText = async (text, targetLanguage) => {
      // Replace with your actual translation API call
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage }),
        });
        const data = await response.json();
        setTranslatedText(data.translatedText);
        return data.translatedText; // Return the translated text
      } catch (error) {
        console.error("Error translating text:", error);
        return null; // Return null if translation fails
      }
    };
  
  
    const sendMessage = async () => {
      if (userInput.trim() === '') return;
  
      const userMessage = { text: userInput, sender: 'user' };
      setMessages([...messages, userMessage]);
      setUserInput('');
  
      const detectedLang = await detectLanguage(userInput);
  
      if (detectedLang) {
        const translated = await translateText(userInput, 'en'); // Translate to English (example)
         const botReply = { text: translated, sender: 'bot' };
          setMessages([...messages, userMessage, botReply]);
      } else {
         const botReply = { text: "Could not detect language", sender: 'bot' };
         setMessages([...messages, userMessage, botReply]);
      }
  
  
    };
  
    useEffect(() => {
      // Scroll to bottom when new messages are added
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    }, [messages]);
  

  return (
    <>
    
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto p-2 bg-gray-100 rounded-md" ref={messageListRef}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>

      {/* Display detected language and translation (optional) */}
      {detectedLanguage && <p className="mt-2 text-sm text-gray-500">Detected Language: {detectedLanguage}</p>}
      {translatedText && <p className="mt-1 text-sm text-gray-500">Translated Text: {translatedText}</p>}
    </div>
    

    </>
  )
}

export default App
