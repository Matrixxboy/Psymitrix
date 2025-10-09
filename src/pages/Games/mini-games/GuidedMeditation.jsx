import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaStepForward } from 'react-icons/fa';
import { FiHeadphones } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';

import { GiMeditation  } from "react-icons/gi";
import { PiHeartFill  } from "react-icons/pi";
import { TbHeadphonesFilled } from "react-icons/tb";
import { IoMdCheckboxOutline } from "react-icons/io";

const GuidedMeditation = () => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [message, setMessage] = useState("Let's begin your calm journey...");
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);
  
  const walkthroughSteps = [
    {
      icon : <PiHeartFill  className='w-20 h-20 text-light-headings dark:text-light-secondary animate-heartbeat' />,
      title: "Welcome to PsyMitrix Meditation",
      text: "Find a quiet space where you can relax without interruptions.",
    },
    {
      icon : <GiMeditation className='w-20 h-20 text-light-headings dark:text-light-secondary animate-float' />,
      title: "Sit or Lie Down Comfortably",
      text: "You may sit upright or lie down — whatever feels best for you. Loosen any tight clothing.",
    },
    {
      icon:<TbHeadphonesFilled className='w-20 h-20 text-light-headings dark:text-light-secondary animate-headphonePulse' />,
      title: "Use Headphones",
      text: "For the best immersive experience, wear headphones and lower your phone volume slightly.",
    },
    {
      icon:<IoMdCheckboxOutline className='w-20 h-20 text-light-headings dark:text-light-secondary animate-checkPop' />,
      title: "Prepare to Begin",
      text: "Take a few slow breaths... Inhale calm, exhale stress. When you feel ready, begin your session.",
    },
  ];

 const meditationScript = [
    "Welcome to PsyMitrix Guided Meditation. Let's begin by taking a soft, deep breath in...",
    "And letting it go with a gentle sigh. Now, if your eyes are not yet closed, gently let your eyelids rest. Give your body permission to relax completely.",
    "Bring your attention to your natural breath. Simply notice the sensation of the air as it gently flows in through your nostrils...",
    "And effortlessly flows out. Inhale ease... Exhale any tension or holding you might notice.",
    "Imagine your thoughts are like fluffy clouds slowly drifting across a vast, blue sky. Don't chase them; just watch them pass and allow yourself to sink deeper into stillness.",
    "We are going to anchor ourselves in the present moment. Repeat softly to yourself: I am safe. I am grounded. I am enough.",
    "Slowly, kindly, bring your awareness to your physical body. Notice the points where your body meets the chair or the floor. Feel the support beneath you.",
    "Feel the weight of your own heart in your chest, beating gently and steadily, a source of peace.",
    "For the next few moments, simply rest here in the silence, breathing in calm, letting go of effort.",
    "With your next breath, invite a gentle smile to your face, keeping your eyes softly closed.",
    "Take a final, deep breath, and as you exhale, know that you carry this quiet, peaceful awareness with you.",
  ];

  const motivationalMessages = [
    "You're doing great 🌸",
    "Stay with your breath 🌿",
    "Peace flows through you 🌊",
    "You are safe and loved 💫",
    "Let go... just be ☁️",
    "You’re calm, centered, and present 🕊️",
  ];

  // Setup speech + music
  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    u.lang = 'en-US';
    u.rate = 0.75;
    u.pitch = 1.1;

    const setVoice = () => {
      const voices = synth.getVoices();
      const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') && v.lang.startsWith('en'));
      u.voice = femaleVoice || voices.find(v => v.lang.startsWith('en'));
    };

    setVoice();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }

    setUtterance(u);

    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2025/09/23/audio_3cbac54762.mp3?filename=meditation-background-409198.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      synth.cancel();
      clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  // Timer update
  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 15 === 0) {
      const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMessage(msg);
    }
  }, [elapsedTime]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (!isMeditating) {
      utterance.text = meditationScript.join(' ');
      utterance.onstart = () => {
        audioRef.current.play();
      }
      synth.speak(utterance);
      setIsMeditating(true);
    } else {
      synth.resume();
      audioRef.current.play();
    }
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;
    synth.pause();
    audioRef.current.pause();
    setIsPlaying(false);
    clearInterval(timerRef.current);
  };

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    clearInterval(timerRef.current);
    setIsMeditating(false);
    setIsPlaying(false);
    setElapsedTime(0);
    setMessage("Take your time... breathe and relax 🌿");
  };

  const handleSkip = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    if (!isMeditating) {
        audioRef.current.play();
        setIsMeditating(true);
        setIsPlaying(true);
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
    }  
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleNext = () => {
    if (walkthroughStep < walkthroughSteps.length - 1) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setIsReady(true);
    }
  };

  const handlePrevious = () => {
    if (walkthroughStep > 0) setWalkthroughStep(walkthroughStep - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl w-full max-w-md mx-auto min-h-[500px] transition-all duration-500">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            key={walkthroughStep}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            {walkthroughSteps[walkthroughStep].icon} 
            <h2 className="text-3xl font-semibold text-light-primary mb-2">
              {walkthroughSteps[walkthroughStep].title}
            </h2>
            <p className="text-light-accent dark:text-light-secondary  mb-8 text-lg max-w-sm leading-relaxed">
              {walkthroughSteps[walkthroughStep].text}
            </p>

            <div className="flex space-x-4">
              {walkthroughStep > 0 && (
                <Button
                  onClick={handlePrevious}
                  
                >
                  Previous
                </Button>
              )}
              <Button 
                onClick={handleNext}
              >
                {walkthroughStep === walkthroughSteps.length - 1 ? 'Begin Meditation' : 'Next'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="meditation"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >

            <h2 className="text-3xl font-semibold text-light-primary mb-2">
              PsyMitrix Guided Meditation
            </h2>

            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <FiHeadphones className="mr-2 animate-pulse" />
              <span>Use headphones for a better experience</span>
            </div>

            <div className="text-6xl font-light text-indigo-600 dark:text-indigo-300 tracking-wider mb-16 mt-10">
              {formatTime(elapsedTime)}
            </div>

            <p className="text-md mt-2 text-light-secondary font-medium transition-all duration-500 mb-4">
              {message}
            </p>

            <div className="flex space-x-6">
              <button onClick={handleTogglePlayPause} className={`p-4 text-white rounded-full shadow-md hover:shadow-xl transition-all duration-300 ${isPlaying ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-green-500 hover:bg-green-600'}`}>
                {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
              </button>
              <button onClick={handleStop} className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-xl transition-all duration-300">
                <FaStop size={18} />
              </button>
              <button onClick={handleSkip} className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md hover:shadow-xl transition-all duration-300">
                <FaStepForward size={18} />
              </button>
            </div>

            <p className="text-sm mt-8 text-gray-500 dark:text-gray-400 italic">
              “Peace begins with a single breath.” — PsyMitrix
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuidedMeditation;