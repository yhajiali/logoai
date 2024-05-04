"use client";
import { useEffect, useState } from "react";
import LogoForm from "./components/LogoForm";
import LogoResult from "./components/LogoResult";
import Loading from "./components/ui/Loading";

export default function Home() {
  const [showLogoForm, setShowLogoForm] = useState(true);
  const [showLogoResult, setShowLogoResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [logoData, setLogoData] = useState({
    name: "Logo Name",
    description: "",
    style: 0,
  });

  useEffect(() => {
    if (imageUrl) {
      setLoading(false);
      setShowLogoForm(false);
      setShowLogoResult(true);
    }
  }, [imageUrl]);

  function handleSubmit() {
    setImageUrl("");
    console.log(logoData);
    setLoading(true);
    getImageData();
  }

  const getImageData = async () => {
    try {
      const response = await fetch("/api/dalle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            logoName: logoData.name,
            logoDescription: logoData.description,
            style: logoData.style,
          },
        }),
      });
      const { imageUrl } = await response.json();
      console.log("Image URL: ", imageUrl);
      setImageUrl(imageUrl);
      setError("");
    } catch (error) {
      setTimeout(() => {
        setError(`An error occurred calling the Dall-E API`);
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <main className="w-full h-full p-6 flex flex-col items-center justify-center gap-10 divide-gray-700 font-mono text-sm lg:flex-row lg:divide-x lg:divide-y-0">
      {showLogoForm && (
        <LogoForm
          handleSubmit={handleSubmit}
          logoData={logoData}
          setLogoData={setLogoData}
          loading={loading}
        />
      )}

      {/* Only show logo result when not fetching image data or showing logo form */}
      {showLogoResult && !loading && !showLogoForm ? (
        <LogoResult
          imageSrc={imageUrl}
          setShowLogoForm={setShowLogoForm}
          handleSubmit={handleSubmit}
          error={error}
        />
      ) : (
        loading && <Loading message="Generating Logo..." />
      )}

      {/* Display error in logo container */}
      {error && !loading && (
        <div className="w-full max-w-3xl h-full px-4 flex justify-center items-center animate-slide-in">
          <p className="text-center text-red-400 font-semibold ">{error}</p>
        </div>
      )}
    </main>
  );
}
