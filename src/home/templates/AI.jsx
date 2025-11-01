import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../static/css/AI.css'; // Đảm bảo tên file CSS khớp
import Swal from 'sweetalert2';

// --- IMPORT API ---
import { getCharacterById } from '../../service/api.character';
import { getUserCharactersByUserId } from '../../service/api.user';

// --- Cấu hình Speech-to-Text (STT) (Giữ nguyên) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'vi-VN';
  recognition.interimResults = false;
}

// --- Component chính ---
function AiChatPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE (TRẠNG THÁI) ---
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [characterInfo, setCharacterInfo] = useState(null);
  const [generalCharacterData, setGeneralCharacterData] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");

  // --- Refs (Đã gỡ bỏ các ref cho Audio API) ---
  const waveRef = useRef(null); // Chỉ giữ lại ref này cho div
  const audioRef = useRef(null); // Giữ ref cho audio để quản lý

  // --- 1. UseEffect XÁC THỰC (Giữ nguyên) ---
  useEffect(() => {
    const checkAuthorization = async () => {
      let authSuccess = false;
      let charInfo = null;
      try {
        const { owned, character } = location.state || {};
        if (owned && character && character.characterID.toString() === characterId) {
          authSuccess = true;
          charInfo = character;
        } else {
          const userId = localStorage.getItem('userId');
          if (!userId) { navigate('/login'); return; }
          const result = await getUserCharactersByUserId(userId);
          if (!result.data) throw new Error(result.message || "Không có data");
          const foundCharacter = result.data.find(
            (char) => char.characterID.toString() === characterId && char.status === 1
          );
          if (foundCharacter) { authSuccess = true; charInfo = foundCharacter; }
        }
        if (authSuccess) {
          setIsAuthorized(true);
          setCharacterInfo(charInfo);
        } else {
          setIsAuthorized(false);
          Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not own this character.',
            confirmButtonText: 'OK'
          });
          navigate('/profile/characters');
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra quyền truy cập:", err);
        setIsAuthorized(false); navigate('/');
      }
    };
    checkAuthorization();

    // Hủy audio khi rời trang
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [characterId, navigate, location.state]);

  // --- 2. UseEffect LẤY DỮ LIỆU (cho 'image') (Giữ nguyên) ---
  useEffect(() => {
    const fetchGeneralData = async () => {
      if (isAuthorized && characterId) {
        try {
          const response = await getCharacterById(characterId);
          const data = response.data || response;
          if (data) setGeneralCharacterData(data);
        } catch (err) {
          console.error("Lỗi khi lấy chi tiết nhân vật:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchGeneralData();
  }, [isAuthorized, characterId]);


  // --- 3. Các hàm xử lý Chat ---

  const startRecording = () => {
    if (!SpeechRecognition) return;
    setIsRecording(true);
    recognition.start();
  };

  if (recognition) {
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      sendToBackend(currentTranscript);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
  }

  // *** HÀM SENDTOBACKEND (ĐÃ ĐƠN GIẢN HÓA) ***
  const sendToBackend = async (text) => {
    if (!text || !characterInfo) return;
    setIsAiSpeaking(true); // Bắt đầu hiệu ứng

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          character_id: characterInfo.characterID.toString()
        }),
      });

      if (!response.ok) throw new Error('Lỗi từ server');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // KHÔNG CẦN GỌI setupAudioContext() hay drawWave()
      audio.play();

      audio.onended = () => {
        setIsAiSpeaking(false); // Tắt hiệu ứng khi nói xong
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

    } catch (error) {
      console.error("Lỗi khi gọi API chat:", error);
      setIsAiSpeaking(false); // Tắt hiệu ứng nếu có lỗi
    }
  };

  // --- 4. Giao diện (Render) (ĐÃ CẬP NHẬT LẠI CLASSNAME) ---

  if (isLoading) {
    return (
      <div className="container" style={{ justifyContent: 'center' }}>
        <h2>Loading character...</h2>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="container" style={{ justifyContent: 'center' }}>
        <h2>You do not have access.</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Chatting with {characterInfo.characterName}</h2>

      <div className="avatar-container">
        {/*
          *** CẬP NHẬT QUAN TRỌNG ***
          Thêm lại class 'speaking' dựa trên state 'isAiSpeaking'
        */}
        <div
          ref={waveRef}
          className={`wave-ring ${isAiSpeaking ? 'speaking' : ''}`}
        ></div>

        <img
          src={generalCharacterData?.image}
          alt={characterInfo.characterName}
          className="avatar-image"
        />
      </div>

      <button
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? null : startRecording}
        disabled={isRecording || isAiSpeaking}
      >
        {isAiSpeaking ? `${characterInfo.characterName} is speaking...` : (isRecording ? 'Listening...' : 'Press to speak')}
      </button>

      <p className="transcript">{transcript || "..."}</p>
    </div>
  );
}

export default AiChatPage;