import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface DownloadButtonProps {
  chartRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export function DownloadButton({ 
  chartRef,
  className = "p-2 bg-blue-200 text-white rounded-full hover:bg-blue-700 transition-colors"
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (chartRef.current) {
      import('html-to-image').then(({ toPng }) => {
        toPng(chartRef.current!)
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'confidence-comparison.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((err) => {
            console.error('Error downloading chart:', err);
          });
      });
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={className}
      title="Download Chart"
    >
      <ArrowDownTrayIcon className="h-5 w-5" />
    </button>
  );
}