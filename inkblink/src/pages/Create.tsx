// create-page.tsx
import { useState } from 'react';
import { generateImage, generateImageWithStyle } from '@/lib/image-generation';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-col container mx-auto px-4 py-16 gap-16 mt-30">
      <h1 className="text-primary text-4xl font-bold text-center mb-8">
        Create Your Images
      </h1>

      {/* Generate Initial Image Section */}
      <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-muted text-primary">
        <h2 className="text-xl font-bold mb-4 text-primary/70 text-center">
          Generate Initial Image
        </h2>
        <p className="text-center font-display mb-6 text-primary/50">
          Create your base image (1 IB per generation)
        </p>
        <input
          type="text"
          placeholder="Enter prompt for initial image"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 mb-6 bg-white text-primary rounded-lg border border-primary/20 outline-none focus:border-primary"
        />
        <Button
          variant="outline"
          onClick={handleGenerateInitialImage}
          disabled={loading}
          className={`w-full rounded-full border-primary border-1 hover:border-1 bg-primary text-white hover:bg-accent hover:text-white ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating...' : 'Generate Initial Image'}
        </Button>

        {initialImagePath && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-center mb-2 text-primary/70">Initial Image:</p>
            <img
              src={initialImagePath}
              alt="Initial"
              className="w-full max-h-96 object-contain rounded-lg border border-primary/20"
            />
          </div>
        )}
      </div>

      {/* Generate Styled Image Section */}
      {initialImagePath && (
        <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-primary text-white">
          <div className="mb-2 flex justify-center">
            <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
              Next Step
            </span>
          </div>
          <h2 className="text-xl font-bold mb-4 text-center">
            Generate Styled Image
          </h2>
          <p className="text-center font-display mb-6">
            Apply a style to your image (1 IB per styling)
          </p>
          <input
            type="text"
            placeholder="Enter prompt for styled image"
            value={stylePrompt}
            onChange={(e) => setStylePrompt(e.target.value)}
            className="w-full p-3 mb-6 bg-white text-primary rounded-lg border border-primary/20 outline-none focus:border-accent"
          />
          <Button
            variant="outline"
            onClick={handleGenerateStyledImage}
            disabled={loading}
            className={`w-full rounded-full border-primary border-1 hover:border-1 bg-white text-primary hover:bg-accent hover:text-white ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Generating...' : 'Generate Styled Image'}
          </Button>

          {styledImagePath && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-center mb-2">Styled Image:</p>
              <img
                src={styledImagePath}
                alt="Styled"
                className="w-full max-h-96 object-contain rounded-lg border border-white/20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
