import { useState } from 'react';
import { generateImage, generateImageWithStyle } from '@/lib/image-generation';

export default function Create() {
  const [initialImagePath, setInitialImagePath] = useState<string | null>(null);
  const [styledImagePath, setStyledImagePath] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [stylePrompt, setStylePrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Function to generate the first image
  const handleGenerateInitialImage = async () => {
    if (!prompt) {
      alert('Please enter a prompt for the initial image.');
      return;
    }

    setLoading(true);
    const outputPath = './initial_image.jpeg';

    try {
      await generateImage(prompt, outputPath);
      setInitialImagePath(outputPath);
    } catch (error) {
      console.error('Error generating initial image:', error);
      alert('Failed to generate the initial image.');
    }

    setLoading(false);
  };

  // Function to generate a styled image using the initial image
  const handleGenerateStyledImage = async () => {
    if (!initialImagePath) {
      alert('Please generate an initial image first.');
      return;
    }
    if (!stylePrompt) {
      alert('Please enter a prompt for the styled image.');
      return;
    }

    setLoading(true);
    const outputPath = './styled_image.webp';

    try {
      await generateImageWithStyle(initialImagePath, stylePrompt, outputPath);
      setStyledImagePath(outputPath);
    } catch (error) {
      console.error('Error generating styled image:', error);
      alert('Failed to generate the styled image.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-6xl px-6">
        <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">
          Image Generation & Style Transfer
        </h1>

        {/* Generate Initial Image */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
          <h2 className="text-xl font-semibold mb-4">Generate Initial Image</h2>
          <input
            type="text"
            placeholder="Enter prompt for initial image"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:border-blue-400"
          />
          <button
            onClick={handleGenerateInitialImage}
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Generating...' : 'Generate Initial Image'}
          </button>

          {initialImagePath && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-center mb-2">Initial Image:</p>
              <img
                src={initialImagePath}
                alt="Initial"
                className="w-full max-h-96 object-contain rounded-lg border border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Generate Image Using Style */}
        {initialImagePath && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full mt-6">
            <h2 className="text-xl font-semibold mb-4">Generate Styled Image</h2>
            <input
              type="text"
              placeholder="Enter prompt for styled image"
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg border border-gray-600 outline-none focus:border-blue-400"
            />
            <button
              onClick={handleGenerateStyledImage}
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Styled Image'}
            </button>

            {styledImagePath && (
              <div className="mt-6 flex flex-col items-center">
                <p className="text-center mb-2">Styled Image:</p>
                <img
                  src={styledImagePath}
                  alt="Styled"
                  className="w-full max-h-96 object-contain rounded-lg border border-gray-600"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

