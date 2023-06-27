import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../assets/images/auth-idle.svg";
import AuthFace from "../assets/images/auth-face.svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 360;
const MODELS_URI = import.meta.env.DEV ? "/models" : "/react-face-auth/models";
const COUNTER_DURATION = 5;

const Login = () => {
  const [tempAccount, setTempAccount] = useState();
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [imageError, setImageError] = useState(false);
  const [counter, setCounter] = useState(COUNTER_DURATION);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setTempAccount(location?.state?.account);
  }, [location]);

  useEffect(() => {
    if (tempAccount) {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages();
          setLabeledFaceDescriptors(labeledFaceDescriptors);
        })
        .then(() => setModelsLoaded(true));
    }
  }, [tempAccount]);

  useEffect(() => {
    if (loginResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);

      if (counter === 0) {
        handleLoginSuccess();
      }

      return () => clearInterval(counterInterval);
    }

    setCounter(COUNTER_DURATION);
  }, [loginResult, counter]);

  const handleLoginSuccess = () => {
    videoRef.current.pause();
    videoRef.current.srcObject = null;
    localUserStream.getTracks().forEach((track) => {
      track.stop();
    });
    clearInterval(faceApiIntervalRef.current);
    localStorage.setItem(
      "faceAuth",
      JSON.stringify({ status: true, account: tempAccount })
    );
    navigate("/protected", { replace: true });
  };

  const loadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URI);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URI);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URI);
  };

  const getLocalUserVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      videoRef.current.srcObject = stream;
      setLocalUserStream(stream);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);

    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
      });

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT); const boxesWithText = resizedDetections.map((d, i) => {
          const { label, distance } = results[i];
          const box = d.detection.box;
          const text = `${label} (${distance.toFixed(2)})`;
      
          return { box, text };
        });
      
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
        boxesWithText.forEach((result) => {
          const { box, text } = result;
          const { x, y, width, height } = box;
      
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: text,
          });
          drawBox.draw(canvasRef.current);
        });
      
        const loginScore = results.reduce(
          (acc, { distance }) => acc + distance,
          0
        );
        if (results.length > 0) {
          const averageScore = loginScore / results.length;
          if (averageScore < import.meta.env.VITE_LOGIN_THRESHOLD) {
            setLoginResult("SUCCESS");
          }
        }
      }, 100);
      
      faceApiIntervalRef.current = faceApiInterval;
      };
      
      const loadLabeledImages = async () => {
      const labels = [tempAccount];
      return Promise.all(
      labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= import.meta.env.VITE_IMAGES_PER_LABEL; i++) {
      try {
      const img = await faceapi.fetchImage(
        `/react-face-auth/images/${label}/${i}.jpg`
      );
      const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
      if (!detections) {
      setImageError(true);
      break;
      }
      descriptions.push(detections.descriptor);
      } catch (error) {
      console.error("Error:", error);
      }
      }
      
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
      };
      
      const renderLoginResult = () => {
      switch (loginResult) {
      case "PENDING":
      return (
      <React.Fragment>
      <img
      src={AuthIdle}
      alt="auth idling"
      className="w-40 h-auto mx-auto mb-12"
      />
      <p className="text-center font-semibold text-lg">
      Initializing camera... please wait
      </p>
      </React.Fragment>
      );
      case "SUCCESS":
      return (
      <React.Fragment>
      <img
      src={AuthFace}
      alt="auth face detected"
      className="w-40 h-auto mx-auto mb-12"
      />
      <p className="text-center font-semibold text-lg">
      Login successful! Redirecting in {counter}...
      </p>
      </React.Fragment>
      );
      default:
      return null;
      }
      };
      
      useEffect(() => {
      Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODELS_URI),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URI),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URI),
      ]).then(() => setFaceApiLoaded(true));
      }, []);
      
      useEffect(() => {
      if (faceApiLoaded && localUserStream) {
      scanFace();
      }
      }, [faceApiLoaded, localUserStream]);
      
      useEffect(() => {
      getLocalUserVideo();
      }, []);
      
      if (!tempAccount) {
      return <Navigate to="/home" />;
      }
      
      return (
      <div className="flex flex-col items-center justify-center h-screen">
      {modelsLoaded && renderLoginResult()}
      <video
      ref={videoRef}
      autoPlay
      muted
      className="hidden"
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      />
      <canvas
      ref={canvasRef}
      className="relative z-10 transform -translate-y-full"
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      />
      {imageError && (
      <p className="text-center text-red-500 font-semibold">
      Error loading face images. Please try again later.
      </p>
      )}
      </div>
      );
      };
      
      export default Login;
