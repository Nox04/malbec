import React, { useState, useEffect } from "react";
interface RecorderProps {
  onResponse: (response: string) => void;
}

const Recorder = (props: RecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleStartRecording = async () => {
    const onStop = (chunks: Array<Blob>) => {
      setRecording(false);
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.wav");

      try {
        const response = fetch("/api/process", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            props.onResponse(data.message);
          });
      } catch (error) {
        console.error(
          "Error al enviar el archivo de audio al servidor: ",
          error
        );
      }

      setAudioStream(null);
      setMediaRecorder(null);
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      const chunks: Array<Blob> = [];
      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      mediaRecorder.addEventListener("stop", () => onStop(chunks));
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error al iniciar la grabación de audio: ", error);
    }
  };

  const handleStopRecording = () => {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.stop();
  };

  useEffect(() => {
    if (audioStream) {
      return () => {
        audioStream.getTracks().forEach((track) => track.stop());
      };
    }
  }, [audioStream]);

  return (
    <div style={{ zIndex: 10 }}>
      {!recording && (
        <button
          onClick={handleStartRecording}
          className="h-full p-1 w-16 rounded-md flex items-center justify-center bg-gray-900"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#fab387] fill-current"
          >
            <path d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z" />
          </svg>
        </button>
      )}
      {recording && (
        <button
          onClick={handleStopRecording}
          className="h-full p-1 w-16 rounded-md flex items-center justify-center bg-gray-900"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#fab387] fill-current"
          >
            <path d="m412.16 592.128-45.44 45.44A191.232 191.232 0 0 1 320 512V256a192 192 0 1 1 384 0v44.352l-64 64V256a128 128 0 1 0-256 0v256c0 30.336 10.56 58.24 28.16 80.128zm51.968 38.592A128 128 0 0 0 640 512v-57.152l64-64V512a192 192 0 0 1-287.68 166.528l47.808-47.808zM314.88 779.968l46.144-46.08A222.976 222.976 0 0 0 480 768h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64v-64c-61.44 0-118.4-19.2-165.12-52.032zM266.752 737.6A286.976 286.976 0 0 1 192 544v-32a32 32 0 0 1 64 0v32c0 56.832 21.184 108.8 56.064 148.288L266.752 737.6z" />
            <path d="M150.72 859.072a32 32 0 0 1-45.44-45.056l704-708.544a32 32 0 0 1 45.44 45.056l-704 708.544z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Recorder;
