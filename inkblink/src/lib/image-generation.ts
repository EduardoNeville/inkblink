import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";
import ImageTracer from "imagetracerjs";

const API_URL = "https://api.stability.ai/v2beta/stable-image";
const API_KEY = "sk-K8H8bsXkAbdnnOZDlZGMjICh1FHG6RNuR52BYjElCV4b8gOs"; // Replace with your actual API key

const DEFAULT_HEADERS = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: "image/*",
};

/**
 * Generate ink style icon prompt 
 * @param prompt The description of the image to generate.
 */
function generatePrompt (prompt: string): string {
  return `Generate a minimalist icon for ${prompt}. Draw the ${prompt} using simple geometric shapes (circles, squares, triangles, or lines) with a flowy feel, as if sketched by a v5 ink pen. Center the ${prompt} symmetrically on a solid white square canvas, using only solid black. Ensure the ${prompt} is bold, simple, and recognizable, avoiding gradients and complexity.`
}

/**
 * Generate an image from a text prompt.
 * @param prompt The description of the image to generate.
 * @param outputPath The path to save the generated image.
 * @param model The model to use for generation (default: "sd3.5-large-turbo").
 * @param format The output format (default: "jpeg").
 */
export async function generateImage(prompt: string, outputPath: string, model: string = "sd3.5-large-turbo", format: string = "jpeg") {
  const transformedPrompt = generatePrompt(prompt);
  const payload = { transformedPrompt, output_format: format, model };

  const response = await axios.postForm(
    `${API_URL}/generate/sd3`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: DEFAULT_HEADERS,
    }
  );

  if (response.status === 200) {
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    console.log(`Image saved to ${outputPath}`);
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}

/**
 * Generate an image using another image as a styling reference.
 * @param imagePath Path to the input image used for style reference.
 * @param prompt Description of the image to generate.
 * @param outputPath Path to save the generated image.
 * @param format Output image format (default: "webp").
 */
export async function generateImageWithStyle(imagePath: string, prompt: string, outputPath: string, format: string = "webp") {
  const transformedPrompt = generatePrompt(prompt);
  const payload = {
    image: fs.createReadStream(imagePath),
    transformedPrompt,
    output_format: format,
  };

  const response = await axios.postForm(
    `${API_URL}/control/style`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: DEFAULT_HEADERS,
    }
  );

  if (response.status === 200) {
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    console.log(`Styled image saved to ${outputPath}`);
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}

/**
 * Edit an image using a mask.
 * @param imagePath Path to the original image.
 * @param maskPath Path to the mask image.
 * @param prompt Description of the edit to apply.
 * @param outputPath Path to save the edited image.
 * @param format Output image format (default: "webp").
 */
export async function editImageWithMask(imagePath: string, maskPath: string, prompt: string, outputPath: string, format: string = "webp") {
  const payload = {
    image: fs.createReadStream(imagePath),
    mask: fs.createReadStream(maskPath),
    prompt,
    output_format: format,
  };

  const response = await axios.postForm(
    `${API_URL}/edit/inpaint`,
    axios.toFormData(payload, new FormData()),
    {
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: DEFAULT_HEADERS,
    }
  );

  if (response.status === 200) {
    fs.writeFileSync(outputPath, Buffer.from(response.data));
    console.log(`Edited image saved to ${outputPath}`);
  } else {
    throw new Error(`${response.status}: ${response.data.toString()}`);
  }
}

/**
 * Convert an image to an SVG format.
 * @param imagePath Path to the input image.
 * @param outputPath Path to save the converted SVG.
 * @param colorMode Color mode for image tracing (default: "posterized2").
 */
export function convertImageToSVG(imagePath: string, outputPath: string, colorMode: string = "posterized2") {
  const reader = new FileReader();
  
  // Read file as DataURL
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string;
    ImageTracer.loadImage(imageUrl, (canvas) => {
      const imgData = ImageTracer.getImgdata(canvas); // Extract ImageData from canvas
      const svgString = ImageTracer.imagedataToSVG(imgData, colorMode); // Convert to SVG

      // Save the SVG string to a file
      fs.writeFileSync(outputPath, svgString);
      console.log(`SVG saved to ${outputPath}`);
    });
  };
  
  reader.readAsDataURL(fs.readFileSync(imagePath)); // Read file as data URL
}
