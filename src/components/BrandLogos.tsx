import React from "react";

interface LogoProps {
  className?: string;
}

// 1. Google Gemini Brand Logo (Four-point gradient sparkle)
export function GeminiLogo({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
        fill="url(#gemini-gradient)"
      />
      <defs>
        <linearGradient id="gemini-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E82EE" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 2. OpenAI Brand Logo (Official Rosette / Spiral)
export function OpenAILogo({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1638a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.686zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813v6.7227zm1.1449-1.9546l3.8565-2.2241 3.8565 2.2241v4.4482l-3.8565 2.2241-3.8565-2.2241z"/>
    </svg>
  );
}

// 3. Groq Brand Logo (Signature geometric orange G)
export function GroqLogo({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#F55036" />
      <path
        d="M12.88 6.5C8.98 6.5 6.5 9.06 6.5 12.5C6.5 15.94 8.98 18.5 12.88 18.5C16.5 18.5 18.5 16.32 18.5 13.06H12.58V11.24H20.4C20.46 11.66 20.5 12.18 20.5 12.78C20.5 17.44 17.5 20.5 12.88 20.5C7.8 20.5 4.5 16.94 4.5 12.5C4.5 8.06 7.8 4.5 12.88 4.5C16.42 4.5 18.66 6.14 19.82 7.32L18.4 8.78C17.34 7.7 15.68 6.5 12.88 6.5Z"
        fill="white"
      />
    </svg>
  );
}

// 4. Anthropic Claude Brand Logo (Terracotta Claude Sparkle)
export function AnthropicLogo({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Official Anthropic / Claude terracotta geometric mark */}
      <path d="M13.827 2.182h3.407L24 21.818h-3.407l-1.92-5.455H9.327l-1.92 5.455H4L10.766 2.182h3.061zm2.348 11.545l-2.45-6.955-2.45 6.955h4.9z" fill="#D97757" />
      <path d="M4.09 13.364H0l3.055-8.728h4.09L4.09 13.364z" fill="#D97757" opacity="0.85" />
    </svg>
  );
}

// 5. Ollama Mascot Brand Logo
export function OllamaLogo({ className = "w-4 h-4" }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.5 2 7 4.5 7 7c0 1.2.3 2.1.8 2.8C6.6 10.6 6 12.2 6 14c0 3.9 2.7 7 6 7s6-3.1 6-7c0-1.8-.6-3.4-1.8-4.2.5-.7.8-1.6.8-2.8 0-2.5-1.5-5-5-5zm-2.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 16.5c-1.4 0-2.5-.7-2.5-1.5h5c0 .8-1.1 1.5-2.5 1.5z" />
    </svg>
  );
}
