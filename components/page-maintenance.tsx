import Link from 'next/link';

import { DynamicImage } from './dynamic-image';

export default function MaintenanceIndex() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <style jsx global>{`
        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
      <div
        style={{ animation: 'fadeInOut 3s ease-in-out infinite' }}
        className=" pointer-events-none select-none"
      >
        <DynamicImage
          lightSrc="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          darkSrc="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          alt="Logo"
          width={100}
          height={100}
          className="h-auto w-auto"
          priority
        />
      </div>

      <div className="text-center text-foreground">
        <p className="text-lg">
          Follow{' '}
          <Link
            href="https://x.com/bark_protocol"
            target="_blank"
            className="text-gray-500 hover:text-gray-600"
          >
            @bark_protocol
          </Link>{' '}
          for updates on our launch
        </p>
      </div>
    </div>
  );
}
