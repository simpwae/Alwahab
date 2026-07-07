import React, { useState, useRef } from 'react';
import { ZoomInIcon } from 'lucide-react';
interface ImageGalleryProps {
  images: string[];
  productName: string;
}
export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPosition({
      x,
      y
    });
  };
  return (
    <div>
      <div
        ref={containerRef}
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl border border-gray-100 bg-surface"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}>
        
        <img
          src={images[activeIndex]}
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-150"
          style={
          isZooming ?
          {
            transform: 'scale(1.9)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
          } :
          undefined
          } />
        
        {!isZooming &&
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-muted shadow-sm">
            <ZoomInIcon className="h-3.5 w-3.5" />
            Hover to zoom
          </span>
        }
      </div>

      {images.length > 1 &&
      <div className="mt-3 flex gap-2.5">
          {images.map((img, i) =>
        <button
          key={img}
          type="button"
          onClick={() => setActiveIndex(i)}
          aria-label={`View image ${i + 1} of ${images.length}`}
          aria-current={activeIndex === i}
          className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-20 ${activeIndex === i ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
          
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
        )}
        </div>
      }
    </div>);

}